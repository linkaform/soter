import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";

export interface DataMsjInterface {
    email_from: string;
    titulo: string;
    nombre: string;
    email_to: string;
    mensaje: string;
    phone_to: string;
}

export const enviarMensaje = async (data_msj: DataMsjInterface | null) => {
    const payload = {
        data_msj,
        option: "send_msj_by_access",
        script_name: "script_turnos.py",
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

    const data = await response.json();
    return data;
};

export const useEnviarMensaje = () => {
    const { setLoading } = useShiftStore();

    const enviarMensajeMutation = useMutation({
        mutationFn: async (data_msj: any) => {
            const response = await enviarMensaje(data_msj);
            const hasError = response.response?.data?.status_code;

            if (hasError === 400 || hasError === 401) {
                const textMsj = errorMsj(response.response.data);
                throw new Error(`Error al enviar mensaje: ${textMsj?.text}`);
            }

            return response.response?.data;
        },
        onMutate: () => {
            const loadingToastId = toast.loading("Enviando mensaje...", {
                style: {
                    background: "#000",
                    color: "#fff",
                    border: 'none'
                },
            });
            return loadingToastId;
        },
        onSuccess: (_data, _variables, context) => {
            toast.dismiss(context);
            toast.success("Mensaje enviado correctamente.", {
                style: {
                    background: "#000",
                    color: "#fff",
                    border: 'none'
                },
            });
        },
        onError: (err: any, _variables, context) => {
            console.error("Error al enviar mensaje:", err);
            toast.dismiss(context);
            toast.error(err.message || "Hubo un error al enviar el mensaje.", {
                style: {
                    background: "#000",
                    color: "#fff",
                    border: 'none'
                },
            });
        },
        onSettled: () => setLoading(false),
    });

    return {
        enviarMensajeMutation,
    };
};
