import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

interface AddGuardModalProps {
  title: string;
  children: React.ReactNode;
  onAddGuardias: (selectedGuardias: GuardiaApoyo[]) => void;
}

type GuardiaApoyo = {
  id: string;
  empleado: string;
  avatar: string;
  status: string;
};

export const AddGuardModal: React.FC<AddGuardModalProps> = ({
  title,
  children,
  onAddGuardias,
}) => {
  const data: GuardiaApoyo[] = [
    {
      id: "a1b2c3d4",
      empleado: "Carlos Rodríguez Pérez",
      avatar: "/image/empleado4.png",
      status: "disponible",
    },
    {
      id: "e5f6g7h8",
      empleado: "Felipe Carranza Piña",
      avatar: "/image/empleado5.png",
      status: "disponible",
    },
    {
      id: "i9j0k1l2",
      empleado: "Jacinto Cruz López",
      avatar: "/image/empleado6.png",
      status: "disponible",
    },
    {
      id: "m3n4o5p6",
      empleado: "Daniel Sánchez Cruz",
      avatar: "/image/empleado7.png",
      status: "disponible",
    },
    {
      id: "q7r8s9t0",
      empleado: "Sebastián López",
      avatar: "/image/empleado8.png",
      status: "disponible",
    },
    {
      id: "u1v2w3x4",
      empleado: "Omar Pérez",
      avatar: "/image/empleado9.png",
      status: "disponible",
    },
    {
      id: "y5z6a7b8",
      empleado: "Camila Torres",
      avatar: "/image/empleado10.png",
      status: "disponible",
    },
  ];

  const [selectedGuardias, setSelectedGuardias] = useState<string[]>([]);

  const handleCheckboxChange = (id: string) => {
    setSelectedGuardias((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleAgregar = () => {
    const selectedData = data.filter((guardia) =>
      selectedGuardias.includes(guardia.id)
    );
    onAddGuardias(selectedData);
    setSelectedGuardias([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {data.map((guardia) => (
            <div
              key={guardia.id}
              className="flex items-center justify-between px-4 py-2 border-b"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={guardia.avatar} alt={guardia.empleado} />
                  <AvatarFallback>{guardia.empleado.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{guardia.empleado}</p>
                  <p className="text-sm text-gray-500">{guardia.status}</p>
                </div>
              </div>
              <Checkbox
                checked={selectedGuardias.includes(guardia.id)}
                onCheckedChange={() => handleCheckboxChange(guardia.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                handleAgregar();
              }}
            >
              Agregar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
