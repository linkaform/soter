import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { useState } from "react";
import { useEnviarMensaje } from "@/hooks/useSendSMSAndEmail";

interface SendMessageModalProps {
  title: string;
  children: React.ReactNode;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Campo requerido",
  })
    .max(50, { message: "Máximo 50 caracteres" }),
  message: z.string().min(2, {
    message: "Campo requerido",
  })
    .max(100, { message: "Máximo 100 caracteres" }),
})

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  title,
  children,
}) => {

  const { searchPass } = useSearchPass(false);
  const [open, setOpen] = useState(false);
  const { enviarMensajeMutation } = useEnviarMensaje();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      message: ''
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data_msj = {
      "email_from": localStorage.getItem("userEmail_soter") ?? '',
      "titulo": values.title,
      "nombre": searchPass?.nombre ?? '',
      "email_to": searchPass?.visita_a[0].email[0],
      "mensaje": values.message,
      "phone_to": searchPass?.visita_a[0].telefono[0] ?? ''
    }

    if (setOpen) setOpen(false);

    enviarMensajeMutation.mutate(
      data_msj,
      {
        onSuccess: () => {
          form.reset()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
          <DialogDescription>
            {'Se enviara una notificacion por correo y SMS a quien es visitado, se claro con tu mensaje.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Motivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribe el motivo del mensaje"
                      maxLength={50} {...field} />

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
                  <FormLabel>* Mensaje</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe el mensaje que recibira el anfitrion"
                      className="resize-none"
                      maxLength={100}
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
                Enviar
              </Button>


            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};