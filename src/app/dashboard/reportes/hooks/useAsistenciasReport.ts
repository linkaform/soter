import { useQuery } from "@tanstack/react-query";
import { getAttendanceDetail, getReportAsistencias, getReportLocations } from "../endpoints/asistenciasReport";
import { asistenciasReport } from "../types/report";

export const useReportAsistencias = ({ enabled = false, dateRange, locations, groupBy }: asistenciasReport) => {
    const {
        data: reportAsistencias,
        isLoading: isLoadingReportAsistencias,
        error: errorReportAsistencias,
        refetch: refetchReportAsistencias,
    } = useQuery<any>({
        queryKey: ["getReportAsistencias"],
        enabled,
        queryFn: async () => {
            const data = await getReportAsistencias({
                dateRange,
                locations,
                groupBy
            });
            return data ?? [];
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        reportAsistencias,
        isLoadingReportAsistencias,
        errorReportAsistencias,
        refetchReportAsistencias,
    };
};

export const useReportLocations = ({ enabled = false }: { enabled?: boolean }) => {
    const {
        data: reportLocations,
        isLoading: isLoadingReportLocations,
        error: errorReportLocations,
        refetch: refetchReportLocations,
    } = useQuery<any>({
        queryKey: ["getReportLocations"],
        enabled,
        queryFn: async () => {
            const data = await getReportLocations();
            return data ?? [];
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        reportLocations,
        isLoadingReportLocations,
        errorReportLocations,
        refetchReportLocations,
    };
};

export const useAttendanceDetail = ({ enabled = false, names, selectedDay, location }: { enabled?: boolean; names: string[]; selectedDay: number; location: string }) => {
    const {
        data: attendanceDetail,
        isLoading: isLoadingAttendanceDetail,
        error: errorAttendanceDetail,
        refetch: refetchAttendanceDetail,
    } = useQuery<any>({
        queryKey: ["getAttendanceDetail", { names, selectedDay, location }],
        enabled,
        queryFn: async () => {
            const data = await getAttendanceDetail(names, selectedDay, location);
            return data ?? [];
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        attendanceDetail,
        isLoadingAttendanceDetail,
        errorAttendanceDetail,
        refetchAttendanceDetail,
    };
};