import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import EditRecipe from "./components/edit-recipe";
import RecipeDisplay from "./components/recipe";
import RecipeBookDisplay from "./components/recipe-book";
import GlobalState from "./context";
import "./main.css";
import { RecipeBook } from "./recipe-book";
import LoadFileDialog from "./components/load-file-dialog";

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
  const [openedFileName, setOpenedFileName] = useState("my-recipebook.rcpbk");

  return (
    <GlobalState.Provider
      value={{ book, setBook, recipeId, setRecipeId, editing, setEditing }}
    >
      <LoadFileDialog setOpenedFileName={setOpenedFileName} />
      <input
        type="button"
        value="Home"
        onClick={() => {
          setRecipeId(null);
        }}
      />
      <input
        type="Button"
        defaultValue="Save"
        style={{ float: "right" }}
        onClick={() => {
          const blob = new Blob([JSON.stringify(book)], { type: "text/json" });
          const element = document.createElement("a");
          element.href = URL.createObjectURL(blob);
          element.download = openedFileName;

          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          setTimeout(() => URL.revokeObjectURL(element.href), 1500);
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
