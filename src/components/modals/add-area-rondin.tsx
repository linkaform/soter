import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger, 
} from "../ui/dialog";

import { useState } from "react";
import { Button } from "../ui/button";
import { useCatalogAreasRondin } from "@/hooks/Rondines/useCatalogAreasRondin";
import { useShiftStore } from "@/store/useShiftStore";
import { ListaAreas } from "../areas-list-rondines";

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
const areasEnUso = points?.map((point) => point.rondin_area);
const areasDisponibles = data?.filter(
    (area:any) => !areasEnUso.includes(area.name)
  );
const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

function onAgregar(){
    console.log("agregar")
}

return (
<Dialog open={isOpenModal} onOpenChange={setOpenModal}>
    <DialogTrigger >{children}</DialogTrigger>
    <DialogContent className="max-w-xl flex flex-col w-full overflow-hidden">
        <DialogHeader>
            <DialogTitle className="text-2xl text-center font-bold">{title}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
            <div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        ) : (
            <ListaAreas
            areas={areasDisponibles}
            onSelectArea={(id) =>
                setSelectedAreas((prev) =>
                prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
                )
            }
            selectedAreas={selectedAreas}
            />
        )}

    <div className="flex flex-between gap-2">
        <Button
            className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700"
            onClick={() => setOpenModal(false)}>
            Cerrar
        </Button>
        <Button
            onClick={onAgregar}
            className="w-1/2 bg-blue-600 hover:bg-blue-700  text-white "
            >
            Agregar
        </Button>
    </div>
        </DialogContent>

</Dialog>
);
};