import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  imports: [RouterLink],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList {
  protected readonly recipeService = inject(RecipeService);
  protected readonly auth = inject(AuthService);

  protected readonly search = signal('');
  protected readonly category = signal('');
  protected readonly categories = this.recipeService.categories;

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const cat = this.category();
    return this.recipeService.recipes().filter(r =>
      (!cat || r.category === cat) &&
      (!term || r.title.toLowerCase().includes(term) || r.description.toLowerCase().includes(term))
    );
  });

  protected async addSamples(): Promise<void> {
    try {
      await this.recipeService.addSamples();
    } catch {
      alert('ההוספה נכשלה. בדוק שאתה מחובר כמנהל.');
    }
  }
}
