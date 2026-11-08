import { Injectable, computed, signal } from '@angular/core';
import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp,
} from 'firebase/firestore/lite';
import { db } from '../firebase';
import { Recipe } from '../models/recipe';

const recipesCol = collection(db, 'recipes');

export const SAMPLE_RECIPES: Omit<Recipe, 'id'>[] = [
  {
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
  private readonly _recipes = signal<Recipe[]>([]);
  private readonly _loading = signal(true);
  private readonly _error = signal('');

  readonly recipes = this._recipes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly categories = computed(() => [...new Set(this._recipes().map(r => r.category))]);

  constructor() {
    this.refresh();
  }

  async refresh(): Promise<void> {
    this._loading.set(true);
    this._error.set('');
    try {
      const snap = await getDocs(query(recipesCol, orderBy('createdAt', 'desc')));
      this._recipes.set(snap.docs.map(d => ({ ...(d.data() as Omit<Recipe, 'id'>), id: d.id })));
    } catch (e) {
      console.error(e);
      this._error.set('לא הצלחנו לטעון את המתכונים.');
    } finally {
      this._loading.set(false);
    }
  }

  getById(id: string): Recipe | undefined {
    return this._recipes().find(r => r.id === id);
  }

  /** Only succeeds for the admin; Firestore rules reject everyone else. */
  async add(recipe: Omit<Recipe, 'id'>): Promise<string> {
    const ref = await addDoc(recipesCol, { ...recipe, createdAt: serverTimestamp() });
    await this.refresh();
    return ref.id;
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, 'recipes', id));
    this._recipes.update(list => list.filter(r => r.id !== id));
  }

  async addSamples(): Promise<void> {
    for (const r of [...SAMPLE_RECIPES].reverse()) {
      await addDoc(recipesCol, { ...r, createdAt: serverTimestamp() });
    }
    await this.refresh();
  }
}
