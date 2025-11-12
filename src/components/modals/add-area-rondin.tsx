import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../ui/dialog"
  import { useState, useEffect, Dispatch, SetStateAction } from "react"
  import { Button } from "../ui/button"
  import { useShiftStore } from "@/store/useShiftStore"
  import { ListaAreas } from "../areas-list-rondines"
  import { Area_rondin } from "../areas-list-draggable"
import { useCatalogAreasRondinFormatted } from "@/hooks/Rondines/useCatalogoAreaRondinFormatted"
  
  interface AreaModalProps {
    title: string
    children: React.ReactNode
    points: Area_rondin[]
    setAreas : Dispatch<SetStateAction<Area_rondin[]>>
    setNuevasAreasSeleccionadas : Dispatch<SetStateAction<Area_rondin[]>>
  }
  
  export const AreasModal: React.FC<AreaModalProps> = ({
    title,
    children,
    points,
    setAreas,
    setNuevasAreasSeleccionadas
  }) => {
    const [isOpenModal, setOpenModal] = useState(false)
    const [selectedAreas, setSelectedAreas] = useState<string[]>([])
    const { location } = useShiftStore()
  
    const { data, isLoading, refetch } = useCatalogAreasRondinFormatted(location, isOpenModal)

    useEffect(() => {
      if (isOpenModal) {
        refetch?.()
      }
    }, [isOpenModal, refetch])
  
    const areasEnUso = points?.map((point) => point.rondin_area)

    const areasDisponibles = data?.filter(
      (area: any) => !areasEnUso.includes(area?.rondin_area)
    )

    function onAgregar() {
      if (!data) return;
      const seleccionadas = data.filter((area: any) =>
        selectedAreas.includes(area?.area_tag_id[0])
      );
    
      const areasParaAgregar = seleccionadas.map((area: any) => ({
        rondin_area: area?.rondin_area || "",
        area_tag_id: area?.area_tag_id || [],
        geolocalizacion_area_ubicacion: area?.geolocalizacion_area_ubicacion || [],
        foto_area: area?.foto_area || []
      }));
    
      setAreas((prev: any) => {
        const prevIds = new Set(prev.map((a: any) => a.area_tag_id[0]));
        const nuevas = areasParaAgregar.filter((a: { area_tag_id: unknown[] }) => !prevIds.has(a.area_tag_id[0]));
        return [...prev, ...nuevas];
      });
    
      setNuevasAreasSeleccionadas(areasParaAgregar);
      setOpenModal(false);
      setSelectedAreas([]);
    }
    
    return (
      <Dialog open={isOpenModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>{children}</DialogTrigger>
  
        <DialogContent className="max-w-xl flex flex-col w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center font-bold">
              {title}
            </DialogTitle>
          </DialogHeader>
  
          {isLoading || !data ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <div className="w-16 h-16 border-8 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Cargando áreas...</p>
            </div>
          ) : areasDisponibles?.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
              No hay áreas disponibles
            </div>
          ) : (
            <ListaAreas
              areas={areasDisponibles}
              onSelectArea={(rondin_area) =>
                setSelectedAreas((prev) =>
                  prev.includes(rondin_area)
                    ? prev.filter((a) => a !== rondin_area)
                    : [...prev, rondin_area]
                )
              }
              selectedAreas={selectedAreas}
            />
          )}
  
          <div className="flex flex-between gap-2 mt-4">
            <Button
              className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              onClick={() => setOpenModal(false)}
            >
              Cerrar
            </Button>
            <Button
              onClick={onAgregar}
              disabled={selectedAreas.length === 0}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Agregar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  