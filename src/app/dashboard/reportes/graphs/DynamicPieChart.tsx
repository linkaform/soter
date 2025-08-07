import React, { useRef, useEffect, useMemo, useState } from 'react';
// @ts-expect-error - Chart.js versión antigua sin tipos
import Chart from 'chart.js';

// ✅ Definir interfaces para TypeScript
interface PieChartDataItem {
  state: string;
  total_fallas: number;
  fallas: Array<{
    id: string;
    label: string;
    total: number;
  }>;
}

interface ClickData {
  index: number;
  label: string;
  value: number;
  data: any;
  isMultiState: boolean;
}

interface DynamicPieChartProps {
  pieChartData: PieChartDataItem[] | null;
  selectedCategories: string[];
  statesCount: number;
  onSegmentClick?: (clickData: ClickData) => void;
}

interface LegendItem {
  text: string;
  value: number;
  percentage: string;
  color: string;
  index: number;
}

// Paleta de colores diferenciados
const BASE_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22',
  '#1abc9c', '#34495e', '#fd79a8', '#00b894', '#fdcb6e', '#636e72',
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd',
  '#98d8c8', '#f7dc6f'
];

// Genera paleta evitando colores pegados
function getColorPalette(n: number): string[] {
  const palette: string[] = [];
  for (let i = 0; i < n; i++) {
    const idx = (i * 3) % BASE_COLORS.length;
    palette.push(BASE_COLORS[idx]);
  }
  return palette;
}

const DynamicPieChart: React.FC<DynamicPieChartProps> = ({
  pieChartData,
  selectedCategories = [],
  onSegmentClick,
  statesCount = 0
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [legendItems, setLegendItems] = useState<LegendItem[]>([]);

  const { labels, dataValues, chartTitle, tooltipData } = useMemo(() => {
    if (!pieChartData || !Array.isArray(pieChartData) || pieChartData.length === 0) {
      return { labels: [], dataValues: [], chartTitle: "", tooltipData: [] };
    }

    // Decidir el modo según la cantidad de estados
    const isMultiState = statesCount > 1;

    if (isMultiState) {
      // MODO MULTI-ESTADO: Mostrar por estados
      const labels = pieChartData.map(item => item.state || 'Estado Desconocido');
      const dataValues = pieChartData.map(item => item.total_fallas || 0);
      const tooltipData = pieChartData.map(item => ({
        state: item.state,
        totalFallas: item.total_fallas,
        fallasDetalle: item.fallas || []
      }));

      return {
        labels,
        dataValues,
        chartTitle: `Distribución de Fallas por Estado (${statesCount} estados)`,
        tooltipData
      };
    } else {
      // MODO SINGLE-ESTADO: Mostrar por tipos de fallas
      const estadoData = pieChartData[0];
      const fallas = estadoData?.fallas || [];

      // Filtrar solo las fallas seleccionadas
      const fallasFiltradas = fallas.filter(falla =>
        selectedCategories.includes(falla.id)
      );

      // Ordenar por total descendente
      const fallasOrdenadas = fallasFiltradas.sort((a, b) => (b.total || 0) - (a.total || 0));

      const labels = fallasOrdenadas.map(falla =>
        (falla.label || 'Falla Desconocida').substring(0, 50) + '...'
      );
      const dataValues = fallasOrdenadas.map(falla => falla.total || 0);
      const tooltipData = fallasOrdenadas.map(falla => ({
        id: falla.id,
        label: falla.label,
        total: falla.total
      }));

      return {
        labels,
        dataValues,
        chartTitle: `Distribución de Fallas en ${estadoData?.state || 'Estado'} (${fallasFiltradas.length} tipos)`,
        tooltipData
      };
    }
  }, [pieChartData, selectedCategories, statesCount]);

  const colorPalette = useMemo(() => {
    return getColorPalette(dataValues.length);
  }, [dataValues.length]);

  // Crear elementos de leyenda personalizados
  useEffect(() => {
    if (labels.length && dataValues.length) {
      const total = dataValues.reduce((a, b) => a + b, 0);
      const items: LegendItem[] = labels.map((label, i) => {
        const value = dataValues[i];
        const percentage = ((value / total) * 100).toFixed(1);
        return {
          text: label,
          value: value,
          percentage: percentage,
          color: colorPalette[i],
          index: i
        };
      });
      setLegendItems(items);
    } else {
      setLegendItems([]);
    }
  }, [labels, dataValues, colorPalette]);

  useEffect(() => {
    if (!chartRef.current || !labels.length || !dataValues.length) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: colorPalette,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3,
            hoverBorderColor: '#333333',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: true,
          mode: 'index',
          callbacks: {
            title: function (tooltipItem: any) {
              const idx = tooltipItem[0].index;
              const tooltip = tooltipData[idx];

              if (statesCount > 1) {
                return (tooltip && 'state' in tooltip) ? tooltip.state : 'Estado';
              } else {
                return (tooltip && 'label' in tooltip) ? tooltip.label : 'Falla';
              }
            },
            label: function (tooltipItem: any, data: any) {
              const value = data.datasets[0].data[tooltipItem.index];
              const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);

              return `Total: ${value} (${percentage}%)`;
            },
            afterBody: function (tooltipItem: any) {
              const idx = tooltipItem[0].index;
              const tooltip = tooltipData[idx];

              if (statesCount > 1) {
                let fallas: Array<{ id: string; label: string; total: number }> = [];
                if (tooltip && 'fallasDetalle' in tooltip && Array.isArray(tooltip.fallasDetalle)) {
                  fallas = tooltip.fallasDetalle;
                }
                const topFallas = fallas
                  .sort((a: any, b: any) => (b.total || 0) - (a.total || 0))
                  .slice(0, 3)
                  .map((f: any) => `• ${(f.label || 'Falla').substring(0, 40)}...: ${f.total}`);

                return topFallas.length > 0 ?
                  ['Top 3 fallas:', ...topFallas] :
                  ['Sin detalles de fallas'];
              } else {
                return [
                  `ID: ${tooltip && 'id' in tooltip && typeof tooltip.id === 'string'
                    ? tooltip.id.substring(0, 8)
                    : 'N/A'
                  }`
                ];
              }
            }
          }
        },
        onClick: function (evt: any, elements: any) {
          if (elements && elements.length > 0 && onSegmentClick) {
            const idx = elements[0]._index;
            const clickedData = tooltipData[idx];

            onSegmentClick({
              index: idx,
              label: labels[idx],
              value: dataValues[idx],
              data: clickedData,
              isMultiState: statesCount > 1
            });
          }
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, dataValues, colorPalette, tooltipData, statesCount, onSegmentClick]);

  // Función para manejar click en leyenda personalizada
  const handleLegendClick = (index: number) => {
    if (chartInstanceRef.current && onSegmentClick) {
      const clickedData = tooltipData[index];
      onSegmentClick({
        index,
        label: labels[index],
        value: dataValues[index],
        data: clickedData,
        isMultiState: statesCount > 1
      });
    }
  };

  // Validaciones para mostrar mensajes
  if (!selectedCategories.length && statesCount <= 1) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-gray-400">
        <div className="text-xl mb-2">📊 Selecciona fallas para visualizar</div>
        <div className="text-sm">Elige una o más fallas del panel izquierdo</div>
      </div>
    );
  }

  if (!labels.length || !dataValues.length) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-gray-400">
        <div className="text-xl mb-2">📈 Sin datos disponibles</div>
        <div className="text-sm">
          {statesCount > 1 ?
            'No hay datos de fallas para los estados seleccionados' :
            'No hay datos para las fallas seleccionadas'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Título del gráfico */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{chartTitle}</h3>
        <div className="text-sm text-gray-500">
          {statesCount > 1 ?
            `Total de ${dataValues.reduce((a, b) => a + b, 0)} fallas` :
            `${dataValues.length} tipos de fallas seleccionadas`
          }
        </div>
      </div>

      {/* Contenedor principal: Gráfico + Leyenda */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Contenedor del gráfico */}
        <div className="flex-1 relative min-h-0">
          <canvas ref={chartRef} />
        </div>

        {/* Leyenda personalizada con scroll */}
        <div className="w-80 flex flex-col">
          <div className="text-sm font-medium text-gray-700 mb-2 px-2">
            Leyenda ({legendItems.length} elementos)
          </div>
          <div className="flex-1 border rounded-lg bg-gray-50 overflow-hidden">
            <div className="h-full overflow-y-auto p-2 space-y-1">
              {legendItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors duration-200 text-xs"
                  onClick={() => handleLegendClick(index)}
                  title={
                    (tooltipData[index] && 'label' in tooltipData[index] && typeof (tooltipData[index] as any).label === 'string')
                      ? (tooltipData[index] as { label: string }).label
                      : item.text
                  }
                >
                  {/* Indicador de color */}
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 border border-gray-300"
                    style={{ backgroundColor: item.color }}
                  />

                  {/* Texto de la leyenda */}
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-gray-800">
                      {statesCount > 1
                        ? item.text
                        : ((tooltipData[index] && 'label' in tooltipData[index] && typeof (tooltipData[index] as any).label === 'string')
                          ? (tooltipData[index] as { label: string }).label
                          : item.text
                        ).substring(0, 40) + '...'}
                    </div>
                    <div className="text-gray-500">
                      {item.value} ({item.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer de la leyenda */}
          {legendItems.length > 10 && (
            <div className="text-xs text-gray-500 mt-2 px-2">
              💡 Usa scroll para ver más elementos
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicPieChart;