import { useQuery } from "@tanstack/react-query";
import { getAuditoriaById, getAuditorias, getReportAuditorias, getStates } from "../requests/peticiones";

export const useGetStates = (enabled: boolean) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<any>({
        queryKey: ["getFilters"],
        enabled,
        queryFn: async () => {
            const data = await getStates();
            return data ?? [];
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        data,
        isLoading,
        error,
        refetch,
    };
};

export const useGetReportAuditorias = (filters: { year: string; states: string[] }, enabled: boolean = false) => {
    const { year, states } = filters;
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<any>({
        queryKey: ["getReportAuditorias", year, states],
        enabled,
        queryFn: async () => {
            const data = await getReportAuditorias(parseInt(year), states);
            return data ?? [];
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        data,
        isLoading,
        error,
        refetch,
    };
};

export const useGetAuditorias = (fallas: string[], states: string[], enabled: boolean = false) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<any>({
        queryKey: ["getAuditorias", fallas, states],
        enabled,
        queryFn: async () => {
            const data = await getAuditorias(fallas, states);
            return data ?? [];
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        data,
        isLoading,
        error,
        refetch,
    };
};

export const useGetAuditoriaById = (id: string, enabled: boolean = false) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<any>({
        queryKey: ["getAuditoriaById", id],
        enabled,
        queryFn: async () => {
            const data = await getAuditoriaById(id);
            return data ?? [];
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        data,
        isLoading,
        error,
        refetch,
    };
};