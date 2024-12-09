import React, { useContext, useState } from "react";
import GlobalState from "../context";

const RecipeDisplay: React.FC = () => {
  const { book, setBook, recipeId, setRecipeId, setEditing } =
    useContext(GlobalState);
  const recipe = book.recipes.find((recipe) => recipe.id === recipeId);
  const [deleteInitiated, setDeleteInitiated] = useState(false);
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
      <input
        type="button"
        value={deleteInitiated ? "Are you sure?" : "Delete"}
        onClick={(e) => {
          if (deleteInitiated) {
            const i = book.recipes.findIndex((r) => r.id === recipeId);
            setBook({
              ...book,
              recipes: [
                ...book.recipes.slice(0, i),
                ...book.recipes.slice(i + 1),
              ],
            });
            setRecipeId(null);
          } else {
            setDeleteInitiated(true);
          }
        }}
        onMouseLeave={() => setDeleteInitiated(false)}
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
      <ol>
        {recipe.instructions.split("\n").map((step, i) => {
          return <li key={i}>{step}</li>;
        })}
      </ol>
      <br />
      <div>{`Added on: ${recipe.lastModified}`}</div>
      <div>{`uuid: ${recipe.id}`}</div>
    </div>
  );
};

export default RecipeDisplay;
