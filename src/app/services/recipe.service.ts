import { Injectable, computed, signal } from '@angular/core';
import { Recipe } from '../models/recipe';

const STORAGE_KEY = 'recipes';

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'shakshuka',
    title: 'שקשוקה',
    description: 'ביצים ברוטב עגבניות חריף, קלאסיקה של ארוחת בוקר.',
    category: 'ארוחת בוקר',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800',
    prepMinutes: 25,
    servings: 3,
    ingredients: ['6 ביצים', '5 עגבניות בשלות', '1 פלפל אדום', '2 שיני שום', 'כפית פפריקה', 'מלח ופלפל'],
    steps: [
      'מטגנים את הפלפל והשום בשמן זית.',
      'מוסיפים עגבניות קצוצות ותבלינים ומבשלים 10 דקות.',
      'שוברים את הביצים לתוך הרוטב, מכסים ומבשלים עד שהחלבון מתייצב.',
    ],
  },
  {
    id: 'hummus',
    title: 'חומוס ביתי',
    description: 'חומוס חלק וקרמי עם טחינה ולימון.',
    category: 'מנות ראשונות',
    imageUrl: '',
    prepMinutes: 40,
    servings: 6,
    ingredients: ['2 כוסות גרגירי חומוס מבושלים', 'חצי כוס טחינה גולמית', 'מיץ מלימון אחד', '1 שן שום', 'מלח', 'מים קרים'],
    steps: [
      'טוחנים את החומוס במעבד מזון.',
      'מוסיפים טחינה, לימון, שום ומלח.',
      'מוסיפים מים קרים בהדרגה עד לקבלת מרקם חלק.',
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly _recipes = signal<Recipe[]>(this.load());

  readonly recipes = this._recipes.asReadonly();
  readonly categories = computed(() => [...new Set(this._recipes().map(r => r.category))]);

  getById(id: string): Recipe | undefined {
    return this._recipes().find(r => r.id === id);
  }

  add(recipe: Omit<Recipe, 'id'>): Recipe {
    const created: Recipe = { ...recipe, id: crypto.randomUUID() };
    this._recipes.update(list => [created, ...list]);
    this.save();
    return created;
  }

  remove(id: string): void {
    this._recipes.update(list => list.filter(r => r.id !== id));
    this.save();
  }

  private load(): Recipe[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : SAMPLE_RECIPES;
    } catch {
      return SAMPLE_RECIPES;
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._recipes()));
    } catch {}
  }
}
