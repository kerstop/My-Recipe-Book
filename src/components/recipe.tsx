import React, { useRef } from "react";
import { Recipe, RecipeBook } from "../recipe-book";
import { useNavigate, useParams } from "react-router";
import EditRecipe from "./edit-recipe";

const RecipeDisplay: React.FC<{ recipeBook: RecipeBook }> = ({
  recipeBook,
}) => {
  const { recipeName } = useParams();

  const navigate = useNavigate();

  if (recipeName === undefined) {
    return <div>No Recipe Selected</div>;
  }
  const recipe = recipeBook.recipes.find(
    (recipe) => recipe.title === recipeName,
  );
  if (recipe === undefined) {
    return <div>Recipe Not Found</div>;
  }

  return (
    <div>
      <input
        type="button"
        value={"edit"}
        onClick={() => {
          navigate(`/recipes/${recipeName}/edit`);
        }}
      />
      <h1>{recipe.title}</h1>
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.orderBy}>
            {ingredient.amount} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      <h2>Instructions</h2>
      <div>{recipe.instructions}</div>
      <br />
      <div>{`Added on: ${recipe.lastModified}`}</div>
      <div>{`uuid: ${recipe.id}`}</div>
    </div>
  );
};

export default RecipeDisplay;
