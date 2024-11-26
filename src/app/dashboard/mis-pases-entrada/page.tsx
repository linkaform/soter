"use client";

import React from "react";
import {
  Ban,
  CircleCheck,
  FilePlus2,
  RefreshCcw,
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
              <div className="flex flex-col justify-between items-start">
                <div className="space-y-1">
                  <p className="text-muted-foreground">
                  Pases Activos
                  </p>
                  <p className="text-3xl font-bold">23</p>
                </div>
                <CircleCheck />     
                                    </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col justify-between items-start">
                <div className="space-y-1">
                  <p className="text-muted-foreground">
                  Pases Recurrentes
                  </p>
                  <p className="text-3xl font-bold">23</p>
                </div>
                <RefreshCcw />
                              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col justify-between items-start">
                <div className="space-y-1">
                  <p className="text-muted-foreground">
                  Pases Próximos a Vencer
                  </p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <Ban />

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col justify-between items-start">
                <div className="space-y-1">
                  <p className="text-muted-foreground">
                  Pases Generados x Día
                  </p>
                  <p className="text-3xl font-bold">23</p>
                </div>
                <FilePlus2 />
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