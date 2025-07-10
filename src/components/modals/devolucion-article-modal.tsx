/* eslint-disable react-hooks/exhaustive-deps */
//eslint-disable react-hooks/exhaustive-deps
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useEffect, useState } from "react";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { useShiftStore } from "@/store/useShiftStore";
import { useArticulosPerdidos } from "@/hooks/useArticulosPerdidos";

interface AddFallaModalProps {
  	title: string;
	data: any;
}

const formSchema = z.object({
	estatus_perdido: z.string().min(1, { message: "Este campo es oblicatorio" }),
	foto_recibe_perdido: z.array(
    z.object({
      file_url: z.string(),
      file_name: z.string(),
    })
  ).optional(),
	identificacion_recibe_perdido:  z.array(
    z.object({
      file_url: z.string(),
      file_name: z.string(),
    })
  ).optional(),
	recibe_perdido: z.string().min(1, { message: "Este campo es oblicatorio" }),
	telefono_recibe_perdido: z.string().min(1, { message: "Este campo es oblicatorio" })
});

export const DevolucionArticuloModal: React.FC<AddFallaModalProps> = ({
  	title,
	data,
}) => {
	const { area, location } = useShiftStore();
	const [isSuccess, setIsSuccess] =useState(false)
	const [foto, setFoto] = useState<Imagen[]>([]);
	const [iden , setIden] = useState<Imagen[]>([]);
	const { devolverArticulosPerdidosMutation, isLoading} = useArticulosPerdidos(location,area, "", false, "", "", "")
	const [isActiveDevolucion, setIsActiveDevolucion] = useState<string>("entregado");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			estatus_perdido: isActiveDevolucion,
			foto_recibe_perdido: foto,
			identificacion_recibe_perdido: iden,
			recibe_perdido: "",
			telefono_recibe_perdido: "",
		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(isSuccess){
			reset()
			setIden([])
			setFoto([])
		}
	},[isSuccess, reset])

	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])

	function onSubmit(values: z.infer<typeof formSchema>) {
    
		if(foto && iden && isActiveDevolucion){
			const formatData ={
				estatus_perdido: isActiveDevolucion,
				foto_recibe_perdido: foto,
				identificacion_recibe_perdido: iden,
				recibe_perdido: values.recibe_perdido,
				telefono_recibe_perdido: values.telefono_recibe_perdido,
			}
			devolverArticulosPerdidosMutation.mutate({data_article_update:formatData, folio:data.folio, location, area , status:formatData.estatus_perdido})
		}else{
		if (!foto) {
			form.setError("foto_recibe_perdido", {
				type: "manual",
				message: "Foto es un campo requerido.",
			});
		}
		if (!iden) {
			form.setError("identificacion_recibe_perdido", {
				type: "manual",
				message: "Identificación es un campo requerido.",
			});
		}
		if (!iden) {
			form.setError("estatus_perdido", {
				type: "manual",
				message: "Estatus es un campo requerido.",
			});
		}
	}
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};

	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])

    const handleOpenModal = async () => {
		setIsSuccess(true);
	};

  return (
    <Dialog onOpenChange={setIsSuccess} open={isSuccess}>
      <div className="cursor-pointer" title="Devolver Artículo" onClick={handleOpenModal}>
        <ArrowRightLeft />
	    </div>

      <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col" aria-describedby="">
			<DialogHeader className="flex-shrink-0">
			<DialogTitle className="text-2xl text-center font-bold">
				{title}
			</DialogTitle>
			</DialogHeader>
            <div className="overflow-y-auto p-2">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
					<div className="w-full flex gap-2 mb-2">
						<p className="font-bold ">Folio: </p>
						<p  className="font-bold text-blue-500">{data?.folio} </p>
					</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 ">

                    <div className="flex justify-between">
                            <LoadImage
                                id="foto_recibe_perdido"
                                titulo={"Foto de quien recibe"}
                                setImg={setFoto}
                                showWebcamOption={true}
                                facingMode="user" 
                                imgArray={foto} 
                                showArray={true} 
                                limit={10}
                                />
                        </div>


                        <div className="flex justify-between">
                            <LoadImage
                                id="identificacion_recibe_perdido"
                                titulo={"Identificación de quien recibe"}
                                setImg={setIden}
                                showWebcamOption={true}
                                facingMode="user" 
                                imgArray={iden} 
                                showArray={true} 
                                limit={10}
                                />
                        </div>


                        <FormField
                        control={form.control}
                        name="recibe_perdido"
                        render={({ field }:any) => (
                            <FormItem>
                            <FormLabel>Recibe:</FormLabel>
                            <FormControl>
                                <Input placeholder="Quién recibe..." {...field} 
                                onChange={(e) => {
                                    field.onChange(e); // Actualiza el valor en react-hook-form
                                }}
                                value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                      <FormField
                        control={form.control}
                        name="telefono_recibe_perdido"
                        render={({ field }:any) => (
                            <FormItem>
                            <FormLabel>Teléfono de quien recibe:</FormLabel>
                            <FormControl>
                                <Input placeholder="Teléfono..." {...field} 
                                onChange={(e) => {
                                    field.onChange(e); // Actualiza el valor en react-hook-form
                                }}
                                value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                   
                    </div>

                    <div className="flex gap-2 flex-col ">
						<FormLabel className="mb-2">
                        Quién entrega, Selecciona una opción:
						</FormLabel>
						<div className="flex gap-2">
							<div className="flex gap-2 flex-wrap">
								<Button
								type="button"
								onClick={() => setIsActiveDevolucion("entregado")}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
                                    isActiveDevolucion === 'entregado'
                                      ? 'bg-blue-600 text-white'
                                      : 'border-2 border-blue-400 bg-transparent'
                                  } hover:bg-current hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`} //hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]
								>
								<div className="flex flex-wrap items-center">
									{isActiveDevolucion == "entregado"? (
									<>
										<div>Entregado</div>
									</>
									) : (
									<>
										<div className="text-blue-600">Entregado</div>
									</>
									)}
								</div>
								</Button>
							</div>
							<div className="flex gap-2 flex-wrap">
								<Button
								type="button"
								onClick={() => setIsActiveDevolucion("Donado")}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
                                    isActiveDevolucion === 'Donado'
                                      ? 'bg-blue-600 text-white'
                                      : 'border-2 border-blue-400 bg-transparent'
                                  } hover:bg-current hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
								>
								<div className="flex flex-wrap items-center">
									{isActiveDevolucion == "Donado"? (
									<>
										<div>Donado</div>
									</>
									) : (
									<>
										<div className="text-blue-600">Donado</div>
									</>
									)}
								</div>
								</Button>
							</div>
						</div>						
					</div>
                </form>
                </Form>
            </div>
            <div className="flex gap-2">
				<DialogClose asChild>
					<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
						Cancelar
					</Button>
				</DialogClose>

				
				<Button
					type="submit"
					className="w-full bg-blue-500 hover:bg-blue-600 text-white " disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
					{ !isLoading ? (<>
					{("Devolver artículo")}
					</>) :(<> <Loader2 className="animate-spin"/> {"Devolver artículo..."} </>)}
				</Button>
			</div>   
      </DialogContent>
    </Dialog>
  );
};
