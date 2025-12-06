"use client";

import { MainLayout } from "@/components/Layout/MainLayout";
import { useGetMenu }  from "@/hooks/useGetMenu";
import { useShiftStore } from "@/store/useShiftStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter(); 
    const { menuItems, isLoadingMenu } = useGetMenu();
    const {location, area, fetchShift} = useShiftStore()
    
    useEffect(()=>{
        if (!area && !location) {
			fetchShift();
		}
    },[area, location, fetchShift])


    const handleClick = (menuName: string) => {
        router.push(`/dashboard/${menuName}`); 
    };

    return (
        <MainLayout>
            <link rel="icon" href="/favicon.ico" type="image/svg+xml" />
            <div className="flex justify-center items-start min-h-screen">
                {isLoadingMenu ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-5 p-4 justify-center items-center sm:w-1/2 md:w-1/3 lg:w-4/6">
                        {menuItems?.length > 0 ? (
                            menuItems.sort((a, b) => {
                                if (a.id === "pases") return -1;  // pases va primero
                                if (b.id === "pases") return 1;   // si {b} es pases, {a} va antes
                                if (a.id === "turnos") return -1;  // turnos va después de pases
                                if (b.id === "turnos") return 1;   // si {b} es turnos, {a} va antes
                                return 0; 
                            }).map((item) => {
                                    return (
                                        <div key={item.id} className="flex flex-wrap">
                                            <div
                                                onClick={() => handleClick(item.id)}
                                                className="text-center p-4 bg-gray-100 rounded-lg shadow-md flex flex-col justify-center items-center w-64 h-40 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer hover:shadow-[0_4px_4px_rgba(0,0,0,0.2)]"
                                            >
                                                <Image
                                                    width={250}
                                                    height={250}
                                                    alt={item.id}
                                                    src={`/${item.id}.svg`}
                                                    className="aspect-square rounded-md group-hover:opacity-75 h-12"
                                                />
                                                <p className="mt-2 text-lg">{item.label == "Pases de entrada"? "Pases De Entrada": item.label }</p>
                                            </div>
                                        </div>
                                    );
                            })
                        ) : (
                            <div>No hay menus disponibles, revisa la configuración.</div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}