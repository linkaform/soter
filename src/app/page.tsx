/* eslint-disable @next/next/no-img-element */
"use client";

import { MainLayout } from "@/components/Layout/MainLayout";
import { useGetMenu } from "@/hooks/useGetMenu";
import { capitalizeFirstLetter, capitalizeOnlyFirstLetterDelete_ } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const router = useRouter(); // Inicializamos el hook useRouter
    const { data, isLoading } = useGetMenu();
    const [menu, setMenu] = useState<string[]>([]);
    const handleClick = (menuName: string) => {
        console.log(`Se hizo clic en: ${menuName}`);
        if (menuName == "fallas") menuName="incidencias"
        if (menuName == "articulos_concesionados" || menuName == "articulos_concesionados") menuName="articulos"
        router.push(`/dashboard/${menuName}`); // Redirige a la ruta proporcionada
    };

    useEffect(() => {
        if(data){
            let updatedData = [...data];
            if (updatedData.includes("incidencias") && !updatedData.includes("fallas")) {
                updatedData.push("fallas");
            }
            if (updatedData.includes("articulos")) {
                updatedData = updatedData.filter(item => item !== "articulos"); 
                updatedData.push("articulos_concesionados", "articulos_perdidos"); 
            }
            setMenu(updatedData);
        }
        
    }, [data]);

    return (
        <MainLayout>
            <link rel="icon" href="/menu.svg" type="image/svg+xml" />
            <div className="flex justify-center items-start min-h-screen mt-5">
                {isLoading ? (
                    <div role="status">
                        <svg
                            aria-hidden="true"
                            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-5 p-4 justify-center items-center sm:w-1/2 md:w-1/3 lg:w-4/6">
                        {menu?.length > 0 ? (
                            menu.sort((a, b) => {
                                if (a === "pases") return -1;  // pases va primero
                                if (b === "pases") return 1;   // si {b} es pases, {a} va antes
                                if (a === "turnos") return -1;  // turnos va después de pases
                                if (b === "turnos") return 1;   // si {b} es turnos, {a} va antes
                                return 0; 
                            }).map((item: string) => {
                                console.log("menu",menu)
                                    return (
                                        <div key={item} className="flex flex-wrap">
                                            <div
                                                onClick={() => handleClick(item)}
                                                className="text-center p-4 bg-gray-100 rounded-lg shadow-md flex flex-col justify-center items-center w-64 h-40 group transition-transform duration-200 transform hover:scale-105 hover:bg-gray-200 cursor-pointer hover:shadow-[0_4px_4px_rgba(0,0,0,0.2)]"
                                            >
                                                <img
                                                    alt={item}
                                                    src={`/${item}.svg`}
                                                    className="aspect-square rounded-md group-hover:opacity-75 h-12"
                                                />
                                                <p className="mt-2 text-lg">{capitalizeOnlyFirstLetterDelete_(item)}</p>
                                            </div>
                                        </div>
                                    );
                            })
                        ) : (
                            <div>No data available</div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}