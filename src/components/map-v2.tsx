
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import L, { latLngBounds } from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import "../app/map.css"
import osm from "@/app/map-config";
import useAuthStore from "@/store/useAuthStore";
import { Map } from 'leaflet';


interface RecordData {
  id: number;
  folio: string;
  form_name: string;
  user_name: string;
  duration: string;
  geolocation?: [number, number];
  bubble_color?: string;
  [key: string]: any;
}

interface Center {
  lat: number;
  lng: number;
}

interface MapViewState {
  center: Center | null;
  filterId: string | null;
  parameters: URLSearchParams;
  records: RecordData[];
  limit: number;
  offset: number;
  dicGroup: Record<string, RecordData[]>;
}

type Punto = {
	lat: number;
	lng: number;
	nombre?: string;
  };
  
  type MapaRutasProps = {
	puntos: Punto[];
  };
  
  
const overlap = (rect1: DOMRect, rect2: DOMRect): boolean => {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
};

const MyComponent: React.FC = () => {
  const hideOverlappingTooltips = () => {
    const rects: DOMRect[] = [];
    const idListData: string[] = [];
    const idListGroup: string[] = [];
    const idListTooltip: string[] = [];

    const tooltips = document.getElementsByClassName(
      "myTooltip"
    ) as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < tooltips.length; i++) {
      const attrData = tooltips[i].querySelector(".toltip-data") as HTMLElement;
      const attrGroup = tooltips[i].querySelector(".toltip-group") as HTMLElement;
      const attrDiv = tooltips[i].querySelector(".tooltip-div") as HTMLElement;

      tooltips[i].style.visibility = "";
      attrData?.style.setProperty("display", "");
      attrGroup?.style.setProperty("display", "none");

      if (attrDiv?.getAttribute("singlecolor")) {
        tooltips[i].style.background = attrDiv.getAttribute("singlecolor")!;
      }

      rects[i] = tooltips[i].getBoundingClientRect();
      idListData[i] = attrData?.id;
      idListGroup[i] = attrGroup?.id;
      idListTooltip[i] = tooltips[i]?.id;
    }

    for (let i = 0; i < tooltips.length; i++) {
      let countRecords = 1;

      if (tooltips[i].style.visibility !== "hidden") {
        for (let j = i + 1; j < tooltips.length; j++) {
          if (overlap(rects[i], rects[j])) {
            countRecords += 1;
            tooltips[j].style.visibility = "hidden";
            document.getElementById(idListData[i])!.style.display = "none";
            document.getElementById(idListGroup[i])!.style.display = "block";
            document.getElementById(idListTooltip[i])!.style.background = "#99a3a4";
            document.getElementById(idListGroup[i])!.textContent = `Records: ${countRecords}`;
          }
        }
      }
    }
  };

  useMapEvents({
    zoomend: () => {
      hideOverlappingTooltips();
    },
  });

  return null;
};

const MapView = ({ puntos }: MapaRutasProps) => {
	const user = useAuthStore()
	console.log("OBJETO USER", user)

	const initialState: MapViewState = {
		center: puntos.length
		? { lat: puntos[0].lat, lng: puntos[0].lng }
		: { lat: 19.4326, lng: -99.1332 },
		filterId: null,
		// parameters: document.location.search ? new URLSearchParams(document.location.search) : new URLSearchParams('deleted=false&limit=20&offset=0'),
		parameters: typeof window !== "undefined" && window.location.search
		? new URLSearchParams(window.location.search)
		: new URLSearchParams('deleted=false&limit=20&offset=0'),
		records: [],
		limit: 20,
		offset: 0,
		dicGroup: {},
	  };
	
	// const [loading, setLoading] = useState(false);
	const DEFAULT_ZOOM = 20;
	const mapRef = useRef<Map | null>(null);
	// const runOnce = useRef(false);

	const [state, setState] = useState<MapViewState>(initialState);

	useEffect(() => {
		if (puntos.length) {
		const records: RecordData[] = puntos.map((p, index) => ({
			id: index + 1,
			folio: `P${index + 1}`,
			form_name: p.nombre ?? "", 
			user_name: "",
			duration: "",
			geolocation: [p.lat, p.lng],
		}));

		setState(prev => ({
			...prev,
			records,
			center: { lat: puntos[0].lat, lng: puntos[0].lng },
		}));
		}
	}, [puntos]);


	const setZoom = (map: any) => {
		if (state.records.length && state.center) {
			map.setView({ lng: state.center.lng, lat: state.center.lat }, DEFAULT_ZOOM);
			const markerBounds = latLngBounds([]);
			state.records.forEach((record) => {
				if (record.geolocation) {
				markerBounds.extend(record.geolocation);
				}
			});
			if (markerBounds.isValid()) {
				map.fitBounds(markerBounds);
			}
		}
	};
	

  const myIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const linePositions: [number, number][] = puntos.map(p => [p.lat, p.lng]);

  return (
    <article>
      {/* {loading && <p>Cargando...</p>} */}
      {/* {!loading && state.center && ( */}
		
        <MapContainer
			center={state.center ?? { lat: 19.4326, lng: -99.1332 }}
			zoom={DEFAULT_ZOOM}
			ref={mapRef}
			whenReady={() => {
				if (mapRef.current) {
				setZoom(mapRef.current);
				}
			}}
			style={{ height: "80vh", width: "100%" }}
			>
			<TileLayer
				url={
				user && user.userIdSoter === 126
					? osm?.maptiler.url_126
					: osm.maptiler.url
				}
				attribution={osm.maptiler.attribution}
			/>
	  		<Polyline positions={linePositions} color="green" />

			<MyComponent />
			{state.records.map((obj) => (
					<Marker
					key={obj.id}
					position={obj.geolocation!}
					icon={myIcon}
					>
					<Popup>
						<div>{obj.form_name} — {obj.folio}</div>
					</Popup>
					<Tooltip permanent className="myTooltip">
						<div
						className="tooltip-div"
						//   singlecolor={obj.bubble_color}
						id={`tooltip-${obj.id}`}
						>
						<p className="toltip-data" id={`toltip-record-${obj.id}`}>
							<Link target="_blank" href={""}>
							{obj.folio}
							</Link>{" "}
							| {obj.duration}
						</p>
						<p
							className="toltip-group"
							id={`toltip-group-${obj.id}`}
							style={{ display: "none" }}
						>
							0
						</p>
						</div>
					</Tooltip>
					</Marker>
			))}
        </MapContainer>
     {/* )} */}
    </article>
  );
};

export default MapView;
