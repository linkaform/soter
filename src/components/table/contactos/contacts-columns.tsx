import { ColumnDef } from "@tanstack/react-table";

type Imagen = {
  file_name: string;
  file_url: string;
};

export interface PaseEntrada {
  folio: string;
  _id: string;
  nombre: string;
  email:string;
  telefono: string;
  fecha_desde_hasta:string;
  fecha_desde_visita:string;
  tipo_de_pase:string;
  motivo_visita: string;
  estatus:string;
  tema_cita:string;
  descripcion:string;
  visita_a: string[];
  ubicacion:string;
  fotografia: Imagen[];
  identificacion: Imagen[];
  enviar_correo_pre_registro: string[];
  enviar_correo: string[];
  config_dia_de_acceso: string;
  tipo_fechas_pase: string;
  tipo_visita : string;
  limite_de_acceso: string;
  grupo_instrucciones_pase: string[];  
  grupo_vehiculos: string[];  
  grupo_equipos: string[]; 
  grupo_areas_acceso : string[];
  limitado_a_dias : string[]; 
  qr_pase: string[];
  archivo_invitacion: string[];
  link: string;

}

const OptionsCell: React.FC<{ row: any }> = ({ row }) => {
  const rowData = row.original;
  return (
    <div className="flex space-x-2">
      {/* <ResendPassModal title="Reenviar Pase">

      <div className="cursor-pointer">
        <Forward />
      </div>

      </ResendPassModal> */}

    </div>
  );
};

export const pasesEntradaColumns: ColumnDef<PaseEntrada>[] = [
  {
    accessorKey: "pase",
    header: "Pase",
    cell: ({ row }) => {
      const foto = row.original.fotografia;
      const nombre = row.original.nombre;
      const estatus = row.original.estatus;
      const primeraImagen = foto && foto.length > 0 ? foto[0].file_url : 'https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067';

      return (
        <div className="flex items-center space-x-4">
          <div>
            {primeraImagen ? (
              <img src={primeraImagen} alt="Imagen" className="h-16 w-16 object-cover rounded-full bg-gray-300" />
            ) : (
              <span>No hay imagen</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-bold">{nombre}</span>
          </div>
        </div>
      );
    },
    enableSorting: false,  // Deshabilitar el orden para esta columna combinada
  },

];
