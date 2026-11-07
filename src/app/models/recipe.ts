export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  prepMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
}
