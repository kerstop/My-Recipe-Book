import { useRef, useState } from "react";
import { Ingredient, IngredientList, Recipe, RecipeBook } from "../recipe-book";
import { max } from "lodash";
import { useNavigate, useParams } from "react-router";

const EditIngredient: React.FC<{
  ingredient: Ingredient;
  setIngredient: (ingredient: Ingredient) => void;
}> = ({ ingredient, setIngredient }) => {
  const amountRef = useRef<HTMLInputElement | null>(null);
  const unitRef = useRef<HTMLSelectElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const onChange = () => {
    if (amountRef.current && unitRef.current && nameRef.current) {
      setIngredient({
        amount: amountRef.current.valueAsNumber,
        unit: unitRef.current.value,
        name: nameRef.current.value,
      });
    }
  };
  return (
    <li>
      <input
        type="number"
        autoComplete="off"
        defaultValue={ingredient.amount}
        ref={amountRef}
        onChange={onChange}
      />
      <select ref={unitRef} onChange={onChange}>
        <option value=""></option>
      </select>
      <input
        autoComplete="off"
        defaultValue={ingredient.name}
        ref={nameRef}
        onChange={onChange}
      />
    </li>
  );
};

const EditRecipe: React.FC<{
  recipeBook: RecipeBook;
  setRecipeBook: (RecipeBook: RecipeBook) => void;
}> = ({ recipeBook, setRecipeBook }) => {
  const { recipeName } = useParams();

  const navigate = useNavigate();

  if (recipeName === undefined) {
    return <div>No Recipe Selected</div>;
  }

  const [recipe, setRecipe] = useState(
    recipeBook.recipes.find((r) => r.title === recipeName),
  );

  if (recipe === undefined) {
    return <div>Recipe Not Found</div>;
  }

  return (
    <form
      method="dialog"
      onSubmit={(e) => {
        let recipeToUpdate = recipeBook.recipes.findIndex(
          (r) => r.id === recipe.id,
        );
        if (recipeToUpdate === -1) {
          recipeBook.recipes.push(recipe);
        } else {
          recipeBook.recipes[recipeToUpdate] = recipe;
        }
        setRecipeBook({ ...recipeBook });
        console.log(recipeBook.recipes);
        navigate(`/recipes/${recipe.title}`);
      }}
    >
      <label>
        Title
        <input
          name="title"
          autoComplete="off"
          defaultValue={recipe?.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
        />
      </label>
      <ul>
        {recipe.ingredients.map((ingredient, i) => {
          return (
            <EditIngredient
              setIngredient={(updatedIngredient) => {
                let updatedIngredientList = [...recipe.ingredients];
                updatedIngredientList[i] = {
                  ...updatedIngredient,
                  orderBy: ingredient.orderBy,
                };
                setRecipe({ ...recipe, ingredients: updatedIngredientList });
              }}
              ingredient={ingredient}
              key={ingredient.orderBy}
            />
          );
        })}
      </ul>
      <input
        type="button"
        value={"+"}
        onClick={() => {
          setRecipe({
            ...recipe,
            ingredients: [
              ...recipe.ingredients,
              {
                name: "",
                unit: "",
                amount: 1,
                orderBy:
                  (max(recipe.ingredients.map((i) => i.orderBy)) ?? 0) + 1,
              },
            ],
          });
        }}
      />
      <label>
        Instructions
        <br />
        <textarea
          name="instructions"
          autoComplete="off"
          defaultValue={recipe.instructions}
          onChange={(e) =>
            setRecipe({ ...recipe, instructions: e.target.value })
          }
        />
      </label>
      <input type="submit" />
    </form>
  );
};

export default EditRecipe;
