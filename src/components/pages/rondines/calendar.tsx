import dynamic from 'next/dynamic'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import esLocale from '@fullcalendar/core/locales/es';
import { format } from 'date-fns';


export default function RondinesCalendar() {


  const events = [
    {
      title: 'Rondin Matutino',
      start: '2024-12-14T09:30:00',
      end: '2024-12-14T10:30:00',
      extendedProps: {
        folio: 1,
        status: 'realizado', // Realizado (Verde)
        ubi: 'Planta Monterrey',
        area: 'Caseta Vigilancia Norte 3',
        nameGuard: 'Juan Pérez',
        observations: 'Observaciones de la ruta',
        evidence: 'Evidencias',
        durationRoute: '1 hora',
      },
    },
    {
      title: 'Áreas Verdes',
      start: '2024-12-14T13:30:00',
      end: '2024-12-14T16:30:00',
      extendedProps: {
        folio: 1,
        status: 'pendiente', // Pendiente (Azul)
        ubi: 'Planta Monterrey',
        area: 'Caseta Vigilancia Norte 3',
        nameGuard: 'Juan Pérez',
        observations: 'Observaciones de la ruta',
        evidence: 'Evidencias',
        durationRoute: '1 hora',
      },
    },
    {
      title: 'Rondin Nocturno',
      start: '2024-12-10T14:45:00',
      end: '2024-12-10T15:45:00',
      extendedProps: {
        folio: 2,
        status: 'cancelado', // Cancelado (Rojo)
        ubi: 'Planta Monterrey',
        area: 'Caseta Vigilancia Norte 3',
        nameGuard: 'María Rodríguez',
        observations: 'Ruta revisada parcialmente',
        evidence: 'Evidencias',
        durationRoute: '1 hora',
      },
    },
    {
      title: 'Rondín Almacén',
      start: '2024-12-12T11:20:00',
      end: '2024-12-12T12:20:00',
      extendedProps: {
        folio: 3,
        status: 'realizado', // Realizado (Verde)
        ubi: 'Planta Monterrey',
        area: 'Caseta Vigilancia Norte 3',
        nameGuard: 'Pedro Gómez',
        observations: 'Observaciones de la ruta',
        evidence: 'Evidencias',
        durationRoute: '1 hora',
      },
    },
    {
      title: 'Rondin Matutino',
      start: '2024-12-08T08:00:00',
      end: '2024-12-08T09:00:00',
      extendedProps: {
        folio: 4,
        status: 'pendiente', // Pendiente (Azul)
        ubi: 'Planta Monterrey',
        area: 'Caseta Vigilancia Norte 3',
        nameGuard: 'Ana López',
        observations: 'Observaciones de la ruta',
        evidence: 'Evidencias',
        durationRoute: '1 hora',
      },
    },
    {
      title: 'Áreas Verdes',
      start: '2024-12-13T15:10:00',
      end: '2024-12-13T16:10:00',
      extendedProps: {
        folio: 5,
        status: 'cancelado', // Cancelado (Rojo)
        ubi: 'Planta Monterrey',
        area: 'Caseta Vigilancia Norte 3',
        nameGuard: 'David Martínez',
        observations: 'Observaciones de la ruta',
        evidence: 'Evidencias',
        durationRoute: '1 hora',
      },
    },
  ];
  


 



  return (
    <FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="dayGridMonth" 
    events={events} 
    headerToolbar={{
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    }}
    locale={esLocale}
    eventContent={renderEventContent}
    eventClick={(info) => {
      const { area, ubi, observations, status } = info.event.extendedProps;

      console.log( area, ubi, observations, status)
    
    }}
  />
  );
}


function renderEventContent(eventInfo: any) {
  const status = eventInfo.event.extendedProps.status;

  function formatTime(dateString: string): string {
    return format(new Date(dateString), 'h:mm a');
  }

  // Determinar el color según el estado
  function getStatusColor(status: string): string {
    switch (status) {
      case 'realizado': 
        return 'bg-green-500';
      case 'pendiente': 
        return 'bg-blue-500';
      case 'cancelado': 
        return 'bg-red-500';
      default: 
        return 'bg-blue-400';
    }
  }

  const statusColor = getStatusColor(status);

  return (
    <div className="p-2 text-xs flex flex-col items-center space-x-2">
      <div className="flex items-center space-x-2">
      <p className={`w-2 h-2 rounded-full ${statusColor}`}></p>
      <span>{formatTime(eventInfo.event.start)}</span>
      </div>
      <div className='font-semibold'>{eventInfo.event.title}</div>
    </div>
  );
}




const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });
