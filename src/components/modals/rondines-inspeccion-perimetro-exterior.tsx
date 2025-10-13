import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { AlarmClock, Calendar, FileDown, Loader2, Repeat2, Tag, User } from "lucide-react";
import { Badge } from "../ui/badge";

interface ViewRondinesDetalleAreaProps {
  title: string;
  data:any
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

export const ViewRondinesDetallePerimetroExt: React.FC<ViewRondinesDetalleAreaProps> = ({
  title,
  data,
  children,
  setIsSuccess,
  isSuccess,
}) => {
    console.log("estadoDia", data.estado)
    const areasInspeccionar=[
        "Caseta de vigilancia planta 1", "Área de rampa 24", "Cisterna", "Sub estación norte planta 3", "Cajas no enrampadas"
    ]

    return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md overflow-y-auto max-h-[80vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">

        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

		<div className="flex flex-col gap-y-3">
            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"><Calendar /> </div>
                <div className="flex flex-col"> 
                    <p>Fecha y hora programada</p>
                    <p className="text-gray-500 text-sm">Abr 12 2025 12:00pm</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"><Calendar /> </div>
                <div className="flex flex-col"> 
                    <p>Finalización</p>
                    <p className="text-gray-500 text-sm">Abr 12 2025 12:00pm</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"><Tag /> </div>
                <div className="flex flex-col"> 
                    <p>Estatus</p>
                    <div>
					<Badge
					className={`text-white text-sm ${
						data.estatus == "Vencido"
						? "bg-red-600 hover:bg-red-600"
						: data.estatus == "Activo"
						? "bg-green-600 hover:bg-green-600"
						: "Programado" == "Programado"
						? "bg-blue-600 hover:bg-blue-600"
						: "bg-gray-400"
					}`}
					>
					{capitalizeFirstLetter("Programado")}
					</Badge>
				</div>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"> <User/> </div>
                <div className="flex flex-col"> 
                    <p>Asignado</p>
                    <p className="text-gray-400">Roberto Pérez López</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"><AlarmClock /> </div>
                <div className="flex flex-col"> 
                    <p>Duración aproximada</p>
                    <p className="text-gray-400">1:30hrs</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"><Repeat2/> </div>
                <div className="flex flex-col"> 
                    <p>Recurrencia</p>
                    <p className="text-gray-400">Abr 12 2025 12:00pm</p>
                </div>
            </div>
        </div>

        <div className="flex  justify-end">
        <Button
			type="submit"
			className="w-1/2  bg-blue-500 hover:bg-blue-600 text-white " disabled={false} onClick={()=>{}}>
			{false ? (<>
				  <> <Loader2 className="animate-spin" /> {"Descargando Reporte..."} </>
			</>) : (<> <FileDown/> Descargar Reporte</>)}
		</Button>
        </div>

        <p className="font-bold">Áreas a inspeccionar</p>
		<div className="overflow-y-auto">
			<div>
                <ul>
                    {areasInspeccionar.map((area, index) => (
                        <li className="py-2" key={index}>
                           <div className="flex gap-3">
                                <div className="w-1 h-12 bg-blue-500"></div>
                                <div>
                                    <p>{area}</p>
                                    <p className="text-gray-400">6/Abril/2025 12:01:58 hrs</p>
                                </div>
                           </div>
                        </li>
                    ))}
                </ul>
            </div>
		</div>

		 <div className="flex gap-1 my-5 col-span-2">
          	<DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cerrar
            </Button>
          	</DialogClose>
        </div>

        </DialogContent>
    </Dialog>
  );
};
