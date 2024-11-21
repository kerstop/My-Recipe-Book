import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RecipeDisplay from "./pages/recipe";
import RecipeBookPage from "./pages/recipe-book";
import { Recipe } from "./recipe-book";

const recipe: Recipe = {
  title: "owl",
  instructions: "make the rest of the owl",
  ingredients: [{ name: "owl meat", unit: "lb", amount: 1 }],
  added_on: new Date(),
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RecipeBookPage book={{ recipes: [recipe] }} />,
  },
  { path: "recipe", element: <RecipeDisplay recipe={recipe}></RecipeDisplay> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
