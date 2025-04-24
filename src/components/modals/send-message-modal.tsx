import { zodResolver } from "@hookform/resolvers/zod";
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
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchPass } from "@/hooks/useSearchPass";
import { Input } from "../ui/input";

interface SendMessageModalProps {
  title: string;
  children: React.ReactNode;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Campo requerido",
  }),
  message: z.string().min(2, {
    message: "Campo requerido",
  }),
})

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  title,
  children,
}) => {

  const { searchPass } = useSearchPass(false);



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: `Mensaje de ${searchPass?.nombre} enviado desde Accesos.`, 
      message: `${searchPass?.nombre} quiere ponerse en contacto contigo.`
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>


    {/*     <div className="">
            <p>
              <Label className="">Para:</Label>
              {searchPass?.nombre}
            </p>

            <p>
              <Label className="">Correo:</Label>
              {searchPass?.email || "No hay email configurado"}
            </p>
          </div> */}


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


          <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Título</FormLabel>
                  <FormControl>
                  <Input placeholder="Texto" {...field} />

                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

  

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Comentario</FormLabel>
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

            <p className="text-gray-400">**Campos requeridos </p>

            <div className="flex gap-5">
              <DialogClose asChild>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
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