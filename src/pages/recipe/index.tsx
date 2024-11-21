import React from "react";
import { Recipe } from "../../recipe-book";

const RecipeDisplay: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { title, ingredients, instructions, added_on } = recipe;
  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {ingredients.map((ingredient) => (
          <li>
            {ingredient.amount} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      {instructions}
    </div>
  );
};

export default RecipeDisplay;
