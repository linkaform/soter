import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 156) + 100;
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
};

const BubbleChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const minFallas = data && data.length > 0 ? Math.min(...data.map(item => item.total_fallas)) : 0;
  const maxFallas = data && data.length > 0 ? Math.max(...data.map(item => item.total_fallas)) : 0;

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const hotelColorMap = {};
    const datasetsByHotel = {};

    data?.forEach((item) => {
      const { hotel, habitacion, total_fallas, grade } = item;

      // Extraer número de habitación (ej: "Habitacion 206" => 206)
      const match = habitacion.match(/(\d{2,4})/);
      let piso = 0;
      if (match) {
        const numeroHabitacion = match[1];
        piso = numeroHabitacion.length === 3
          ? Number(numeroHabitacion[0])
          : Number(numeroHabitacion.slice(0, numeroHabitacion.length - 2));
      }

      // Desplazamiento aleatorio pequeño para dispersar burbujas en el eje Y
      const offset = (Math.random() - 0.5) * 0.8;

      if (!hotelColorMap[hotel]) {
        hotelColorMap[hotel] = getRandomColor();
        datasetsByHotel[hotel] = [];
      }

      datasetsByHotel[hotel].push({
        x: total_fallas,      // Ahora las fallas están en el eje X
        y: piso + offset,     // Piso en el eje Y
        r: Math.max(5, (grade ?? 0) * 20), // <-- Aquí el cambio
        label: habitacion,
        total_fallas,
        grade,
      });
    });

    const datasets = Object.entries(datasetsByHotel).map(([hotel, points]) => ({
      label: hotel,
      backgroundColor: hotelColorMap[hotel],
      data: points,
    }));

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bubble',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'top',
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const point = dataset.data[tooltipItem.index];
              return [
                `Habitación: ${point.label}`,
                `Hotel: ${dataset.label}`,
                `Calificación: ${typeof point.grade === "number" ? (point.grade * 100).toFixed(1) : "N/A"}`,
                `Fallas: ${point.total_fallas}`,
              ];
            },
          },
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Total de fallas',
            },
            ticks: {
              max: maxFallas + 20,
              min: minFallas,
              stepSize: 20,
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Piso',
            },
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          }],
        },
      },
    });
  }, [data, minFallas, maxFallas]);

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default BubbleChart;
