import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Imagen } from "@/lib/update-pass-full";

    interface DelPhotoGuard {
        setEvidencia: Dispatch<SetStateAction<Imagen[]>>;
        open: boolean;
        setOpen: Dispatch<SetStateAction<boolean>>;
    }
  
    export const DeletePhotoGuard: React.FC<DelPhotoGuard> = ({
        setEvidencia,
        open,
        setOpen
    }) => {
	
    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogContent className="max-w-md  flex flex-col overflow-hidden justify-between " onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Eliminar Fotografía
                    </DialogTitle>
                </DialogHeader>
            <div>
            </div>

            <div className="flex justify-between items-center">
                <p>¿Estas seguro de eliminar la imágen? Una vez confirmada, la acción no se podrá deshacer.</p>
            </div>

            <div className="flex gap-4 mt-auto">
			<DialogClose asChild>
				<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
				Cerrar
				</Button>
			</DialogClose>

			<Button
			type="submit"
			className="w-full  bg-blue-500 hover:bg-blue-600 text-white "  onClick={()=>{setEvidencia([]); setOpen(false)}}>
                Eliminar foto
			</Button>

		</div>
            </DialogContent>
        </Dialog>
    );
};

export default DeletePhotoGuard;