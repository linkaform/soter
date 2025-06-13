import React, { useRef, useEffect } from "react";
import Chart from "chart.js";

function getRandomColor() {
  // Genera un color pastel aleatorio
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}, 70%, 60%)`;
}

const RadarChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Filtra los que no tienen hotel
    const filteredData = data.filter(item => item.hotel);

    // 1. Obtener todas las secciones únicas
    const sectionSet = new Set();
    filteredData.forEach(item => {
      Object.keys(item.sections || {}).forEach(section => sectionSet.add(section));
    });
    const labels = Array.from(sectionSet);

    // 2. Agrupar por hotel y sumar fallas por sección
    const hotelMap = {};
    filteredData.forEach(item => {
      const hotel = item.hotel;
      if (!hotelMap[hotel]) hotelMap[hotel] = {};
      labels.forEach(section => {
        const fallas = item.sections?.[section]?.fallas || 0;
        hotelMap[hotel][section] = (hotelMap[hotel][section] || 0) + fallas;
      });
    });

    // 3. Crear datasets para Chart.js
    const datasets = Object.entries(hotelMap).map(([hotel, sectionData]) => ({
      label: hotel,
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      pointBackgroundColor: getRandomColor(),
      data: labels.map(section => sectionData[section] || 0),
      fill: true,
    }));

    // 4. Renderizar el radar chart
    const ctx = chartRef.current.getContext("2d");
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    chartInstanceRef.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        legend: { position: "top" },
        scale: {
          ticks: {
            beginAtZero: true,
            stepSize: 5,
          },
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              const hotel = data.datasets[tooltipItem.datasetIndex].label;
              const section = data.labels[tooltipItem.index];
              const value = tooltipItem.yLabel;
              return `${hotel} - ${section}: ${value} fallas`;
            },
          },
        },
      },
    });
  }, [data]);

  return (
    <div className='w-full flex justify-center'>
      <canvas ref={chartRef} width={1000} height={400} />
    </div>
  );
};

export default RadarChart;