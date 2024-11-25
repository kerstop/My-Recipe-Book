import React from "react";
import { RecipeBook } from "../recipe-book";
import { NavLink } from "react-router";

const RecipeBookPage: React.FC<{ recipeBook: RecipeBook }> = ({
  recipeBook: book,
}) => {
  return (
    <>
      <h1>Recipes</h1>
      <ul>
        {book.recipes.map((recipe) => (
          <li>
            <NavLink to={`/recipes/${recipe.title}`}>{recipe.title}</NavLink>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RecipeBookPage;
