import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import SearchInput from '../search-input';

interface ActivePassesModalProps {
  title: string;
  children: React.ReactNode;
  onAddGuardias?: (selectedGuardias: Passes[]) => void;
}

type Passes = {
  id: string;
  nombre: string;
  avatar: string;
  vista: string;
};

export const ActivePassesModal: React.FC<ActivePassesModalProps> = ({
  title,
  children,
}) => {

    const data: Passes[] = [
        { 
        id: "a1b2c3d4", 
        nombre: "Samantha Chávez Juárez", avatar: "/image/empleado1.png", vista: "Visita General" },
        { id: "e5f6g7h8", nombre: "Orlando Peña Silva", avatar: "/image/empleado2.png", vista: "Visita General" },
        { id: "i9j0k1l2", nombre: "Luisa Ramírez Sánchez", avatar: "/image/empleado3.png", vista: "Visita General" },
        { id: "m3n4o5p6", nombre: "Miguel Hernández Rodríguez", avatar: "/image/empleado4.png", vista: "Visita General" },
        { id: "q7r8s9t0", nombre: "Leticia Perez Chávez", avatar: "/image/empleado5.png", vista: "Visita General" },
        { id: "u1v2w3x4", nombre: "Carlos López Martínez", avatar: "/image/empleado1.png", vista: "Visita General" },
        { id: "y5z6a7b8", nombre: "Fernanda Gómez Ruiz", avatar: "/image/empleado2.png", vista: "Visita General" },
        { id: "c9d0e1f2", nombre: "Juan Torres Mejía", avatar: "/image/empleado3.png", vista: "Visita General" },
        { id: "g3h4i5j6", nombre: "Ana María Díaz Vega", avatar: "/image/empleado4.png", vista: "Visita General" },
        { id: "k7l8m9n0", nombre: "Luis Fernando Ortega", avatar: "/image/empleado5.png", vista: "Visita General" },
        { id: "o1p2q3r4", nombre: "Paola Herrera Morales", avatar: "/image/empleado6.png", vista: "Visita General" },
        { id: "s5t6u7v8", nombre: "Ricardo Núñez García", avatar: "/image/empleado1.png", vista: "Visita General" },
        { id: "w9x0y1z2", nombre: "Mariana Castillo Paredes", avatar: "/image/empleado2.png", vista: "Visita General" },
        { id: "a3b4c5d6", nombre: "Eduardo Sánchez Flores", avatar: "/image/empleado3.png", vista: "Visita General" },
        { id: "e7f8g9h0", nombre: "Valeria Reyes Montes", avatar: "/image/empleado4.png", vista: "Visita General" }
      ];

  return (
    <Dialog>
  <DialogTrigger asChild>{children}</DialogTrigger>

  <DialogContent className="max-w-xl flex flex-col">
    <DialogHeader>
      <DialogTitle className="text-2xl text-center font-bold my-5">
        {title}
      </DialogTitle>
    </DialogHeader>

    <SearchInput />

    <div className="flex-1 overflow-y-auto max-h-[500px] space-y-0 border-t border-b mt-2">
      {data.map((guardia) => (
        <div
          key={guardia.id}
          className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="w-14 h-14">
              <AvatarImage src={guardia.avatar} alt={guardia.nombre} />
              <AvatarFallback>{guardia.nombre.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{guardia.nombre}</p>
              <p className="text-sm text-gray-500">{guardia.vista}</p>
            </div>
          </div>
      
        </div>
      ))}
    </div>

   
  </DialogContent>
</Dialog>

  );
};
