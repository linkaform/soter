import { useQuery } from "@tanstack/react-query";
import { getAvancesInspecciones, getBackgroundCommentsAndImages, getBackgroundGraphs, getHoteles, getHotelesAvances, getHotelHabitaciones, getReportAvances, getReportFallas } from "../requests/peticiones";
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
    anio?: string | null | number;
    cuatrimestres?: any[];
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

////////////////////// REPORTE DE AVANCES //////////////////////
export const useGetHotelesAvances = (enabled: boolean) => {
    const {
        data: hotelesFallas,
        isLoading: isLoadingHotelesFallas,
        error: errorHotelesFallas,
        refetch: refetchHotelesFallas,
    } = useQuery<any>({
        queryKey: ["getHotelesAvances"],
        enabled,
        queryFn: async () => {
            const data = await getHotelesAvances();
            const textMsj = errorMsj?.(data);
            if (textMsj) {
                throw new Error(`Error al obtener hoteles de avances: ${data.error}`);
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

export const useReportAvances = ({ enabled = false, anio, cuatrimestres, hoteles }: reportFalla) => {

    anio = anio ? Number.parseInt(anio as any, 10) : undefined;
    cuatrimestres = cuatrimestres?.map((item: any) => item.id);
    hoteles = hoteles?.map((item: any) => item.nombre_hotel);

    const {
        data: reportAvances,
        isLoading: isLoadingReportAvances,
        error: errorReportAvances,
        refetch: refetchReportAvances,
    } = useQuery<any>({
        queryKey: ["getReportAvances"],
        enabled,
        queryFn: async () => {
            const data = await getReportAvances({ anio, cuatrimestres, hoteles });
            const textMsj = errorMsj?.(data);
            if (textMsj) {
                throw new Error(`Error al obtener reporte de avances: ${data.error}`);
            } else {
                return data.response?.data ?? [];
            }
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        reportAvances,
        isLoadingReportAvances,
        errorReportAvances,
        refetchReportAvances,
    };
};

export const useGetAvancesInspecciones = ({ enabled = false, anio, cuatrimestres, hoteles }: reportFalla) => {

    anio = anio ? Number.parseInt(anio as any, 10) : undefined;
    cuatrimestres = cuatrimestres?.map((item: any) => item.id);
    hoteles = hoteles?.map((item: any) => item.nombre_hotel);

    const {
        data: avancesInspecciones,
        isLoading: isLoadingAvancesInspecciones,
        error: errorAvancesInspecciones,
        refetch: refetchAvancesInspecciones,
    } = useQuery<any>({
        queryKey: ["getAvancesInspecciones"],
        enabled,
        queryFn: async () => {
            const data = await getAvancesInspecciones({ anio, cuatrimestres, hoteles });
            const textMsj = errorMsj?.(data);
            if (textMsj) {
                throw new Error(`Error al obtener avances de inspecciones: ${data.error}`);
            } else {
                return data.response?.data ?? [];
            }
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        avancesInspecciones,
        isLoadingAvancesInspecciones,
        errorAvancesInspecciones,
        refetchAvancesInspecciones,
    };
};

export const useReportBackgroundGraphs = ({ enabled = false, anio, cuatrimestres, hoteles }: reportFalla) => {

    anio = anio ? Number.parseInt(anio as any, 10) : undefined;
    cuatrimestres = cuatrimestres?.map((item: any) => item.id);
    hoteles = hoteles?.map((item: any) => item.nombre_hotel);

    const {
        data: reportFallas,
        isLoading: isLoadingReportFallas,
        error: errorReportFallas,
        refetch: refetchReportFallas,
    } = useQuery<any>({
        queryKey: ["getBackgroundGraphs"],
        enabled,
        queryFn: async () => {
            const data = await getBackgroundGraphs({ anio, cuatrimestres, hoteles });
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
        reportBackgroundGraphs: reportFallas,
        isLoadingReportBackgroundGraphs: isLoadingReportFallas,
        errorReportBackgroundGraphs: errorReportFallas,
        refetchReportBackgroundGraphs: refetchReportFallas,
    };
};

export const useReportBackgroundCommentsAndImages = ({ enabled = false, anio, cuatrimestres, hoteles }: reportFalla) => {

    anio = anio ? Number.parseInt(anio as any, 10) : undefined;
    cuatrimestres = cuatrimestres?.map((item: any) => item.id);
    hoteles = hoteles?.map((item: any) => item.nombre_hotel);

    const {
        data: reportFallas,
        isLoading: isLoadingReportFallas,
        error: errorReportFallas,
        refetch: refetchReportFallas,
    } = useQuery<any>({
        queryKey: ["getBackgroundCommentsAndImages"],
        enabled,
        queryFn: async () => {
            const data = await getBackgroundCommentsAndImages({ anio, cuatrimestres, hoteles });
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
        reportBackgroundCommentsAndImages: reportFallas,
        isLoadingReportBackgroundCommentsAndImages: isLoadingReportFallas,
        errorReportBackgroundCommentsAndImages: errorReportFallas,
        refetchReportBackgroundCommentsAndImages: refetchReportFallas,
    };
};