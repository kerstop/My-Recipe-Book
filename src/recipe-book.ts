import Ajv from "ajv/dist/jtd";
import recipeBookSchema from "../recipe_book.json";
export interface RecipeBook {
  recipes: Recipe[];
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  lastModified: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  amount: number;
  orderBy: number;
}

const ajv = new Ajv();
export const recipeBookValidator = ajv.compile<RecipeBook>(recipeBookSchema);
