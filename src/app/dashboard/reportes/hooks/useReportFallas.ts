import { useQuery } from "@tanstack/react-query";
import { getHoteles, getHotelHabitaciones, getReportFallas } from "../requests/peticiones";
import { errorMsj } from "@/lib/utils";

export interface reportFalla {
    enabled?: boolean;
    anio?: string | null | number;
    cuatrimestres?: any[];
    hoteles?: any[]
}

export interface useHotelHabitacionesProps {
    enabled?: boolean;
    hotel?: string | null;
    fallas?: string[];
}

export const useReportFallas = ({ enabled = false, anio, cuatrimestres, hoteles }: reportFalla) => {

    anio = anio ? Number.parseInt(anio as any, 10) : undefined;
    cuatrimestres = cuatrimestres?.map((item: any) => item.id);
    hoteles = hoteles?.map((item: any) => item.nombre_hotel);

    const {
        data: reportFallas,
        isLoading: isLoadingReportFallas,
        error: errorReportFallas,
        refetch: refetchReportFallas,
    } = useQuery<any>({
        queryKey: ["getReportFallas"],
        enabled,
        queryFn: async () => {
            const data = await getReportFallas({ anio, cuatrimestres, hoteles });
            const textMsj = errorMsj?.(data);
            if (textMsj) {
                throw new Error(`Error al obtener reporte de fallas: ${data.error}`);
            } else {
                return data.response?.data ?? [];
            }
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        reportFallas,
        isLoadingReportFallas,
        errorReportFallas,
        refetchReportFallas,
    };
};

export const useGetHoteles = (enabled: boolean) => {
    const {
        data: hotelesFallas,
        isLoading: isLoadingHotelesFallas,
        error: errorHotelesFallas,
        refetch: refetchHotelesFallas,
    } = useQuery<any>({
        queryKey: ["getHoteles"],
        enabled,
        queryFn: async () => {
            const data = await getHoteles();
            const textMsj = errorMsj?.(data);
            if (textMsj) {
                throw new Error(`Error al obtener hoteles de fallas: ${data.error}`);
            } else {
                return data.response?.data ?? [];
            }
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        hotelesFallas,
        isLoadingHotelesFallas,
        errorHotelesFallas,
        refetchHotelesFallas,
    };
};

export const useHotelHabitaciones = ({ enabled = false, hotel, fallas }: useHotelHabitacionesProps) => {

    const {
        data: hotelHabitaciones,
        isLoading: isLoadingHotelHabitaciones,
        error: errorHotelHabitaciones,
        refetch: refetchHotelHabitaciones,
    } = useQuery<any>({
        queryKey: ["getReportFallas"],
        enabled,
        queryFn: async () => {
            const data = await getHotelHabitaciones({ hotel, fallas });
            const textMsj = errorMsj?.(data);
            if (textMsj) {
                throw new Error(`Error al obtener reporte de fallas: ${data.error}`);
            } else {
                return data.response?.data ?? [];
            }
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        hotelHabitaciones,
        isLoadingHotelHabitaciones,
        errorHotelHabitaciones,
        refetchHotelHabitaciones,
    };
};