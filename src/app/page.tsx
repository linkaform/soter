import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { GuardiasTable } from "@/components/table/guardias/table";
import Guest from "@/components/icon/guests";
import Fails from "@/components/icon/fails";
import Concessioned from "@/components/icon/concessioned";
import Vehicles from "@/components/icon/vehicles";
import Badges from "@/components/icon/badges";
import { GuardiasApoyoTable } from "@/components/table/guardias-apoyo/table";
import Sidebar from "@/components/pages/turnos/sidebar";

export default function Home() {
  const items = [
    { icon: <Guest />, title: "Invitados Dentro", count: 11 },
    { icon: <Fails />, title: "Fallas Pendientes", count: 13 },
    { icon: <Concessioned />, title: "Equipos Concesionados", count: 24 },
    { icon: <Vehicles />, title: "Vehículos Estacionados", count: 35 },
    { icon: <Badges />, title: "Gafetes Pendientes", count: 14 },
  ];

  return (
    <div className="">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/4 h-screen px-6 py-6 border border-[#F0F2F5]">
          <Sidebar />
        </div>

        <div className="w-full lg:w-3/4 p-8 flex flex-col">
          
          
          <div className="flex items-center flex-col md:flex-row justify-between mb-10 md:mb-5">
            <div className="flex">
              <div className="flex space-x-10">
                <div className="">
                  <p>Fecha:</p>
                  <p>2024-08-19</p>
                </div>

                <div className="">
                  <p>Ciudad:</p>
                  <p>Monterrey</p>
                </div>

                <div className="">
                  <p>Estatus:</p>
                  <p className="text-red-600">Cerrado</p>
                </div>
              </div>
            </div>

            <div className="">
              <Button className="w-[520px]  md:w-[300px] bg-button-primary hover:bg-bg-button-primary">
                Iniciar turno
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
            <div className="w-full">
              <p className="font-bold text-2xl mb-5">Resumen de actividad</p>

              <div className="">

                <div className="max-w-[520px]">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 rounded-md p-3"
                  >
                    <div className="mr-4 bg-gray-100 p-3 rounded-lg">
                      {item.icon}
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{item.title}</p>
                      <p className="font-bold text-2xl">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>

            <div className="w-full">
              <p className="font-bold text-2xl mb-5">Guardias de Apoyo</p>


              <GuardiasApoyoTable />




            </div>
          </div>

          <div className="w-full flex flex-col  border border-[#F0F2F5]">

            <p className="font-bold text-2xl mt-5">Notas</p>

            <GuardiasTable />
          </div>
        </div>
      </div>
    </div>
  );
}
