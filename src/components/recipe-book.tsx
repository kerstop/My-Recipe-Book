import React, { useContext } from "react";
import { RecipeBook } from "../recipe-book";
import { NavLink } from "react-router";
import GlobalState from "../context";

const RecipeBookPage: React.FC = () => {
  const { book, setRecipeId, setEditing } = useContext(GlobalState);
  return (
    <>
      <h1>Recipes</h1>
      <ul>
        {book.recipes.map((recipe) => (
          <li key={recipe.id}>
            <a
              onClick={() => {
                setRecipeId(recipe.id);
                setEditing(false);
              }}
            >
              {recipe.title}
            </a>
          </li>
        ))}
      </ul>
      <input type="button" defaultValue="Create New" />
    </>
  );
};

export default RecipeBookPage;
