export interface RecipeBook {
  recipes: Recipe[];
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: IngredientList;
  instructions: string;
  lastModified: Date;
}

export interface Ingredient {
  name: string;
  unit: string | null;
  amount: number;
}

export type IngredientList = (Ingredient & { orderBy: number })[];
