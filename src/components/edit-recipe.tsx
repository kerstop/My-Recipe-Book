import { useContext, useRef, useState } from "react";
import { Ingredient } from "../recipe-book";
import { max } from "lodash";
import GlobalState from "../context";

const EditIngredient: React.FC<{
  ingredient: Ingredient;
  setIngredient: (ingredient: Ingredient) => void;
  removeIngredient: () => void;
}> = ({ ingredient, setIngredient, removeIngredient }) => {
  const amountRef = useRef<HTMLInputElement | null>(null);
  const unitRef = useRef<HTMLSelectElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const onChange = () => {
    if (amountRef.current && unitRef.current && nameRef.current) {
      setIngredient({
        id: ingredient.id,
        amount: amountRef.current.valueAsNumber,
        unit: unitRef.current.value,
        name: nameRef.current.value,
      });
    }
  };
  return (
    <li>
      <input
        className="ingredient-amount-input"
        type="number"
        autoComplete="off"
        defaultValue={ingredient.amount}
        ref={amountRef}
        onChange={onChange}
      />
      <select ref={unitRef} onChange={onChange}>
        <option selected={ingredient.unit === ""}></option>
        <option selected={ingredient.unit === "lb"}>lb</option>
        <option selected={ingredient.unit === "cup"}>cup</option>
      </select>
      <input
        className="ingredient-name-input"
        autoComplete="off"
        defaultValue={ingredient.name}
        ref={nameRef}
        onChange={onChange}
      />
      <input type="button" defaultValue="-" onClick={removeIngredient} />
    </li>
  );
};

const EditRecipe: React.FC = () => {
  const { book, recipeId, setBook, setEditing } = useContext(GlobalState);
  const [recipe, setRecipe] = useState(
    book.recipes.find((r) => r.id === recipeId),
  );

  if (recipe === undefined) {
    return <div>Recipe Not Found</div>;
  }

  return (
    <form action="none">
      <label>
        {"Title "}
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
              removeIngredient={() => {
                let updatedIngredientList = [
                  ...recipe.ingredients.slice(0, i),
                  ...recipe.ingredients.slice(i + 1),
                ];
                updatedIngredientList.sort((a, b) => a.orderBy - b.orderBy);
                updatedIngredientList.forEach(
                  (ingredient, i) => (ingredient.orderBy = i),
                );
                setRecipe({ ...recipe, ingredients: updatedIngredientList });
              }}
              ingredient={ingredient}
              key={ingredient.id}
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
                id: window.crypto.randomUUID(),
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
      <input
        type="button"
        defaultValue="Save"
        onClick={() => {
          let recipeToUpdate = book.recipes.findIndex(
            (r) => r.id === recipe.id,
          );
          if (recipeToUpdate === -1) {
            book.recipes.push(recipe);
          } else {
            book.recipes[recipeToUpdate] = recipe;
          }
          setBook({ ...book });
          console.log(book.recipes);
          setEditing(false);
        }}
      />
      <input
        type="button"
        defaultValue={"Cancel"}
        onClick={() => setEditing(false)}
      />
    </form>
  );
};

export default EditRecipe;
