import { ChangeBoothModal } from '@/components/modals/change-booth-modal'
import { ForceExitModal } from '@/components/modals/force-exit-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

const Sidebar = () => {


 

  return (
    <div className="max-w-[520px]  lg:max-w-[320px] mx-auto">
    <div className="flex  flex-col space-y-5 mb-10 ">
      <Avatar className="w-32 h-32 mx-auto">
        <AvatarImage
          width="300"
          height="300"
          src="/image/sidebar.png"
          alt="Avatar"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="">
        <p className="font-bold text-2xl">Emiliano Zapata</p>
        <p className="">Guardia líder</p>
        <p className="">seguridad@linkaform.com</p>
      </div>

      <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700">
        Cambiar Imagen
      </Button>

  

    </div>

    <div className="flex flex-col space-y-5 mb-10">
      <div className="flex">
        <div className="w-full">
          <p>Ubicación:</p>
          <p>Planta Monterrey</p>
        </div>

        <div className="w-full">
          <p>Ciudad:</p>
          <p>Monterrey</p>
        </div>
      </div>

      <div className="flex">
        <div className="w-full">
          <p>Estado:</p>
          <p>Nuevo León</p>
        </div>

        <div className="w-full">
          <p>Dirección:</p>
          <p># 4321</p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="w-full">
          <p>Caseta:</p>
          <p>Caseta Principal</p>
        </div>
      </div>

      <ChangeBoothModal title="Cambiar caseta">
        <Button className="w-full  bg-blue-500 text-white hover:bg-blue-600">
          Cambiar Caseta
        </Button>
      </ChangeBoothModal>
    </div>
    <div className="flex  flex-col space-y-5 mb-10">
      <div className="">
        <p>Estatus de la caseta:</p>
        <p className="text-red-600">Ocupado</p>
      </div>

      <div className="">
        <p>Guardia en turno:</p>
        <p className="">Jacinto Martínez Sánchez</p>
      </div>

      <div className="">
        <p>Fecha de inicio de turno:</p>
        <div className="flex justify-between">
          <p className="">04/09/2024</p>

          <p className="">11:25:12 hrs</p>
        </div>
      </div>

      <ForceExitModal title="Confirmación">
        <Button className="w-full bg-red-500 text-white hover:bg-red-600">
          Forzar Salida
        </Button>
      </ForceExitModal>
    </div>
  </div>
  )
}

export default Sidebar