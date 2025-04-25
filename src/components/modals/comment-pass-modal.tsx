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
import { useAccessStore } from "@/store/useAccessStore";
import { toast } from "sonner";
import { useState } from "react";

interface CommentPassModalProps {
  title: string;
  children: React.ReactNode;
}

const formSchema = z.object({
  comment: z.string().min(2, {
    message: "Campo requerido.",
  }),
});

export const CommentPassModal: React.FC<CommentPassModalProps> = ({
  title,
  children,
}) => {
  const [open, setOpen] = useState(false); 

  const {
    newCommentsPase, 
    setNewCommentsPase,
 
  } = useAccessStore();


  const addNewComment = (comment: string) => {
    setNewCommentsPase([{ comentario_pase: comment, tipo_de_comentario: "pase"}, ...newCommentsPase, ])
  }




  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    addNewComment(data.comment)
    form.reset()



    toast.success("Comentario de Pase listo para agregar al registro de ingreso.");

    setOpen(false)




  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
        </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="comment"
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