import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger, 
} from "../ui/dialog";

import { useState } from "react";
import { Button } from "../ui/button";
import { AreasTable } from "../table/areas/table";
import { useCatalogAreasRondin } from "@/hooks/Rondines/useCatalogAreasRondin";
import { useShiftStore } from "@/store/useShiftStore";

interface AreaModalProps {
title: string;
children: React.ReactNode;
points:any[];
// closeModal: () => void;
// isOpenModal:boolean
// setOpenModal:Dispatch<SetStateAction<boolean>>
}

export const AreasModal: React.FC<AreaModalProps> = ({
title,
children,
points
// closeModal,
// isOpenModal,
// setOpenModal
}) => {

const [isOpenModal, setOpenModal] = useState(false)
const { location } = useShiftStore()
const { data, isLoading} = useCatalogAreasRondin(location, isOpenModal);
const areasEnUso = points.map((point) => point.rondin_area);
const areasDisponibles = data?.filter(
    (area:any) => !areasEnUso.includes(area.name)
  );


return (
<Dialog open={isOpenModal} onOpenChange={setOpenModal}>
    <DialogTrigger >{children}</DialogTrigger>
    <DialogContent className="max-w-xl flex flex-col w-full overflow-hidden">
        <DialogHeader>
            <DialogTitle className="text-2xl text-center font-bold">
                {title}
            </DialogTitle>
        </DialogHeader>
            <div className="">
            { isLoading ?(
                <div className="flex justify-center items-center h-screen">
                    <div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ):( 
            <AreasTable isOpen={isOpenModal} data={areasDisponibles} isLoading={isLoading} />
            )}
            </div>
        <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={()=>{
            setOpenModal(false)
        }}>
        Cerrar
    </Button>
    </DialogContent>
</Dialog>
);
};