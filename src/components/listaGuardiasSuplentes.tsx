"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export default function ListaGuardiasSuplentes() {
  const [guardias, setGuardias] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      foto:[ {file_name:"nombre", file_url:"https://via.placeholder.com/80"}],
      area: "Acceso Principal",
      location: "Planta 1",
    },
    {
      id: 2,
      nombre: "Carlos López",
      foto:[ {file_name:"nombre", file_url:"https://via.placeholder.com/80"}],
      area: "Patio",
      location: "Zona B",
    },
  ]);

  const eliminar = (id: number) => {
    setGuardias((prev) => prev.filter((g) => g.id !== id));
  };

  const editar = (id: number, nuevoNombre: string) => {
    setGuardias((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, nombre: nuevoNombre } : g
      )
    );
  };

  return (
    <div className="space-y-4 mt-4">

      {guardias.map((g) => (
        <Card key={g.id} className="shadow-md">
          <CardContent className="flex items-center gap-4 p-4">

            <Image
              src={g.foto[0].file_url}
              className="w-16 h-16 rounded-full object-cover"
              alt={g.foto[0].file_name}
            />
            {/* NOMBRE */}
            <div className="flex-1">
              <p className="font-semibold text-lg">{g.nombre}</p>
            </div>

            <div className="flex gap-2">

              <Button
                variant="outline"
                onClick={() => {
                  const nuevo = prompt("Nuevo nombre:", g.nombre);
                  if (nuevo) editar(g.id, nuevo);
                }}
              >
                Editar
              </Button>

              <Button
                variant="destructive"
                onClick={() => eliminar(g.id)}
              >
                Eliminar
              </Button>

           

            </div>
          </CardContent>
        </Card>
      ))}

    </div>
  );
}
