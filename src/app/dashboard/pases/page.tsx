"use client";

import React, { useState } from "react";
import PageTitle from "@/components/page-title";
import { useGetMyPases } from "@/hooks/useGetMyPases";
import PasesEntradaTable from "@/components/table/pases-entrada/table";
import PaginationPases from "@/components/pages/pases/PaginationPases";
import ChangeLocation from "@/components/changeLocation";
import { arraysIguales } from "@/lib/utils";
import { Sun, UsersRound } from "lucide-react";
import { useShiftStore } from "@/store/useShiftStore";

const ListaPasesPage = () => {
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);
  const [searchName, setSearchName] = useState("");
  const {location} = useShiftStore()
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string>(location );
	const [areaSeleccionada, setAreaSeleccionada] = useState("todas");
  const { data, isLoading } = useGetMyPases({ skip, limit, searchName });
  const { records, actual_page, records_on_page, total_pages, total_records } = data || {};

	const [selectedOption, setSelectedOption] = useState<string[]>([]);
	const [dateFilter, setDateFilter] = useState<string>("")
  
  const handlePageChange = (newSkip: number, newLimit: number) => {
    setSkip(newSkip);
    setLimit(newLimit);
  };


  const handleTabChange = (tab:string, option:string[], filter="") => {
		if(arraysIguales(option, selectedOption) && filter == dateFilter){
				setSelectedOption([]);
				setDateFilter("")
		}else{
			setDateFilter( filter=="today"? filter:"")
			setSelectedOption(option); 
		}
	};

  return (
    <div className="">
      <div className="flex flex-col m-3">

          <div className="flex gap-5 justify-between">
            <div className="ml-3"> 
				<PageTitle title="Historial De Pases De Entrada" />
			</div>
            <div className="flex gap-5">
                <div>
                  <ChangeLocation
                    ubicacionSeleccionada={ubicacionSeleccionada}
                    areaSeleccionada={areaSeleccionada}
                    setUbicacionSeleccionada={setUbicacionSeleccionada}
                    setAreaSeleccionada={setAreaSeleccionada}
                  />
                </div>

                <div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
                  dateFilter== "today" && selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
                  onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
                  <div className="flex gap-6">
                    <Sun className="text-primary w-10 h-10" />
                    <span className="flex items-center font-bold text-4xl">
                    {10}
                    </span>
                  </div>
                  <div className="flex items-center space-x-0">
                    <div className="h-1 w-1/2 bg-cyan-100"></div>
                    <div className="h-1 w-1/2 bg-blue-500"></div>
                  </div>
                  <span className="text-md">Pases en Proceso</span>
                </div>

                <div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
                  selectedOption[0] === 'entrada' &&dateFilter == "" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => {handleTabChange("Personal",["entrada"], "");}}>
                  <div className="flex gap-6">
                    <UsersRound className="text-primary w-10 h-10" />
                    <span className="flex items-center font-bold text-4xl">
                    {12}
                    </span>
                  </div>
                  <div className="flex items-center space-x-0">
                    <div className="h-1 w-1/2 bg-cyan-100"></div>
                    <div className="h-1 w-1/2 bg-blue-500"></div>
                  </div>
                  <span className="text-md">Pases Completos</span>
                </div>
            </div>
		</div>
        
          <PasesEntradaTable isLoading={isLoading} pases={records ?? []} onSearch={setSearchName} />
          {!isLoading && (
            <PaginationPases
              actual_page={actual_page}
              records_on_page={records_on_page}
              total_pages={total_pages}
              total_records={total_records}
              limit={limit}
              onPageChange={handlePageChange}
            />
          )}
      </div>
    </div>
  );
};

export default ListaPasesPage;
