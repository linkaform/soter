import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { z } from "zod";

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
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useState } from "react";
import { SuccessModal } from "./success-modal";
import { Separator } from "../ui/separator";

interface ResendPassModalProps {
  title: string;
  children: React.ReactNode;
}

const FormSchema = z.object({
  documentos: z.array(z.string()).min(1, {
    message: "Selecciona al menos un método de envío.",
  }),
});

export const ResendPassModal: React.FC<ResendPassModalProps> = ({
  title,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      documentos: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setOpen(true);
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

        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="">
            <FormField
  control={form.control}
  name="documentos"
  render={({ field }) => (
    <FormItem>
      <div className="flex flex-col items-center text-center">
        <FormLabel>
          Seleccione las opciones para reenviar el pase.
        </FormLabel>
        <div className="space-y-2 my-5">
          {[
            { label: "Enviar mensaje", value: "sms" },
            { label: "Enviar correo", value: "correo" },
          ].map((method) => (
            <FormControl key={method.value}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value?.includes(method.value)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...(field.value || []), method.value]
                      : field.value?.filter((val) => val !== method.value) || [];
                    field.onChange(newValue); // Actualiza la lista seleccionada
                  }}
                />
                <Label className="text-sm">{method.label}</Label>
              </div>
            </FormControl>
          ))}
        </div>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
            </div>

            <Separator />

            <div className="flex gap-5">
              <DialogClose asChild>
                <Button
                  onClick={() => form.reset()}
                  className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white">
                Confirmar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

      <SuccessModal
        title={"Gafete Recibido"}
        description={"El gafete ha sido recibido correctamente."}
        open={open}
        setOpen={setOpen}
      />
    </Dialog>
  );
};
