import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
})
export class RecipeForm {
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    imageUrl: [''],
    prepMinutes: [30, [Validators.required, Validators.min(1)]],
    servings: [4, [Validators.required, Validators.min(1)]],
    ingredients: ['', Validators.required],
    steps: ['', Validators.required],
  });

  protected readonly saving = signal(false);
  protected readonly saveError = signal('');

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const lines = (text: string) => text.split('\n').map(l => l.trim()).filter(Boolean);
    this.saving.set(true);
    this.saveError.set('');
    try {
      const id = await this.recipeService.add({
        ...v,
        ingredients: lines(v.ingredients),
        steps: lines(v.steps),
      });
      this.router.navigate(['/recipe', id]);
    } catch {
      this.saveError.set('השמירה נכשלה. בדוק שאתה מחובר כמנהל.');
    } finally {
      this.saving.set(false);
    }
  }
}
