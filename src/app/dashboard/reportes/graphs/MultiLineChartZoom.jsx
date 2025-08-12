import React, { useRef, useEffect, useMemo, useState } from 'react';
import Chart from 'chart.js';

const COLORS = [
  '#e74c3c', // Rojo
  '#3498db', // Azul
  '#2ecc71', // Verde
  '#f39c12', // Naranja
  '#9b59b6', // Púrpura
  '#1abc9c', // Turquesa
  '#e67e22', // Naranja oscuro
  '#34495e', // Azul grisáceo
  '#f1c40f', // Amarillo
  '#e91e63', // Rosa magenta
  '#00bcd4', // Cian
  '#ff5722', // Rojo naranja
  '#795548', // Marrón
  '#607d8b', // Azul gris
  '#8bc34a', // Verde lima
  '#ff9800'  // Ámbar
];

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

  // ✅ Modificar groupByWeeks para mantener el progreso acumulativo
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
          porcentaje_progresivo_final: 0,
          dias: [],
          allDaysOfWeek: getDaysOfWeek(mondayOfWeek),
          sortOrder: new Date(mondayOfWeek).getTime()
        });
      }
      
      const week = weekMap.get(mondayOfWeek);
      week.inspecciones += dia.inspecciones;
      week.dias.push(dia);
      
      // ✅ El porcentaje progresivo final de la semana es el mayor porcentaje de esa semana
      if (dia.porcentaje_progresivo > week.porcentaje_progresivo_final) {
        week.porcentaje_progresivo_final = dia.porcentaje_progresivo;
      }
    });
    
    return Array.from(weekMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [getMondayOfWeek, formatWeekLabel, getDaysOfWeek]);

  // ✅ Modificar weeklyData para mantener progreso acumulativo
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
          
          hotelWeekData[hotel.hotel][key] = week.porcentaje_progresivo_final;
        });
      });
    });

    // Ordenar semanas cronológicamente
    const sortedWeeks = Array.from(allWeeks.values()).sort((a, b) => a.sortOrder - b.sortOrder);
    const labels = sortedWeeks.map(week => week.weekLabel);
    const weekKeys = sortedWeeks.map(week => week.mondayDate);
    
    // ✅ Crear datasets por hotel manteniendo progreso acumulativo
    const datasets = data.map((hotel, idx) => {
      let lastKnownPercentage = 0; // ✅ Mantener último porcentaje conocido
    
      const hotelData = sortedWeeks.map(week => {
        const currentPercentage = hotelWeekData[hotel.hotel][week.mondayDate];
        
        if (currentPercentage !== undefined && currentPercentage > 0) {
          lastKnownPercentage = currentPercentage; // ✅ Actualizar último conocido
          return currentPercentage;
        } else {
          return lastKnownPercentage; // ✅ Mantener el anterior si no hay datos
        }
      });

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

  // ✅ Modificar dailyData para usar inspecciones como dato principal
  const dailyData = useMemo(() => {
    if (!selectedWeekRange || !data || !weeklyData.weekDetails) {
      return { labels: [], datasets: [] };
    }

    const [startWeekKey, endWeekKey] = selectedWeekRange;
    
    // Encontrar las semanas seleccionadas
    const selectedWeeks = weeklyData.weekDetails.filter(week => 
      week.mondayDate >= startWeekKey && week.mondayDate <= endWeekKey
    );

    // Generar todos los días de las semanas seleccionadas
    const allDays = [];
    selectedWeeks.forEach(week => {
      week.allDaysOfWeek.forEach(day => {
        if (!allDays.includes(day)) {
          allDays.push(day);
        }
      });
    });
    
    allDays.sort();

    // ✅ Crear mapa de datos por hotel y día
    const hotelDayData = {};
    data.forEach(hotel => {
      hotelDayData[hotel.hotel] = {};
      
      // ✅ Obtener TODOS los días de datos del hotel
      const allHotelDays = [];
      hotel.cuatrimestres_data.forEach(cuatrimestre => {
        cuatrimestre.dias_data?.forEach(dia => {
          allHotelDays.push({
            fecha: dia.fecha,
            porcentaje_progresivo: dia.porcentaje_progresivo || 0,
            inspecciones: dia.inspecciones || 0
          });
        });
      });
      
      // Ordenar todos los días por fecha
      allHotelDays.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      
      // ✅ Llenar datos día por día
      let lastKnownPercentage = 0;
      
      allDays.forEach(day => {
        // Buscar si hay datos para este día específico
        const dayData = allHotelDays.find(d => d.fecha === day);
        
        if (dayData) {
          // ✅ Hay datos para este día
          if (dayData.porcentaje_progresivo > 0) {
            lastKnownPercentage = dayData.porcentaje_progresivo;
          }
          
          hotelDayData[hotel.hotel][day] = {
            inspecciones: dayData.inspecciones, // ✅ PRINCIPAL: Inspecciones reales del día
            porcentaje_progresivo: dayData.porcentaje_progresivo > 0 ? dayData.porcentaje_progresivo : lastKnownPercentage
          };
        } else {
          // ✅ No hay datos para este día
          const previousDays = allHotelDays.filter(d => new Date(d.fecha) < new Date(day));
          if (previousDays.length > 0) {
            const lastPreviousDay = previousDays[previousDays.length - 1];
            lastKnownPercentage = lastPreviousDay.porcentaje_progresivo;
          }
          
          hotelDayData[hotel.hotel][day] = {
            inspecciones: 0, // ✅ PRINCIPAL: Sin inspecciones ese día
            porcentaje_progresivo: lastKnownPercentage // ✅ SECUNDARIO: Mantener progreso anterior
          };
        }
      });
    });

    // ✅ Crear datasets por hotel (INSPECCIONES como dato principal)
    const datasets = data.map((hotel, idx) => {
      const hotelData = allDays.map(day => {
        const dayData = hotelDayData[hotel.hotel][day];
        return dayData ? dayData.inspecciones : 0; // ✅ Usar inspecciones como Y
      });

      return {
        label: hotel.hotel.replace(/_/g, ' ').toUpperCase(),
        data: hotelData, // ✅ Array de inspecciones por día
        borderColor: COLORS[idx % COLORS.length],
        backgroundColor: COLORS[idx % COLORS.length] + '20',
        fill: false,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
        // ✅ Datos adicionales para tooltips
        porcentajes: allDays.map(day => {
          const dayData = hotelDayData[hotel.hotel][day];
          return dayData ? dayData.porcentaje_progresivo : 0;
        })
      };
    });

    // Formatear labels de días
    const labels = allDays.map(day => {
      const date = new Date(day + 'T00:00:00');
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNum = date.getDate();
      const month = date.toLocaleDateString('es-ES', { month: 'short' });
      
      return `${dayName} ${dayNum}/${month}`;
    });

    return { labels, datasets, allDays, hotelDayData };
  }, [data, selectedWeekRange, weeklyData.weekDetails]);

  // Datos actuales según el nivel de zoom
  const currentData = zoomLevel === 'week' ? weeklyData : dailyData;

  // ✅ Efecto para renderizar el gráfico
  useEffect(() => {
    if (!chartRef.current || !currentData.labels?.length) {
      return;
    }

    const ctx = chartRef.current.getContext('2d');

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
        animation: {
          duration: isTransitioning ? 0 : 750,
          easing: 'easeInOutQuart',
        },
        hover: {
          animationDuration: 200
        },
        onHover: function(evt, elements) {
          evt.target.style.cursor = (zoomLevel === 'week' && elements.length > 0) ? 'pointer' : 'default';
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              // ✅ Ajustar stepSize según la vista
              stepSize: zoomLevel === 'week' ? 10 : 1, // ✅ 10% para semanal, 1 inspección para diaria
              // ✅ Formatear según el tipo de vista
              callback: (value) => {
                if (zoomLevel === 'week') {
                  return value.toFixed(0) + '%'; // ✅ Sin decimales para pasos más grandes
                } else {
                  return Math.floor(value) + ' insp.';
                }
              },
            },
            scaleLabel: {
              display: true,
              labelString: zoomLevel === 'week' 
                ? 'Porcentaje Progresivo Semanal' 
                : 'Inspecciones Completadas',
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
          mode: 'point',
          intersect: true,
          usePointStyle: true,
          displayColors: true,
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
              
              if (zoomLevel === 'week') {
                // ✅ Vista semanal: porcentaje progresivo
                return `${dataset.label}: ${value.toFixed(1)}% progreso`;
              } else {
                // ✅ Vista diaria: inspecciones + porcentaje
                const inspecciones = Math.floor(value); // ✅ Valor principal del gráfico
                const porcentaje = dataset.porcentajes ? dataset.porcentajes[tooltipItem.index] : 0;
                
                if (inspecciones > 0) {
                  return [
                    `${dataset.label}: ${inspecciones} inspecciones`, // ✅ PRINCIPAL
                    `Progreso acumulado: ${porcentaje.toFixed(1)}%`    // ✅ SECUNDARIO
                  ];
                } else {
                  return [
                    `${dataset.label}: Sin inspecciones`,              // ✅ PRINCIPAL
                    `Progreso acumulado: ${porcentaje.toFixed(1)}%`    // ✅ SECUNDARIO
                  ];
                }
              }
            },
            footer: function() {
              if (zoomLevel === 'week') {
                return '💡 Haz click para ver inspecciones diarias';
              }
              return '';
            }
          }
        },
        onClick: function(evt, elements) {
          if (zoomLevel === 'week' && elements && elements.length > 0 && !isTransitioning) {
            const clickedIndex = elements[0]._index;
            const weekKey = weeklyData.weekKeys[clickedIndex];
            
            handleZoomIn(weekKey);
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
          </span> puntos • 
          {zoomLevel === 'week' ? '📈 % Progreso Semanal' : '📋 Inspecciones Diarias'} {/* ✅ Cambiar texto */}
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