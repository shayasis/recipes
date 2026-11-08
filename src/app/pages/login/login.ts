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
    } catch {
      this.error.set('אימייל או סיסמה שגויים.');
    } finally {
      this.busy.set(false);
    }
  }
}
