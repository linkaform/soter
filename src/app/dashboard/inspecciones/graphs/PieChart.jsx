import React, { useRef, useEffect, useMemo } from 'react';
import Chart from 'chart.js';

const COLORS = [
  '#8cd610', '#efc600', '#e71831', '#1e90ff', '#a259f7', '#ff7f50', '#00b894', '#fdcb6e',
  '#636e72', '#00cec9', '#fd79a8', '#6c5ce7', '#fab1a0', '#0984e3', '#d35400', '#2d3436',
  '#ffb347', '#b2bec3', '#00b894', '#fdcb6e', '#e17055', '#00b8d4', '#6c5ce7', '#fd79a8',
  '#00cec9', '#fdcb6e', '#636e72', '#fab1a0', '#e17055', '#00b894', '#fdcb6e', '#636e72'
];

const PieChart = ({ values, selectedFallas, onHotelClick }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const { labels, dataValues, fallasPorHotel } = useMemo(() => {
    const hotelsArray = Array.isArray(values) ? values : [];
    const labels = [];
    const dataValues = [];
    const fallasPorHotel = [];

    hotelsArray.forEach((hotelObj) => {
      const nombre = hotelObj.hotel
        ? hotelObj.hotel.replace(/_/g, " ").toUpperCase()
        : "HOTEL";
      labels.push(nombre);

      let total = 0;
      let fallas = [];
      Object.entries(hotelObj).forEach(([key, value]) => {
        if (
          key !== "hotel" &&
          typeof value === "number" &&
          value > 0 &&
          selectedFallas &&
          selectedFallas.includes(key)
        ) {
          total += value;
          fallas.push({ key, value }); // Guarda el nombre y la cantidad
        }
      });

      // Ordena las fallas por cantidad descendente
      fallas = fallas.sort((a, b) => b.value - a.value)
        .map(f => `${f.key.replace(/_/g, " ")}: ${f.value}`);

      dataValues.push(total);
      fallasPorHotel.push(fallas);
    });

    return { labels, dataValues, fallasPorHotel };
  }, [values, selectedFallas]);

  useEffect(() => {
    // Solo intenta crear la gráfica si el canvas existe y hay datos y fallas seleccionadas
    if (
      !chartRef.current ||
      !selectedFallas ||
      selectedFallas.length === 0 ||
      !labels.length ||
      !dataValues.length
    ) {
      return;
    }

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
            backgroundColor: COLORS,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontSize: 14,
            padding: 20,
          },
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
            },
            afterBody: function(tooltipItem) {
              const idx = tooltipItem[0].index;
              const fallas = fallasPorHotel[idx] || [];
              return fallas.length > 0 ? fallas.map(f => `• ${f}`) : ["Sin fallas seleccionadas"];
            }
          }
        },
        onClick: function (evt, elements) {
          // Chart.js 2.9.4: elements es un array de elementos clickeados
          if (elements && elements.length > 0) {
            const idx = elements[0]._index;
            const hotel = labels[idx];
            if (onHotelClick) {
              onHotelClick(hotel);
            }
          }
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, dataValues, fallasPorHotel, selectedFallas, onHotelClick]);

  // SOLO renderiza el canvas si hay datos y fallas seleccionadas
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

export default PieChart;
