"use client"

import { NotasTable } from "@/components/table/notas/table";
import { GuardiasApoyoTable } from "@/components/table/guardias-apoyo/table";
import Sidebar from "@/components/pages/turnos/sidebar";
import ActivitySummary from "@/components/pages/turnos/activity-summary";
import TurnStatus from "@/components/pages/turnos/turn-status";

import { useGetShift } from "@/hooks/useGetShift";



export default function Home() {



    const { shift } = useGetShift()



    console.log("shift", shift)

  return (
     <>
     <link rel="icon" href="/turnos.svg" type="image/svg+xml" /><div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/4 h-full px-6 py-6 border border-[#F0F2F5]">
              <Sidebar />
          </div>
          <div className="w-full lg:w-3/4 p-8 flex flex-col">
              <TurnStatus />

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
      </>
  );
}
