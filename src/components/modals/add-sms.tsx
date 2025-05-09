/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
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
} from "../ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "sonner";
import { useUpdatePassEmailPhone } from "@/hooks/UseUpdatePassEmail";
import useAuthStore from "@/store/useAuthStore";

interface Props {
  title: string;
  open:boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOpenPadre: Dispatch<SetStateAction<boolean>>;
  id:string;
}
const formSchema = z.object({
    telefono_pase: z.string().optional().refine((val) => {
            if (val && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(val)) {
                return false;
            }
            return true;
        }, {
            message: "Por favor, ingresa un correo electrónico válido.",
        }),
});

export const AddSmsModal: React.FC<Props> = ({ title, open, setOpen, id, setOpenPadre}) => {
    const { updateDataMutation, isLoading }= useUpdatePassEmailPhone()
    const { userIdSoter } = useAuthStore()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        telefono_pase: "",
        },
    });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("info para enviar",data);
    updateDataMutation.mutate({access_pass: data, id:id , account_id:userIdSoter },  
        {
            onSuccess: () => {
                setOpenPadre(false)
            },
          })
    form.reset();
    toast.success(
      "Teleéfono agregado correctamente."
    );
    setOpen(false);
  }

    useEffect(() => {
        if(!open)
        form.setValue("telefono_pase", "")
    }, [open]);

    const close = () =>{
        setOpen(false)
        // 
      }
  

    useEffect(()=>{
        if(!isLoading){
          close()			
        }
      },[isLoading])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl  overflow-y-auto max-h-[90vh] flex flex-col" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          
            <FormField
                control={form.control}
                name="telefono_pase"
                render={({ field }: any) => (
                <FormItem>
                    <FormLabel>
                    <span className="text-red-500">*</span> Teléfono
                    </FormLabel>
                    <FormControl>
                    <PhoneInput
                        {...field}
                        // value={`${selected?.telefono||""}`}
                        onChange={(value:string) => {
                        form.setValue("telefono_pase", value || "");
                        }}
                        placeholder="Teléfono"
                        defaultCountry="MX"
                        international={false}
                        withCountryCallingCode={false}
                        containerComponentProps={{
                        className:
                            "flex h-10 w-full rounded-md border border-input bg-background pl-3 py-0 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        }}
                        numberInputProps={{
                        className: "pl-3",
                        }}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

          </form>
        </Form>
        </div>

        <div className="flex gap-5">
              <DialogClose asChild>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={close}>
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
              >
                 {isLoading? ("Cargando..."): ("Actualizar")}
              </Button>
            </div>

      </DialogContent>
    </Dialog>
  );
};