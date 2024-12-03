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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useState } from "react";
import { SuccessModal } from "./success-modal";

interface AddBadgeModalProps {
  title: string;
  children: React.ReactNode;
}

const FormSchema = z.object({
  gafete: z.string().min(2, {
    message: "Campo requerido.",
  }),

  locker: z.string().min(2, {
    message: "Campo requerido.",
  }),
  documentos: z.array(z.string()).min(1, {
    message: "Selecciona al menos un documento.",
  }),
});

export const AddBadgeModal: React.FC<AddBadgeModalProps> = ({
  title,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gafete: "",
      locker: "",
      documentos: [],
    },
  });


  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setOpen(true); // Trigger the success modal
  }

  // Return the SuccessModal if open is true
  if (open) {
    return (
      <SuccessModal
        title={"Gafete Recibido"}
        description={"El gafete ha sido recibido correctamente."}
        open={open}
        setOpen={setOpen}
      />
    );
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="gafete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-red-500">*</span> Gafete
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m@example.com">
                          m@example.com
                        </SelectItem>
                        <SelectItem value="m@google.com">
                          m@google.com
                        </SelectItem>
                        <SelectItem value="m@support.com">
                          m@support.com
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-red-500">*</span> Locker
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m@example.com">
                          m@example.com
                        </SelectItem>
                        <SelectItem value="m@google.com">
                          m@google.com
                        </SelectItem>
                        <SelectItem value="m@support.com">
                          m@support.com
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documentos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-red-500">*</span> Documentos de
                      garantía
                    </FormLabel>
                    <div className="space-y-2 my-5">
                      {[
                        { label: "INE", value: "ine" },
                        { label: "Licencia de Conducir", value: "licencia" },
                        { label: "Pase de Estacionamiento", value: "pase" },
                        { label: "Otro", value: "otro" },
                      ].map((doc) => (
                        <FormControl key={doc.value}>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value?.includes(doc.value)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), doc.value]
                                  : field.value?.filter(
                                      (val) => val !== doc.value
                                    ) || [];
                                field.onChange(newValue); // Actualiza la lista seleccionada
                              }}
                            />
                            <Label className="text-sm">{doc.label}</Label>
                          </div>
                        </FormControl>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
    </Dialog>
  );
};
