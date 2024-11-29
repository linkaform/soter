import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

interface AddVehicleModalProps {
  title: string;
  children: React.ReactNode;

}


const FormSchema = z.object({
    tipo: z.string().min(2, {
        message: "Campo requerido.",
      }),

      marca: z.string().min(2, {
        message: "Campo requerido.",
      }),
      modelo: z.string().min(2, {
        message: "Campo requerido.",
      }),
      estado: z.string().min(2, {
        message: "Campo requerido.",
      }), 
      placas: z.string().min(2, {
        message: "Campo requerido.",
      }), 
      color: z.string().min(2, {
        message: "Campo requerido.",
      }), 
  })
   

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  title,
  children,

}) => {


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            tipo: "",
            marca: "",
            modelo: "",
            placas: "",
            color: ""         
        }
      })
     


   
  function onSubmit(data: z.infer<typeof FormSchema>) {

    console.log(data)
  
  }
 

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>


        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      
      
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span> Tipo de Vehículo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
           
              <FormMessage />
            </FormItem>
          )}
        />

       <FormField
          control={form.control}
          name="marca"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span> Marca</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
           
              <FormMessage />
            </FormItem>
          )}
        />

       <FormField
          control={form.control}
          name="modelo"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span> Modelo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
           
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span> Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
           
              <FormMessage />
            </FormItem>
          )}
        />




     <FormField
          control={form.control}
          name="placas"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span> Placas</FormLabel>
              <FormControl>
                <Input placeholder="Placas" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />



       <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span> Color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
           
              <FormMessage />
            </FormItem>
          )}
        />


</div>







  

     
        <div className="flex gap-5">
          <DialogClose asChild>
            <Button onClick={() => form.reset()} className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white"
          >
            Confirmar
          </Button>
        </div>

        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
