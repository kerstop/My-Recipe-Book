import React, { useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import RecipeDisplay from "./components/recipe";
import RecipeBookDisplay from "./components/recipe-book";
import { Recipe, RecipeBook } from "./recipe-book";
import "./main.css";
import EditRecipe from "./components/edit-recipe";
import GlobalState from "./context";

const defaultBook: RecipeBook = {
  recipes: [
    {
      id: self.crypto.randomUUID(),
      title: "owl",
      instructions: "make the rest of the owl",
      ingredients: [{ name: "owl meat", unit: "lb", amount: 1, orderBy: 1 }],
      lastModified: new Date(),
    },
  ],
};

const Body: React.FC = () => {
  const { recipeId, editing } = useContext(GlobalState);
  if (recipeId !== null) {
    if (editing) {
      return <EditRecipe />;
    } else {
      return <RecipeDisplay />;
    }
  } else {
    return <RecipeBookDisplay />;
  }
};

const RootNode: React.FC = () => {
  const [book, setBook] = useState(defaultBook);
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  return (
    <GlobalState.Provider
      value={{ book, setBook, recipeId, setRecipeId, editing, setEditing }}
    >
      <input
        type="button"
        value="Home"
        onClick={() => {
          setRecipeId(null);
        }}
      />
      <hr />
      <Body />
    </GlobalState.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RootNode />
  </React.StrictMode>,
);
