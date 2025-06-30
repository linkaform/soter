import React, { useRef, useEffect, useMemo } from 'react';
import Chart from 'chart.js';

const COLORS = ['#8cd610', '#efc600', '#e71831', '#1e90ff'];

const MultiLineChart = ({ data = [] }) => {
  // Siempre mostrar C1, C2, C3
  const cuatriLabels = useMemo(() => ['C1', 'C2', 'C3'], []);

  // Si quieres mostrar el año, puedes ajustar aquí
  // const year = cuatris[0]?.anio || new Date().getFullYear();

  // Construir datasets asegurando que cada cuatrimestre tenga un valor (0 si no hay dato)
  const datasets = useMemo(() => {
    const cuatriIds = [1, 2, 3];
    return data.map((hotel, idx) => {
      // Mapea cuatrimestres a un objeto para acceso rápido
      const cuatriMap = {};
      hotel.cuatrimestres.forEach(c => {
        cuatriMap[c.cuatrimestre] = c;
      });

      // Para cada cuatrimestre esperado, toma el valor o 0
      const dataPoints = cuatriIds.map(id =>
        cuatriMap[id] ? parseFloat(cuatriMap[id].promedio) : 0
      );

      return {
        label: hotel.hotel.replace(/_/g, ' ').toUpperCase(),
        data: dataPoints,
        borderColor: COLORS[idx] || `hsl(${(idx * 360 / data.length)}, 70%, 50%)`,
        fill: false,
        lineTension: 0,
      };
    });
  }, [data]);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: cuatriLabels,
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 100,
              stepSize: 10,
              callback: (value) => value + '%',
            },
            scaleLabel: {
              display: true,
              labelString: 'Porcentaje',
            },
            gridLines: {
              drawOnChartArea: false,
              drawBorder: true,
            },
          }],
          xAxes: [{
            offset: true,
            scaleLabel: {
              display: true,
              labelString: 'Cuatrimestres',
            },
            gridLines: {
              drawOnChartArea: false,
              drawBorder: true,
            },
            ticks: {
              padding: 10,
            },
          }],
        },
        legend: {
          display: true,
          position: 'bottom',
        },
        elements: {
          line: {
            tension: 0,
          },
          point: {
            radius: 4,
            hoverRadius: 6,
          },
        },
      },
    });

    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [datasets, cuatriLabels]);

  return (
    <div className='w-full flex justify-center'>
      <canvas ref={chartRef} width={1000} height={400} />
    </div>
  );
};

export default MultiLineChart;
