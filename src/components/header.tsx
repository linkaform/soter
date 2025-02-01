"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DoorOpen, LogOut, Settings, StickyNote} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { useGetMenu } from "@/hooks/useGetMenu";

export const Header = () => {
    const currentPath = usePathname();
    const { logout } = useAuthStore();
    const { data } = useGetMenu();
  return (
    <header className="w-full shadow py-3 px-12">
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between">
        {/* Logo */}

          <div className="flex  mb-5 lg:mb-0 justify-center items-center">
            <Link href="/">
              <Image
                className="dark:invert"
                src="/logo.svg"
                alt="Next.js logo"
                width={150}
                height={50}
                priority
              />
            </Link>
            { currentPath !== "/" && currentPath !== "/dashboard/pase-update"  ? (
              <Link href="/dashboard/pases">
                <Button
                  className={`${
                    currentPath === "/dashboard/pases"
                      ? "bg-button-primary hover:bg-button-primary text-white hover:text-white"
                      : "hover:text-white hover:bg-button-primary"
                  }`} variant="ghost">
                  Pase de entrada
                </Button>
              </Link>
            ):null}
          </div>
          {currentPath !== "/dashboard/pase-update" && (
              <div className="flex">
              {/* Navegación */}
              <nav className="flex  space-x-3 mr-5">
              { currentPath !== "/" ? (
                <>
                {data?.length > 0 ? (
                  <>
                    { data.includes("accesos")? (
                      <>
                        <Link href="/dashboard/accesos">
                        <Button
                          className={`${currentPath === "/dashboard/accesos"
                              ? "bg-button-primary hover:text-white hover:bg-button-primary text-white"
                              : "hover:text-white hover:bg-button-primary"}`}
                          variant="ghost"
                        >
                          Accesos
                        </Button>
                        </Link>
                      </>
                      ) : null
                    }
                    
                    { data.includes("turnos")? (
                      <>
                          <Link href="/dashboard/turnos">
                          <Button
                            className={`${currentPath === "/dashboard/turnos"
                                ? "bg-button-primary hover:text-white hover:bg-button-primary text-white"
                                : "hover:text-white hover:bg-button-primary"}`}
                            variant="ghost"
                          >
                            Turnos
                          </Button>
                          </Link>
                      </>
                      ) : null
                    }
                      
                      { data.includes("bitacoras")? (
                      <>
                          <Link href="/dashboard/bitacoras">
                          <Button
                            className={`${currentPath === "/dashboard/bitacoras"
                                ? "bg-button-primary hover:text-white hover:bg-button-primary text-white"
                                : "hover:text-white hover:bg-button-primary"}`}
                            variant="ghost"
                          >
                            Bitácoras
                          </Button>
                        </Link>
                      </>
                      ) : null
                    }
    
                    { data.includes("incidencias")? (
                      <>
                          <Link href="/dashboard/incidencias">
                          <Button
                            className={`${currentPath === "/dashboard/incidencias"
                                ? "bg-button-primary hover:text-white hover:bg-button-primary text-white"
                                : "hover:text-white hover:bg-button-primary"}`}
                            variant="ghost"
                          >
                            Incidencias
                          </Button>
                        </Link>
                      </>
                      ) : null
                    }
                      
                    { data.includes("articulos")? (
                      <>
                          <Link href="/dashboard/articulos">
                          <Button
                            className={`${currentPath === "/dashboard/articulos"
                                ? "bg-button-primary hover:text-white hover:bg-button-primary text-white"
                                : "hover:text-white hover:bg-button-primary"}`}
                            variant="ghost"
                          >
                            Artículos
                          </Button>
                        </Link>
                      </>
                      ) : null
                    }
    
                    { data.includes("rondines")? (
                      <>
                          <Link href="/dashboard/rondines">
                          <Button
                            className={`${currentPath === "/dashboard/rondines"
                                ? "bg-button-primary hover:text-white hover:bg-button-primary text-white"
                                : "hover:text-white hover:bg-button-primary"}`}
                            variant="ghost"
                          >
                            Rondines
                          </Button>
                          </Link>
                      </>
                      ) : null
                    }     
                  </>
                ):null}
                
                </>
                  ): null}
              </nav>
              {/* Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src="/image/profile.png" alt="Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  { currentPath !== "/" ? (
                    <>
                    {data?.length > 0 ? (
                      <>
                        { data.includes("turnos")? (
                          <>
                            <Link href="/dashboard/turnos">
                              <DropdownMenuItem>
                                <DoorOpen />
                                Turno
                              </DropdownMenuItem>
                            </Link>
                          </>
                        ): null}
                      </>
                    ):null}
                      
                    {data?.length > 0 ? (
                      <>
                        { data.includes("notas")? (
                      <>
                        <Link href="/dashboard/notas">
                          <DropdownMenuItem>
                            <StickyNote />
                            Notas
                          </DropdownMenuItem>
                        </Link>
                      </>
                    ): null}
                      </>
                    ):null}
                    </>
                    ): null}
                  <Link href="/dashboard/configuracion">
                    <DropdownMenuItem>
                      <Settings />
                      Configuración
                    </DropdownMenuItem>
                  </Link>
    
                  <DropdownMenuItem onClick={logout}>
                    <LogOut />
                    Salir
                  </DropdownMenuItem>
    
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
          )}
          
      </div>
    </header>
  );
};
