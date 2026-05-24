'use client';

import React, { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerProps {
  position: { latitude: number; longitude: number } | null;
  onPositionChange: (pos: { latitude: number; longitude: number }) => void;
  height?: string;
}

function LocationMarker({ position, setPosition }: { position: LatLng | null, setPosition: (p: LatLng) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const markerRef = useRef<any>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [setPosition]
  );

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

export default function MapPicker({ position, onPositionChange, height = '400px' }: MapPickerProps) {
  const center = position ? [position.latitude, position.longitude] as [number, number] : [-6.3956, 106.8166] as [number, number];
  
  const handleSetPosition = (latlng: LatLng) => {
    onPositionChange({ latitude: latlng.lat, longitude: latlng.lng });
  };

  const currentPos = position ? new LatLng(position.latitude, position.longitude) : null;

  return (
    <div style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden', zIndex: 0, border: '1px solid #e5e7eb' }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={currentPos} setPosition={handleSetPosition} />
      </MapContainer>
    </div>
  );
}
