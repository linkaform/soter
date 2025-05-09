import React from "react";

import Guest from "@/components/icon/guests";
import Fails from "@/components/icon/fails";
import Concessioned from "@/components/icon/concessioned";
import Vehicles from "@/components/icon/vehicles";
import Badges from "@/components/icon/badges";
import Link from "next/link";
import { useShiftStore } from "@/store/useShiftStore";
import { TriangleAlert } from "lucide-react";

const ActivitySummary = (booth_stats:any) => {
  const stats= booth_stats.booth_stats
  const { setTab } = useShiftStore();
  const items = [
    {
      icon: <Guest />,
      title: "Personas Dentro",
      count: stats?.in_invitees || 0,
      link: "/dashboard/bitacoras",
      tab:"Personal"
    },
    {
      icon: <TriangleAlert />,
      title: "Incidencias Pendientes",
      count: stats?.incidentes_pendites || 0,
      link: "/dashboard/incidencias",
      tab:"Incidencias"
    },
    {
      icon: <Fails />,
      title: "Fallas Pendientes",
      count: stats?.fallas_pendientes || 0,
      link: "/dashboard/incidencias",
      tab:"Fallas"
    },
    {
      icon: <Concessioned />,
      title: "Articulos Concesionados",
      count: stats?.articulos_concesionados || 0,
      link: "/dashboard/articulos",
      tab:"Concecionados"
    },
    {
      icon: <Vehicles />,
      title: "Vehículos Dentro",
      count: stats?.total_vehiculos_dentro || 0,
      link: "/dashboard/bitacoras",
      tab:"Vehiculos"
    },
    {
      icon: <Badges />,
      title: "Equipos dentro",
      count: stats?.gafetes_pendientes || 0,
      link: "/dashboard/bitacoras",
      tab:"Equipos"
    },
  ];

  return (
  <div className="w-full">
    <p className="font-bold text-2xl mb-5">Resumen de actividad</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-10/12 ">
      {items.map((item, index) => (
        <Link key={index} href={item.link}>
          <div
            onClick={() => setTab(item.tab)}
            className="flex items-center space-x-4 rounded-md p-4 border cursor-pointer transition duration-100 hover:bg-gray-100 "
          >
            <div className="bg-gray-100 p-3 rounded-lg">{item.icon}</div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none">{item.title}</p>
              <p className="font-bold text-2xl">{item.count}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
  );
};

export default ActivitySummary;
