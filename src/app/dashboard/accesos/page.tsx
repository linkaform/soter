"use client";

import React, { useState } from "react";

import Vehicles from "@/components/icon/vehicles";
import Exit from "@/components/icon/exit";
import { Button } from "@/components/ui/button";
import { ActivePassesModal } from "@/components/modals/active-passes-modal";
import {
  DoorOpen,
  Home,
  List,
  LogIn,
  Menu,
  Plus,
  ScanQrCode,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ComentariosAccesosTable } from "@/components/table/accesos/comentarios/table";
import Credentials from "@/components/pages/accesos/credential";
import { AccesosPermitidosTable } from "@/components/table/accesos/accesos-permitidos/table";
import { UltimosAccesosTable } from "@/components/table/accesos/ultimos-accesos/table";
import { AccesosPermisosTable } from "@/components/table/accesos/permisos-certificaciones/table";
import { VehiculosAutorizadosTable } from "@/components/table/accesos/vehiculos-autorizados/table";
import { EquiposAutorizadosTable } from "@/components/table/accesos/equipos-autorizados/table";
import ReusableAccordion from "@/components/resuable-accordion";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStats } from "@/lib/get-shift";
import { TemporaryPassesModal } from "@/components/modals/temporary-passes-modal";
import { useSearchPass } from "@/hooks/useSearchPass";
import { useAccessStore } from "@/store/useAccessStore";
import { AddVisitModal } from "@/components/modals/add-visit-modal";
import { toast } from "sonner";
import { useGetShift } from "@/hooks/useGetShift";
import { exitRegister, registerIncoming } from "@/lib/access";
import { ScanMethodModal } from "@/components/modals/scan-method-modal";

const AccesosPage = () => {
  const { area, location, setLoading } = useShiftStore();

  const { shift } = useGetShift();

  const { passCode, setPassCode } = useAccessStore();
  const { isLoading, loading, searchPass } = useSearchPass();

  const [inputValue, setInputValue] = useState("");

  const queryClient = useQueryClient();

  const { data: stats } = useQuery<any>({
    queryKey: ["getAccessStats", area, location],
    queryFn: async () => {
      const data = await getStats({ area, location, page: "Accesos" });
      const responseData = data.response?.data || {};
      return responseData;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
  });

 
  const exitRegisterAccess = useMutation({
    mutationFn: async () => {
      const data = await exitRegister(area, location, passCode);

      if (!data.success) {
        throw new Error(data.error?.msg?.msg || "Hubo un error en la Salida");
      }

      return data.response?.data || [];
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setPassCode("");

      toast.success("Salida Exitosa");

      queryClient.invalidateQueries({ queryKey: ["serchPass"] });
    },
    onError: (error) => {
      console.log(error);

      const errorMsg = `❌ Hubo un error en la salida: ${error.message}`;

      console.log(errorMsg);

      toast.error(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const certificaciones = Array.isArray(searchPass?.certificaciones)
    ? searchPass.certificaciones
    : [];

  const { newCommentsPase, setAllComments, newVehicle, setSelectedVehicle } =
    useAccessStore();

  const allComments = [
    ...(newCommentsPase || []),
    ...(searchPass?.grupo_instrucciones_pase || []),
  ];

  React.useEffect(() => {
    if (allComments.length > 0) {
      setAllComments(allComments);
    }
  }, [newCommentsPase]);

  const allVehicles = [
    ...(newVehicle || []),
    ...(searchPass?.grupo_vehiculos || []),
  ];

  React.useEffect(() => {
    if (allVehicles.length > 0) {
      setSelectedVehicle(allVehicles[0]);
    }
  }, [newVehicle]);

  const { newEquipment, setAllEquipments } = useAccessStore();

  const allEquipments = [
    ...(newEquipment || []),
    ...(searchPass?.grupo_equipos || []),
  ];

  React.useEffect(() => {
    setAllEquipments(allEquipments);
  }, [newEquipment, searchPass?.grupo_equipos]);


  const doAccess = useMutation({
    mutationFn: async () => {
      console.log(
        "doAccess",
        area,
        location,
        passCode,
        searchPass?.visita_a,
        searchPass?.grupo_vehiculos?.[0],
        searchPass?.grupo_equipos
      );

      const data = await registerIncoming({
        area,
        location,
        visita_a: searchPass?.visita_a,
        qr_code: passCode,
        vehiculo: allVehicles?.[0] ? [allVehicles[0]] : [],
        equipo: allEquipments,
        comentario_acceso: [],
        comentario_pase: [],
      });

      if (!data.success) {
        throw new Error(data.error?.msg?.msg || "Hubo un error en el Ingreso");
      }

      return data.response?.data || [];
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serchPass"] });

      setPassCode("");

      toast.success("Entrada Exitosa");
    },
    onError: (error) => {
      const errorMsg = `❌ Hubo un error en el ingreso: ${error.message}`;

      console.log(errorMsg);

      toast.error(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });




  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

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
                value: stats?.visitas_en_dia || 0,
                icon: <Home className="text-primary " />,
              },
              {
                label: "Visitas Dentro",
                value: stats?.personal_dentro || 0,
                icon: <Users className="text-primary" />,
              },
              {
                label: "Vehículos Estacionados",
                value: stats?.total_vehiculos_dentro || 0,
                icon: <Vehicles />,
              },
              {
                label: "Salidas Registradas",
                value: stats?.salidas_registradas || 0,
                icon: <Exit />,
              },
            ]}
          />

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex mb-5 mr-5 w-full md:max-w-lg  mx-auto">
              <div className="relative w-full flex items-center">
                <Input
                  type="text"
                  placeholder="Escanear Pase"
                  className="pl-5 pr-10 w-full"
                  value={inputValue} // Enlazamos el input con su estado
                  onChange={(e) => setInputValue(e.target.value)} // Actualizamos el estado
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-10 border rounded-none top-0 h-full "
                  onClick={() => {
                    setPassCode(inputValue);
                  }}
                >
                  <Search className="h-4 w-4" />
                </Button>

                <ActivePassesModal title="Pases Activos">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full border rounded-tl-none rounded-bl-none rounded-tr-sm rounded-br-sm"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </ActivePassesModal>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {searchPass?.tipo_movimiento === "Entrada" && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (shift?.guard?.status_turn === "Turno Cerrado") {
                      toast.error(
                        "¡Debes iniciar turno antes de registrar un ingreso!."
                      );
                      return;
                    }

                    doAccess.mutate();
                  }}
                >
                  <LogIn />
                  Registrar ingreso
                </Button>
              )}

              {searchPass?.tipo_movimiento === "Salida" && (
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    if (shift?.guard?.status_turn === "Turno Cerrado") {
                      toast.error(
                        "¡Debes iniciar turno antes de registrar una salida!."
                      );
                      return;
                    }

                    exitRegisterAccess.mutate();
                  }}
                >
                  <DoorOpen />
                  Registrar Salida
                </Button>
              )}

              {!passCode && (
                <AddVisitModal title="Nueva Visita">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus />
                    Nueva Visita
                  </Button>
                </AddVisitModal>
              )}

              <ScanMethodModal title="Dispositivo a utilizar">
                <Button className="bg-amber-400 hover:bg-amber-500 text-black">
                  <ScanQrCode />
                  Escanear un pase
                </Button>
              </ScanMethodModal>

              <ScanMethodModal title="Dispositivo a utilizar">
              <Button className="bg-white text-black hover:bg-black hover:text-white border border-gray-300">

                  <LogIn />


                  Habilitar auto acceso
                </Button>
              </ScanMethodModal>

              <TemporaryPassesModal title="Pases Temporales">
                <Button
                  variant="secondary"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <List className="text-white" />
                  Pases Temporales
                </Button>
              </TemporaryPassesModal>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                variant="secondary"
                onClick={() => setPassCode("")}
              >
                <Trash2 className="text-white" />
                Limpiar
              </Button>
            </div>
          </div>



    
        </div>





        {passCode && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Tabla de credenciales */}
            <div className="w-full p-4">
              <Credentials searchPass={searchPass} />
            </div>

            {/* Tabla de comentarios de accesos */}

            <div className="w-full p-4">
              <ComentariosAccesosTable
                allComments={allComments}
                searchPass={searchPass}
              />
            </div>

            {/* Tabla de últimos accesos */}

            {/* Tabla de accesos permitidos */}
            {searchPass?.grupo_areas_acceso &&
              searchPass.grupo_areas_acceso.length > 0 && (
                <div className="w-full p-4">
                  <UltimosAccesosTable searchPass={searchPass} />
                </div>
              )}

            {certificaciones.length > 0 && (
              <div className="w-full p-4">
                <AccesosPermisosTable searchPass={searchPass} />
              </div>
            )}

            {/* Tabla de accesos permitidos */}
            {searchPass?.grupo_areas_acceso &&
              searchPass.grupo_areas_acceso.length > 0 && (
                <div className="w-full p-4">
                  <AccesosPermitidosTable searchPass={searchPass} />
                </div>
              )}

            {/* Tabla de equipos permitidos */}

            <div className="w-full p-4">
              <EquiposAutorizadosTable
                allEquipments={allEquipments}
                searchPass={searchPass}
              />
            </div>

            {/* Tabla de vehículos autorizados */}

            <div className="w-full p-4">
              <VehiculosAutorizadosTable
                allVehicles={allVehicles}
                searchPass={searchPass}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccesosPage;
