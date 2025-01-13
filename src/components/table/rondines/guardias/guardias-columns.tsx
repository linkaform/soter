import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { GuardiaRondines } from "./table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pen, Trash, UserRoundMinus } from "lucide-react";
  





export const GuardiasRondinesColumns: ColumnDef<GuardiaRondines>[] = [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center space-x-4">
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={row.original.avatar}
              alt={`${row.original.empleado} avatar`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "empleado",
      header: "",
      cell: ({ row }) => (
        <>
        <div className="capitalize max-w-[200px] truncate">
          {row.getValue("empleado")}
        </div>
        {/* Accediendo directamente a `puesto` desde `row.original` */}
        <div className="capitalize text-sm max-w-[200px] truncate">
          {row.original.puesto}
        </div>
      </>        
      ),
    },
  
      {
        id: "actions",
        enableHiding: false,
        cell: () => {
     
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>               
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                <Pen />

                    Editar
                    </DropdownMenuItem>
                <DropdownMenuItem>
                <UserRoundMinus />
                     Desasignar
                    </DropdownMenuItem>
                <DropdownMenuItem>
                <Trash />
                    Borrar
                    </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
  
  
  ];
