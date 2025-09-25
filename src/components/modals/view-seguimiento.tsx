import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { formatDateToText } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import EvidenciaCarousel from "../view-images-videos";

interface ViewSegModalProps {
  title: string;
  data:any
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  disableNext?: boolean;
  disablePrev?: boolean;
}

export const ViewSeg: React.FC<ViewSegModalProps> = ({
  title,
  data,
  children,
  setIsSuccess,
  isSuccess,
  onNext,
  onPrev,
  disableNext,
  disablePrev
}) => {

    return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
		{onPrev && (
		<button
			onClick={onPrev}
			disabled={disablePrev}
			className="fixed left-4 top-1/2 transform -translate-y-1/2 z-[9999]
			text-slate-950 bg-slate-950 bg-opacity-30 shadow-md px-3 py-2 rounded-full
			hover:text-slate-950 hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
		>
			←
		</button>
		)}

		{onNext && (
		<button
			onClick={onNext}
			disabled={disableNext}
			className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[9999]
			text-slate-950 bg-slate-950 bg-opacity-30 shadow-md px-3 py-2 rounded-full
			hover:text-slate-950 hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
		>
			→
		</button>
		)}

        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

		<div className="overflow-y-auto px-14">
			<div className="flex justify-between">
				<div className="w-full flex flex-col gap-3 mb-2">
					<div className="w-full flex gap-2">
						<p className="font-bold">Fecha y hora: <span className="font-normal">{data?.fecha_inicio_seg ? formatDateToText(data?.fecha_inicio_seg.slice(0, -3)): ""}</span> </p>
					</div>
                    
					<div className="w-full flex gap-2">
                        <p className="font-bold ">Tiempo transcurrido: </p>
                        <p  className="font-normal">{data?.tiempo_transcurrido} </p>
					</div>

					<div className="w-full flex gap-2">
					    <p className="font-bold">Accion realizada: <span className="font-normal">{data?.accion_correctiva_incidencia}</span></p>
					</div> 

					<div className=" flex justify-between">
						<div className="w-full flex gap-2">
						<p className="font-bold">Personas Involucradas: <span className="font-normal">{data?.incidencia_personas_involucradas}</span></p>
						</div>
					</div>
                    <div className="flex flex-col gap-2">
					<p className="font-bold ">Evidencia: </p>
                   {data?.incidencia_evidencia_solucion?.length > 0 ? (
					<div className="w-full flex justify-center ">
						<EvidenciaCarousel evidencia={data?.incidencia_evidencia_solucion || []}  w={"w-48"} h={"h-40"}/>
					</div>
					) : (
						<div className="flex justify-start">No hay evidencias disponibles</div>
					)}
					<p className="font-bold">Documentos:</p>
					{data?.incidencia_documento_solucion && data?.incidencia_documento_solucion.length > 0 ? (
						<div className="mt-5 border border-gray-200 rounded-md p-2">
							<ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
							{data.incidencia_documento_solucion.map((documento: any, index: number) => (
								<li key={index}>
								<a
									href={documento.file_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 underline break-words"
								>
									{documento.file_name}
								</a>
								</li>
							))}
							</ul>
						</div>
					) : (
					<p>No hay documentos disponibles</p>
					)}
				</div>
				</div>
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
