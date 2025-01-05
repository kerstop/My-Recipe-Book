import React, { useContext, useRef, useState } from "react";
import GlobalState from "../context";
import { invoke } from "@tauri-apps/api/core";

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
              ingredients: [
                {
                  id: window.crypto.randomUUID(),
                  orderBy: 0,
                  name: "",
                  unit: "",
                  amount: 1,
                },
              ],
              instructions: "",
              lastModified: new Date(),
            },
          ];
          setBook({ ...book });
          setEditing(true);
          setRecipeId(newId);
        }}
      />
      <br />
      {"__TAURI_INTERNALS__" in window ? <ImportDialog /> : ""}
    </>
  );
};

const ImportDialog: React.FC = () => {
  const dialog_element = useRef<HTMLDialogElement | null>(null);
  const url_element = useRef<HTMLInputElement | null>(null);
  const { book, setRecipeId, setEditing, setBook } = useContext(GlobalState);
  const [error, setError] = useState<null | string>(null);
  return (
    <>
      <input
        type="button"
        defaultValue="Import Recipe"
        onClick={() => {
          dialog_element.current?.showModal();
        }}
      />
      <dialog ref={dialog_element}>
        {error !== null ? <p>{`Error: ${error}`}</p> : ""}
        <label>
          URL
          <br />
          <input ref={url_element} />
        </label>
        <input
          type="button"
          defaultValue="Import"
          onClick={() => {
            const url = url_element.current?.value;
            (invoke("import_recipe", { url: url }) as Promise<string>)
              .then((json: string) => {
                const new_recipe = JSON.parse(json);
                book.recipes = [...book.recipes, new_recipe];
                setBook({ ...book });
                setEditing(true);
                setRecipeId(new_recipe.id);
                dialog_element.current?.close();
              })
              .catch((reason) => {
                setError(reason);
              });
          }}
        />
      </dialog>
    </>
  );
};

export default RecipeBookPage;
