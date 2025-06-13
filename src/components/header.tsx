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
import { useMenuStore } from "@/store/useGetMenuStore";

export const Header = () => {
  const currentPath = usePathname();
  const userPhoto = useAuthStore((state) => state.userPhoto);
  const { logout } = useAuthStore();
  const { labels } = useMenuStore();

  return (
    <header className="w-full shadow py-1 px-12 sticky top-0 left-0 bg-white  z-50">
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between mb-0">
        {/* Logo */}

          <div className="flex lg:mb-0 justify-center items-center">
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
                {labels?.length > 0 ? (
                  <>
                    { labels.includes("accesos")? (
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
                    
                    { labels.includes("turnos")? (
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
                      
                      { labels.includes("bitacoras")? (
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
    
                    { labels.includes("incidencias")? (
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
                      
                    { labels.includes("articulos")? (
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

                    { labels.includes("reportes")? (
                      <>
                          <Link href="/dashboard/reportes">
                          <Button
                            className={`${currentPath === "/dashboard/reportes"
                                ? "bg-button-primary hover:text-white hover:bg-button-primary text-white"
                                : "hover:text-white hover:bg-button-primary"}`}
                            variant="ghost"
                          >
                            Reportes
                          </Button>
                        </Link>
                      </>
                      ) : null
                    }
    
                    { labels.includes("rondines")? (
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
                  <Avatar className="shadow-[0_0_3px_rgba(0,0,0,0.4)] rounded-full overflow-hidden">
                    <AvatarImage src={userPhoto??undefined} alt="Avatar" className="object-contain"/>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  { currentPath !== "/" ? (
                    <>
                    {labels?.length > 0 ? (
                      <>
                        { labels.includes("turnos")? (
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
                      
                    {labels?.length > 0 ? (
                      <>
                        { labels.includes("notas")? (
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
