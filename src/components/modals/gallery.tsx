import Image from "next/image";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CalendarDays, Eraser, Search } from "lucide-react";
import { Button } from "../ui/button";
import { catalogoFechas } from "@/lib/utils";
import { useState } from "react";
import DateTime from "../dateTime";

interface GalleryModalProps {
rondin:any[];
}

export const Gallery: React.FC<GalleryModalProps> = ({
rondin
}) => {


    const [date1, setDate1] = useState<Date|"">("")
    const [date2, setDate2] = useState<Date|"">("")
    const [dateFilter, setDateFilter] = useState<string>("")
    const [selectedTab, setSelectedTab] = useState<string>( "Rondines"); 

	const Filter = () => {
	};

	const resetTableFilters = ()=>{
		setDate1("")
		setDate2("")
		setDateFilter(""); 
		setSelectedTab(selectedTab);
	}


return (
    <div className="">
        <div className="flex justify-between items-center my-2 ">
			<div className="flex w-full justify-start gap-4 ">
				<div className="flex justify-center items-center ">
					<TabsList className="bg-blue-500 text-white p-1 rounded-md ">
						<TabsTrigger value="Bitacora">Bitácora</TabsTrigger>
						<TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
						<TabsTrigger value="Fotos">Fotos</TabsTrigger>
						<TabsTrigger value="Rondines">Rondines</TabsTrigger>
						<TabsTrigger value="Calendario">Calendario</TabsTrigger>
					</TabsList>
				</div> 
				
				<div className="flex w-full max-w-sm items-center space-x-2">
				<input
					type="text"
					placeholder="Buscar"
					// value={globalFilter || ''}
					// onChange={(e) => setGlobalFilter(e.target.value)}
					className="border border-gray-300 rounded-md p-2 placeholder-gray-600 w-full" 
				/>
					<Search />
				</div>
			</div>

			<div className="flex w-full justify-end gap-3 ">
				{dateFilter == "range" ?
				<div className="flex items-center gap-2 mr-14">
					<DateTime date={date1} setDate={setDate1} disablePastDates={false}/>
					<DateTime date={date2} setDate={setDate2} disablePastDates={false}/>
					<Button type="button"  className={"bg-blue-500 hover:bg-blue-600"} onClick={Filter}> Filtrar</Button>
					<Button type="button"  className={"bg-blue-500 hover:bg-blue-600"} onClick={()=>{resetTableFilters()}}> 
						<Eraser/> 
					</Button>
				</div>:null}
				<div className="flex items-center w-48 gap-2"> 
				<Select value={dateFilter}  onValueChange={(value) => { 
                    console.log(value)
						// setDateFilter(value); 
						}}> 
					<SelectTrigger className="w-full">
					<SelectValue placeholder="Selecciona un filtro de fecha" />
					<CalendarDays />
					</SelectTrigger>
					<SelectContent>
					{catalogoFechas().map((option:any) => {
						return (
							<SelectItem key={option.key} value={option.key}> 
							{option.label}
							</SelectItem>
						)
					})}
					</SelectContent>
					
				</Select>
				
				</div>
			</div>
    	</div>

        <div className="flex flex-col gap-3">
            <div className="w-full ml-4 p-4 border rounded-md bg-white shadow-md">	
                <div className="mb-2 font-bold">31 de Julio del 2025: </div>
                <div className="flex gap-4">
                {rondin.map((val:any, idx:any) => {
                    const imageUrl = "/nouser.svg";
                    return imageUrl ? (
                        <div key={idx} className="rounded overflow-hidden shadow-md p-2 w-fit bg-white">
                        <Image
                            height={300}
                            width={300}
                            src={imageUrl}
                            alt={`Foto área ${idx + 1}`}
                            className="object-cover rounded"
                        />
                        </div>
                    ) :null; 
                    })}
                </div>	
            </div>
            <div className="w-full ml-4 p-4 border rounded-md bg-white shadow-md">	
                <div className="mb-2 font-bold">20 de Julio del 2025: </div>
                <div className="flex gap-4">
                {rondin.map((val:any, idx:any) => {
                    const imageUrl ="/nouser.svg";
                    return imageUrl ? (
                        <div key={idx} className="rounded overflow-hidden shadow-md p-2 w-fit bg-white">
                        <Image
                            height={300}
                            width={300}
                            src={imageUrl}
                            alt={`Foto área ${idx + 1}`}
                            className="object-cover rounded"
                        />
                        </div>
                    ) :null; 
                    })}
                </div>	
            </div>
        </div> 
    </div>
);
};