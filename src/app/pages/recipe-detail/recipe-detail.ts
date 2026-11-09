import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecipeService } from '../../services/recipe.service';
import { exportRecipeToWord } from '../../services/word-export';

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

  protected readonly checked = signal(new Set<number>());
  protected readonly exporting = signal(false);

  /** Opens WhatsApp (app on phones, WhatsApp Web on desktop) with the recipe name and link. */
  protected readonly whatsappUrl = computed(() => {
    const r = this.recipe();
    if (!r) return '';
    const text = `🍳 ${r.title} - מתוך "סבתא מלכה מבשלת"\n${r.description ? r.description + '\n' : ''}${location.href}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  });

  constructor() {
    // Reset the ingredient checklist when moving to another recipe.
    effect(() => {
      this.id();
      this.checked.set(new Set());
    });
  }

  protected toggle(index: number): void {
    this.checked.update(s => {
      const next = new Set(s);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  protected async exportWord(): Promise<void> {
    const r = this.recipe();
    if (!r) return;
    this.exporting.set(true);
    try {
      await exportRecipeToWord(r);
    } catch (e) {
      console.error(e);
      alert('היצוא ל-Word נכשל. נסו שוב.');
    } finally {
      this.exporting.set(false);
    }
  }

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
