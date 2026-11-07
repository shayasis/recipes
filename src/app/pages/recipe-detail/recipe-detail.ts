import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();
  protected readonly recipe = computed(() => this.recipeService.getById(this.id()));

  protected remove(): void {
    if (confirm('למחוק את המתכון?')) {
      this.recipeService.remove(this.id());
      this.router.navigate(['/']);
    }
  }
}
