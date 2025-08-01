import { toast } from "sonner";
import { reportFalla, useHotelHabitacionesProps } from "../hooks/useReportFallas"

export const getHoteles = async () => {
    toast.loading("Obteniendo hoteles...", {
        style: {
            background: "#000",
            color: "#fff",
            border: 'none'
        },
    });

    try {
        const payload = {
            option: "get_hoteles",
            script_name: "reporte_fallas_hoteleria.py",
        };

        const userJwt = localStorage.getItem("access_token");
        const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJwt}`,
            },
            body: JSON.stringify(payload),
        });

        toast.dismiss();
        toast.success("Hoteles obtenidos correctamente.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        toast.dismiss();
        toast.error(`${error}` || "Hubo un error al obtener tus hoteles.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });
        console.error("Error al ejecutar el reporte:", error);
        throw error;
    }
}

export const getReportFallas = async ({ anio, cuatrimestres, hoteles }: reportFalla) => {
    toast.loading("Obteniendo reporte...", {
        style: {
            background: "#000",
            color: "#fff",
            border: 'none'
        },
    });

    try {
        const payload = {
            option: "get_report",
            script_name: "reporte_fallas_hoteleria.py",
            anio,
            cuatrimestres,
            hoteles
        };

        const userJwt = localStorage.getItem("access_token");
        const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJwt}`,
            },
            body: JSON.stringify(payload),
        });

        toast.dismiss();
        toast.success("Reporte obtenido correctamente.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        toast.dismiss();
        toast.error(`${error}` || "Hubo un error al obtener el reporte.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });
        console.error("Error al ejecutar el reporte:", error);
        throw error;
    }
}

export const getHotelHabitaciones = async ({ hotel, fallas }: useHotelHabitacionesProps) => {
    toast.loading("Obteniendo habitaciones...", {
        style: {
            background: "#000",
            color: "#fff",
            border: 'none'
        },
    });

    try {
        const payload = {
            option: "get_habitaciones_by_hotel",
            script_name: "reporte_fallas_hoteleria.py",
            hotel_name: hotel,
            fallas,
        };

        const userJwt = localStorage.getItem("access_token");
        const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJwt}`,
            },
            body: JSON.stringify(payload),
        });

        toast.dismiss();
        toast.success("Habitaciones obtenidas correctamente.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        toast.dismiss();
        toast.error(`${error}` || "Hubo un error al obtener las habitaciones.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });
        console.error("Error al ejecutar el script:", error);
        throw error;
    }
}

export const getHabitacion = async ({ hotel, roomId }: { hotel: string, roomId: string }) => {
    toast.loading("Obteniendo habitacion...", {
        style: {
            background: "#000",
            color: "#fff",
            border: 'none'
        },
    });

    try {
        const payload = {
            option: "get_room_data",
            script_name: "reporte_fallas_hoteleria.py",
            hotel_name: hotel,
            room_id: roomId,
        };

        const userJwt = localStorage.getItem("access_token");
        const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJwt}`,
            },
            body: JSON.stringify(payload),
        });

        toast.dismiss();
        toast.success("Habitacion obtenida correctamente.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        toast.dismiss();
        toast.error(`${error}` || "Hubo un error al obtener la habitacion.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });
        console.error("Error al ejecutar el script:", error);
        throw error;
    }
}

export const getHabitacionPDF = async ({ recordId }: { recordId: string }) => {
    toast.loading("Obteniendo PDF de la habitacion...", {
        style: {
            background: "#000",
            color: "#fff",
            border: 'none'
        },
    });

    try {
        const payload = {
            option: "get_room_pdf",
            script_name: "reporte_fallas_hoteleria.py",
            record_id: recordId,
        };

        const userJwt = localStorage.getItem("access_token");
        const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJwt}`,
            },
            body: JSON.stringify(payload),
        });

        toast.dismiss();
        toast.success("PDF de la habitacion obtenido correctamente.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        toast.dismiss();
        toast.error(`${error}` || "Hubo un error al obtener el PDF de la habitacion.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });
        console.error("Error al ejecutar el script:", error);
        throw error;
    }
}

export const getStates = async () => {
    toast.loading("Obteniendo estados...", {
        style: {
            background: "#000",
            color: "#fff",
            border: 'none'
        },
    });

    try {
        const payload = {
            option: "get_filters",
            script_name: "report_inspecciones.py",
        };

        const userJwt = localStorage.getItem("access_token");
        const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJwt}`,
            },
            body: JSON.stringify(payload),
        });

        toast.dismiss();
        toast.success("Filtros obtenidos correctamente.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });

        const data = await response.json();
        const states = data?.response?.response?.states ?? [];
        return states;
    } catch (error) {
        toast.dismiss();
        toast.error(`${error}` || "Hubo un error al obtener tus filtros.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });
        console.error("Error al ejecutar el reporte:", error);
        throw error;
    }
}

export const getReportAuditorias = async (year: number, states: string[]) => {
    toast.loading("Obteniendo reporte...", {
        style: {
            background: "#000",
            color: "#fff",
            border: 'none'
        },
    });

    try {
        const payload = {
            option: "get_report",
            script_name: "report_inspecciones.py",
            anio: year,
            states
        };

        const userJwt = localStorage.getItem("access_token");
        const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJwt}`,
            },
            body: JSON.stringify(payload),
        });

        toast.dismiss();
        toast.success("Reporte obtenido correctamente.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });

        const res = await response.json();
        const data = res?.response?.response ?? [];
        return data;
    } catch (error) {
        toast.dismiss();
        toast.error(`${error}` || "Hubo un error al obtener el reporte.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });
        console.error("Error al ejecutar el reporte:", error);
        throw error;
    }
}

export const getAuditorias = async (fallas: string[], states: string[]) => {
    toast.loading("Obteniendo auditorías...", {
        style: {
            background: "#000",
            color: "#fff",
            border: 'none'
        },
    });

    try {
        const payload = {
            option: "get_auditorias",
            script_name: "report_inspecciones.py",
            fallas_list: fallas,
            states: states
        };

        const userJwt = localStorage.getItem("access_token");
        const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJwt}`,
            },
            body: JSON.stringify(payload),
        });

        toast.dismiss();
        toast.success("Auditorías obtenidas correctamente.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });

        const res = await response.json();
        const data = res?.response?.response ?? [];
        return data;
    } catch (error) {
        toast.dismiss();
        toast.error(`${error}` || "Hubo un error al obtener las auditorías.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });
        console.error("Error al ejecutar el script:", error);
        throw error;
    }
}

export const getAuditoriaById = async (id: string) => {
    toast.loading("Obteniendo auditoría...", {
        style: {
            background: "#000",
            color: "#fff",
            border: 'none'
        },
    });

    try {
        const payload = {
            option: "get_auditoria_by_id",
            script_name: "report_inspecciones.py",
            record_id: id
        };

        const userJwt = localStorage.getItem("access_token");
        const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJwt}`,
            },
            body: JSON.stringify(payload),
        });

        toast.dismiss();
        toast.success("Auditoría obtenida correctamente.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });

        const res = await response.json();
        const data = res?.response?.response ?? [];
        return data;
    } catch (error) {
        toast.dismiss();
        toast.error(`${error}` || "Hubo un error al obtener la auditoría.", {
            style: {
                background: "#000",
                color: "#fff",
                border: 'none'
            },
        });
        console.error("Error al ejecutar el script:", error);
        throw error;
    }
}