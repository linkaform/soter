/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Depositos } from "@/lib/incidencias";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

	interface DepositosItemProps {
		isCollapsed: boolean;
		onToggleCollapse: () => void;
		index: number;
		onDelete: () => void;
		DepositosRaw: Depositos;
		updateDeposito: (value: string, fieldName:string ) => void;
	}

	const DepositosItem: React.FC<DepositosItemProps> = ({isCollapsed, onToggleCollapse, onDelete, DepositosRaw, updateDeposito
	})=>  {
        const[cantidad, setCantidad]=useState<number>(0)
        const[tipoDeposito, setTipoDeposito]=useState<string>("")
		const depos = DepositosRaw
		
		useEffect(() => {
			if(depos){
				loadNewArea(depos)
			}
		}, [depos])

		function loadNewArea(item:Depositos){
            setCantidad(item.cantidad)
            setTipoDeposito(item.tipo_deposito)
		}
		
		const handleInputChange = (value:string, fieldName: string) => {
			if (value === "") {
				if (fieldName === "cantidad") {
					onDelete(); 
				}
			}
			updateDeposito(value, fieldName);
		};

return (
	<div className="p-2">
		<div className="flex justify-between">
			{isCollapsed ? (<>
			<h3 className="font-bold text-lg ml-3 w-80 truncate">{formatCurrency(depos?.cantidad)}</h3>
			</>) : (<>
				<h3 className="font-bold text-lg ml-3 p-2 w-96 truncate">Detalles del depósito: {formatCurrency(depos?.cantidad)}</h3>
			</>)}
			<div className="flex justify-between gap-5">
				<button onClick={onToggleCollapse} className="text-blue-500" type="button">
					{isCollapsed ? 'Abrir' : 'Cerrar'}
				</button>
				
				<button onClick={onDelete} className="text-blue-500" type="button">
						{isCollapsed ? 'Eliminar' : 'Eliminar'}
				</button>
			</div>
			
		</div>
            {!isCollapsed && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 pt-2">
                    <div className="form-item">
                    <label className="text-sm"> Cantidad: </label>
                    <Input
                        id="cantidad"
                        placeholder="Cantidad"
                        onChange={(e) => {
                            setCantidad(parseInt(e.target.value));

                            handleInputChange(e.target.value, "cantidad");
                        } }
                        value={cantidad}
                        className="input-class" />
                    </div>
                    <div className="form-item">
                        <Label htmlFor="tipo_deposito" className="text-sm">
                            Tipo deposito:
                        </Label>

                        <Select 
                        onValueChange={(value:string) => {
                            setTipoDeposito(value)
                        }}
                        value={tipoDeposito}
                    >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona una opcion" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={"Efectivo"} value={"Efectivo"}>Efectivo</SelectItem>
                                <SelectItem key={"Fichas Deposito"} value={"Fichas Deposito"}>Fichas Deposito</SelectItem>
                                <SelectItem key={"Menos Dev. DEP-PDT"} value={"Menos Dev. DEP-PDT"}>Menos Dev. DEP-PDT</SelectItem>
                                <SelectItem key={"Cheques"} value={"Cheques"}>Cheques</SelectItem>
                                <SelectItem key={"Cheques Dlls"} value={"Cheques Dlls"}>Cheques Dlls</SelectItem>
                                <SelectItem key={"Vales"} value={"Vales"}>Vales</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </>
            )}
	</div>
);
};

export default DepositosItem;