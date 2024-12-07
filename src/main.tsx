import React, { useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import EditRecipe from "./components/edit-recipe";
import RecipeDisplay from "./components/recipe";
import RecipeBookDisplay from "./components/recipe-book";
import GlobalState from "./context";
import "./main.css";
import { RecipeBook } from "./recipe-book";
import LoadFileDialog from "./components/load-file-dialog";

const defaultBook: RecipeBook = {
  recipes: [],
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
      <LoadFileDialog />
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
