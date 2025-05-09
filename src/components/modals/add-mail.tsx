/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Dialog,
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

import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { useUpdatePassEmailPhone } from "@/hooks/UseUpdatePassEmail";

interface Props {
  title: string;
  open:boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOpenPadre: Dispatch<SetStateAction<boolean>>;
  id:string;
}
const formSchema = z.object({
    email_pase: z.string().optional().refine((val) => {
            if (val && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(val)) {
                return false;
            }
            return true;
        }, {
            message: "Por favor, ingresa un correo electrónico válido.",
        }),
});

export const AddEmailModal: React.FC<Props> = ({ title, open, setOpen, id, setOpenPadre}) => {
  const { updateDataMutation, isLoading }= useUpdatePassEmailPhone()
  const { userIdSoter } = useAuthStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_pase: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("email para agregar",data);
    updateDataMutation.mutate({access_pass: data, id:id , account_id:userIdSoter }, 
      {
      onSuccess: () => {
          setOpenPadre(false)
      }
    })
    form.reset();
  }

    useEffect(() => {
        if(!open)
        form.setValue("email_pase", "")
    }, [open]);

    const close = () =>{
      setOpen(false)

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
              name="email_pase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Correo" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form>
        </div>

        <div className="flex gap-5">
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={close}>
                  Cancelar
                </Button>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
              >
                {isLoading? ("Cargando..."):("Actualizar")}
              </Button>
            </div>

      </DialogContent>
    </Dialog>
  );
};