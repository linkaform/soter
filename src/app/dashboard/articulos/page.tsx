"use client";

import React, { useState } from "react";
import { Archive, CircleHelp } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PageTitle from "@/components/page-title";
import { useArticulosPerdidos } from "@/hooks/useArticulosPerdidos";
import ArticulosPerdidosTable from "@/components/table/articulos/pendientes/table";
import { AddArticuloModal } from "@/components/modals/add-article-lost";
import ArticulosConTable from "@/components/table/articulos/concecionados/table";
import { useArticulosConcesionados } from "@/hooks/useArticulosConcesionados";
import { AddArticuloConModal } from "@/components/modals/add-article.con";
import PaqueteriaTable from "@/components/table/articulos/paqueteria/table";
import { usePaqueteria } from "@/hooks/usePaqueteria";
import { useShiftStore } from "@/store/useShiftStore";
import { AddPaqueteriaModal } from "@/components/modals/add-paqueteria";

const ArticulosPage = () => {
	const [stateArticle, setStateArticle] = useState("pendiente");
	
	const {location, area} = useShiftStore()
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
	const [areaSeleccionada, setAreaSeleccionada] = useState(area)
	const [all, setAll] = useState(false)

	const { listArticulosPerdidos, isLoadingListArticulosPerdidos , stats} = useArticulosPerdidos(ubicacionSeleccionada, areaSeleccionada, stateArticle, true);
	const { listArticulosCon, isLoadingListArticulosCon} = useArticulosConcesionados( true);
	const { listPaqueteria, isLoadingListPaqueteria} = usePaqueteria("", "", "guardado", true);

	const [isSuccess, setIsSuccess] = useState(false);
	const [modalData] = useState<any>(null);
	const [selectedArticulos, setSelectedArticulos]= useState<string[]>([]);

	const [isSuccessCon, setIsSuccessCon] = useState(false);
	const [isSuccessPaq, setIsSuccessPaq] = useState(false);

	const openModal = () => {
		setIsSuccess(true);  
		};
	const closeModal = () => {
			setIsSuccess(false);  
		};


	const openModalCon = () => {
		setIsSuccessCon(true);  
		};
	const closeModalCon = () => {
		setIsSuccessCon(false);  
	};
	const openModalPaq = () => {
		setIsSuccessPaq(true);  
		};
	const closeModalPaq = () => {
		setIsSuccessPaq(false);  
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
        <div className="border p-4 px-12 py-1 rounded-md">
					<div className="flex gap-6"><CircleHelp className="text-primary w-10 h-10"/>
						<span className="flex items-center font-bold text-4xl"> {stats?.articulos_perdidos}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Paqueteria</span>
				</div>
			</div>
		</div>

          <Tabs defaultValue="Perdidos" className="w-full">
            
            <TabsContent value="Perdidos">
                <div className="">
                  <ArticulosPerdidosTable data={listArticulosPerdidos} isLoadingListArticulosPerdidos={isLoadingListArticulosPerdidos} 
				   openModal={openModal} setStateArticle={setStateArticle} selectedArticulos={selectedArticulos} setSelectedArticulos={setSelectedArticulos}
				   ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} setUbicacionSeleccionada={setUbicacionSeleccionada} 
				   setAreaSeleccionada={setAreaSeleccionada} setAll={setAll} all={all} 
				   />
                </div>
             
            </TabsContent>
            <TabsContent value="Concecionados">
              <div className="">
                <ArticulosConTable data={listArticulosCon} isLoadingListArticulosCon={isLoadingListArticulosCon} 
				   openModal={openModalCon} setStateArticle={setStateArticle} selectedArticulos={selectedArticulos} setSelectedArticulos={setSelectedArticulos}
				   ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} setUbicacionSeleccionada={setUbicacionSeleccionada} 
				   setAreaSeleccionada={setAreaSeleccionada} setAll={setAll} all={all} 
				   />
              </div>
            </TabsContent>

            <TabsContent value="Paqueteria">
              <div className="">
                <PaqueteriaTable data={listPaqueteria} isLoadingListPaqueteria={isLoadingListPaqueteria} 
				    openModal={openModalPaq} setStateArticle={setStateArticle} selectedArticulos={selectedArticulos} setSelectedArticulos={setSelectedArticulos}
					ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} setUbicacionSeleccionada={setUbicacionSeleccionada} 
				   setAreaSeleccionada={setAreaSeleccionada} setAll={setAll} all={all} />

              </div>
            </TabsContent>

          </Tabs>

		<AddArticuloModal
			title={"Crear Artículo Perdido"}
			data={modalData}
			isSuccess={isSuccess}
			setIsSuccess={setIsSuccess}
			onClose={closeModal}
		/>
		<AddArticuloConModal
			title={"Crear Artículo Concesionado"}
			isSuccess={isSuccessCon}
			setIsSuccess={setIsSuccessCon}
			onClose={closeModalCon}
		/>

		<AddPaqueteriaModal
			title={"Crear Paquetería"}
			isSuccess={isSuccessPaq}
			setIsSuccess={setIsSuccessPaq}
			onClose={closeModalPaq}
		/>

        </div>
      </div>
    </div>
  );
};

export default ArticulosPage;
