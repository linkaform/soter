import { useState } from "react";
import { Flag, Search } from "lucide-react";

export const ListaAreas = ({
  areas,
  onSelectArea,
  selectedAreas,
}: {
  areas: { id: string; name: string; ubicacion?: string }[];
  onSelectArea: (id: string) => void;
  selectedAreas: string[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔍 Filtrar áreas por nombre
  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 mt-4">
      {/* 🔹 Barra de búsqueda */}
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

      {/* 🔹 Lista de áreas filtradas */}
      <div className="space-y-3 mt-4 max-h-80 overflow-y-auto">
        {filteredAreas.length > 0 ? (
          filteredAreas.map((area) => {
            const isChecked = selectedAreas.includes(area.id);

            return (
              <div
                key={area.id}
                onClick={() => onSelectArea(area.id)}
                className={`flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 transition cursor-pointer ${
                  isChecked ? "bg-blue-50 border-blue-400" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Flag className="text-blue-500 mt-1 w-5 h-5" />
                  <div>
                    <div className="font-normal text-gray-800">{area.name}</div>
                    {area.ubicacion && (
                      <div className="text-sm text-gray-500">{area.ubicacion}</div>
                    )}
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onSelectArea(area.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
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
