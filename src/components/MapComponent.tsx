'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  markers: {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    category?: string;
  }[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapComponent({ markers, center, zoom = 13, height = '400px' }: MapComponentProps) {
  const mapCenter = center || (markers.length > 0 ? [markers[0].latitude, markers[0].longitude] as [number, number] : [-6.3956, 106.8166]);

  return (
    <div style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden', zIndex: 0 }}>
      <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.latitude, marker.longitude]}>
            <Popup>
              <div className="font-semibold">{marker.title}</div>
              {marker.category && <div className="text-xs text-gray-500">{marker.category}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
