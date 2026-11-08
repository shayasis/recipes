import { Routes } from '@angular/router';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/recipe-list/recipe-list').then(m => m.RecipeList), title: 'המתכונים שלי' },
  { path: 'new', canActivate: [adminGuard], loadComponent: () => import('./pages/recipe-form/recipe-form').then(m => m.RecipeForm), title: 'מתכון חדש' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login), title: 'כניסת מנהל' },
  { path: 'recipe/:id', loadComponent: () => import('./pages/recipe-detail/recipe-detail').then(m => m.RecipeDetail), title: 'מתכון' },
  { path: '**', redirectTo: '' },
];
