import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Imagen } from '@/lib/update-pass-full';
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

    interface ViewPhotoGuard {
        evidencia: Imagen[];
        open: boolean;
        setOpen: Dispatch<SetStateAction<boolean>>;
    }
  
    export const ViewPhotoGuard: React.FC<ViewPhotoGuard> = ({
        evidencia,
        open,
        setOpen
    }) => {
	
    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogContent className="max-w-md min-h-[400px] max-h-[90vh] flex flex-col overflow-hidden justify-between " onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-2xl text-center font-bold">
                        
                    </DialogTitle>
                </DialogHeader>
            <div>
            </div>

            {evidencia?.length > 0 && (
            <div className="flex justify-center items-center h-[350px]">
                <Image width={300} height={300} alt=""
                src={evidencia[0]?.file_url}
                className="rounded-lg w-[300px] h-[300px] object-cover"
                />
            </div>)}

            </DialogContent>
        </Dialog>
    );
};

export default ViewPhotoGuard;