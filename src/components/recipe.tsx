import React, { useRef } from "react";
import { Recipe, RecipeBook } from "../recipe-book";
import { useParams } from "react-router";
import EditRecipeForm from "./edit-recipe";

const RecipeDisplay: React.FC<{ recipeBook: RecipeBook }> = ({
  recipeBook,
}) => {
  const { recipeName } = useParams();
  const editDialog = useRef<HTMLDialogElement | null>(null);

  const showEditDialog = () => {
    editDialog.current?.showModal();
  };
  const editDialogHandler = (newRecipe: Recipe) => {
    console.log(newRecipe);
  };

  if (recipeName === undefined) {
    return <div>No Recipe Selected</div>;
  }
  const recipe = recipeBook.recipes.find(
    (recipe) => recipe.title === recipeName,
  );
  if (recipe === undefined) {
    return <div>Recipe Not Found</div>;
  }

  const { title, ingredients, instructions, lastModified: addedOn } = recipe;

  return (
    <div>
      <input type="button" value={"edit"} onClick={showEditDialog} />
      <h1>{title}</h1>
      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((ingredient, i) => (
          <li key={i}>
            {ingredient.amount} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      <h2>Instructions</h2>
      <div>{instructions}</div>
      <br />
      <div>{`Added on: ${addedOn}`}</div>
      <dialog ref={editDialog}>
        <EditRecipeForm recipe={recipe} onSubmit={editDialogHandler} />
      </dialog>
    </div>
  );
};

export default RecipeDisplay;
