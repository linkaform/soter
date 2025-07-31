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

import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useState } from "react";
import { useAccessStore } from "@/store/useAccessStore";
import QRScanner from "../pages/accesos/QRScanner";

interface Props {
  title: string;
  children: React.ReactNode;
}
const FormSchema = z.object({
  method: z.string().min(1, {
    message: "Selecciona un método de escaneo.",
  }),
});

export const ScanMethodModal: React.FC<Props> = ({ children }) => {
  const { setPassCode } = useAccessStore();

  const [open, setOpen] = useState(false); // Estado para manejar la visibilidad del modal

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      method: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            Escanea un código QR
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            {/*     <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col items-center text-center">
                    <FormLabel>
                      Selecciona el dispositivo que deseas utilizar para escanear el código QR.
                    </FormLabel>
                    <div className="flex gap-4 my-5">
                      {[
                        { label: "Scanner", value: "scanner", icon: <QrCode /> },
                        { label: "Cámara", value: "camara", icon: <Camera /> },
                      ].map((method) => (
                        <Button
                          key={method.value}
                          type="button"
                          onClick={() => field.onChange(method.value)}
                          className={`px-4 py-2 text-white font-medium rounded-md transition ${
                            field.value === method.value
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-300 hover:bg-gray-400 text-black"
                          }`}
                        >
                          {method.icon} {method.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
 */}

            <div>
              <QRScanner
                onScan={(result: any) => {
                  setPassCode(result);
                }}
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

              <Button
                type="submit"
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
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
