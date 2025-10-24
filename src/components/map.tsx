import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { fixLeafletIcon } from '@/lib/fixLeafletIcon';

type Punto = {
  lat: number;
  lng: number;
  nombre?: string;
};

type MapaRutasProps = {
  puntos: Punto[];
};

const MapaRutas = ({ puntos }: MapaRutasProps) => {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const center: LatLngExpression = puntos.length > 0
    ? [puntos[0].lat, puntos[0].lng]
    : [0, 0];

  const ruta: LatLngExpression[] = puntos.map(p => [p.lat, p.lng]);

  // Función para crear un icono con número
  const crearIconoNumero = (num: number) => {
    return L.divIcon({
      className: 'icono-numero', // lo usaremos para estilos CSS
      html: `<div style="
        background-color:green;
        color:white;
        border-radius:50%;
        width: 30px;
        height: 30px;
        display:flex;
        justify-content:center;
        align-items:center;
        font-weight:bold;
        border: 2px solid white;
        box-shadow: 0 0 3px rgba(0,0,0,0.5);
      ">${num}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30], // apunta a la base del círculo
      popupAnchor: [0, -30],
    });
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {puntos.map((p, idx) => (
        <Marker
          key={idx}
          position={[p.lat, p.lng]}
          icon={crearIconoNumero(idx + 1)} // aquí usamos el icono personalizado
        >
          <Popup>{p.nombre || `Punto ${idx + 1}`}</Popup>
        </Marker>
      ))}

      {ruta.length > 1 && (
        <Polyline positions={ruta} pathOptions={{ color: 'green', weight: 4 }} />
      )}
    </MapContainer>
  );
};

export default MapaRutas;