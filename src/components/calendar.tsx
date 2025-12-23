"use client"
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TabsList, TabsTrigger } from './ui/tabs';


const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

const guardias = [
  {
    id: "a1b2c3d4",
    empleado: "Juan Pérez",
    avatar: "/image/empleado1.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "e5f6g7h8",
    empleado: "María López",
    avatar: "/image/empleado2.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "i9j0k1l2",
    empleado: "Carlos Díaz",
    avatar: "/image/empleado3.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "m3n4o5p6",
    empleado: "Ana García",
    avatar: "/image/empleado1.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "q7r8s9t0",
    empleado: "Luis Hernández",
    avatar: "/image/empleado2.png",
    puesto: "Jefe de Seguridad",
  },
  {
    id: "u1v2w3x4",
    empleado: "Laura Martínez",
    avatar: "/image/empleado3.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "y5z6a7b8",
    empleado: "Pedro Jiménez",
    avatar: "/image/empleado1.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "c9d0e1f2",
    empleado: "Sofía Castro",
    avatar: "/image/empleado2.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "g3h422j6",
    empleado: "Roberto Morales",
    avatar: "/image/empleado3.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "q7r844t0",
    empleado: "Luis Hernández",
    avatar: "/image/empleado2.png",
    puesto: "Jefe de Seguridad",
  },
  {
    id: "u1v553x4",
    empleado: "Laura Martínez",
    avatar: "/image/empleado3.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "y5z666b8",
    empleado: "Pedro Jiménez",
    avatar: "/image/empleado1.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "c9d077f2",
    empleado: "Sofía Castro",
    avatar: "/image/empleado2.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "g388i5j6",
    empleado: "Roberto Morales",
    avatar: "/image/empleado3.png",
    puesto: "Guardia de Seguridad",
  },
];

const allEvents = [
    {
      title: 'Rondin Matutino',
      start: '2025-10-01T08:00:00',
      end: '2025-10-01T09:00:00',
      extendedProps: {
        guardId: "a1b2c3d4",
        status: 'realizado',
        area: 'Caseta Norte',
      },
    },
    {
      title: 'Rondin Vespertino',
      start: '2025-10-01T16:00:00',
      end: '2025-10-01T17:00:00',
      extendedProps: {
        guardId: "e5f6g7h8",
        status: 'pendiente',
        area: 'Bodega Principal',
      },
    },
    {
      title: 'Rondin Nocturno',
      start: '2025-10-02T22:00:00',
      end: '2025-10-02T23:00:00',
      extendedProps: {
        guardId: "i9j0k1l2",
        status: 'cancelado',
        area: 'Zona Sur',
      },
    },
    {
      title: 'Áreas Verdes',
      start: '2025-10-03T11:00:00',
      end: '2025-10-03T12:00:00',
      extendedProps: {
        guardId: "m3n4o5p6",
        status: 'realizado',
        area: 'Jardines',
      },
    },
    {
      title: 'Rondin General',
      start: '2025-10-03T15:00:00',
      end: '2025-10-03T16:00:00',
      extendedProps: {
        guardId: "q7r8s9t0",
        status: 'pendiente',
        area: 'Recepción',
      },
    },
    {
      title: 'Rondin Caseta Sur',
      start: '2025-10-04T09:30:00',
      end: '2025-10-04T10:30:00',
      extendedProps: {
        guardId: "u1v2w3x4",
        status: 'realizado',
        area: 'Caseta Sur',
      },
    },
    {
      title: 'Control Accesos',
      start: '2025-10-04T18:00:00',
      end: '2025-10-04T19:00:00',
      extendedProps: {
        guardId: "y5z6a7b8",
        status: 'cancelado',
        area: 'Accesos Planta',
      },
    },
    {
      title: 'Rondin Bodega',
      start: '2025-10-05T07:00:00',
      end: '2025-10-05T08:00:00',
      extendedProps: {
        guardId: "c9d0e1f2",
        status: 'pendiente',
        area: 'Bodega 2',
      },
    },
    {
      title: 'Rondin Oficinas',
      start: '2025-10-05T13:00:00',
      end: '2025-10-05T14:00:00',
      extendedProps: {
        guardId: "g3h4i5j6",
        status: 'realizado',
        area: 'Oficinas Administrativas',
      },
    },
    {
      title: 'Rondin Perimetral',
      start: '2025-10-06T10:00:00',
      end: '2025-10-06T11:00:00',
      extendedProps: {
        guardId: "a1b2c3d4",
        status: 'pendiente',
        area: 'Perímetro Planta',
      },
    },
    {
      title: 'Rondin Almacén',
      start: '2025-10-07T17:00:00',
      end: '2025-10-07T18:00:00',
      extendedProps: {
        guardId: "e5f6g7h8",
        status: 'realizado',
        area: 'Almacén Central',
      },
    },
    {
      title: 'Rondin Entrada Principal',
      start: '2025-10-08T06:00:00',
      end: '2025-10-08T07:00:00',
      extendedProps: {
        guardId: "i9j0k1l2",
        status: 'realizado',
        area: 'Entrada Principal',
      },
    },
    {
      title: 'Rondin Caseta Norte',
      start: '2025-10-09T10:00:00',
      end: '2025-10-09T11:00:00',
      extendedProps: {
        guardId: "m3n4o5p6",
        status: 'pendiente',
        area: 'Caseta Norte',
      },
    },
    {
      title: 'Rondin Estacionamiento',
      start: '2025-10-10T13:30:00',
      end: '2025-10-10T14:30:00',
      extendedProps: {
        guardId: "q7r8s9t0",
        status: 'realizado',
        area: 'Estacionamiento General',
      },
    },
    {
      title: 'Rondin Bodega 3',
      start: '2025-10-11T12:00:00',
      end: '2025-10-11T13:00:00',
      extendedProps: {
        guardId: "u1v2w3x4",
        status: 'cancelado',
        area: 'Bodega 3',
      },
    },
    {
      title: 'Rondin Jardines',
      start: '2025-10-12T09:00:00',
      end: '2025-10-12T10:00:00',
      extendedProps: {
        guardId: "y5z6a7b8",
        status: 'pendiente',
        area: 'Jardines Planta Sur',
      },
    },
    {
      title: 'Control Cámaras',
      start: '2025-10-13T19:00:00',
      end: '2025-10-13T20:00:00',
      extendedProps: {
        guardId: "c9d0e1f2",
        status: 'realizado',
        area: 'Sala de Monitoreo',
      },
    },
    {
      title: 'Rondin Planta Alta',
      start: '2025-10-14T08:00:00',
      end: '2025-10-14T09:00:00',
      extendedProps: {
        guardId: "g3h4i5j6",
        status: 'pendiente',
        area: 'Planta Alta',
      },
    },
    {
      title: 'Rondin Cafetería',
      start: '2025-10-15T10:00:00',
      end: '2025-10-15T11:00:00',
      extendedProps: {
        guardId: "m3n4o5p6",
        status: 'realizado',
        area: 'Cafetería',
      },
    },
    {
      title: 'Rondin Taller',
      start: '2025-10-16T13:00:00',
      end: '2025-10-16T14:00:00',
      extendedProps: {
        guardId: "q7r8s9t0",
        status: 'pendiente',
        area: 'Taller Mecánico',
      },
    },
    {
      title: 'Rondin Planta Baja',
      start: '2025-10-17T09:00:00',
      end: '2025-10-17T10:00:00',
      extendedProps: {
        guardId: "u1v2w3x4",
        status: 'realizado',
        area: 'Planta Baja',
      },
    },
    {
      title: 'Rondin Control Accesos',
      start: '2025-10-18T14:00:00',
      end: '2025-10-18T15:00:00',
      extendedProps: {
        guardId: "y5z6a7b8",
        status: 'cancelado',
        area: 'Accesos Planta Sur',
      },
    },
    {
      title: 'Rondin Oficina Dirección',
      start: '2025-10-19T10:00:00',
      end: '2025-10-19T11:00:00',
      extendedProps: {
        guardId: "c9d0e1f2",
        status: 'pendiente',
        area: 'Oficina Dirección',
      },
    },
    {
        title: 'Rondín Matutino',
        start: '2025-01-10T08:00:00',
        end: '2025-01-10T09:00:00',
        extendedProps: { guardId: "a1b2c3d4", status: 'realizado', area: 'Entrada Principal' },
    },
    {
        title: 'Patrullaje Perimetral',
        start: '2025-01-11T10:00:00',
        end: '2025-01-11T11:30:00',
        extendedProps: { guardId: "e5f6g7h8", status: 'pendiente', area: 'Zona Industrial' },
    },
    {
        title: 'Control de Acceso',
        start: '2025-02-05T14:00:00',
        end: '2025-02-05T15:00:00',
        extendedProps: { guardId: "i9j0k1l2", status: 'realizado', area: 'Caseta Sur' },
    },
    {
        title: 'Rondín Nocturno',
        start: '2025-02-10T22:00:00',
        end: '2025-02-10T23:00:00',
        extendedProps: { guardId: "m3n4o5p6", status: 'cancelado', area: 'Bodega 3' },
    },
    {
        title: 'Inspección de Equipos',
        start: '2025-03-15T09:00:00',
        end: '2025-03-15T10:00:00',
        extendedProps: { guardId: "q7r8s9t0", status: 'realizado', area: 'Sala de Control' },
    },
    {
        title: 'Rondín Matutino',
        start: '2025-03-20T08:00:00',
        end: '2025-03-20T09:00:00',
        extendedProps: { guardId: "u1v2w3x4", status: 'pendiente', area: 'Entrada Principal' },
    },
    {
        title: 'Patrullaje',
        start: '2025-04-01T14:00:00',
        end: '2025-04-01T15:00:00',
        extendedProps: { guardId: "y5z6a7b8", status: 'realizado', area: 'Zona Verde' },
    },
    {
        title: 'Control de Acceso',
        start: '2025-04-10T10:00:00',
        end: '2025-04-10T11:00:00',
        extendedProps: { guardId: "c9d0e1f2", status: 'pendiente', area: 'Caseta Norte' },
    },
    {
        title: 'Rondín Nocturno',
        start: '2025-05-05T21:00:00',
        end: '2025-05-05T22:00:00',
        extendedProps: { guardId: "g3h422j6", status: 'realizado', area: 'Bodega 1' },
    },
    {
        title: 'Inspección',
        start: '2025-05-12T09:00:00',
        end: '2025-05-12T10:00:00',
        extendedProps: { guardId: "q7r844t0", status: 'cancelado', area: 'Sala de Control' },
    },
    {
        title: 'Rondín Matutino',
        start: '2025-06-15T08:00:00',
        end: '2025-06-15T09:00:00',
        extendedProps: { guardId: "u1v553x4", status: 'pendiente', area: 'Entrada Principal' },
    },
    {
        title: 'Patrullaje Perimetral',
        start: '2025-06-20T14:00:00',
        end: '2025-06-20T15:30:00',
        extendedProps: { guardId: "y5z666b8", status: 'realizado', area: 'Zona Industrial' },
    },
    {
        title: 'Control de Acceso',
        start: '2025-07-01T10:00:00',
        end: '2025-07-01T11:00:00',
        extendedProps: { guardId: "c9d077f2", status: 'pendiente', area: 'Caseta Sur' },
    },
    {
        title: 'Rondín Nocturno',
        start: '2025-07-10T22:00:00',
        end: '2025-07-10T23:00:00',
        extendedProps: { guardId: "g388i5j6", status: 'realizado', area: 'Bodega 2' },
    },
    {
        title: 'Inspección de Equipos',
        start: '2025-08-15T09:00:00',
        end: '2025-08-15T10:00:00',
        extendedProps: { guardId: "a1b2c3d4", status: 'pendiente', area: 'Sala de Control' },
    },
    {
        title: 'Rondín Matutino',
        start: '2025-08-20T08:00:00',
        end: '2025-08-20T09:00:00',
        extendedProps: { guardId: "e5f6g7h8", status: 'realizado', area: 'Entrada Principal' },
    },
    {
        title: 'Patrullaje',
        start: '2025-09-01T14:00:00',
        end: '2025-09-01T15:00:00',
        extendedProps: { guardId: "i9j0k1l2", status: 'pendiente', area: 'Zona Verde' },
    },
    {
        title: 'Control de Acceso',
        start: '2025-09-10T10:00:00',
        end: '2025-09-10T11:00:00',
        extendedProps: { guardId: "m3n4o5p6", status: 'realizado', area: 'Caseta Norte' },
    },
    {
        title: 'Rondín Nocturno',
        start: '2025-10-05T21:00:00',
        end: '2025-10-05T22:00:00',
        extendedProps: { guardId: "q7r8s9t0", status: 'cancelado', area: 'Bodega 3' },
    },
    {
        title: 'Inspección',
        start: '2025-10-12T09:00:00',
        end: '2025-10-12T10:00:00',
        extendedProps: { guardId: "u1v2w3x4", status: 'realizado', area: 'Sala de Control' },
    },
    {
        title: 'Rondín Matutino',
        start: '2025-10-15T08:00:00',
        end: '2025-10-15T09:00:00',
        extendedProps: { guardId: "y5z6a7b8", status: 'pendiente', area: 'Entrada Principal' },
    },
    {
        title: 'Patrullaje Perimetral',
        start: '2025-10-20T14:00:00',
        end: '2025-10-20T15:30:00',
        extendedProps: { guardId: "c9d0e1f2", status: 'realizado', area: 'Zona Industrial' },
    },
    {
        title: 'Control de Acceso',
        start: '2025-10-01T10:00:00',
        end: '2025-10-01T11:00:00',
        extendedProps: { guardId: "g3h422j6", status: 'pendiente', area: 'Caseta Sur' },
    },
    {
        title: 'Rondín Nocturno',
        start: '2025-10-10T22:00:00',
        end: '2025-10-10T23:00:00',
        extendedProps: { guardId: "q7r844t0", status: 'realizado', area: 'Bodega 1' },
    },
    { title: 'Rondín Matutino', start: '2025-10-01T07:30:00', end: '2025-10-01T08:30:00', extendedProps: { guardId: "a1b2c3d4", status: 'realizado', area: 'Entrada Principal' } },
    { title: 'Patrullaje Perimetral', start: '2025-10-01T10:00:00', end: '2025-10-01T11:00:00', extendedProps: { guardId: "e5f6g7h8", status: 'pendiente', area: 'Zona Industrial' } },
    { title: 'Control de Acceso', start: '2025-10-02T09:00:00', end: '2025-10-02T10:00:00', extendedProps: { guardId: "i9j0k1l2", status: 'realizado', area: 'Caseta Sur' } },
    { title: 'Rondín Nocturno', start: '2025-10-02T22:00:00', end: '2025-10-02T23:00:00', extendedProps: { guardId: "m3n4o5p6", status: 'cancelado', area: 'Bodega 3' } },
    { title: 'Inspección Equipos', start: '2025-10-03T08:30:00', end: '2025-10-03T09:30:00', extendedProps: { guardId: "q7r8s9t0", status: 'realizado', area: 'Sala de Control' } },
    { title: 'Rondín Matutino', start: '2025-10-03T07:00:00', end: '2025-10-03T08:00:00', extendedProps: { guardId: "u1v2w3x4", status: 'pendiente', area: 'Entrada Principal' } },
    { title: 'Patrullaje', start: '2025-10-04T13:00:00', end: '2025-10-04T14:00:00', extendedProps: { guardId: "y5z6a7b8", status: 'realizado', area: 'Zona Verde' } },
    { title: 'Control de Acceso', start: '2025-10-04T15:00:00', end: '2025-10-04T16:00:00', extendedProps: { guardId: "c9d0e1f2", status: 'pendiente', area: 'Caseta Norte' } },
    { title: 'Rondín Nocturno', start: '2025-10-05T21:00:00', end: '2025-10-05T22:00:00', extendedProps: { guardId: "g3h422j6", status: 'realizado', area: 'Bodega 1' } },
    { title: 'Inspección', start: '2025-10-05T10:00:00', end: '2025-10-05T11:00:00', extendedProps: { guardId: "q7r844t0", status: 'cancelado', area: 'Sala de Control' } },
    { title: 'Rondín Matutino', start: '2025-10-06T07:30:00', end: '2025-10-06T08:30:00', extendedProps: { guardId: "u1v553x4", status: 'pendiente', area: 'Entrada Principal' } },
    { title: 'Patrullaje Perimetral', start: '2025-10-06T14:00:00', end: '2025-10-06T15:00:00', extendedProps: { guardId: "y5z666b8", status: 'realizado', area: 'Zona Industrial' } },
    { title: 'Control de Acceso', start: '2025-10-07T09:00:00', end: '2025-10-07T10:00:00', extendedProps: { guardId: "c9d077f2", status: 'pendiente', area: 'Caseta Sur' } },
    { title: 'Rondín Nocturno', start: '2025-10-07T22:00:00', end: '2025-10-07T23:00:00', extendedProps: { guardId: "g388i5j6", status: 'realizado', area: 'Bodega 2' } },
    { title: 'Inspección de Equipos', start: '2025-10-08T08:30:00', end: '2025-10-08T09:30:00', extendedProps: { guardId: "a1b2c3d4", status: 'pendiente', area: 'Sala de Control' } },
    { title: 'Rondín Matutino', start: '2025-10-08T07:00:00', end: '2025-10-08T08:00:00', extendedProps: { guardId: "e5f6g7h8", status: 'realizado', area: 'Entrada Principal' } },
    { title: 'Patrullaje', start: '2025-10-09T13:00:00', end: '2025-10-09T14:00:00', extendedProps: { guardId: "i9j0k1l2", status: 'pendiente', area: 'Zona Verde' } },
    { title: 'Control de Acceso', start: '2025-10-09T15:00:00', end: '2025-10-09T16:00:00', extendedProps: { guardId: "m3n4o5p6", status: 'realizado', area: 'Caseta Norte' } },
    { title: 'Rondín Nocturno', start: '2025-10-10T21:00:00', end: '2025-10-10T22:00:00', extendedProps: { guardId: "q7r8s9t0", status: 'cancelado', area: 'Bodega 3' } },
    { title: 'Inspección', start: '2025-10-10T10:00:00', end: '2025-10-10T11:00:00', extendedProps: { guardId: "u1v2w3x4", status: 'realizado', area: 'Sala de Control' } },
    { title: 'Rondín Matutino', start: '2025-10-11T07:30:00', end: '2025-10-11T08:30:00', extendedProps: { guardId: "y5z6a7b8", status: 'pendiente', area: 'Entrada Principal' } },
    { title: 'Patrullaje Perimetral', start: '2025-10-11T14:00:00', end: '2025-10-11T15:30:00', extendedProps: { guardId: "c9d0e1f2", status: 'realizado', area: 'Zona Industrial' } },
    { title: 'Control de Acceso', start: '2025-10-12T09:00:00', end: '2025-10-12T10:00:00', extendedProps: { guardId: "g3h422j6", status: 'pendiente', area: 'Caseta Sur' } },
    { title: 'Rondín Nocturno', start: '2025-10-12T22:00:00', end: '2025-10-12T23:00:00', extendedProps: { guardId: "q7r844t0", status: 'realizado', area: 'Bodega 1' } },
    { title: 'Inspección', start: '2025-10-13T08:00:00', end: '2025-10-13T09:00:00', extendedProps: { guardId: "a1b2c3d4", status: 'pendiente', area: 'Sala de Control' } },
    { title: 'Rondín Matutino', start: '2025-10-13T07:00:00', end: '2025-10-13T08:00:00', extendedProps: { guardId: "e5f6g7h8", status: 'realizado', area: 'Entrada Principal' } },
    { title: 'Patrullaje', start: '2025-10-14T13:00:00', end: '2025-10-14T14:00:00', extendedProps: { guardId: "i9j0k1l2", status: 'pendiente', area: 'Zona Verde' } },
    { title: 'Control de Acceso', start: '2025-10-14T15:00:00', end: '2025-10-14T16:00:00', extendedProps: { guardId: "m3n4o5p6", status: 'realizado', area: 'Caseta Norte' } },
    { title: 'Rondín Nocturno', start: '2025-10-15T21:00:00', end: '2025-10-15T22:00:00', extendedProps: { guardId: "q7r8s9t0", status: 'cancelado', area: 'Bodega 3' } },
];

export default function RondinesCalendar() {
  const [selectedGuards, setSelectedGuards] = useState<string[]>(guardias.map(g => g.id));
  const [searchText, setSearchText] = useState<string>('');

  
  const baseColors = [
    '#800000', 
    '#808080',
    '#000080',
    '#00CED1',
    '#9370DB',
    '#FF4500',
    '#008080', 
    '#FFD700',
    '#4B0082',
    '#2E8B57',
    '#FF69B4', 
    '#A52A2A', 
    '#1E90FF', 
    '#708090', 
    '#DA70D6', 
  ];
  
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  const guardColors = useMemo(() => {
    const colors = shuffleArray(baseColors);
    const map = new Map<string, string>();
    guardias.forEach((g, i) => {
      map.set(g.id, colors[i % colors.length]);
    });
    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardias]);
  
  
  const toggleGuard = (id: string) => {
    setSelectedGuards(prev =>
      prev.includes(id)
        ? prev.filter(g => g !== id)
        : [...prev, id]
    );
  };

  const filteredEvents = allEvents.filter(event =>
    selectedGuards.includes(event.extendedProps.guardId)
  );


  const filteredGuardias = guardias.filter(guard =>
    guard.empleado.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
	<div className="w-full">
		<div className="flex justify-between items-center my-2">
            <div className="flex w-full justify-start gap-4 ">
				<div className="flex justify-center items-center">
					<TabsList className="bg-blue-500 text-white p-1 rounded-md ">
						<TabsTrigger value="Bitacora">Ejecuciones</TabsTrigger>
            <TabsTrigger value="Rondines">Rondines</TabsTrigger>
						<TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
						<TabsTrigger value="Fotos">Fotos</TabsTrigger>
						<TabsTrigger value="Calendario">Calendario</TabsTrigger>
					</TabsList>
				</div> 
			</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-screen">
                <div className="w-full lg:w-1/4 h-4/6 space-y-4 overflow-y-auto">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Filtrar por guardias</h2>
                    <input
                    type="text"
                    placeholder="Buscar guardia..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                </div>
            
                <div className="space-y-2 pr-1">
                    {filteredGuardias.map((guard) => {
                    const color = guardColors.get(guard.id) || '#ccc';
                    return (
                        <label
                        key={guard.id}
                        className="flex items-center space-x-3 border p-2 rounded shadow-sm cursor-pointer"
                        style={{
                            backgroundColor: `${color}33`, 
                        }}
                        >
                        <input
                            type="checkbox"
                            checked={selectedGuards.includes(guard.id)}
                            onChange={() => toggleGuard(guard.id)}
                            className="w-4 h-4 rounded"
                            style={{
                            accentColor: color,
                            }}
                        />
            
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                        />
            
                        <Image
                            src={guard.avatar}
                            alt={guard.empleado}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                        />
            
                        <div>
                            <p className="text-sm font-semibold">{guard.empleado}</p>
                            <p className="text-xs text-gray-500">{guard.puesto}</p>
                        </div>
                        </label>
                    );
                    })}
                </div>
                </div>
            
                <div className="w-full lg:w-3/4 overflow-auto" style={{ maxHeight: '80vh' }}>
                
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    titleFormat={{year:"numeric", month:"short"}}
                    initialView="dayGridMonth"
                    allDaySlot={false}
                    dayHeaderContent={(args) => {
                        const date = args.date;
                        const dayNumber = format(date, 'd'); // número de día
                        const dayName = format(date, 'EEEE', { locale: es }); // nombre corto (lun, mar, etc.)
                    
                        return (
                            <div className="flex flex-col items-start text-left leading-tight">
                            <div className="text-[10px] uppercase text-gray-500">{dayName}</div> 
                            <div className="text-lg font-bold text-gray-900">{dayNumber}</div>
                        </div>
                        
                        );
                    }}
                    events={filteredEvents} 
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    locale={esLocale}
                    eventContent={(eventInfo) => {
                        const guardId = eventInfo.event.extendedProps.guardId;
                        const color = guardColors.get(guardId) || '#666';
                        const backgroundColor = color + '33';
                        const textColor = color;
                    
                        function safeFormat(date: Date | null, formatStr: string) {
                            return date ? format(date, formatStr) : '-';
                        }
                        
                        const startStr = safeFormat(eventInfo.event.start, 'h:mm a');
                        const endStr = safeFormat( eventInfo.event.end, 'h:mm a');

                        return (
                            <div
                            style={{
                            backgroundColor,
                            color: textColor,
                            padding: '4px 6px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            display: 'flex',      
                            alignItems: 'center',
                            gap: 6,
                            }}
                        >
                            <div
                            style={{
                            width: 4,
                            height: '40px', 
                            backgroundColor: color,
                            borderRadius: 2,
                            flexShrink: 0,
                            }}
                            />
                            
                            <div style={{ overflow: 'hidden' }}>
                                <small style={{ fontWeight: 400, whiteSpace: 'normal' }}>
                                    {startStr} - {endStr}
                                </small>
                                <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {eventInfo.event.title}
                                </div>
                            
                            </div>
                        </div>
                        );
                    }}
                    />

                </div>
        </div>
    </div>         
  );
}

