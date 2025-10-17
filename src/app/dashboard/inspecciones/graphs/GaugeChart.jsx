import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';

const COLORS = ['#e71831', '#8cd610', '#efc600']; // verde, amarillo, rojo

function index(perc) {
  return perc < 70 ? 0 : perc < 90 ? 1 : 2;
}

const GaugeChart = ({ porcentaje }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const value = porcentaje;
  const label = 'Areas inspeccionadas'; // Texto que quieres mostrar debajo

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [value, 100 - value],
          backgroundColor: [
            COLORS[index(value)],
            '#eaeaea',
          ],
          borderWidth: 0,
        }],
      },
      options: {
        rotation: Math.PI,        // empieza desde 180 grados (mitad inferior)
        circumference: Math.PI,   // semicircular (180 grados)
        cutoutPercentage: 70,     // tamaño del agujero central
        legend: { display: false },
        tooltips: { enabled: false },
      },
    });
  }, [value]);

  return (
    <div style={{ position: 'relative', width: 300, height: 150 }}>
      <canvas ref={chartRef} width={300} height={150} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -30%)',
        fontWeight: 'bold',
        fontSize: 32,
        color: COLORS[index(value)],
        userSelect: 'none',
      }}>
        <div className='flex flex-col text-sm justify-center items-center'>
          <div className='text-2xl mt-4'>{value}%</div>
          <div className='text-xs text-center text-black font-light'>{label}</div>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;
