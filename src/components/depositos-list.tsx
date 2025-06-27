/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Depositos } from "@/lib/incidencias";
import DepositosItem from "./depositos-items";
import { formatCurrency } from "@/lib/utils";


interface DepositosListProps {
    depositos: Depositos[];
    setDepositos: Dispatch<SetStateAction<Depositos[]>>;
}

const formSchema = 
    z.object({
        cantidad: z.number().min(1,{message:"Cantidad es un campo obligatorio"}),
        tipo_deposito: z.string().min(1,{message:"Cantidad es un campo obligatorio"}),
});

const DepositosList:React.FC<DepositosListProps> = ({ depositos, setDepositos})=> {
    const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);
    const [total, setTotal] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { cantidad:0, tipo_deposito: "",}});

    const onSubmitArea = (data: z.infer<typeof formSchema>) => {
      const newPI = {
        cantidad:data.cantidad || 0,  
        tipo_deposito: data.tipo_deposito||"",  
      };
      setDepositos([...depositos, newPI]);
      cleanInputs()
    };

    const handleDeleteArea = (index: number) => {
        setDepositos((prevState) => prevState.filter((_, i) => i !== index)); 
      };


    const toggleCollapse = (index: number) => {
      if (collapsedIndex === index) {
        setCollapsedIndex(null);  
      } else {
        setCollapsedIndex(index);
      }
    };
    
    const cleanInputs =() =>{
        form.setValue('cantidad', 0);
        form.setValue('tipo_deposito', '');
    }

    const updatedAT = (index: number, value: string, fieldName:string) => {
        const updatedAreas = [...depositos];
          updatedAreas[index] = {
            ...updatedAreas[index],  
            [fieldName]: value, 
          };
        setDepositos(updatedAreas);

        if (fieldName === "cantidad" && depositos.some(at => at.cantidad === parseInt(value))) {
            setDepositos((prevState) => prevState.filter((at) => at.tipo_deposito !== value));
        }
    };

    useEffect(()=>{
        if(depositos){
            const sumaTotal = depositos.reduce((total: any, item: { cantidad: number; }) => total + item.cantidad, 0);
            setTotal(formatCurrency(sumaTotal))
        }
    },[depositos])

  return (
    <div >
      {depositos?.map((at, index) => 
      { 
        return(
        <div key={index} className="border rounded mt-2">
          <DepositosItem
            DepositosRaw={at}
            isCollapsed={collapsedIndex !== index}
            onToggleCollapse={() => toggleCollapse(index)}
            index={index}
            onDelete={() => handleDeleteArea(index)}
            updateDeposito={(value:string, fieldName:string) => updatedAT(index, value, fieldName)}/>
        </div>
      )})}

      <Form {...form} >
      <div className="border p-7 pb-4 pt-4 rounded mt-5">
        <div className="font-bold text-lg mb-2">Depósitos</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
          <FormField
              control={form.control}
              name="tipo_deposito"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Tipo Deposito:</FormLabel>
                  <FormControl>
                  <Select {...field} className="input"t
                       onValueChange={(value:string) => {
                       field.onChange(value); 
                     }}
                     value={field.value}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cantidad"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Cantidad:</FormLabel>
                  <FormControl>
                    <Input placeholder="Cantidad" {...field} 
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || !isNaN(Number(value))) {
                            field.onChange(value === "" ? "" : Number(value)); // Si es vacío, lo mantiene vacío
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 items-center">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">{total}</span>
            </div>
           
          </div>
          <div className="text-end  mt-3">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white " 
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    form.handleSubmit(onSubmitArea)(); 
                  }}
              >
                Agregar
              </Button>
            </div>
      </div>
      </Form>
    </div>
  );
};

export default DepositosList;