import React, { useRef, useEffect, useMemo } from 'react';
import Chart from 'chart.js';

const COLORS = ['#8cd610', '#efc600', '#e71831', '#1e90ff'];

const getQuarterInfo = () => {
  const date = new Date();
  const month = date.getMonth(); // 0-11
  let currentQuarter;

  if (month <= 3) currentQuarter = 1;
  else if (month <= 7) currentQuarter = 2;
  else currentQuarter = 3;

  let labels, ids;
  if (currentQuarter === 1) {
    ids = [2, 3, 1];
    labels = ['C2', 'C3', 'C1'];
  } else if (currentQuarter === 2) {
    ids = [3, 1, 2];
    labels = ['C3', 'C1', 'C2'];
  } else {
    ids = [1, 2, 3];
    labels = ['C1', 'C2', 'C3'];
  }
  return { ids, labels };
};

const MultiLineChart = ({ data = [] }) => {
  const { labels: cuatriLabels, ids: cuatriIds } = useMemo(() => getQuarterInfo(), []);

  const datasets = useMemo(() => {
    return data.map((hotel, idx) => {
      const cuatriMap = {};
      hotel.cuatrimestres.forEach(c => {
        cuatriMap[c.cuatrimestre] = c;
      });

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
  }, [data, cuatriIds]);

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
