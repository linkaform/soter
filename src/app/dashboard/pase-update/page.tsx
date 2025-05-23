"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useGetCatalogoPaseNoJwt } from "@/hooks/useGetCatologoPaseNoJwt";
import { Equipo, Imagen, Vehiculo } from "@/lib/update-pass";
import { EntryPassModal2 } from "@/components/modals/add-pass-modal-2";
import LoadImage from "@/components/upload-Image";
import { ArrowLeft, Car, Laptop, Loader2 } from "lucide-react";
import { useGetPdf } from "@/hooks/usetGetPdf";
import { descargarPdfPase } from "@/lib/download-pdf";
import Image from "next/image";
import { VehiclePassModal } from "@/components/modals/add-local-vehicule";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EqipmentLocalPassModal } from "@/components/modals/add-local-equipo";
import { formatEquipos, formatVehiculos } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

 const grupoEquipos = z.array(
	z.object({
		nombre: z.string().optional(),
		modelo: z.string().optional(),
		marca: z.string().optional(),
		color: z.string().optional(),
		tipo: z.string().optional(),
		serie: z.string().optional() ,
	})
).optional();

 const grupoVehiculos = z.array(
	z.object({
		tipo: z.string().optional(),
		marca: z.string().optional(),
		modelo: z.string().optional(),
		estado: z.string().optional(),
		placas: z.string().optional(),
		color: z.string().optional()
	})
).optional();

 const valImagen = z.array(
	z.object({
		file_url: z.string().optional(),
		file_name: z.string().optional(),
	})
).optional();

 const formSchema = z
	.object({
	grupo_equipos:grupoEquipos,
	grupo_vehiculos:grupoVehiculos,
	walkin_fotografia: valImagen,
	walkin_identificacion: valImagen,
	status_pase: z.string().optional(),
	folio: z.string().optional(),
	account_id: z.number().optional(),
	nombre:z.string().nullable().optional(),
	ubicacion:z.string().nullable().optional(),
	email:z.string().nullable().optional(),
	telefono:z.string().nullable().optional(),
	acepto_aviso_privacidad: z.boolean()
    .refine((val) => val === true, {
      message: "Debes aceptar el aviso de privacidad",
    }),
})


export type formatData = {
	grupo_equipos:Equipo[],
	grupo_vehiculos:Vehiculo[],
	walkin_fotografia: Imagen[] ,
	walkin_identificacion: Imagen[] ,
	status_pase: string ,
	folio: string,
	account_id: number,
	nombre:string,
	ubicacion:string,
	email:string,
	telefono:string,
	acepto_aviso_privacidad:boolean
	acepto_aviso_datos_personales:boolean
	conservar_datos_por:string
}
const PaseUpdate = () =>{
	const [id, setId] = useState("")
	const [showIneIden, setShowIneIden] = useState<string[]|undefined>([])
	const[account_id, setAccount_id] = useState<number|null>(null)
	const [enablePdf, setEnablePdf] = useState(false)
	const [enableInfo, setEnableInfo] = useState(false)
	const { data: responsePdf, isLoading: loadingPdf} = useGetPdf(account_id, id, enablePdf);
	const { data: dataCatalogos, isLoading: loadingDataCatalogos} = useGetCatalogoPaseNoJwt(account_id, id, enableInfo );
	const [agregarEquiposActive, setAgregarEquiposActive] = useState(false);
	const [agregarVehiculosActive, setAgregarVehiculosActive] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [modalData, setModalData] = useState<any>(null);
	const [identificacion, setIdentificacion] = useState<Imagen[]>([])

	const downloadUrl=responsePdf?.response?.data?.data?.download_url
	
	const [errorFotografia, setErrorFotografia] = useState("")
	const [errorIdentificacion, setErrorIdentificacion] = useState("")

	const [isActualizarOpen, setIsActualizarOpen] = useState<string|boolean>(false);
	const [equipos, setEquipos] = useState<Equipo[]>( []);
	const [vehicles, setVehiculos] = useState<Vehiculo[]>([]);
	const [fotografia, setFotografia] = useState<Imagen[]>([])

	const [mostrarAviso, setMostrarAviso] = useState(false);
	const [radioSelected, setRadioSelected] = useState("1 semana");		
	// const [showRadioGroup, setShowRadioGroup] = useState(false);

	const handleClickGoogleButton = () => {
		const url = dataCatalogos?.pass_selected?.google_wallet_pass_url;
		if (url) {
			window.open(url, '_blank');
		} else {
			toast.error('No hay pase disponible', {
                style: {
                    background: "#dc2626",
                    color: "#fff",
                    border: 'none'
                },
            });
		}
	}

	const handleClickAppleButton = async () => {
		const record_id = dataCatalogos?.pass_selected?._id;
		const userJwt = localStorage.getItem("access_token");

		toast.loading("Obteniendo tu pase...", {
			style: {
				background: "#000",
				color: "#fff",
				border: 'none'
			},
		});

		try {
			const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
				method: 'POST',
				body: JSON.stringify({
					script_name: 'create_pass_apple_wallet.py',
					record_id
				}),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + userJwt
				},
			});
			const data = await response.json();
			const file_url = data?.response?.file_url;

			toast.dismiss();
			toast.success("Pase obtenido correctamente.", {
				style: {
					background: "#000",
					color: "#fff",
					border: 'none'
				},
			});

			const fileResponse = await fetch(file_url);
			const blob = await fileResponse.blob();
			const pkpassBlob = new Blob([blob], { type: 'application/vnd.apple.pkpass' });
			const url = window.URL.createObjectURL(pkpassBlob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'pass.pkpass';
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			toast.dismiss();
			toast.error(`${error}` || "Hubo un error al obtener su pase.", {
				style: {
					background: "#000",
					color: "#fff",
					border: 'none'
				},
			});
		}
	}

	useEffect(()=>{
		if(dataCatalogos){
			setEquipos(dataCatalogos.pass_selected?.grupo_equipos ??[])
			setVehiculos(dataCatalogos.pass_selected?.grupo_vehiculos ??[])
		}

	},[dataCatalogos])

	const form = useForm<z.infer<typeof formSchema>>({
			resolver: zodResolver(formSchema),
			defaultValues: {
			grupo_vehiculos:[],
			grupo_equipos:[],
			status_pase:'Activo',
			walkin_fotografia:[],
			walkin_identificacion:[],
			folio: "",
			account_id: 0,
			nombre:"",
			ubicacion:"",
			email:"",
			telefono:"",
			acepto_aviso_privacidad:false,
	}
	});

	const onSubmit = (data: z.infer<typeof formSchema>) => {
			const formattedData = {
				grupo_vehiculos: vehicles,
				grupo_equipos: equipos,
				status_pase: data.status_pase||"",
				walkin_fotografia:fotografia,
				walkin_identificacion:identificacion,
				folio: id,
				account_id: account_id,
				nombre: dataCatalogos?.pass_selected?.nombre||"",
				ubicacion: dataCatalogos?.pass_selected?.ubicacion||"",
				email: dataCatalogos?.pass_selected?.email||"",
				telefono:dataCatalogos?.pass_selected?.telefono||"",
				acepto_aviso_privacidad:data.acepto_aviso_privacidad,
				conservar_datos_por: radioSelected
			};
			
			if (showIneIden?.includes("foto") && fotografia.length<=0) {
					setErrorFotografia("Este campo es requerido.");
			}else{
				setErrorFotografia("-")
			}

			if (showIneIden?.includes("iden") && identificacion.length<=0) {
					setErrorIdentificacion("Este campo es requerido.")
			}else{
				setErrorIdentificacion("-")
			}
			setModalData(formattedData);
	};

	const updateInfoActivePass= () => {
		console.log("actualizar info de pase activo")
		const formattedData = {
			grupo_vehiculos: vehicles,
			grupo_equipos: equipos,
			walkin_fotografia:fotografia.length>0 ? fotografia: dataCatalogos?.pass_selected?.foto,
			walkin_identificacion:identificacion.length>0 ? identificacion: dataCatalogos?.pass_selected?.identificacion,
			folio: id,
			account_id: account_id,
			email: dataCatalogos?.pass_selected?.email||"",
			telefono:dataCatalogos?.pass_selected?.telefono||"",
			nombre: dataCatalogos?.pass_selected?.nombre||"",
		};
		setIsSuccess(true)
		setModalData(formattedData);
	}


	useEffect(()=>{
		console.log("errors",form.formState.errors)
	}, [form.formState.errors])


	useEffect(() => {
		if (typeof window !== "undefined") {
		  const valores = window.location.search
		  const urlParams = new URLSearchParams(valores);
		  const docs= urlParams.get('docs') !== null ? urlParams.get('docs') :''
		  setShowIneIden(docs?.split("-"))
		  setId(urlParams.get('id') ?? '')
		  
		  let acc = parseInt(urlParams.get('user') ?? '') || 0
		  if(!acc){
		  		acc = Number(window.localStorage.getItem("userId_soter"))
		  }
		  setAccount_id(acc);
		  setEnableInfo(true)
		}
	  }, []);

	useEffect(()=>{
		if(id && account_id && enableInfo){
			setEnableInfo(false)
		}
	},[id, account_id, enableInfo])

	useEffect(()=>{
		if(isActualizarOpen && dataCatalogos?.pass_selected?.grupo_equipos){
			 setEquipos( formatEquipos(dataCatalogos?.pass_selected?.grupo_equipos))
		}
		if(isActualizarOpen && dataCatalogos?.pass_selected?.grupo_vehiculos){
			setVehiculos(formatVehiculos(dataCatalogos?.pass_selected?.grupo_vehiculos))
		}
	},[isActualizarOpen, dataCatalogos?.pass_selected ])

	useEffect(()=>{
		if (errorFotografia === "-" && errorIdentificacion === "-") {
			setIsSuccess(true); 
	} else {
			setIsSuccess(false); 
	}
	},[errorFotografia,errorIdentificacion ])


	const handleCheckboxChange = (name:string) => {
	if (name === "agregar-equipos") {
			setAgregarEquiposActive(!agregarEquiposActive);
	} else if (name === "agregar-vehiculos") {
			setAgregarVehiculosActive(!agregarVehiculosActive);
	}
	};

	useEffect(()=>{
		if(downloadUrl){
			onDescargarPDF(downloadUrl)
			setEnablePdf(false)
			toast.success("¡PDF descargado correctamente!");
			setTimeout(() => {
				window.location.href = "https://www.soter.mx/";
			}, 1000);
		}
	},[downloadUrl])

	async function onDescargarPDF(download_url: string) {
		try {
		  await descargarPdfPase(download_url);
		} catch (error) {
		  toast.error("Error al descargar el PDF: " + error);
		}
	  }


	if(loadingDataCatalogos){
		return(
			<div className="flex justify-center items-center mt-10">
				<div role="status" className="flex flex-col items-center text-center">
					<span className="font-bold text-3xl text-slate-800">Cargando tu pase de entrada...</span>
						<div className="flex justify-center items-center">
						<svg aria-hidden="true" className="mt-10 w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
						</svg>
						</div>
				</div>
			</div>
		)
	}

	const closeModal = () => {
		setErrorFotografia("")
		setErrorIdentificacion("")
		setIsSuccess(false);  // Reinicia el estado para que el modal no se quede abierto.
	};

  const handleRemove = (index: number) => {
	setVehiculos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveEq = (index: number) => {
	setEquipos((prev) => prev.filter((_, i) => i !== index))
  }


  	if (mostrarAviso) {
		return (
			<div className="p-6 max-w-4xl mx-auto">
				<div className="flex gap-3 mt-6 items-center">
					<div>	
						<ArrowLeft className="text-black w-8 h-8 cursor-pointer"  onClick={() => setMostrarAviso(false)}/>
					</div>
					<div className="flex w-full justify-center">
						<h1 className="text-3xl font-bold mb-4">Aviso de Privacidad Integral </h1>
					</div>
				</div>

				<div>
					<div className="text-blue-950 text-2xl font-bold mb-2 mt-2">Responsable</div>
					<div>
					INFOSYNC, SAPI DE CV (en adelante, y de forma conjunta el “Responsable”) con domicilio convencional ubicado en José Maria Morelos Poniente no.177 int. 62, Colonia Monterrey Centro, Codigo Postal 64000, 
					Teléfono (81) 8192-2973, correo electrónico info@linkaform.com, estamos conscientes que usted como visitante de nuestras oficinas y/o sitio web, consumidor o potencial consumidor de nuestros productos y/o 
					servicios tiene derecho a conocer qué información recabamos de usted y nuestras prácticas en relación con dicha información.
					Las condiciones contenidas en el presente son aplicables a la información que se recaba a nombre de y por el Responsable o cualquiera de sus empresas filiales o subsidiarias, por cualquier medio, 
					incluyendo a través de o cualquier sitio web operado por el Responsable.
					</div>
				</div>
						
				<div>
					<div className="text-blue-950 text-2xl font-bold mb-2 mt-2">Datos Personales</div>
					<div>
					Los datos personales que puede llegar a recabar el Responsable de forma directa o indirecta consisten en los siguientes: Los datos personales considerados como de identificación son todos los relativos 
					a la identificación de la persona (nombre completo, dirección, teléfonos fijo y/o celular, empresa para la cual labora, huellas digitales, fecha de nacimiento, nacionalidad, lugar de nacimiento, ocupación 
					y/o sus familiares directos). Nos comprometemos a que todos los datos obtenidos serán tratados bajo las más estrictas medidas de seguridad que garanticen su confidencialidad.
					</div>
				</div>
						
				<div>
					<div className="text-blue-950 text-2xl font-bold mb-2 mt-2">Finalidades</div>
					<div>
							La finalidad principal para las que recabamos sus datos tiene por objeto ofrecer nuestros servicios y productos, dar acceso a la plataforma y atención a clientes , cumpliendo con los estándares mediante 
							los procesos internos para asegurar la calidad y seguridad del cliente en nuestras instalaciones.
							<br /><br />
							Las finalidades secundarias para las que recabamos sus datos son: facturación, cobranza, informarle sobre nuevos productos, servicios o cambios en los mismos, mensajes promocionales; evaluar la calidad 
							del servicio; cumplir con las obligaciones derivadas de la prestación del servicio; cumplir con la legislación aplicable vigente; contestar requerimientos de información de cualquier autoridad, ya sea por 
							investigaciones, estadísticas o reportes normativos; atender a sus comentarios relacionados con la prestación de servicios; enviar avisos e información de nuestros servicios; y coadyuvar con el proceso 
							de mejora continua.
					</div>
				</div>
						
				<div>
					<div className="text-blue-950 text-2xl font-bold mb-2 mt-2">Transferencias y encargados de datos personales</div>
					<div>
					Asimismo, le informamos que sus datos personales podrán ser transferidos a terceros y podrán ser compartidos a encargados para su tratamiento dentro y fuera del país, por personas distintas al Responsable, quien girará las instrucciones para su tratamiento. En ese sentido, su información puede ser transferida o compartida con 
					<br /><br />
					(i) Diversos profesionales, técnicos y auxiliares, así como otros entes privados por cuestión de servicios subrogados en relación con la atención del cliente; 
					(ii) Administradoras de programas de lealtad; 
					(iii) Socios comerciales del Responsable, con la finalidad de que estos administren y operen servicios complementarios a los del Responsable; 
					(iv) Sociedades o terceros que operen en forma conjunta con el Responsable algún producto, servicio o cualquier software o infraestructura informática que sirva como plataforma para la realización de operaciones o servicios; 
					(v) Terceros prestadores de servicios o vendedores de productos necesarios para la operación de la responsable, así como comisionistas que realicen operaciones o brinden servicios a la responsable que esta pueda realizar de acuerdo con la legislación vigente y sus estatutos sociales, como son, entre otros, comisionistas, procesadores de datos, empresas de envío de material de marketing, empresas de mensajería, de seguridad, transporte de valores, agencias de publicidad, guarda de información, con el propósito de que estos asistan en la realización de las finalidades previstas en este aviso de privacidad; 
					(vi) Profesionistas, asesores o consultores externos, para efecto de la administración de operaciones de venta, servicios y de los demás actos que la responsable pueda realizar de conformidad con la legislación vigente y sus estatutos sociales, así como para la defensa de sus intereses ante cualquier controversia legal que surja con motivo de dichas operaciones y servicios, tales como agencias de cobranza, auditores externos, legales, contables, etc.; y 
					(vii) Todas aquellas dependencias gubernamentales y/o judiciales que por ministerio de ley soliciten y/o requieran de la responsable datos personales de sus clientes y/o familiares, necesarias para el cumplimiento de diversas legislaciones.
					<br /><br />
					Si usted no manifiesta su oposición para que sus datos personales sean transferidos, se entenderá que ha otorgado su consentimiento para ello.
					<br /><br />
					El Responsable informa que todos los contratos de prestación de servicios con terceros que impliquen el tratamiento de su información personal a nombre y por cuenta del Responsable incluirán una cláusula garantizando que otorgan el nivel de protección de datos personales, mediante el cual se constituyan encargados en términos del párrafo anterior. En cualquier caso, todo manejo de datos personales se realizará dando cumplimiento a la Ley Federal de Protección de Datos Personales en Posesión de Particulares (en adelante la “Ley”) y su Reglamento.
					<br /><br />
					La información que proporcione deberá ser veraz y completa. Por lo que queda bajo su responsabilidad la veracidad de los datos proporcionados y en ningún caso el Responsable será responsable a este respecto.
					</div>
				</div>
						
				<div>
					<div className="text-blue-950 text-2xl font-bold mb-2 mt-2">Derechos ARCO</div>
					<div>
					En el momento que lo estime oportuno podrá ejercer sus derechos ARCO (acceso, rectificación, cancelación y oposición) sobre el tratamiento de los datos personales proporcionados, así como revocar el consentimiento otorgado en este documento, por lo cual deberá ponerse en contacto con nosotros a través del correo electrónico “info@linkaform.com”; el procedimiento y requisitos que deberá contener su solicitud de conformidad con lo dispuesto en la Ley y su Reglamento, son los siguientes:
					<br /><br />
					(1) Nombre y Domicilio, si no se incluye la dirección se dará por no recibida la solicitud. 
					(2) El documento que acredite su identidad o la personalidad de su representante (copia de identificación oficial vigente.) El representante deberá acreditar la identidad del titular, identidad del representante, y sus facultades de representación mediante instrumento público o carta poder firmada ante dos testigos, o declaración en comparecencia personal del titular; 
					(3) La descripción clara y precisa de los datos personales a los que desea acceder, rectificar, cancelar u oponerse; 
					(4) Descripción de otros elementos que faciliten la localización de sus datos personales (sitio Web, Sucursal).Los documentos deberán ser escaneados y adjuntados al correo electrónico para verificar la veracidad de los mismos.
					<br /><br />
					Para conocer el procedimiento, requisitos y plazos del ejercicio de los derechos ARCO puedes ponerte en contacto al correo electrónico info@linkform.com.
					</div>
				</div>

				<div>
					<div className="text-blue-950 text-2xl font-bold mb-2 mt-2">Modificaciones al Aviso de Privacidad</div>
					<div>
					El Responsable se reserva el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad, para la atención de novedades legislativas o jurisprudenciales, políticas internas, nuevos requerimientos para la prestación u ofrecimiento de nuestros servicios y prácticas del mercado, cualquier modificación al Aviso de Privacidad estará disponible a través de nuestro portal Web; sección “aviso de privacidad”.
					<br /><br />
					El presente Aviso de Privacidad ha sido modificado el día 05 abril del 2019.
					</div>
				</div>

				{/* <div className="flex items-center gap-2 mt-4">
						<Checkbox
							checked={radioSelected!==""}
							// eslint-disable-next-line @typescript-eslint/no-unused-expressions
							onCheckedChange={()=>{radioSelected!==""? actualizarEstados("", false) :  actualizarEstados("default", true)}}
							id="avisoPriv"
						/>
						<Label htmlFor="avisoPriv" className="text-sm text-slate-500">
						<span className="text-red-500 mr-1">*</span> 
							He leído y aceptado el{" "}
							<button
							type="button"
							onClick={() => {setShowRadioGroup(!showRadioGroup)}}
							className="text-blue-600 underline hover:text-blue-800"
							>
							aviso de privacidad sobre tus datos personales
							</button>
						</Label>
					</div> */}
				
						<div className="mt-10 mb-3">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Eliminar tus datos personales no eliminará los registros históricos donde tu nombre haya sido utilizado, 
								como visitas realizadas a alguna planta o accesos autorizados previamente. Esta información se mantiene 
								por razones de trazabilidad y cumplimiento normativo.
							</label>
							<p className="block text-sm font-medium text-gray-700 mb-2">Conservar mis datos personales durante:</p>

						<RadioGroup
							className="flex flex-col gap-2 "
							value={radioSelected}
							onValueChange={(value) => setRadioSelected(value)}
						>
							<div className="flex items-center gap-2">
							<RadioGroupItem
								className="w-4 h-4 rounded-full border border-gray-400  "
								value="1 semana"
								id="r1"
							/>
							<label htmlFor="r1" className="text-sm text-gray-700">1 semana</label>
							</div>

							<div className="flex items-center gap-2">
							<RadioGroupItem
								className="w-4 h-4 rounded-full border border-gray-400 "
								value="1 mes"
								id="r2"
							/>
							<label htmlFor="r2" className="text-sm text-gray-700">1 mes</label>
							</div>

							<div className="flex items-center gap-2">
							<RadioGroupItem
								className="w-4 h-4 rounded-full border border-gray-400 "
								value="3 meses"
								id="r3"
							/>
							<label htmlFor="r3" className="text-sm text-gray-700">3 meses</label>
							</div>

							<div className="flex items-center gap-2">
							<RadioGroupItem
								className="w-4 h-4 rounded-full border border-gray-400 "
								value="Hasta que yo los elimine manualmente"
								id="r4"
							/>
							<label htmlFor="r4" className="text-sm text-gray-700">Hasta que yo los elimine manualmente</label>
							</div>

						</RadioGroup>
					</div>
			</div>
		)
	}


return (
	<div className="p-8">
		<EntryPassModal2
				title={"Confirmación"}
				data={modalData}
				isSuccess={isSuccess}
				setIsSuccess={setIsSuccess}
				onClose={closeModal}
				passData={dataCatalogos}
			/>
		{dataCatalogos?.pass_selected?.estatus == "proceso" ? (
			<>
			<div className="flex flex-col flex-wrap space-y-5 max-w-5xl mx-auto">
				<div className="text-center">
						<h1 className="font-bold text-2xl">Pase de Entrada</h1>
				</div>
				<div className="flex flex-col space-y-5">
					{/* Nombre */}
					<div className="flex flex-col sm:flex-row justify-between gap-4">
						<div className="w-full flex gap-2">
						<p className="font-bold whitespace-nowrap">Nombre:</p>
						<p>{dataCatalogos?.pass_selected?.nombre}</p>
						</div>
					</div>

					{/* Email y Teléfono */}
					<div className="flex flex-col sm:flex-row justify-between gap-4">
						<div className="w-full flex gap-2">
						<p className="font-bold whitespace-nowrap">Email:</p>
						<p className="w-full break-words">{dataCatalogos?.pass_selected?.email}</p>
						</div>

						<div className="w-full flex gap-2">
						<p className="font-bold whitespace-nowrap">Teléfono:</p>
						<p className="text-sm">{dataCatalogos?.pass_selected?.telefono}</p>
						</div>
					</div>

					{/* Visita y Ubicación */}
					<div className="flex flex-col sm:flex-row justify-between gap-4">
						<div className="w-full flex gap-2">
						<p className="font-bold whitespace-nowrap">Visita a:</p>
						<p className="w-full break-words">
							{dataCatalogos?.pass_selected?.visita_a?.[0]?.nombre || ""}
						</p>
						</div>

						<div className="w-full flex gap-2">
						<p className="font-bold whitespace-nowrap">Ubicación:</p>
						<p className="w-full break-words">
							{dataCatalogos?.pass_selected?.ubicacion}
						</p>
						</div>
					</div>
					

					<div className="flex justify-between gap-3">
						{showIneIden?.includes("foto")&& 
							<div className="w-full md:w-1/2 pr-2">
									<LoadImage
										id="fotografia"
										titulo={"Fotografía"}
										setImg={setFotografia}
										showWebcamOption={true}
										facingMode="user" 
										imgArray={fotografia} 
										showArray={true} 
										limit={1}/>
									{fotografia.length==0 && errorFotografia !=="" && <span className="text-red-500 text-sm">{errorFotografia}</span>}
							</div>}
							{showIneIden?.includes("iden")&& <div className="w-full md:w-1/2">
									<LoadImage
									id="identificacion"
									titulo={"Identificación"}
									setImg={setIdentificacion}
									showWebcamOption={true}
									facingMode="environment" 
									imgArray={identificacion} 
									showArray={true} 
									limit={1}
									/>
									{identificacion.length==0 && errorIdentificacion !=="" && <span className="text-red-500 text-sm">{errorIdentificacion}</span>}
							</div>}
					</div> 
					<div className="flex flex-col gap-y-6">
						<div>
							<div className="flex items-center gap-x-10">
							<span className="font-bold text-xl">Lista de Vehículos</span>
							<VehiclePassModal title="Nuevo Vehiculo" vehicles={vehicles} setVehiculos={setVehiculos} isAccesos={false}>
								<button
								type="button"
								onClick={() => handleCheckboxChange("agregar-vehiculos")}
								className="px-4 py-2 rounded-md transition-all duration-300 border-2 border-blue-400 bg-transparent hover:bg-slate-100"
								>
								<div className="flex items-center gap-2">
									<div className="text-blue-600 sm:hidden text-xl font-bold">+</div>
									<Car className="text-blue-600" />
									<div className="text-blue-600 hidden sm:block">Agregar Vehículos</div>
								</div>
								</button>
							</VehiclePassModal>
							</div>
							<div className="mt-2 text-gray-600">
								
							<Accordion type="multiple" className="w-full">
								{vehicles.map((vehiculo, index) => (
									<AccordionItem key={index} value={`vehiculo-${index}`}>
									<AccordionTrigger>
										{vehiculo.tipo}
									</AccordionTrigger>
									<AccordionContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-sm">
										<p><strong>Tipo:</strong> {vehiculo.tipo}</p>
										<p><strong>Marca:</strong> {vehiculo.marca}</p>
										<p><strong>Modelo:</strong> {vehiculo.modelo}</p>
										<p><strong>Placas:</strong> {vehiculo.placas}</p>
										<p><strong>Estado:</strong> {vehiculo.estado}</p>
										<p><strong>Color:</strong> {vehiculo.color}</p>
										</div>
							
										<div className="flex justify-end px-4 pb-4">
										<Button variant="destructive" size="sm" onClick={() => handleRemove(index)}>
											Eliminar
										</Button>
										</div>
									</AccordionContent>
									</AccordionItem>
								))}
								{vehicles.length==0?(
								<div>No se han agregado vehiculos.</div>):null}
							</Accordion>
							</div>
						</div>

						<div>
							<div className="flex items-center gap-x-10">
							<span className="font-bold text-xl">Lista de Equipos</span>
							<EqipmentLocalPassModal title="Nuevo Equipo" equipos={equipos} setEquipos={setEquipos} isAccesos={false}>
								<button
								type="button"
								onClick={() => handleCheckboxChange("agregar-equipos")}
								className="px-4 py-2 rounded-md transition-all duration-300 border-2 border-blue-400 bg-transparent hover:bg-slate-100"
								>
								<div className="flex items-center gap-2">
									<div className="text-blue-600 sm:hidden text-xl font-bold">+</div>
									<Laptop className="text-blue-600" />
									<div className="text-blue-600 hidden sm:block">Agregar Equipos</div>
								</div>
								</button>
							</EqipmentLocalPassModal>
							</div>

							<div className="mt-2 text-gray-600">
							<Accordion type="multiple" className="w-full">
								{equipos.map((equipo, index) => (
									<AccordionItem key={index} value={`equipo-${index}`}>
									<AccordionTrigger>
										{equipo.tipo}
									</AccordionTrigger>
									<AccordionContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-sm">
										<p><strong>Tipo:</strong> {equipo.tipo}</p>
										<p><strong>Nombre:</strong> {equipo.nombre}</p>
										<p><strong>Marca:</strong> {equipo.marca}</p>
										<p><strong>Modelo:</strong> {equipo.modelo}</p>
										<p><strong>No. Serie:</strong> {equipo.serie}</p>
										<p><strong>Color:</strong> {equipo.color}</p>
										</div>
							
										<div className="flex justify-end px-4 pb-4">
										<Button variant="destructive" size="sm" onClick={() => handleRemoveEq(index)}>
											Eliminar
										</Button>
										</div>
									</AccordionContent>
									</AccordionItem>
								))}
								{equipos.length==0?(
								<div>No se han agregado equipos.</div>):null}
							</Accordion>
							</div>
						</div>
					</div>
				</div>

				

				<div className="flex items-center space-x-2 text-slate-500">
					
				</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> 
							<FormField
								control={form.control}
								name="acepto_aviso_privacidad"
								render={({ field }) => (
									<FormItem>
									<FormControl>
										<div className="flex items-center gap-2">
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											id="aviso"
										/>
										<Label htmlFor="aviso" className="text-sm text-slate-500">
										<span className="text-red-500 mr-1">*</span> 
											He leído y acepto el{" "}
											<button
											type="button"
											onClick={() => setMostrarAviso(true)}
											className="text-blue-600 underline hover:text-blue-800"
											>
											aviso de privacidad
											</button>
										</Label>
										</div>
									</FormControl>

									<FormMessage />
									</FormItem>
								)}
								/>

							<div className="text-center mt-10 flex justify-center">
								<Button
									className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-1/2"
									variant="secondary"
									type="submit"
								>
									Siguiente
								</Button>
							</div>
						</form>
					</Form> 
			</div>
			</>
		): (<>
		{dataCatalogos?.pass_selected?.estatus =="activo" || dataCatalogos?.pass_selected?.estatus =="vencido" ?(<>
			<div className="flex flex-col items-center justify-start  space-y-5 max-w-2xl mx-auto h-screen">
					<span className="font-bold text-3xl text-slate-800">{dataCatalogos?.pass_selected?.nombre}</span>
					<div>
						<p className="font-bold whitespace-nowrap">Visita General </p>
					</div>
					<div className="flex flex-col gap-2">
						<div className="w-full flex sm:flex-row gap-2">
							<p className="font-bold whitespace-nowrap">Visita a: </p>
							<p className="w-full break-words">{dataCatalogos?.pass_selected?.visita_a[0] ? dataCatalogos?.pass_selected?.visita_a[0]?.nombre:""}</p>
						</div>

						<div className="w-full flex  gap-2">
							<p className="font-bold whitespace-nowrap">Ubicación : </p>
							<p className="w-full break-words">{dataCatalogos?.pass_selected?.ubicacion} </p>
						</div>

						<div className="w-full flex  gap-2">
							<p className="font-bold whitespace-nowrap">Fecha : </p>
							<p className="text-sm">{dataCatalogos?.pass_selected?.fecha_de_expedicion}</p>
						</div>
					</div>
					<div className="w-full flex-col">
						{dataCatalogos?.pass_selected?.qr_pase[0]?.file_url ?
							<>
							<div className="w-full flex justify-center">
								<Image
									width={280}
									height={280}
									src={dataCatalogos?.pass_selected?.qr_pase[0]?.file_url ?? "/nouser.svg" } 
									alt="Imagen"
									className="w-42 h-42 object-contain bg-gray-200 rounded-lg" 
								/>
							</div>
							</>
						:<>
						<div className="w-full flex justify-center">
							<Image
								width={280}
								height={280}
								src={"/nouser.svg" } 
								alt="Imagen"
								className="w-42 h-42 object-contain bg-gray-200 rounded-lg" 
							/>
						</div>
						</>}
					</div>

					<div className="flex flex-col lg:flex-row gap-6">
						<button type="button" onClick={handleClickGoogleButton}>
							<Image src="/esES_add_to_google_wallet_add-wallet-badge.png" alt="Add to Google Wallet" width={150} height={150} className="mt-2" />
						</button>

						<button type="button" onClick={handleClickAppleButton}>
							<Image src="/ESMX_Add_to_Apple_Wallet_RGB_101821.svg" alt="Add to Apple Wallet" width={150} height={150} className="mt-2" />
						</button>
					</div>
				
					<div className="flex flex-col gap-2">
						<Button className="w-40 m-0 bg-yellow-500 hover:bg-yellow-600" type="submit" onClick={()=>{setEnablePdf(true)}} disabled={loadingPdf}>
						{!loadingPdf ? ("Descargar PDF"):(<><Loader2 className="animate-spin"/>Descargando PDF...</>)}
						</Button>

						<Button
						className={`w-40 m-0 ${
							isActualizarOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
						}`}
						type="button"
						onClick={() =>{
							setIsActualizarOpen(!isActualizarOpen);
						}}
						disabled={loadingDataCatalogos}
						>
						{isActualizarOpen ? "Cerrar" : "Actualizar información"}
						</Button>
					</div>

					{loadingDataCatalogos ?(
							<div className="flex justify-center items-center h-screen">
								<div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
					  		</div>
					):(
						<>
							{isActualizarOpen==true?(
							<><div className="flex flex-col items-center justify-start gap-5">
								<div className="flex flex-col sm:flex-row gap-2 ">
									<div className="flex flex-col">
										<p>Fotografia actual: </p>
										<Image
											width={180}
											height={180}
											src={dataCatalogos?.pass_selected?.foto ? dataCatalogos?.pass_selected?.foto[0]?.file_url?? "/nouser.svg":"/nouser.svg"}
											alt="Imagen"
											className="w-42 h-42 object-cover bg-gray-200 rounded-lg" />
									</div>
									<div >
										<p>Identificacion actual: </p>
										<Image
											width={180}
											height={180}
											src={dataCatalogos?.pass_selected?.identificacion ? dataCatalogos?.pass_selected?.identificacion[0]?.file_url : "/nouser.svg"}
											alt="Imagen"
											className="w-42 h-42  object-cover bg-gray-200 rounded-lg mb-2" />
									</div>
								</div>

								<div className="flex flex-col gap-y-6">
									<div>
										<div className="flex items-center gap-x-10">
										<span className="font-bold text-xl">Lista de Vehículos</span>
										<VehiclePassModal title="Nuevo Vehiculo" vehicles={vehicles} setVehiculos={setVehiculos} isAccesos={false}>
											<button
											type="button"
											onClick={() => handleCheckboxChange("agregar-vehiculos")}
											className="px-4 py-2 rounded-md transition-all duration-300 border-2 border-blue-400 bg-transparent hover:bg-slate-100"
											>
											<div className="flex items-center gap-2">
												<div className="text-blue-600 sm:hidden text-xl font-bold">+</div>
												<Car className="text-blue-600" />
												<div className="text-blue-600 hidden sm:block">Agregar Vehículos</div>
											</div>
											</button>
										</VehiclePassModal>
										</div>
										<div className="mt-2 text-gray-600">
											
										<Accordion type="multiple" className="w-full">
											{vehicles.map((vehiculo, index) => (
												<AccordionItem key={index} value={`vehiculo-${index}`}>
												<AccordionTrigger>
													{vehiculo.tipo}
												</AccordionTrigger>
												<AccordionContent>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-sm">
													<p><strong>Tipo:</strong> {vehiculo.tipo}</p>
													<p><strong>Marca:</strong> {vehiculo.marca}</p>
													<p><strong>Modelo:</strong> {vehiculo.modelo}</p>
													<p><strong>Placas:</strong> {vehiculo.placas}</p>
													<p><strong>Estado:</strong> {vehiculo.estado}</p>
													<p><strong>Color:</strong> {vehiculo.color}</p>
													</div>
										
													<div className="flex justify-end px-4 pb-4">
													<Button variant="destructive" size="sm" onClick={() => handleRemove(index)}>
														Eliminar
													</Button>
													</div>
												</AccordionContent>
												</AccordionItem>
											))}
											{vehicles.length==0?(
											<div>No se han agregado vehiculos.</div>):null}
										</Accordion>
										</div>
									</div>

									<div>
										<div className="flex items-center gap-x-10">
										<span className="font-bold text-xl">Lista de Equipos</span>
										<EqipmentLocalPassModal title="Nuevo Equipo" equipos={equipos} setEquipos={setEquipos} isAccesos={false}>
											<button
											type="button"
											onClick={() => handleCheckboxChange("agregar-equipos")}
											className="px-4 py-2 rounded-md transition-all duration-300 border-2 border-blue-400 bg-transparent hover:bg-slate-100"
											>
											<div className="flex items-center gap-2">
												<div className="text-blue-600 sm:hidden text-xl font-bold">+</div>
												<Laptop className="text-blue-600" />
												<div className="text-blue-600 hidden sm:block">Agregar Equipos</div>
											</div>
											</button>
										</EqipmentLocalPassModal>
										</div>
										<div className="mt-2 text-gray-600">
										<Accordion type="multiple" className="w-full">
											{equipos.map((equipo, index) => (
												<AccordionItem key={index} value={`equipo-${index}`}>
												<AccordionTrigger>
													{equipo.tipo}
												</AccordionTrigger>
												<AccordionContent>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-sm">
													<p><strong>Tipo:</strong> {equipo.tipo}</p>
													<p><strong>Nombre:</strong> {equipo.nombre}</p>
													<p><strong>Marca:</strong> {equipo.marca}</p>
													<p><strong>Modelo:</strong> {equipo.modelo}</p>
													<p><strong>No. Serie:</strong> {equipo.serie}</p>
													<p><strong>Color:</strong> {equipo.color}</p>
													</div>
										
													<div className="flex justify-end px-4 pb-4">
													<Button variant="destructive" size="sm" onClick={() => handleRemoveEq(index)}>
														Eliminar
													</Button>
													</div>
												</AccordionContent>
												</AccordionItem>
											))}
											{equipos.length==0?(
											<div>No se han agregado equipos.</div>):null}
										</Accordion>
										</div>
									</div>
								</div>

							
								{/* <Button className="w-1/2  bg-blue-500 hover:bg-blue-600 my-2" type="submit" onClick={SendUpdate} disabled={isLoading}>
								{!isLoading ? ("Actualizar"):(<><Loader2 className="animate-spin"/>Actualizando...</>)}
								</Button> */}

								<Button className="w-1/2  bg-blue-500 hover:bg-blue-600 my-2" type="submit" onClick={updateInfoActivePass} >
								Actualizar
								</Button>
							</div>
							
							</>
							):null}
						</>
					)}
					
			</div>
		</>):null}
		</>)}
	</div>
);
};
export default PaseUpdate;


