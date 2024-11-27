import React, { useContext } from "react";
import { RecipeBook } from "../recipe-book";
import { NavLink } from "react-router";
import GlobalState from "../context";

const RecipeBookPage: React.FC = () => {
  const { book, setRecipeId } = useContext(GlobalState);
  return (
    <>
      <h1>Recipes</h1>
      <ul>
        {book.recipes.map((recipe) => (
          <li key={recipe.id}>
            <a
              onClick={() => {
                setRecipeId(recipe.id);
              }}
            >
              {recipe.title}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RecipeBookPage;
