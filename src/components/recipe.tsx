import React, { useContext } from "react";
import GlobalState from "../context";

const RecipeDisplay: React.FC = () => {
  const { book, recipeId, setEditing } = useContext(GlobalState);
  const recipe = book.recipes.find((recipe) => recipe.id === recipeId);
  if (recipe === undefined) {
    return <div>Recipe Not Found</div>;
  }

  return (
    <div>
      <input
        type="button"
        value={"edit"}
        onClick={() => {
          setEditing(true);
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
