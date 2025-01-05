import { useContext, useEffect, useRef, useState } from "react";
import GlobalState from "../context";
import { invoke } from "@tauri-apps/api/core";
import { recipeBookValidator } from "../recipe-book";

const LoadFileDialog: React.FC<{}> = () => {
  const { book, setBook } = useContext(GlobalState);
  const [openedFileName, setOpenedFileName] = useState("my-recipebook.rcpbk");
  const [popupOpen, setPopupOpen] = useState(false);
  const load_file_dialog = useRef<HTMLDialogElement>(null);
  const file_input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if ("__TAURI_INTERNALS__" in window) {
      invoke("load_book").then((book) => {
        const loaded_book = JSON.parse(book as string);
        if (recipeBookValidator(loaded_book)) {
          setBook(loaded_book);
        } else {
          console.error(
            "file was not properly formated",
            recipeBookValidator.errors,
          );
        }
      });
    } else {
      load_file_dialog.current?.showModal();
    }
  }, []);

  return (
    <div className="header-right">
      <button className="popup-trigger" onClick={() => setPopupOpen(true)}>
        viewing: {openedFileName.replace(".rcpbk", "")}
      </button>
      {popupOpen ? (
        <div className="popup" onMouseLeave={() => setPopupOpen(false)}>
          {"Currently Viewing: "}
          <strong>{openedFileName.replace(".rcpbk", "")}</strong>
          <br />
          <input
            type="Button"
            defaultValue="Save"
            onClick={() => {
              if ("__TAURI_INTERNALS__" in window) {
                invoke("save_book", { bookStr: JSON.stringify(book) });
                return;
              }
              const blob = new Blob([JSON.stringify(book)], {
                type: "text/json",
              });
              const element = document.createElement("a");
              element.href = URL.createObjectURL(blob);
              element.download = openedFileName;

              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
              setTimeout(() => URL.revokeObjectURL(element.href), 1500);
            }}
          />
          <input
            type="Button"
            defaultValue="Load"
            onClick={() => load_file_dialog.current?.showModal()}
          />
        </div>
      ) : null}
      <dialog ref={load_file_dialog} onClose={() => setError(null)}>
        {error !== null ? <p>{`Error: ${error}`}</p> : ""}
        <form method="dialog">
          <p>Select a recipe book to open</p>
          <input
            type="file"
            name="book"
            accept=".rcpbk,.json"
            ref={file_input}
          />
          <input
            type="button"
            value={"Load"}
            onClick={async () => {
              setError(null);
              const file = file_input.current?.files?.[0];
              if (file !== undefined) {
                const file_contents = JSON.parse(await file.text());
                if (recipeBookValidator(file_contents)) {
                  setBook(file_contents);
                  setOpenedFileName(file.name);
                  load_file_dialog.current?.close();
                } else {
                  setError("This file seems to be improperly formated");
                  console.error(
                    "recipe book validation errors",
                    recipeBookValidator.errors,
                  );
                }
              }
            }}
          />
          <input
            type="button"
            value="Cancel"
            onClick={() => load_file_dialog.current?.close()}
          />
        </form>
      </dialog>
    </div>
  );
};

export default LoadFileDialog;
