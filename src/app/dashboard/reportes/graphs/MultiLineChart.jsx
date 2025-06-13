import React, { useRef, useEffect, useMemo } from 'react';
import Chart from 'chart.js';

const COLORS = ['#8cd610', '#efc600', '#e71831', '#1e90ff'];

const MultiLineChart = ({ data = [], cuatris = [] }) => {

  function getColor(idx, total) {
    return `hsl(${(idx * 360 / total)}, 70%, 50%)`;
  }

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const labels = useMemo(
    () => cuatris.length === 0
      ? ['C1', 'C2', 'C3']
      : cuatris
          .map(c => c.id)
          .sort((a, b) => Number(a) - Number(b)),
    [cuatris]
  );

  const datasets = useMemo(() =>
    data.map((hotel, idx) => ({
      label: hotel.hotel.replace(/_/g, ' ').toUpperCase(),
      data: hotel.cuatrimestres.map(c => parseInt(c.max, 10)),
      borderColor: COLORS[idx] || getColor(idx, data.length),
      fill: false,
      lineTension: 0,
    })), [data]
  );

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
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
  }, [labels, datasets]);

  return (
    <div className='w-full flex justify-center'>
      <canvas ref={chartRef} width={1000} height={400} />
    </div>
  );
};

export default MultiLineChart;
