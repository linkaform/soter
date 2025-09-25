"use client"

import { NotasTable } from "@/components/table/notas/table";
import { GuardiasApoyoTable } from "@/components/table/guardias-apoyo/table";
import Sidebar from "@/components/pages/turnos/sidebar";
import ActivitySummary from "@/components/pages/turnos/activity-summary";
import TurnStatus from "@/components/pages/turnos/turn-status";

import { useGetShift } from "@/hooks/useGetShift";
import { useShiftStore } from "@/store/useShiftStore";
import { useEffect, useState } from "react";
import { Imagen } from "@/lib/update-pass-full";



export default function Home() {
  const { isLoading, loading, shift} = useGetShift(true)
  const {
    location,
    area,
    setCheckin_id,
  } = useShiftStore()

  const [evidencia, setEvidencia]=useState<Imagen[]>([])
  const [identificacion, setIdentificacion]=useState<Imagen[]>([])
  
	useEffect(() => {
		if ( shift?.guard?.status_turn !== "Turno Cerrado") {
			setCheckin_id(shift?.booth_status?.checkin_id);
      setEvidencia(shift?.booth_status?.fotografia_cierre_turno)
		}else if (shift?.guard?.status_turn !== "Turno Abierto") {
      setEvidencia(shift?.booth_status?.fotografia_inicio_turno)

		}
  }, [shift, setCheckin_id]);

  useEffect(() => {
    if(shift){
      console.log("FOTO",shift?.booth_status?.fotografia_inicio_turno)
      setEvidencia(shift?.booth_status?.fotografia_inicio_turno)
      setIdentificacion(shift?.booth_status?.fotografia_cierre_turno)
    }
    }, [shift]);
    

    if (isLoading || loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      );
    }

  return (
     <>
     <link rel="icon" href="/turnos.svg" type="image/svg+xml" /><div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/4 h-full px-6 py-6 border border-[#F0F2F5]">
              <Sidebar key={shift?.location?.name} shift={shift} />
          </div>
          <div className="w-full lg:w-3/4 p-8 flex flex-col">
              <TurnStatus shift={shift} location={location} area={area} evidencia={evidencia} setEvidencia={setEvidencia} identificacion={identificacion} setIdentificacion={setIdentificacion}/>
              <div className="flex flex-col sm:flex-row justify-between">
                  <ActivitySummary booth_stats={shift?.booth_stats}/>
                  <div className="w-full">
                      <GuardiasApoyoTable shift={shift} location={location} area={area} />
                  </div>
              </div>
              <div className="w-full">
                  <NotasTable data={shift?.notes?.records} />
              </div>

          </div>
      </div>
      </>
  );
}
