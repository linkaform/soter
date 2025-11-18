import { useState } from "react";
import { Flag, Search, AlertTriangle } from "lucide-react";
import { Area_rondin } from "./areas-list-draggable";

export const ListaAreas = ({
  areas,
  onSelectArea,
  selectedAreas,
}: {
  areas: Area_rondin[];
  onSelectArea: (id: string) => void;
  selectedAreas: string[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredAreas = areas.filter((area) =>
    area?.rondin_area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white shadow-sm">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar área..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none text-sm text-gray-700"
        />
      </div>

      <div className="space-y-3 mt-4 max-h-80 overflow-y-auto">
        {filteredAreas.length > 0 ? (
          filteredAreas.map((area) => {
            const isChecked = selectedAreas.includes(area?.area_tag_id[0]);

            const geo = area?.geolocalizacion_area_ubicacion;
            const sinGeo =
              !geo?.length ||
              geo[0]?.latitude === 0 ||
              geo[0]?.longitude === 0 ||
              geo[0]?.latitude == null ||
              geo[0]?.longitude == null;

            return (
              <div
                key={area?.area_tag_id[0]}
                onClick={() => onSelectArea(area?.area_tag_id[0])}
                className={`flex flex-col border rounded-lg p-3 hover:bg-gray-50 transition cursor-pointer ${
                  isChecked ? "bg-blue-50 border-blue-400" : "border-gray-200"
                } ${sinGeo ? "border-red-400" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Flag className="text-blue-500 mt-1 w-5 h-5" />
                    <div>
                      <div className="font-normal text-gray-800">
                        {area?.rondin_area}
                      </div>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onSelectArea(area?.area_tag_id[0])}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </div>

                {sinGeo && (
                  <div className="flex items-center gap-1 text-xs text-red-500 mt-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Sin geolocalización disponible</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 text-sm text-center py-4">
            No se encontraron áreas.
          </div>
        )}
      </div>
    </div>
  );
};
