import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Note, useGetNotes } from "@/hooks/useGetNotes";

interface CloseNoteModalProps {
  title: string;
  children: React.ReactNode;
  folio: string;
  note: Note;
}

export const CloseNoteModal: React.FC<CloseNoteModalProps> = ({
  title,
  children,
  folio,
}) => {
  const { closeNoteMutation } = useGetNotes();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-xl	 text-center  font-bold my-5">
          ¿Estás seguro que deseas cerrar esta nota?
        </p>


        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button
            type="submit"
            className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
            onClick={() => {
              closeNoteMutation.mutate(folio);
            }}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};