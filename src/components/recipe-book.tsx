import React, { useContext } from "react";
import { RecipeBook } from "../recipe-book";
import { NavLink } from "react-router";
import GlobalState from "../context";

const RecipeBookPage: React.FC = () => {
  const { book, setRecipeId, setEditing, setBook } = useContext(GlobalState);
  return (
    <>
      <h1>Recipes</h1>
      <ul>
        {book.recipes.map((recipe) => (
          <li key={recipe.id}>
            <a
              onClick={() => {
                setRecipeId(recipe.id);
                setEditing(false);
              }}
            >
              {recipe.title}
            </a>
          </li>
        ))}
      </ul>
      <input
        type="button"
        defaultValue="Create New"
        onClick={() => {
          const newId = self.crypto.randomUUID();
          book.recipes = [
            ...book.recipes,
            {
              id: newId,
              title: "New Recipe",
              ingredients: [{ orderBy: 1, name: "", unit: "", amount: 1 }],
              instructions: "",
              lastModified: new Date(),
            },
          ];
          setBook({ ...book });
          setEditing(true);
          setRecipeId(newId);
        }}
      />
    </>
  );
};

export default RecipeBookPage;
