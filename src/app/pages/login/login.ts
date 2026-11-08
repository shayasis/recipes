import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly busy = signal(false);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      const { email, password } = this.form.getRawValue();
      await this.authService.login(email, password);
      if (this.authService.isAdmin()) {
        this.router.navigate(['/']);
      } else {
        await this.authService.logout();
        this.error.set('למשתמש הזה אין הרשאת ניהול.');
      }
    } catch (e) {
      const code = (e as { code?: string }).code ?? 'unknown';
      console.error('Login failed:', code, e);
      const messages: Record<string, string> = {
        'auth/invalid-credential': 'אימייל או סיסמה שגויים.',
        'auth/wrong-password': 'אימייל או סיסמה שגויים.',
        'auth/user-not-found': 'אימייל או סיסמה שגויים.',
        'auth/invalid-email': 'כתובת האימייל לא תקינה.',
        'auth/too-many-requests': 'יותר מדי ניסיונות. נסה שוב בעוד כמה דקות.',
        'auth/network-request-failed': 'בעיית חיבור לאינטרנט.',
      };
      this.error.set(messages[code] ?? `הכניסה נכשלה (${code}).`);
    } finally {
      this.busy.set(false);
    }
  }
}
