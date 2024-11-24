"use client";

import React from "react";
import Vehicles from "@/components/icon/vehicles";
import Exit from "@/components/icon/exit";
import {
  Home,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PasesEntradaTable } from "@/components/table/pases-entrada/table";


const RondinesPage = () => {
  return (
    <div className="">

    <div className="flex flex-col">
      <div className="p-6 space-y-6 w-full mx-auto">
    


         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Visitas en el Día
                  </p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <Home className="text-primary h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Visitas Dentro
                  </p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <Users className="text-primary h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Vehículos Estacionados
                  </p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <Vehicles />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Salidas Registradas
                  </p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <Exit />
              </div>
            </CardContent>
          </Card>
        </div>


  
    
        <div className="">
           <PasesEntradaTable />
      </div>      
      </div>    
    </div>
  </div>
    )
}

export default RondinesPage