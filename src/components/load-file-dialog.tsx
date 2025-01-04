import { useContext, useEffect, useRef, useState } from "react";
import GlobalState from "../context";
import { invoke } from "@tauri-apps/api/core";

const LoadFileDialog: React.FC<{}> = () => {
  const { book, setBook } = useContext(GlobalState);
  const [openedFileName, setOpenedFileName] = useState("my-recipebook.rcpbk");
  const [popupOpen, setPopupOpen] = useState(false);
  const load_file_dialog = useRef<HTMLDialogElement>(null);
  const file_input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ("__TAURI_INTERNALS__" in window) {
      invoke("load_book").then((book) => {
        setBook(JSON.parse(book as string));
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
      <dialog ref={load_file_dialog}>
        <form
          method="dialog"
          onSubmit={async (e) => {
            const form = e.target as HTMLFormElement;
            const file_input = form.elements[0] as HTMLInputElement;
            const file = file_input.files?.[0];
            if (file !== undefined) {
              const file_contents = await file.text();
              setBook(JSON.parse(file_contents));
              setOpenedFileName(file.name);
            }
          }}
        >
          <p>Select a recipe book to open</p>
          <input type="file" name="book" accept=".rcpbk" ref={file_input} />
          <input
            type="button"
            value={"Load"}
            onClick={async () => {
              const file = file_input.current?.files?.[0];
              if (file !== undefined) {
                const file_contents = await file.text();
                setBook(JSON.parse(file_contents));
                setOpenedFileName(file.name);
                load_file_dialog.current?.close();
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
