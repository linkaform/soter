import { StartShiftModal } from '@/components/modals/start-shift-modal'
import { Button } from '@/components/ui/button'
import React from 'react'

const TurnStatus = () => {
  return (
    <div className="flex items-center flex-col md:flex-row justify-between mb-10 md:mb-5">
    <div className="flex mb-5 lg:mb-0">
      <div className="flex space-x-10">
        <div className="">
          <p>Fecha:</p>
          <p>2024-08-19</p>
        </div>

        <div className="">
          <p>Ciudad:</p>
          <p>Monterrey</p>
        </div>

        <div className="">
          <p>Estatus:</p>
          <p className="text-red-600">Cerrado</p>
        </div>
      </div>
    </div>

    <div className="">
      <StartShiftModal title="Confirmación">
        <Button className="w-[520px]  md:w-[300px] bg-button-primary hover:bg-bg-button-primary">
          Iniciar turno
        </Button>
      </StartShiftModal>
    </div>
  </div>
  )
}

export default TurnStatus
