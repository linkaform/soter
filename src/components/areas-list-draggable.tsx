"use client"

import { Dispatch, SetStateAction, useEffect, useMemo } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2, Menu, AlertTriangle } from "lucide-react"

export type Area_rondin = {
  rondin_area: string
  geolocalizacion_area_ubicacion: {
    latitude: number
    longitude: number
  }[]
  area_tag_id: string[]
  foto_area: {
    file_name: string
    file_url: string
  }[]
}

interface AreasListProps {
  rondin: any
  areas: Area_rondin[]
  setAreas: Dispatch<SetStateAction<Area_rondin[]>>
}

export const AreasList: React.FC<AreasListProps> = ({ areas, setAreas, rondin }) => {
  useEffect(() => {
    if (rondin?.areas) {
      setAreas(rondin.areas)
    }
  }, [rondin, setAreas])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setAreas((items: any[]) => {
        const oldIndex = items.findIndex((i) => i.rondin_area === active.id)
        const newIndex = items.findIndex((i) => i.rondin_area === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const totalSinGeo = useMemo(() => {
    return areas.filter(
      (a) =>
        !a.geolocalizacion_area_ubicacion ||
        a.geolocalizacion_area_ubicacion.length === 0 ||
        a.geolocalizacion_area_ubicacion.some(
          (g) => !g.latitude || !g.longitude || g.latitude === 0 || g.longitude === 0
        )
    ).length
  }, [areas])

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={areas.map((a) => a.rondin_area)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {areas.map((item) => (
              <SortableItem
                key={item.rondin_area}
                id={item.rondin_area}
                item={item}
                setAreas={setAreas}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="text-sm text-gray-600 mt-4 text-right">
        Total de áreas sin geolocalización:{" "}
        <span className="font-semibold text-red-600">{totalSinGeo}</span>
      </div>
    </div>
  )
}

function SortableItem({
  id,
  item,
  setAreas,
}: {
  id: string
  item: Area_rondin
  setAreas: Dispatch<SetStateAction<Area_rondin[]>>
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDelete = () => {
    setAreas((prev) => prev.filter((a) => a.rondin_area !== item.rondin_area))
  }

  const sinGeo =
    !item.geolocalizacion_area_ubicacion ||
    item.geolocalizacion_area_ubicacion.length === 0 ||
    item.geolocalizacion_area_ubicacion.some(
      (g) => !g.latitude || !g.longitude || g.latitude === 0 || g.longitude === 0
    )

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between border rounded p-3 bg-white shadow-sm cursor-grab active:cursor-grabbing transition 
        ${sinGeo ? "border-red-500 bg-red-50" : "border-gray-200"}
      `}
    >
      <div>
        <p className="font-bold">{item.rondin_area}</p>
        {sinGeo ? (
          <small className="flex items-center text-red-600 mt-1">
            <AlertTriangle className="w-4 h-4 mr-1" /> Sin geolocalización
          </small>
        ) : (
          <small className="flex items-center text-gray-500 mt-1">
            <Menu className="mr-1 h-4 w-4" /> Ordenar
          </small>
        )}
      </div>

      <button
        className="text-red-600 hover:text-red-800"
        onClick={(e) => {
          e.stopPropagation()
          handleDelete()
        }}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}
