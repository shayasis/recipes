import { Injectable, computed, signal } from '@angular/core';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { ADMIN_EMAIL } from '../firebase.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAdmin = computed(() => this._user()?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  /** Resolves once Firebase has restored (or not) the previous session. */
  readonly ready: Promise<void>;

  constructor() {
    this.ready = new Promise(resolve => {
      onAuthStateChanged(auth, user => {
        this._user.set(user);
        resolve();
      });
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(auth);
  }
}
