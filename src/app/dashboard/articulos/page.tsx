"use client";

import React, { useState } from "react";
import { Archive, CircleHelp } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ConcecionadosTable } from "@/components/table/articulos/concecionados/table";
import PageTitle from "@/components/page-title";
import { useArticulosPerdidos } from "@/hooks/useArticulosPerdidos";
import ArticulosPerdidosTable from "@/components/table/articulos/pendientes/table";
import { AddArticuloModal } from "@/components/modals/add-article-lost";

const ArticulosPage = () => {
  const [stateArticle, setStateArticle] = useState("Pendientes");
  const { listArticulosPerdidos, isLoadingListArticulosPerdidos , stats, statsError} = useArticulosPerdidos("", "", "pendiente", true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedArticulos, setSelectedArticulos]= useState<string[]>([]);

  const openModal = () => {
	setIsSuccess(true);  
	};
  const closeModal = () => {
		setIsSuccess(false);  
	};
  return (
    <div className="">
		
      <div className="flex flex-col">
        <div className="p-6 space-y-1 pt-3 pb-0 mb-0 w-full mx-auto">

        <div className="flex justify-between">
			<div>
				<PageTitle title="Registro y Seguimiento de Artículos" />	
			</div>
			<div className="flex gap-5">
				<div className="border px-12 py-1 rounded-md">
					<div className="flex gap-6"><Archive className="text-primary w-10 h-10" />
						<span className="flex items-center font-bold text-4xl"> {stats?.articulos_concesionados_pendientes}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Artículos Concesionados Pendientes</span>
				</div>
				<div className="border p-4 px-12 py-1 rounded-md">
					<div className="flex gap-6"><CircleHelp className="text-primary w-10 h-10"/>
						<span className="flex items-center font-bold text-4xl"> {stats?.articulos_perdidos}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Artículos perdidos</span>
				</div>
			</div>
		</div>

          <Tabs defaultValue="Perdidos" className="w-full">
            
            <TabsContent value="Perdidos">
              {stateArticle === "Pendientes" && (
                <div className="">
                  <ArticulosPerdidosTable data={listArticulosPerdidos} isLoadingListArticulosPerdidos={isLoadingListArticulosPerdidos} 
				   openModal={openModal} setSelectedState={setSelectedState} selectedArticulos={selectedArticulos} setSelectedArticulos={setSelectedArticulos}/>
                </div>
              )}

              {/* {stateArticle === "Entregados" && (
                <div className="">
                  <ArticulosEntregadosTable />
                </div>
              )}

              {stateArticle === "Donados" && (
                <div className="">
                  <ArticulosDonadosTable />
                </div>
              )} */}
            </TabsContent>
            <TabsContent value="Concecionados">
              <div className="">
                <ConcecionadosTable />
              </div>
            </TabsContent>
          </Tabs>

		  <AddArticuloModal
			title={"Crear Artículo"}
			data={modalData}
			isSuccess={isSuccess}
			setIsSuccess={setIsSuccess}
			onClose={closeModal}
		/>
        </div>
      </div>
    </div>
  );
};

export default ArticulosPage;
