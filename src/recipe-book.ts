export interface RecipeBook {
  recipes: Recipe[];
}

export interface Recipe {
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  lastModified: Date;
}

export interface Ingredient {
  name: string;
  unit: string | null;
  amount: number;
}
