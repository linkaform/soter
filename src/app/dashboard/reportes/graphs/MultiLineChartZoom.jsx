import React, { useRef, useEffect, useMemo, useState } from 'react';
import Chart from 'chart.js';

const COLORS = ['#8cd610', '#efc600', '#e71831', '#1e90ff', '#ff6384', '#36a2eb', '#cc65fe', '#ffce56'];

const MultiLineChartZoom = ({ data = [] }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState('week'); // 'week' | 'day'
  const [selectedWeekRange, setSelectedWeekRange] = useState(null);

  // ✅ Función para obtener el lunes de una fecha
  const getMondayOfWeek = React.useCallback((date) => {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Domingo = 6, Lunes = 0
    const monday = new Date(d);
    monday.setDate(d.getDate() - mondayOffset);
    return monday.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }, []);

  // ✅ Función para generar todos los días de una semana
  const getDaysOfWeek = React.useCallback((mondayDate) => {
    const days = [];
    const monday = new Date(mondayDate);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day.toISOString().split('T')[0]);
    }
    
    return days;
  }, []);

  // ✅ Función para formatear fecha de semana
  const formatWeekLabel = React.useCallback((mondayDate, cuatrimestre) => {
    const monday = new Date(mondayDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                       'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const startMonth = monthNames[monday.getMonth()];
    const endMonth = monthNames[sunday.getMonth()];
    
    if (startMonth === endMonth) {
      return `C${cuatrimestre}-${startMonth}-${monday.getDate()}-${sunday.getDate()}`;
    } else {
      return `C${cuatrimestre}-${startMonth}${monday.getDate()}-${endMonth}${sunday.getDate()}`;
    }
  }, []);

  // ✅ Agrupar datos por semanas
  const groupByWeeks = React.useCallback((diasData, cuatrimestreInfo) => {
    const weekMap = new Map();
    
    // Procesar cada día de datos
    diasData.forEach(dia => {
      const mondayOfWeek = getMondayOfWeek(dia.fecha);
      
      if (!weekMap.has(mondayOfWeek)) {
        weekMap.set(mondayOfWeek, {
          mondayDate: mondayOfWeek,
          cuatrimestre: cuatrimestreInfo.cuatrimestre,
          anio: cuatrimestreInfo.anio,
          weekLabel: formatWeekLabel(mondayOfWeek, cuatrimestreInfo.cuatrimestre, cuatrimestreInfo.anio),
          inspecciones: 0,
          dias: [],
          allDaysOfWeek: getDaysOfWeek(mondayOfWeek),
          sortOrder: new Date(mondayOfWeek).getTime()
        });
      }
      
      const week = weekMap.get(mondayOfWeek);
      week.inspecciones += dia.inspecciones;
      week.dias.push(dia);
    });
    
    return Array.from(weekMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [getMondayOfWeek, formatWeekLabel, getDaysOfWeek]);

  // ✅ Procesar datos para vista semanal
  const weeklyData = useMemo(() => {
    if (!data || data.length === 0) return { labels: [], datasets: [], weekDetails: [] };

    const allWeeks = new Map();
    const hotelWeekData = {};
    
    // Procesar cada hotel
    data.forEach(hotel => {
      hotelWeekData[hotel.hotel] = {};
      
      hotel.cuatrimestres_data.forEach(cuatrimestre => {
        const weeks = groupByWeeks(cuatrimestre.dias_data || [], {
          cuatrimestre: cuatrimestre.cuatrimestre,
          anio: cuatrimestre.anio
        });
        
        weeks.forEach(week => {
          const key = week.mondayDate;
          
          if (!allWeeks.has(key)) {
            allWeeks.set(key, week);
          }
          
          hotelWeekData[hotel.hotel][key] = week.inspecciones;
        });
      });
    });

    // Ordenar semanas cronológicamente
    const sortedWeeks = Array.from(allWeeks.values()).sort((a, b) => a.sortOrder - b.sortOrder);
    const labels = sortedWeeks.map(week => week.weekLabel);
    const weekKeys = sortedWeeks.map(week => week.mondayDate);
    
    // Crear datasets por hotel
    const datasets = data.map((hotel, idx) => {
      const hotelData = sortedWeeks.map(week => 
        hotelWeekData[hotel.hotel][week.mondayDate] || 0
      );

      return {
        label: hotel.hotel.replace(/_/g, ' ').toUpperCase(),
        data: hotelData,
        borderColor: COLORS[idx % COLORS.length],
        backgroundColor: COLORS[idx % COLORS.length] + '20',
        fill: false,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    });

    return { 
      labels, 
      datasets, 
      weekKeys, 
      weekDetails: sortedWeeks 
    };
  }, [data, groupByWeeks]);

  // ✅ Procesar datos para vista diaria (con zoom)
  const dailyData = useMemo(() => {
    if (!selectedWeekRange || !data || !weeklyData.weekDetails) {
      return { labels: [], datasets: [] };
    }

    const [startWeekKey, endWeekKey] = selectedWeekRange;
    
    // Encontrar las semanas seleccionadas
    const selectedWeeks = weeklyData.weekDetails.filter(week => 
      week.mondayDate >= startWeekKey && week.mondayDate <= endWeekKey
    );

    // ✅ Generar TODOS los días de las semanas seleccionadas (incluye días sin datos)
    const allDays = [];
    selectedWeeks.forEach(week => {
      week.allDaysOfWeek.forEach(day => {
        if (!allDays.includes(day)) {
          allDays.push(day);
        }
      });
    });
    
    allDays.sort();

    // ✅ Crear mapa de datos por hotel y día (incluyendo días con 0)
    const hotelDayData = {};
    data.forEach(hotel => {
      hotelDayData[hotel.hotel] = {};
      
      // ✅ Inicializar TODOS los días con 0
      allDays.forEach(day => {
        hotelDayData[hotel.hotel][day] = 0;
      });
      
      // ✅ Llenar con datos reales donde existan
      hotel.cuatrimestres_data.forEach(cuatrimestre => {
        cuatrimestre.dias_data?.forEach(dia => {
          if (allDays.includes(dia.fecha)) {
            hotelDayData[hotel.hotel][dia.fecha] = dia.inspecciones;
          }
        });
      });

    });

    // Crear datasets por hotel
    const datasets = data.map((hotel, idx) => {
      
      const hotelData = [];
      
      // Procesar día por día para ver exactamente qué está pasando
      allDays.forEach((day) => {
        const value = hotelDayData[hotel.hotel][day];
        hotelData.push(value || 0);
      });

      const dataset = {
        label: hotel.hotel.replace(/_/g, ' ').toUpperCase(),
        data: hotelData,
        borderColor: COLORS[idx % COLORS.length],
        backgroundColor: COLORS[idx % COLORS.length] + '20',
        fill: false,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
      };
      
      return dataset;
    });


    // Formatear labels de días
    const labels = allDays.map(day => {
      const date = new Date(day + 'T00:00:00'); // ✅ Forzar timezone local
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNum = date.getDate();
      const month = date.toLocaleDateString('es-ES', { month: 'short' });
      
      
      return `${dayName} ${dayNum}/${month}`;
    });

    return { labels, datasets, allDays };
  }, [data, selectedWeekRange, weeklyData.weekDetails]);

  // Datos actuales según el nivel de zoom
  const currentData = zoomLevel === 'week' ? weeklyData : dailyData;

  // ✅ Efecto para renderizar el gráfico
  useEffect(() => {
    if (!chartRef.current || !currentData.labels?.length) {
      return;
    }

    const ctx = chartRef.current.getContext('2d');

    // ✅ Destruir instancia anterior SIEMPRE
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    // ✅ Limpiar canvas
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: currentData.labels,
        datasets: currentData.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // ✅ Desactivar animación temporalmente para debug
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              stepSize: 1,
              callback: (value) => value + ' insp.',
            },
            scaleLabel: {
              display: true,
              labelString: 'Inspecciones Completadas',
            },
            gridLines: {
              drawOnChartArea: true,
              color: 'rgba(0,0,0,0.1)',
            },
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: zoomLevel === 'week' ? 'Semanas' : 'Días',
            },
            gridLines: {
              drawOnChartArea: true,
              color: 'rgba(0,0,0,0.1)',
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
            },
          }],
        },
        legend: {
          display: true,
          position: 'top',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: function(tooltipItems, data) {
              const label = data.labels[tooltipItems[0].index];
              if (zoomLevel === 'week') {
                return `Semana: ${label}`;
              } else {
                return `Día: ${label}`;
              }
            },
            label: function(tooltipItem, data) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const value = tooltipItem.yLabel;
              return `${dataset.label}: ${value} inspecciones`;
            }
          }
        },
        onClick: function(evt, elements) {
          if (zoomLevel === 'week' && elements && elements.length > 0) {
            const clickedIndex = elements[0]._index;
            const weekKey = weeklyData.weekKeys[clickedIndex];
            
            // Hacer zoom a esa semana específica
            setSelectedWeekRange([weekKey, weekKey]);
            setZoomLevel('day');
          }
        }
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [currentData, zoomLevel, weeklyData.weekKeys]); // ✅ Agregar todas las dependencias

  // ✅ Funciones de control
  const handleZoomOut = () => {
    setZoomLevel('week');
    setSelectedWeekRange(null);
  };

  const handleZoomToRange = () => {
    if (zoomLevel === 'week' && weeklyData.weekKeys?.length > 0) {
      // Zoom a las primeras semanas disponibles
      const start = weeklyData.weekKeys[0];
      const end = weeklyData.weekKeys[Math.min(2, weeklyData.weekKeys.length - 1)];
      setSelectedWeekRange([start, end]);
      setZoomLevel('day');
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        <div className="text-xl">No hay datos de inspecciones disponibles</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Controles de zoom */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel === 'week'}
            className={`px-3 py-1 rounded text-sm ${
              zoomLevel === 'week' 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            🔍➖ Vista Semanal
          </button>
          <button
            onClick={handleZoomToRange}
            disabled={zoomLevel === 'day'}
            className={`px-3 py-1 rounded text-sm ${
              zoomLevel === 'day' 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            🔍➕ Vista Diaria
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {zoomLevel === 'week' ? (
            <span>📊 Vista semanal - Haz click en un punto para ver días</span>
          ) : (
            <span>📅 Vista diaria - Incluye todos los días de la semana</span>
          )}
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-96 w-full">
        <canvas 
          ref={chartRef} 
          key={`chart-${zoomLevel}-${selectedWeekRange ? selectedWeekRange.join('-') : 'all'}`}
        />
      </div>

      {/* Información adicional */}
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex flex-wrap gap-4">
          <span>🏨 Hoteles: {data.length}</span>
          <span>📈 Vista: {zoomLevel === 'week' ? 'Semanal' : 'Diaria'}</span>
          <span>📊 Puntos: {currentData.labels?.length || 0}</span>
          {zoomLevel === 'day' && selectedWeekRange && (
            <span>📅 Período: {selectedWeekRange[0]} a {selectedWeekRange[1]}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiLineChartZoom;