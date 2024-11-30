import { useContext, useEffect, useRef } from "react";
import GlobalState from "../context";

const LoadFileDialog: React.FC<{
  setOpenedFileName: (name: string) => void;
}> = ({ setOpenedFileName }) => {
  const { setBook } = useContext(GlobalState);
  const load_file_dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    load_file_dialog.current?.showModal();
  }, []);

  return (
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
        <input type="file" name="book" />
        <input type="submit" />
      </form>
    </dialog>
  );
};

export default LoadFileDialog;
