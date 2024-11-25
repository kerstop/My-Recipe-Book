import { Ingredient, Recipe } from "../recipe-book";

const EditRecipeForm: React.FC<{
  recipe: Recipe | undefined;
  onSubmit: (newRecipe: Recipe) => void;
}> = ({ recipe, onSubmit }) => {
  return (
    <form
      method="dialog"
      onSubmit={(e) => {
        onSubmit({
          title: (e.target as any).title.value,
          ingredients: Array.from(
            (e.target as HTMLElement).getElementsByTagName("li"),
          ).map((listItem): Ingredient => {
            const unit = (listItem.children[1] as HTMLSelectElement).value;
            return {
              amount: (listItem.children[0] as HTMLInputElement).valueAsNumber,
              unit: unit.length > 0 ? unit : null,
              name: (listItem.children[2] as HTMLInputElement).value,
            };
          }),
          instructions: "",
          lastModified: new Date(),
        });
      }}
    >
      <label>
        Title
        <input name="title" autoComplete="off" defaultValue={recipe?.title} />
      </label>
      <ul>
        <li>
          <input type="number" autoComplete="off" defaultValue={1} />
          <select>
            <option value=""></option>
          </select>
          <input autoComplete="off" />
        </li>
      </ul>
      <label>
        Instructions
        <br />
        <textarea name="instructions" autoComplete="off" />
      </label>
      <input type="submit" />
    </form>
  );
};

export default EditRecipeForm;
