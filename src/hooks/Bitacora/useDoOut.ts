import { doOut } from "@/lib/bitacoras";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDoOut = () => {
  const queryClient = useQueryClient();
  const { setLoading} = useShiftStore();
  
  // const { data: data, error, isFetching, refetch} = useQuery<any>({
  //   queryKey: ["doOut", location, area, qr_code], 
  //   enabled:false,
  //   queryFn: async () => {
  //       const data = await doOut(qr_code, location, area); 
  //       return data; 
  //   },
   
  //   refetchOnWindowFocus: true, 
  //   refetchInterval: 60000,
  //   refetchOnReconnect: true, 
  //   staleTime: 1000 * 60 * 5, 
  // });

    return useMutation({
      mutationFn: async ({qr_code, location, area} : {qr_code: string, location:string, area:string}) => {
          const response = await doOut(qr_code, location , area);
          if(response?.response.data?.json?.success==false){
            throw new Error(`Error al realizar la salida, Error:${response?.response.data?.json?.error} `);
          }
          else if(response.success==false){
              throw new Error(`Error al realizar la salida, Error:${response.error.exception.msg[0]} `);
          }else{
              return response.response?.data
          }
          
      },
      onMutate: () => {
        setLoading(true);
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListBitacoras"] });
          queryClient.invalidateQueries({ queryKey: ["getStats"] });
          toast.success("Salida registrada correctamente.");
      },
      onError: (err) => {
        toast.error(err.message || "Hubo un error al realizar la salida.", {
          style: {
            backgroundColor: "#f44336", 
            color: "#fff",
          },
        });
      },
      onSettled: () => {
        setLoading(false);
      },
    });
};
