import React, { useState, useEffect } from 'react';
import Submersible3DView from './Submersible3DView';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Polyline } from 'react-leaflet/Polyline';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Ocean areas (very simplified, you might want to use more precise data)
const oceanAreas = [
  { name: 'Pacific Ocean', bounds: [[-60, -180], [60, -80]] },
  { name: 'Atlantic Ocean', bounds: [[-60, -80], [60, 20]] },
  { name: 'Indian Ocean', bounds: [[-60, 20], [30, 120]] },
];

const SubmersibleMap = ({ position, depth, speed, setPosition, setDepth, setSpeed }) => {
  const [heading, setHeading] = useState(0);
  const [pathHistory, setPathHistory] = useState([position]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(currentPosition => {
        const [lat, lon] = currentPosition;
        const newLat = lat + (Math.cos(heading * Math.PI / 180) * speed / 60);
        const newLon = lon + (Math.sin(heading * Math.PI / 180) * speed / 60);
        
        const inWater = oceanAreas.some(area => 
          newLat >= area.bounds[0][0] && newLat <= area.bounds[1][0] &&
          newLon >= area.bounds[0][1] && newLon <= area.bounds[1][1]
        );

        if (!inWater) {
          setHeading(current => (current + 90) % 360);
          return [lat, lon];
        }


        const newPosition = [newLat, newLon];

        setPathHistory(currentHistory => {
            const newHistory = [...currentHistory, newPosition];
            
            return newHistory.slice(-150);
        });

        return newPosition;
      });

      // Randomly adjust depth, heading, and speed
      setDepth(current => Math.max(50, Math.min(1000, current + (Math.random() - 0.5) * 20)));
      setHeading(current => (current + (Math.random() - 0.5) * 10 + 360) % 360);
      setSpeed(current => Math.max(1, Math.min(10, current + (Math.random() - 0.5))));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Submersible Location</h2>
      <MapContainer center={position} zoom={3} style={{ height: '400px', width: '50%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            Submersible Location<br />
            Latitude: {position[0].toFixed(6)}<br />
            Longitude: {position[1].toFixed(6)}<br />
            Depth: {depth.toFixed(2)} meters<br />
            Heading: {heading.toFixed(1)}°<br />
            Speed: {speed.toFixed(1)} knots
          </Popup>
        </Marker>
        <Polyline positions={pathHistory} color="blue" />
      </MapContainer>

      <div>
        <p>Current Position: {position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
        <p>Depth: {depth.toFixed(2)} meters</p>
        <p>Heading: {heading.toFixed(1)}°</p>
        <p>Speed: {speed.toFixed(1)} knots</p>
      </div>
    </div>
  );
};

export default SubmersibleMap;