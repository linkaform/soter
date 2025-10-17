import React, { useRef, useEffect, useMemo } from 'react';
import Chart from 'chart.js';

// Paleta de colores primarios/secundarios bien diferenciados
const BASE_COLORS = [
  '#e74c3c', // rojo
  '#3498db', // azul
  '#2ecc71', // verde
  '#f1c40f', // amarillo
  '#9b59b6', // morado
  '#e67e22', // naranja
  '#1abc9c', // turquesa
  '#34495e', // azul oscuro
  '#fd79a8', // rosa
  '#00b894', // verde claro
  '#fdcb6e', // mostaza
  '#636e72', // gris
];

// Genera una paleta de N colores, repitiendo pero desfasando para que no estén pegados
function getColorPalette(n) {
  const palette = [];
  for (let i = 0; i < n; i++) {
    // El truco: saltar de 2 en 2 para evitar colores pegados
    const idx = (i * 2) % BASE_COLORS.length + Math.floor((i * 2) / BASE_COLORS.length);
    palette.push(BASE_COLORS[idx % BASE_COLORS.length]);
  }
  return palette;
}

const PieChartFallas = ({ values, selectedFallas, onHotelClick }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Solo toma el primer hotel (o el único)
  const { labels, dataValues, hotelName } = useMemo(() => {
    const hotelsArray = Array.isArray(values) ? values : [];
    if (!hotelsArray.length) return { labels: [], dataValues: [], hotelName: "" };

    const hotelObj = hotelsArray[0];
    const fallas = [];

    Object.entries(hotelObj).forEach(([key, value]) => {
      if (
        key !== "hotel" &&
        typeof value === "number" &&
        value > 0 &&
        selectedFallas &&
        selectedFallas.includes(key)
      ) {
        fallas.push({ key, value });
      }
    });

    // Ordena descendente
    const sortedFallas = fallas.sort((a, b) => b.value - a.value);

    return {
      labels: sortedFallas.map(f => f.key.replace(/_/g, " ")),
      dataValues: sortedFallas.map(f => f.value),
      hotelName: hotelObj.hotel
        ? hotelObj.hotel.replace(/_/g, " ").toUpperCase()
        : "",
    };
  }, [values, selectedFallas]);

  const colorPalette = useMemo(() => {
    return getColorPalette(dataValues.length);
  }, [dataValues.length]);

  useEffect(() => {
    if (!chartRef.current || !labels.length || !dataValues.length) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: colorPalette,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              const idx = tooltipItem[0].index;
              return data.labels[idx];
            },
            label: function(tooltipItem, data) {
              const value = data.datasets[0].data[tooltipItem.index];
              return `Total: ${value}`;
            }
          }
        },
        onClick: function (evt, elements) {
          if (elements && elements.length > 0 && onHotelClick) {
            // Chart.js 2.x: el índice del segmento clickeado
            const idx = elements[0]._index;
            onHotelClick(hotelName, idx); // puedes pasar el índice si lo necesitas
          }
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, dataValues, colorPalette, hotelName, onHotelClick]);

  if (!selectedFallas || selectedFallas.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center text-gray-400">
        Selecciona una o más fallas para visualizar la gráfica.
      </div>
    );
  }
  if (!labels.length || !dataValues.length) {
    return (
      <div className="w-full h-full flex justify-center items-center text-gray-400">
        No hay datos para las fallas seleccionadas.
      </div>
    );
  }

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <canvas ref={chartRef} width={1000} height={569} />
    </div>
  );
};

export default PieChartFallas;