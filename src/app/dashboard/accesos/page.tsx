"use client";

import React from "react";

import Vehicles from "@/components/icon/vehicles";
import Exit from "@/components/icon/exit";
import { Button } from "@/components/ui/button";
import { ActivePassesModal } from "@/components/modals/active-passes-modal";
import { Eraser, Home, Menu, Search, Trash, Trash2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ErrorModal } from "@/components/modals/error-modal";
import { CommentPassModal } from "@/components/modals/comment-pass-modal";
import { AddBadgeModal } from "@/components/modals/add-badge-modal";
import { ComentariosAccesosTable } from "@/components/table/accesos/comentarios/table";
import Credentials from "@/components/pages/accesos/credential";
import { AccesosPermitidosTable } from "@/components/table/accesos/accesos-permitidos/table";
import { UltimosAccesosTable } from "@/components/table/accesos/ultimos-accesos/table";
import { AccesosPermisosTable } from "@/components/table/accesos/permisos-certificaciones/table";
import { VehiculosAutorizadosTable } from "@/components/table/accesos/vehiculos-autorizados/table";
import { EquiposAutorizadosTable } from "@/components/table/accesos/equipos-autorizados/table";
import ReusableAccordion from "@/components/resuable-accordion";

const AccesosPage = () => {
  return (
    <div className="">
      <div className="flex flex-col">
        <div className="p-6 space-y-6 w-full mx-auto">
          <ReusableAccordion
            ubicaciones={[
              { value: "planta-monterrey", label: "Planta Monterrey" },
              { value: "planta-saltillo", label: "Planta Saltillo" },
            ]}
            casetas={[
              { value: "caseta-6", label: "Caseta 6 Poniente" },
              { value: "caseta-5", label: "Caseta 5 Norte" },
            ]}
            jefe="Emiliano Zapata"
            estadisticas={[
              {
                label: "Visitas en el Día",
                value: 23,
                icon: <Home className="text-primary h-5 w-5" />,
              },
              {
                label: "Visitas Dentro",
                value: 23,
                icon: <Users className="text-primary h-5 w-5" />,
              },
              {
                label: "Vehículos Estacionados",
                value: 23,
                icon: <Vehicles />,
              },
              {
                label: "Salidas Registradas",
                value: 23,
                icon: <Exit />,
              },
            ]}
          />

          <div className="flex flex-col sm:flex-row">
            <div className="flex mb-5 mr-5 w-full md:max-w-lg  mx-auto">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar usuario"
                  className="pl-10 pr-10 w-full"
                />

                <ActivePassesModal title="Pases Activos">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </ActivePassesModal>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <ErrorModal
                title={"Error al registrar la entrada"}
                message="No es posible registrar la entrada porque la vigencia del pase ha expirado."
                description="Por favor, contacte al responsable adecuado para actualizar el pase."
              >
                <Button className="bg-green-600 hover:bg-green-700">
                  Registrar ingreso
                </Button>
              </ErrorModal>

              <AddBadgeModal title={"Asignar Gafete"}>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  variant="secondary"
                >
                  Asignar Gafete
                </Button>
              </AddBadgeModal>

              <Button
                className="bg-red-500 hover:bg-red-600 text-black"
                variant="secondary"
              >
                <Trash2 className="text-white"/>
              </Button>

              <Button
                variant="secondary"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Pases Temporales
              </Button>

              <CommentPassModal title="Comentario al Pase">
                <Button
                  className="bg-gray-700 text-white hover:bg-gray-600"
                  variant="secondary"
                >
                  + Agregar Comentario
                </Button>
              </CommentPassModal>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Tabla de credenciales */}
          <div className="w-full p-4">
            <Credentials />
          </div>

          {/* Tabla de comentarios de accesos */}
          <div className="w-full p-4">
            <ComentariosAccesosTable />
          </div>

          {/* Tabla de últimos accesos */}
          <div className="w-full p-4">
            <UltimosAccesosTable />
          </div>

          {/* Tabla de accesos y permisos */}
          <div className="w-full p-4">
            <AccesosPermisosTable />
          </div>

          {/* Tabla de accesos permitidos */}
          <div className="w-full p-4">
            <AccesosPermitidosTable />
          </div>

          {/* Tabla de equipos autorizados */}
          <div className="w-full p-4">
            <EquiposAutorizadosTable />
          </div>

          {/* Tabla de vehículos autorizados */}
          <div className="w-full p-4">
            <VehiculosAutorizadosTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccesosPage;
