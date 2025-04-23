import React from "react";

import Guest from "@/components/icon/guests";
import Fails from "@/components/icon/fails";
import Concessioned from "@/components/icon/concessioned";
import Vehicles from "@/components/icon/vehicles";
import Badges from "@/components/icon/badges";
import { useGetShift } from "@/hooks/useGetShift";

const ActivitySummary = () => {
  const { stats } = useGetShift(false, false);



  console.log("stats", stats)

  const items = [
    {
      icon: <Guest />,
      title: "Invitados Dentro",
      count: stats?.in_invitees || 0,
    },
    {
      icon: <Fails />,
      title: "Fallas Pendientes",
      count: stats?.incidentes_pendites || 0,
    },
    {
      icon: <Concessioned />,
      title: "Articulos Concesionados",
      count: stats?.articulos_concesionados || 0,
    },
    {
      icon: <Vehicles />,
      title: "Vehículos Estacionados",
      count: stats?.total_vehiculos_dentro || 0,
    },
    {
      icon: <Badges />,
      title: "Gafetes Pendientes",
      count: stats?.gafetes_pendientes || 0,
    },
  ];

  return (
    <div className="w-full">
      <p className="font-bold text-2xl mb-5">Resumen de actividad</p>

      <div className="">
        <div className="max-w-[520px]">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 rounded-md p-3"
            >
              <div className="mr-4 bg-gray-100 p-3 rounded-lg">{item.icon}</div>

              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">{item.title}</p>
                <p className="font-bold text-2xl">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;
