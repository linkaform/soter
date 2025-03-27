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
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import Camera from "../icon/camera";
import Upload from "../ui/upload";
import { useShiftStore } from "@/store/useShiftStore";
import { useGetNotes } from "@/hooks/useGetNotes";
import { useUploadImage } from "@/hooks/useUploadImage";
import { useState } from "react";
import Image from "next/image";

import { Loader2 } from "lucide-react";

interface AddNoteModalProps {
  title: string;
  children: React.ReactNode;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Campo requerido.",
  }),
  description: z.string().min(2, {
    message: "Campo requerido.",
  }),
});

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  title,
  children,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { createNoteMutation } = useGetNotes();

  const { area, location } = useShiftStore();

  const { data, isLoading } = useUploadImage(selectedFile);

  console.log("adata", data);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createNoteMutation.mutate({
      area,
      location,
      note: values.title,
      note_booth: area,
      note_comments: [values.description],
      note_pic: data ? [data] : [],
      /*   note_file: [{ file_name: "documento.pdf", file_url: "https://ruta.com/documento.pdf" }],   */
    });

    // ✅ Resetea los campos del formulario
    form.reset();

    // ✅ Borra el archivo seleccionado
    setSelectedFile(null);
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  function handleReset() {
    form.reset(); // ✅ Resetea los campos del formulario
    setSelectedFile(null); // ✅ Borra el archivo seleccionado
  }


  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	text-center font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>* Titulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Texto" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>* Descripción</FormLabel>
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
            <div className="flex justify-between items-center">
              <p>Agregar foto</p>
              <label
                htmlFor="fileUpload"
                className="cursor-pointer flex items-center gap-2"
              >
                <Camera />
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="fileUpload"
              />
            </div>

            {isLoading && (
              <div className="flex justify-center items-center">
                {" "}
                <p>Subiendo imagen...</p>
                <Loader2 className="animate-spin" />
              </div>
            )}

            {data?.file_url && (
              <div className="flex flex-col justify-center items-center  my-4">


                
                <p className="my-3">{data.file_name}</p>{" "}
                {/* Nombre del archivo */}
                <Image
                  src={data.file_url}
                  alt="Imagen subida"
                  width={75}
                  height={75}
                  className="object-cover rounded-md"
                />
              </div>
            )}

            <div className="flex justify-between items-center">
              <p>Subir un archivo</p>
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex items-center gap-2"
              >
                <Upload />
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="fileInput"
              />
            </div>
            <p className="text-gray-400">**Campos requeridos </p>

            <div className="flex gap-5">
              <DialogClose asChild>
                <Button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => handleReset()}
                >
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
