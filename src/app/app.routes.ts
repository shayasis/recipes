import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/recipe-list/recipe-list').then(m => m.RecipeList), title: 'המתכונים שלי' },
  { path: 'new', loadComponent: () => import('./pages/recipe-form/recipe-form').then(m => m.RecipeForm), title: 'מתכון חדש' },
  { path: 'recipe/:id', loadComponent: () => import('./pages/recipe-detail/recipe-detail').then(m => m.RecipeDetail) },
  { path: '**', redirectTo: '' },
];
