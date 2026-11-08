import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  // inject() must run before any await
  const authService = inject(AuthService);
  const router = inject(Router);
  await authService.ready;
  return authService.isAdmin() || router.createUrlTree(['/login']);
};
