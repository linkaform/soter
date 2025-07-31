import { data_correo, sendCorreo } from "@/lib/send_correo";
import { errorMsj } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useSendCorreoSms = () => {
	const [isLoadingCorreo, setIsLoadingCorreo] = useState(false);
	const [isLoadingSms, setIsLoadingSms] = useState(false);

    const createSendCorreoSms = useMutation({
      mutationFn: async ({account_id ,envio, data_for_msj , folio} : { account_id: number|null,envio: string[],data_for_msj:data_correo|null,folio:string}) => {
          const response = await sendCorreo(
			account_id,
			envio,
			data_for_msj,
			folio);
          const hasError= response.response.data.status_code

          if(hasError == 400|| hasError == 401){
              const textMsj = errorMsj(response.response.data) 
              throw new Error(`Error al enviar correo, Error: ${textMsj?.text}`);
          }else{
              return response.response?.data
          }
      },
      onMutate: () => {
        setIsLoadingCorreo(true);
      },
      onSuccess: () => {
        toast.success("Correo enviado correctamente.");
      },
      onError: (err) => {
        toast.error(err.message || "Hubo un error al enviar correo: " + err);
  
      },
      onSettled: () => {
        setIsLoadingCorreo(false);
      },
    });

	const createSendSms = useMutation({
	mutationFn: async ({account_id ,envio, data_for_msj , folio} : { account_id: number|null,envio: string[],data_for_msj:data_correo|null,folio:string}) => {
		const response = await sendCorreo(
			account_id,
			envio,
			data_for_msj,
			folio
		);
		const hasError= response.response.data.status_code

		if(hasError == 400|| hasError == 401){
			const textMsj = errorMsj(response.response.data) 
			throw new Error(`Error al enviar SMS, Error: ${textMsj?.text}`);
		}else{
			return response.response?.data
		}
	},
	onMutate: () => {
		setIsLoadingSms(true);
	},
	onSuccess: () => {
		toast.success("SMS enviado correctamente.");
	},
	onError: (err) => {
		toast.error(err.message || "Hubo un error al enviar SMS: "+ err );
	},
	onSettled: () => {
		setIsLoadingSms(false);
	},
	});

  return {
	createSendCorreoSms,
	createSendSms,
	isLoadingCorreo,
	isLoadingSms
  };
};
