"use client";

import React, { useEffect, useState } from "react";
import { Archive, CircleHelp, Package } from "lucide-react";
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
import { dateToString } from "@/lib/utils";
import { toast } from "sonner";
import ChangeLocation from "@/components/changeLocation";

const ArticulosPage = () => {
	// const [stateArticle, setStateArticle] = useState("pendiente");
	
	const {location} = useShiftStore()
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
	const [areaSeleccionada, setAreaSeleccionada] = useState("todas")

	const [date1, setDate1] = useState<Date|"">("")
	const [date2, setDate2] = useState<Date|"">("")

	const [dates, setDates] = useState<string[]>([])
	const [dateFilter, setDateFilter] = useState<string>("this_month")

	const { listArticulosPerdidos, isLoadingListArticulosPerdidos , stats} = useArticulosPerdidos(ubicacionSeleccionada,  areaSeleccionada == "todas" ? "": areaSeleccionada, "", true, dates[0], dates[1], dateFilter);
	const { listArticulosCon, isLoadingListArticulosCon} = useArticulosConcesionados( true, dates[0], dates[1], dateFilter);
	const { listPaqueteria, isLoadingListPaqueteria} = usePaqueteria("", "", "guardado", true, dates[0], dates[1], dateFilter);
	const { tab, setTab } = useShiftStore()
	const [selectedTab, setSelectedTab] = useState<string>(tab ? tab:'Perdidos'); 

	const [isSuccess, setIsSuccess] = useState(false);
	const [modalData] = useState<any>(null);
	const [selectedArticulos, setSelectedArticulos]= useState<string[]>([]);
	console.log(selectedArticulos)
	const [isSuccessCon, setIsSuccessCon] = useState(false);
	const [isSuccessPaq, setIsSuccessPaq] = useState(false);

	useEffect(()=>{
		if(tab){
			setTab("")
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

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
	
	useEffect(()=>{
		setUbicacionSeleccionada("")
		setAreaSeleccionada("")
	},[])

	const Filter = () => {
		if(date1 && date2){
			const f1= dateToString(new Date(date1)) 
			const f2= dateToString(new Date(date2)) 
			setDates([f1,f2])
		}else{
			toast.error("Escoge un rango de fechas.")
		}
	};

	const handleTabChangeTab = (newTab: any) => {
		setSelectedTab(newTab); 
		
		
	  };

	const handleTabChange = (tab:string, option:string) => {
		if(tab == selectedTab){
			setSelectedTab("Perdidos")
		}else{
			setDateFilter(option); 
			setSelectedTab(tab)
		}
	};

  return (
    <div className="">
      	<div className="p-6 space-y-1 pt-3 w-full mx-auto ">

				<div className="flex justify-between">
					<div>
						<PageTitle title="Registro y Seguimiento de Artículos" />	
					</div>
					<div className="flex items-center gap-5">
						<div>
							<ChangeLocation
								ubicacionSeleccionada={ubicacionSeleccionada}
								areaSeleccionada={areaSeleccionada}
								setUbicacionSeleccionada={setUbicacionSeleccionada}
								setAreaSeleccionada={setAreaSeleccionada}
							/>
						</div>
						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						selectedTab=="Concecionados" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() =>  handleTabChange("Concecionados","")}>
							<div className="flex gap-6"><Archive className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl"> {stats?.articulos_concesionados_pendientes}</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Artículos Concesionados</span>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						 selectedTab=="Perdidos"? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => handleTabChange("Perdidos","")}>
							<div className="flex gap-6"><CircleHelp className="text-primary w-10 h-10"/>
								<span className="flex items-center font-bold text-4xl"> {stats?.articulos_perdidos}</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Artículos perdidos</span>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						selectedTab== "Paqueteria" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => handleTabChange("Paqueteria","")}>
							<div className="flex gap-6"><Package className="text-primary w-10 h-10"/>
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

				<Tabs defaultValue="Perdidos" className="w-full" value={selectedTab}  onValueChange={handleTabChangeTab}>
					
					<TabsContent value="Perdidos">
						<div className="">
						<ArticulosPerdidosTable data={listArticulosPerdidos} isLoadingListArticulosPerdidos={isLoadingListArticulosPerdidos} 
						openModal={openModal} setSelectedArticulos={setSelectedArticulos}
						date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter}
						/>
						</div>
				
					</TabsContent>
					<TabsContent value="Concecionados">
					<div className="">
						<ArticulosConTable data={listArticulosCon} isLoadingListArticulosCon={isLoadingListArticulosCon} 
						openModal={openModalCon}  setSelectedArticulos={setSelectedArticulos}
						date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter}
						/>
					</div>
					</TabsContent>

					<TabsContent value="Paqueteria">
					<div className="">
						<PaqueteriaTable data={listPaqueteria} isLoadingListPaqueteria={isLoadingListPaqueteria} 
							openModal={openModalPaq} setSelectedArticulos={setSelectedArticulos}
							date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter}
						/>
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
  );
};

export default ArticulosPage;
