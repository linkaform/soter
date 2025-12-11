"use client"
import React from "react";

import Link from "next/link";
import { useShiftStore } from "@/store/useShiftStore";
import { CarFront, FileBox, Flame, TriangleAlert, Users, Wrench } from "lucide-react";

const ActivitySummary = (booth_stats:any) => {
  const stats= booth_stats.booth_stats
  const { setTab, setFilter,setFrom } = useShiftStore();
  const items = [
    {
      icon: <Users />,
      title: "Visitas Dentro",
      count: stats?.in_invitees || 0,
      link: "/dashboard/bitacoras",
      tab:"Personal",
      filter:"today",
    },
    {
      icon: <TriangleAlert />,
      title: "Incidencias Pendientes",
      count: stats?.incidentes_pendites || 0,
      link: "/dashboard/incidencias",
      tab:"Incidencias",
      filter:"today"
    },
    {
      icon: <Flame/>,
      title: "Fallas Pendientes",
      count: stats?.fallas_pendientes || 0,
      link: "/dashboard/incidencias",
      tab:"Fallas",
      filter:"abierto"
    },
    {
      icon: <FileBox />,
      title: "Articulos Concesionados",
      count: stats?.articulos_concesionados || 0,
      link: "/dashboard/articulos",
      tab:"Concecionados",
      filter:"today"
    },
    {
      icon: <CarFront />,
      title: "Vehículos Dentro",
      count: stats?.total_vehiculos_dentro || 0,
      link: "/dashboard/bitacoras",
      tab:"Vehiculos",
      filter:"today"
    },
    {
      icon: <Wrench />,
      title: "Equipos Dentro",
      count: stats?.total_equipos_dentro || 0,
      link: "/dashboard/bitacoras",
      tab:"Equipos",
      filter:"today"
    },
  ];


  function setTabAndFilter(tab:string, filter:string){
    setTab(tab)
    setFilter(filter)
    setFrom("turnos")
  }

  return (
  <div className="w-full">
    <p className="font-bold text-2xl mb-5">Resumen De Actividad</p>

    <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2  gap-4  mr-5">
      {items.map((item, index) => (
        <Link key={index} href={item.link}>
          <div
            onClick={() => setTabAndFilter(item.tab, item.filter)}
            className="flex items-center space-x-4 rounded-md p-4 border cursor-pointer transition duration-100 hover:bg-gray-100 overflow-hidden"
          >
            <div className="bg-gray-100 p-3 rounded-lg ">{item.icon}</div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none flex-1 space-y-1 min-w-0">{item.title}</p>
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
