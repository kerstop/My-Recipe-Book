import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router";
import RecipeDisplay from "./components/recipe";
import RecipeBookDisplay from "./components/recipe-book";
import { Recipe, RecipeBook } from "./recipe-book";
import "./main.css";
import EditRecipe from "./components/edit-recipe";

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

const HomePage: React.FC = () => {
  const [book, setBook] = useState(defaultBook);

  const routes = (
    <Routes>
      <Route path="/" element={<RecipeBookDisplay recipeBook={book} />} />
      <Route
        path="/recipes/:recipeName"
        element={<RecipeDisplay recipeBook={book} />}
      />
      <Route
        path="/recipes/:recipeName/edit"
        element={<EditRecipe recipeBook={book} setRecipeBook={setBook} />}
      />
    </Routes>
  );
  return <BrowserRouter>{routes}</BrowserRouter>;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
);
