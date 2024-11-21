import React from "react";
import { RecipeBook } from "../../recipe-book";

const RecipeBookPage: React.FC<{ book: RecipeBook }> = ({ book }) => {
  return (
    <>
      <h1>Recipes</h1>
      <ul>
        {book.recipes.map((recipe) => (
          <li>{recipe.title}</li>
        ))}
      </ul>
    </>
  );
};

export default RecipeBookPage;
