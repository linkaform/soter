/* eslint-disable react-hooks/exhaustive-deps */
//eslint-disable react-hooks/exhaustive-deps
import { z } from "zod";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// import { useShiftStore } from "@/store/useShiftStore";
import { useArticulosConcesionados } from "@/hooks/useArticulosConcesionados";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import DateTime from "../dateTime";
import { format } from "date-fns";
import { useShiftStore } from "@/store/useShiftStore";

interface AddACModalProps {
  	title: string;
	data: any;
}

const formSchema = z.object({
    status_concesion:  z.string().min(1, { message: "Este campo es oblicatorio" }),
    fecha_devolucion_concesion: z.string().optional()
});

export const DevolucionArticuloConModal: React.FC<AddACModalProps> = ({
  title,
	data
}) => {
	const { area, location } = useShiftStore();
	const [isSuccess, setIsSuccess] =useState(false)
	const { editarArticulosConMutation, isLoading} = useArticulosConcesionados(location, area, "",false, "", "", "")
	// const [isActiveDevolucion, setIsActiveDevolucion] = useState<string>("entregado");
	const [date, setDate] = useState<Date|"">("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			status_concesion: "abierto",
			fecha_devolucion_concesion: "",
		},
	});
    

	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])

	function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
        const formatData = {
            status_concesion: values.status_concesion ?? "devuelto",
            fecha_devolucion_concesion: formattedDate ??"",
        }
        editarArticulosConMutation.mutate({data_article_update:formatData, folio:data.folio})
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};

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
                  <div className="w-full flex gap-2">
                    <p className="font-bold ">Folio: </p>
                    <p  className="font-bold text-blue-500">{data?.folio} </p>
                  </div>
                
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5  mb-2">


                        <FormField
                        control={form.control}
                        name="status_concesion"
                        render={({ field }:any) => (
                            <FormItem>
                            <FormLabel>Recibe:</FormLabel>
                            <FormControl>
                                <Input placeholder="Acción realizada..." {...field} 
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
                        name="fecha_devolucion_concesion"
                        render={() => (
                            <FormItem>
                            <FormLabel>Telefono de quien recibe:</FormLabel>
                            <FormControl>
                            <FormControl>
                                <DateTime date={date} setDate={setDate} />
                            </FormControl>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
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
