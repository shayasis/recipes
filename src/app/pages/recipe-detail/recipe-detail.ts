import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  protected readonly recipeService = inject(RecipeService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();
  protected readonly recipe = computed(() => this.recipeService.getById(this.id()));

  protected async remove(): Promise<void> {
    if (!confirm('למחוק את המתכון?')) return;
    try {
      await this.recipeService.remove(this.id());
      this.router.navigate(['/']);
    } catch {
      alert('המחיקה נכשלה. בדוק שאתה מחובר כמנהל.');
    }
  }
}
