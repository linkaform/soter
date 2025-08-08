import React, { useRef, useEffect, useMemo, useState } from 'react';
import Chart from 'chart.js';

const COLORS = ['#8cd610', '#efc600', '#e71831', '#1e90ff', '#ff6384', '#36a2eb', '#cc65fe', '#ffce56'];

const MultiLineChartZoom = ({ data = [] }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState('week'); // 'week' | 'day'
  const [selectedWeekRange, setSelectedWeekRange] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false); // ✅ Nuevo estado

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

    // ✅ Destruir instancia anterior
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: currentData.labels,
        datasets: currentData.datasets.map(dataset => ({
          ...dataset,
          pointRadius: zoomLevel === 'week' ? 6 : 4,
          pointHoverRadius: zoomLevel === 'week' ? 8 : 6,
          pointBorderWidth: 2,
          pointHoverBorderWidth: 3,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // ✅ Animación suave habilitada
        animation: {
          duration: isTransitioning ? 0 : 750, // Sin animación durante transición
          easing: 'easeInOutQuart',
          onComplete: function() {}
        },
        // ✅ Animaciones específicas para elementos
        hover: {
          animationDuration: 200
        },
        responsiveAnimationDuration: 300,
        onHover: function(evt, elements) {
          evt.target.style.cursor = (zoomLevel === 'week' && elements.length > 0) ? 'pointer' : 'default';
        },
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
              labelString: zoomLevel === 'week' ? 'Semanas (click para ver días)' : 'Días de la semana',
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
                return `Semana: ${label} (click para ver días)`;
              } else {
                return `Día: ${label}`;
              }
            },
            label: function(tooltipItem, data) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const value = tooltipItem.yLabel;
              return `${dataset.label}: ${value} inspecciones`;
            },
            footer: function() {
              if (zoomLevel === 'week') {
                return '💡 Haz click para zoom a vista diaria';
              }
              return '';
            }
          }
        },
        onClick: function(evt, elements) {
          if (zoomLevel === 'week' && elements && elements.length > 0 && !isTransitioning) {
            const clickedIndex = elements[0]._index;
            const weekKey = weeklyData.weekKeys[clickedIndex];
            
            handleZoomIn(weekKey); // ✅ Usar función animada
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
  }, [currentData, zoomLevel, weeklyData.weekKeys, isTransitioning]);

  // ✅ Funciones de control
  const handleZoomOut = () => {
    setIsTransitioning(true);
    
    // Animación de salida
    setTimeout(() => {
      setZoomLevel('week');
      setSelectedWeekRange(null);
      
      // Animación de entrada
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };

  // ✅ Función animada para hacer zoom in
  const handleZoomIn = (weekKey) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setSelectedWeekRange([weekKey, weekKey]);
      setZoomLevel('day');
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
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
      {/* Controles con animaciones */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {/* ✅ Botón que desaparece completamente cuando no se necesita */}
          {zoomLevel === 'day' && (
            <div className="animate-in slide-in-from-left-4 duration-300">
              <button
                onClick={handleZoomOut}
                disabled={isTransitioning}
                className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
                Volver a vista semanal
              </button>
            </div>
          )}
          
          {/* ✅ Badge que se ajusta dinámicamente sin espacio reservado */}
          <div className="transition-all duration-500 ease-in-out">
            {zoomLevel === 'week' ? (
              <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full transition-all duration-300 transform hover:scale-105">
                <span className="animate-pulse">📊</span> Vista Semanal
                <span className="text-xs opacity-75">• Click en puntos para ver días</span>
              </span>
            ) : (
              <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full transition-all duration-300 transform hover:scale-105">
                <span className="animate-pulse">📅</span> Vista Diaria
                <span className="text-xs opacity-75">• Semana del {selectedWeekRange?.[0]}</span>
              </span>
            )}
          </div>
        </div>

        {/* ✅ Info con contador animado */}
        <div className="text-sm text-gray-500 transition-all duration-300">
          🏨 {data.length} hoteles • 📊 
          <span className="inline-block transition-all duration-300 transform">
            {currentData.labels?.length || 0}
          </span> puntos
        </div>
      </div>

      {/* ✅ Gráfico con overlay de transición */}
      <div className="relative h-96 w-full">
        {/* Overlay de transición */}
        <div className={`absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center transition-all duration-300 ${
          isTransitioning 
            ? 'opacity-100' 
            : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            <span>Cargando vista...</span>
          </div>
        </div>

        {/* Canvas con animación de escala */}
        <canvas 
          ref={chartRef} 
          key={`chart-${zoomLevel}-${selectedWeekRange ? selectedWeekRange.join('-') : 'all'}`}
          className={`transition-all duration-300 ${
            isTransitioning 
              ? 'transform scale-95 opacity-50' 
              : 'transform scale-100 opacity-100'
          }`}
        />
      </div>

      {/* ✅ Información con animación de slide */}
      <div className={`mt-4 text-xs text-gray-400 border-t pt-3 transition-all duration-500 ${
        isTransitioning ? 'transform translate-y-2 opacity-50' : 'transform translate-y-0 opacity-100'
      }`}>
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <span className="transition-all duration-300">
              📈 Vista: {zoomLevel === 'week' ? 'Semanal' : 'Diaria'}
            </span>
            <div className={`transition-all duration-300 ${
              zoomLevel === 'day' && selectedWeekRange 
                ? 'opacity-100 transform translate-x-0' 
                : 'opacity-0 transform translate-x-4'
            }`}>
              {zoomLevel === 'day' && selectedWeekRange && (
                <span>📅 Período: {new Date(selectedWeekRange[0]).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}</span>
              )}
            </div>
          </div>
          
          {/* ✅ Tips con fade animado */}
          <div className="text-right transition-all duration-500">
            {zoomLevel === 'week' ? (
              <span className="animate-fade-in">💡 Tip: Haz click en cualquier punto para ver los días de esa semana</span>
            ) : (
              <span className="animate-fade-in">💡 Tip: Usa el botón &quot;← Volver&quot; para regresar a la vista semanal</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiLineChartZoom;