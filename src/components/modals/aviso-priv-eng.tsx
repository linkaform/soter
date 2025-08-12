import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AvisoPrivacidadProps {
  setMostrarAviso: (mostrar: boolean) => void;
  radioSelected: string;
  setRadioSelected: (value: string) => void;
}

const AvisoPrivacidad: React.FC<AvisoPrivacidadProps> = ({
  setMostrarAviso,
  radioSelected,
  setRadioSelected,
}) => {
  const [language, setLanguage] = useState<"es" | "en">("es");

  const t = {
    es: {
      title: "Aviso de Privacidad Integral",
      responsable: "Responsable",
      responsableText: `
INFOSYNC, SAPI DE CV (en adelante, y de forma conjunta el “Responsable”) con domicilio convencional ubicado en José Maria Morelos Poniente no.177 int. 62, Colonia Monterrey Centro, Código Postal 64000, Teléfono (81) 8192‑2973, correo electrónico info@linkaform.com, estamos conscientes que usted como visitante de nuestras oficinas y/o sitio web, consumidor o potencial consumidor de nuestros productos y/o servicios tiene derecho a conocer qué información recabamos de usted y nuestras prácticas en relación con dicha información. Las condiciones contenidas en el presente son aplicables a la información que se recaba a nombre de y por el Responsable o cualquiera de sus empresas filiales o subsidiarias, por cualquier medio, incluyendo a través de o cualquier sitio web operado por el Responsable.`,
      datosPersonales: "Datos Personales",
      datosPersonalesText: `
Los datos personales que puede llegar a recabar el Responsable de forma directa o indirecta consisten en los siguientes: Los datos personales considerados como de identificación son todos los relativos a la identificación de la persona (nombre completo, dirección, teléfonos fijo y/o celular, empresa para la cual labora, huellas digitales, fecha de nacimiento, nacionalidad, lugar de nacimiento, ocupación y/o sus familiares directos). Nos comprometemos a que todos los datos obtenidos serán tratados bajo las más estrictas medidas de seguridad que garanticen su confidencialidad.`,
      finalidades: "Finalidades",
      finalidadesText: `
La finalidad principal para las que recabamos sus datos tiene por objeto ofrecer nuestros servicios y productos, dar acceso a la plataforma y atención a clientes, cumpliendo con los estándares mediante los procesos internos para asegurar la calidad y seguridad del cliente en nuestras instalaciones.

Las finalidades secundarias para las que recabamos sus datos son: facturación, cobranza, informarle sobre nuevos productos, servicios o cambios en los mismos, mensajes promocionales; evaluar la calidad del servicio; cumplir con las obligaciones derivadas de la prestación del servicio; cumplir con la legislación aplicable vigente; contestar requerimientos de información de cualquier autoridad, ya sea por investigaciones, estadísticas o reportes normativos; atender a sus comentarios relacionados con la prestación de servicios; enviar avisos e información de nuestros servicios; y coadyuvar con el proceso de mejora continua.`,
      transferencias: "Transferencias y encargados de datos personales",
      transferenciasText: `
Asimismo, le informamos que sus datos personales podrán ser transferidos a terceros y podrán ser compartidos a encargados para su tratamiento dentro y fuera del país, por personas distintas al Responsable, quien girará las instrucciones para su tratamiento. En ese sentido, su información puede ser transferida o compartida con:

(i) Diversos profesionales, técnicos y auxiliares..., (vii) Todas aquellas dependencias gubernamentales y/o judiciales... Si usted no manifiesta su oposición para que sus datos personales sean transferidos, se entenderá que ha otorgado su consentimiento para ello. El Responsable informa que todos los contratos de prestación de servicios con terceros que impliquen el tratamiento de su información personal... cumplirán la Ley Federal de Protección de Datos Personales en Posesión de Particulares.`,
      derechos: "Derechos ARCO",
      derechosText: `
En el momento que lo estime oportuno podrá ejercer sus derechos ARCO (acceso, rectificación, cancelación y oposición)... deberá ponerse en contacto con nosotros a través del correo electrónico “info@linkaform.com”; el procedimiento y requisitos... son los siguientes:
(1) Nombre y Domicilio... (4) Descripción de otros elementos... Para conocer el procedimiento, requisitos y plazos... info@linkform.com.`,
      modificaciones: "Modificaciones al Aviso de Privacidad",
      modificacionesText: `
El Responsable se reserva el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad... cualquier modificación al Aviso de Privacidad estará disponible a través de nuestro portal Web; sección “aviso de privacidad”.

El presente Aviso de Privacidad ha sido modificado el día 05 abril del 2019.`,
      deleteNote: `Eliminar tus datos personales no eliminará los registros históricos donde tu nombre haya sido utilizado, como visitas realizadas a alguna planta o accesos autorizados previamente. Esta información se mantiene por razones de trazabilidad y cumplimiento normativo.`,
      conservar: "Conservar mis datos personales durante:",
      opciones: ["1 semana", "1 mes", "3 meses", "Hasta que yo los elimine manualmente"],
    },
    en: {
      title: "Integral Privacy Notice",
      responsable: "Controller",
      responsableText: `
INFOSYNC, SAPI DE CV (hereinafter jointly referred to as the "Controller") with conventional address at José Maria Morelos Poniente no. 177 int. 62, Monterrey Centro, Postal Code 64000, Phone (81) 8192‑2973, email info@linkaform.com, hereby informs you, as a visitor to our offices and/or website, consumer or potential consumer of our products and/or services, that you have the right to know what information we collect about you and our practices regarding such information. The terms herein apply to information collected in the name of and by the Controller or any of its affiliate or subsidiary companies, by any means, including through or any website operated by the Controller.`,
      datosPersonales: "Personal Data",
      datosPersonalesText: `
The personal data that the Controller may collect, directly or indirectly, includes the following: Identification personal data are all data related to the identification of the person (full name, address, landline and/or mobile phone numbers, employer, fingerprints, date of birth, nationality, place of birth, occupation and/or direct relatives). We commit to treat all obtained data under the strictest security measures that ensure its confidentiality.`,
      finalidades: "Purposes",
      finalidadesText: `
The main purpose for which we collect your data is to offer our services and products, provide access to the platform, and customer service, complying with internal standards to ensure quality and security in our facilities.

Secondary purposes include: billing, collection, informing about new products or service changes, promotional messages; evaluating service quality; fulfilling obligations from service provision; complying with applicable laws; responding to authority requests for information, whether for investigations, statistics or regulatory reports; handling your comments regarding service provision; sending notices and information about our services; and supporting continuous improvement processes.`,
      transferencias: "Transfers and Data Processors",
      transferenciasText: `
We also inform you that your personal data might be transferred to third parties and data processors for handling, inside and outside the country, by persons other than the Controller, following its instructions. In that regard, your information may be transferred or shared with:

(i) Various professionals, technicians, and auxiliary personnel..., (vii) All governmental and/or judicial bodies required by law... If you do not express your opposition to the transfer of your personal data, it will be understood that you have given your consent. The Controller informs that all service contracts with third parties involving processing of your personal data will include a clause ensuring they provide an adequate level of data protection, in accordance with applicable law.`,
      derechos: "ARCO Rights",
      derechosText: `
At any time you deem appropriate, you may exercise your ARCO rights (access, rectification, cancellation, and opposition) regarding the processing of the personal data provided, as well as revoke your consent. To do so, you must contact us at “info@linkaform.com”; the request must meet the following requirements:
(1) Name and Address... (4) Description of other elements... For procedures, requirements, and deadlines, contact info@linkform.com.`,
      modificaciones: "Privacy Notice Modifications",
      modificacionesText: `
The Controller reserves the right to make modifications or updates to this privacy notice at any time to comply with legislative or jurisprudential changes, internal policies, or market practices. Any modification will be available on our website; “privacy notice” section.

This Privacy Notice was last modified on April 5, 2019.`,
      deleteNote: `Deleting your personal data will not delete historical records where your name has been used, such as visits to a facility or previously authorized accesses. This information is kept for traceability and regulatory compliance.`,
      conservar: "Keep my personal data for:",
      opciones: ["1 week", "1 month", "3 months", "Until I delete them manually"],
    },
  }[language];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-end ">
        <select
          className="border rounded px-2 py-1 text-md"
          value={language}
          onChange={(e) => setLanguage(e.target.value as "es" | "en")}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="flex gap-3 mt-6 items-center">
        <ArrowLeft
          className="text-black w-8 h-8 cursor-pointer"
          onClick={() => setMostrarAviso(false)}
        />
        <div className="flex w-full justify-center">
          <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        </div>
      </div>

      {/* Secciones dinámicas */}
      <section>
        <h2 className="text-blue-950 text-2xl font-bold mt-4">{t.responsable}</h2>
        <p className="whitespace-pre-line">{t.responsableText}</p>
      </section>

      <section>
        <h2 className="text-blue-950 text-2xl font-bold mt-4">{t.datosPersonales}</h2>
        <p className="whitespace-pre-line">{t.datosPersonalesText}</p>
      </section>

      <section>
        <h2 className="text-blue-950 text-2xl font-bold mt-4">{t.finalidades}</h2>
        <p className="whitespace-pre-line">{t.finalidadesText}</p>
      </section>

      <section>
        <h2 className="text-blue-950 text-2xl font-bold mt-4">{t.transferencias}</h2>
        <p className="whitespace-pre-line">{t.transferenciasText}</p>
      </section>

      <section>
        <h2 className="text-blue-950 text-2xl font-bold mt-4">{t.derechos}</h2>
        <p className="whitespace-pre-line">{t.derechosText}</p>
      </section>

      <section>
        <h2 className="text-blue-950 text-2xl font-bold mt-4">{t.modificaciones}</h2>
        <p className="whitespace-pre-line">{t.modificacionesText}</p>
      </section>

      <div className="mt-10 mb-3">
        <p className="block text-sm font-medium text-gray-700 mb-1">{t.deleteNote}</p>
        <p className="block text-sm font-medium text-gray-700 mb-1">{t.conservar}</p>

        <RadioGroup
          className="flex flex-col gap-2"
          value={radioSelected}
          onValueChange={(value) => setRadioSelected(value)}
        >
          {t.opciones.map((op, i) => (
            <div key={i} className="flex items-center gap-2">
              <RadioGroupItem
                className="w-4 h-4 rounded-full border border-gray-400"
                value={op}
                id={`r${i}`}
              />
              <label htmlFor={`r${i}`} className="text-sm text-gray-700">
                {op}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default AvisoPrivacidad;
