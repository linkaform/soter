import { Equipo_bitacora, Vehiculo_bitacora } from "@/components/table/bitacoras/bitacoras-columns";
import { UpdateBitacora } from "@/lib/update-bitacora-entrada";
import { useQuery } from "@tanstack/react-query";

export const useUpdateBitacora = (vehiculo:Vehiculo_bitacora[]|null, equipo: Equipo_bitacora[]|null, id:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["UpdateBitacora", vehiculo, equipo, id],
    enabled:false,
    queryFn: async () => {
      const data = await UpdateBitacora({
        vehiculo,
        equipo,
        id,
      });
      return data.response?.data;
    },
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};

