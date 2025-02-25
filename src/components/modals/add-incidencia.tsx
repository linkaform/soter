import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Camera from "../icon/camera";
import Upload from "../ui/upload";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AddIncidenciasModalProps {
  title: string;
	data: any;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
	onClose: ()=> void;
}

const formSchema = z.object({
  falla: z.string().optional(),
  falla_caseta: z.string().optional(),
  falla_comentarios: z.string().optional(),
  falla_documento:z.array(z.string()).optional(),
  falla_estatus: z.string().optional(),
  falla_evidencia:z.array(z.string()).optional(),
  falla_fecha_hora: z.string().optional(),
  falla_objeto_afectado: z.string().optional(),
  falla_reporta_nombre: z.string().optional(),
  falla_responsable_solucionar_nombre: z.string().optional(),
  falla_ubicacion: z.string().optional(),

//   falla_reporta_departamento: z.string(),
//   falla_responsable_solucionar_documento: z.array(z.string()).optional(),
//   falla_grupo_seguimiento: z.array(z.string()).optional(),
//   falla_folio_accion_correctiva:  z.string(),
//   falla_evidencia_solucion: z.array(z.string()).optional(),
//   falla_documento_solucion: z.array(z.string()).optional(),
//   falla_comentario_solucion:  z.string().optional(),
});

export const AddIncidenciaModal: React.FC<AddIncidenciasModalProps> = ({
  title,
	data,
	isSuccess,
	setIsSuccess,
}) => {
	const [modalData, setModalData] = useState<any>(null);
  const [ubicaciones, setUbicaciones] = useState<any| string[]>(["Planta Monterrey"]);

  const [areas, setAreas] = useState<any| string[]>(["Caseta Principal"]);
  const [concepto, setConcepto] = useState<any| string[]>(["Fallos en la maquinaria industrial"]);
  const [subconcepto, setSubconcepto] = useState<any| string[]>(["Cortadora de cerámica"]);

  const [reporta, setReporta] = useState<any| string[]>(["Pedro Parmo"]);
  const [responsable, setResponsable] = useState<any| string[]>(["Roman Lezama de la Rosa"]);
//   const { data:responseUpdateFull, isLoading:loadingUpdateFull, refetch: refetchUpdateFull } = useCreateFalla(sendDataUpdate, id, folio, dataPass?.ubicacion);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      falla: "",
      falla_caseta: "",
      falla_comentarios: "",
      falla_documento:[],
      falla_estatus: "",
      falla_evidencia:[],
      falla_fecha_hora: "",
      falla_objeto_afectado: "",
      falla_reporta_nombre: "",
      falla_responsable_solucionar_nombre: "",
      falla_ubicacion: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    let formatData={
      falla: "Fallos en la maquinaria industrial",
      falla_caseta: "Caseta Principal",
      falla_comentarios:  "soy una prueba",
      falla_documento:[],
      falla_estatus:"abierto",
      falla_evidencia:[ {
        "file_name": "PASE_DE_ENTRADA.png",
        "file_url": "https://f001.backblazeb2.com/file/app-linkaform/public-client-5986/95435/63e65029c0f814cb466658a2/67bdd905c0182609180b9c80.png"
      }],
      falla_fecha_hora: "2025-02-18 02:01:00",
      falla_objeto_afectado:  "Cortadora de cerámica",
      falla_reporta_nombre: "Pedro Parmo",
      falla_responsable_solucionar_nombre: "Roman Lezama de la Rosa",
      falla_ubicacion: "Planta Monterrey",
    }
    setModalData(formatData);

  }

  useEffect(()=>{
	if(modalData){
		
	}
  },[modalData])

  const handleClose = () => {
    setIsSuccess(false); 
};

  return (
    <Dialog open={isSuccess} modal>
      <DialogTrigger></DialogTrigger>

      <DialogContent className="max-w-3">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">


          <FormField
				control={form.control}
				name="falla_ubicacion"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Ubicacion:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecciona una ubicacion" />
						</SelectTrigger>
						<SelectContent>
						{ubicaciones?.map((vehiculo:string, index:number) => (
							<SelectItem key={index} value={vehiculo}>
								{vehiculo}
							</SelectItem>
						))}
						</SelectContent>
					</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="falla_caseta"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Area:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecciona una ubicacion" />
						</SelectTrigger>
						<SelectContent>
						{areas?.map((vehiculo:string, index:number) => (
							<SelectItem key={index} value={vehiculo}>
								{vehiculo}
							</SelectItem>
						))}
						</SelectContent>
					</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
            <FormField
              control={form.control}
              name="falla_fecha_hora"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>* Fecha</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" placeholder="Fecha" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

			<FormField
				control={form.control}
				name="falla"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Concepto:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecciona una falla" />
						</SelectTrigger>
						<SelectContent>
						{concepto?.map((vehiculo:string, index:number) => (
							<SelectItem key={index} value={vehiculo}>
								{vehiculo}
							</SelectItem>
						))}
						</SelectContent>
					</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>	

			<FormField
				control={form.control}
				name="falla_objeto_afectado"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Subconcepto:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecciona una opcion" />
						</SelectTrigger>
						<SelectContent>
						{subconcepto?.map((vehiculo:string, index:number) => (
							<SelectItem key={index} value={vehiculo}>
								{vehiculo}
							</SelectItem>
						))}
						</SelectContent>
					</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>	

			<FormField
              control={form.control}
              name="falla_comentarios"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>* Comentarios</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Texto"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
			<FormField
				control={form.control}
				name="falla_reporta_nombre"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Reporta:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecciona una opcion" />
						</SelectTrigger>
						<SelectContent>
						{reporta?.map((vehiculo:string, index:number) => (
							<SelectItem key={index} value={vehiculo}>
								{vehiculo}
							</SelectItem>
						))}
						</SelectContent>
					</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>	


			<FormField
				control={form.control}
				name="falla_responsable_solucionar_nombre"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Responsable:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecciona una opcion" />
						</SelectTrigger>
						<SelectContent>
						{responsable?.map((vehiculo:string, index:number) => (
							<SelectItem key={index} value={vehiculo}>
								{vehiculo}
							</SelectItem>
						))}
						</SelectContent>
					</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>	


            <div className="flex justify-between">
              <p>Agregar foto</p>

              <Camera />
            </div>

            <div className="flex justify-between">
              <p>Subir un archivo</p>

              <Upload />

            </div>


            <p className="text-gray-400">
            **Campos requeridos            </p>

            <div className="flex gap-5">
              <DialogClose asChild>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
              >
                Agregar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
