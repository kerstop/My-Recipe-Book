import React from "react";
import { RecipeBook } from "./recipe-book";

const GlobalState = React.createContext<{
  book: RecipeBook;
  setBook: (newBook: RecipeBook) => void;
  recipeId: string | null;
  setRecipeId: (id: string | null) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
}>(null as any);

export default GlobalState;
