import { useRef, useState } from "react";
import { Ingredient, Recipe } from "../recipe-book";

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

const EditRecipeForm: React.FC<{
  recipeToEdit?: Recipe;
  onSubmit: (newRecipe: Recipe) => void;
}> = ({ recipeToEdit, onSubmit }) => {
  const [recipe, setRecipe] = useState<Recipe>(
    recipeToEdit ?? {
      title: "",
      ingredients: [],
      instructions: "",
      lastModified: new Date(),
    },
  );
  return (
    <form
      method="dialog"
      onSubmit={(e) => {
        onSubmit({ ...recipe, lastModified: new Date() });
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
        {recipe.ingredients.map((ingredient) => {
          return (
            <EditIngredient
              setIngredient={(ingredient) => {}}
              ingredient={ingredient}
            />
          );
        })}
      </ul>
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

export default EditRecipeForm;
