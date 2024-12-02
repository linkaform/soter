import { Button } from "@/components/ui/button";
import { NotasTable } from "@/components/table/notas/table";

import { GuardiasApoyoTable } from "@/components/table/guardias-apoyo/table";
import Sidebar from "@/components/pages/turnos/sidebar";
import { StartShiftModal } from "@/components/modals/start-shift-modal";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Metadata } from "next";
import ActivitySummary from "@/components/pages/turnos/activity-summary";

export const metadata: Metadata = {
  title: "Portal de Turnos",
};

export default function Home() {


  return (
    <MainLayout>
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
              <StartShiftModal title="Confirmación">
                <Button className="w-[520px]  md:w-[300px] bg-button-primary hover:bg-bg-button-primary">
                  Iniciar turno
                </Button>
              </StartShiftModal>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
             <ActivitySummary />

            <div className="w-full">
              <GuardiasApoyoTable />
            </div>
            
          </div>

          {/* Notas Table */}
          <div className="w-full">
            <NotasTable />
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
