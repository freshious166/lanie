import React, { useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface MapPolylineProps {
  points: { lat: number; lng: number }[];
  color?: string;
  weight?: number;
}

export const MapPolyline: React.FC<MapPolylineProps> = ({ 
  points, 
  color = '#3b82f6', // Tailwind blue-500
  weight = 4 
}) => {
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create polyline instance
    const newPolyline = new google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: weight,
    });

    newPolyline.setMap(map);
    setPolyline(newPolyline);

    return () => {
      newPolyline.setMap(null);
    };
  }, [map]); // Re-create if map changes

  // Update path dynamically if points change
  useEffect(() => {
    if (polyline) {
      polyline.setPath(points);
    }
  }, [polyline, points]);

  return null;
};
