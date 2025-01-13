"use client";

// import { Metadata } from "next";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useRouter } from "next/navigation";


// export const metadata: Metadata = {
//   title: "Menu",
// };

export default function Home() {
     // Función de manejo para el evento onClick
    const router = useRouter(); // Inicializamos el hook useRouter
    const handleClick = (menuName: string) => {
        console.log(`Se hizo clic en: ${menuName}`);
        router.push(`/dashboard/${menuName}`); // Redirige a la ruta proporcionada
    };
    

  return (
    <MainLayout>

    <link rel="icon" href="/menu.svg" type="image/svg+xml" />
    <div className="flex justify-center items-start min-h-screen mt-5 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 justify-center">
            <div className="flex justify-center">
                <div onClick={() => handleClick('historial-de-paese')} className="menu-grid-item text-center p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center w-64 h-38 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer">
                    <img alt="Pases de Entrada" src="/pase_entrada.svg" className="aspect-square rounded-md group-hover:opacity-75 h-10" />
                    <p className="mt-2 text-lg ">Pases de Entrada</p>
                </div>
            </div>
            {/* Repite esta sección para cada card que quieras agregar */}
            <div className="flex justify-center">
                <div onClick={() => handleClick('bitacoras')} className="menu-grid-item text-center p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center w-64 h-38 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer">
                    <img alt="Pases de Entrada" src="/bitacoras.svg" className="aspect-square rounded-md group-hover:opacity-75 h-10" />
                    <p className="mt-2 text-lg ">Bitacoras</p>
                </div>
            </div>
            <div className="flex justify-center">
                <div onClick={() => handleClick('turnos')} className="menu-grid-item text-center p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center w-64 h-38 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer" >
                    <img alt="Pases de Entrada" src="/turnos.svg" className="aspect-square rounded-md group-hover:opacity-75 h-10" />
                    <p className="mt-2 text-lg ">Turnos</p>
                </div>
            </div>
            <div className="flex justify-center">
                <div onClick={() => handleClick('notas')} className="menu-grid-item text-center p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center w-64 h-38 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer">
                    <img alt="Pases de Entrada" src="/notas.svg" className="aspect-square rounded-md group-hover:opacity-75 h-10" />
                    <p className="mt-2 text-lg ">Notas</p>
                </div>
            </div>
            <div className="flex justify-center">
                <div onClick={() => handleClick('articulos')} className="menu-grid-item text-center p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center w-64 h-38 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer">
                    <img alt="Pases de Entrada" src="/articulos_perdidos.svg" className="aspect-square rounded-md group-hover:opacity-75 h-10" />
                    <p className="mt-2 text-lg ">Objetos perdidos</p>
                </div>
            </div>
            <div className="flex justify-center">
                <div onClick={() => handleClick('articulos')} className="menu-grid-item text-center p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center w-64 h-38 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer">
                    <img alt="Pases de Entrada" src="/articulos_concesionados.svg" className="aspect-square rounded-md group-hover:opacity-75 h-10" />
                    <p className="mt-2 text-lg ">Articulos concesionados</p>
                </div>
            </div>
            <div className="flex justify-center">
                <div onClick={() => handleClick('incidencias')} className="menu-grid-item text-center p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center w-64 h-38 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer">
                    <img alt="Pases de Entrada" src="/incidencias.svg" className="aspect-square rounded-md group-hover:opacity-75 h-10" />
                    <p className="mt-2 text-lg ">Incidencias</p>
                </div>
            </div>
            <div className="flex justify-center">
                <div onClick={() => handleClick('incidencias')} className="menu-grid-item text-center p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center w-64 h-38 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer">
                    <img alt="Pases de Entrada" src="/incidencias.svg" className="aspect-square rounded-md group-hover:opacity-75 h-10" />
                    <p className="mt-2 text-lg ">Fallas</p>
                </div>
            </div>
            <div className="flex justify-center">
                <div onClick={() => handleClick('rondines')} className="menu-grid-item text-center p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center w-64 h-38 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer">
                    <img alt="Pases de Entrada" src="/rondines.svg" className="aspect-square rounded-md group-hover:opacity-75 h-10" />
                    <p className="mt-2 text-lg ">Rondines</p>
                </div>
            </div>
        </div>
    </div>
    </MainLayout>
  );
}
