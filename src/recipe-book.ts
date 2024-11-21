export interface RecipeBook {
  recipes: Recipe[];
}

export interface Recipe {
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  added_on: Date;
}

export interface Ingredient {
  name: string;
  unit?: string;
  amount: number;
}
