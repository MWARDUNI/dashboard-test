import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text, Line } from '@react-three/drei';

const Submersible = ({ position, depth, speed }) => {
  const submersibleRef = useRef();
  const [pathHistory, setPathHistory] = useState([]);

  useEffect(() => {
    // init pathHistory with the first position
    const x = (position[1] + 180) / 360 - 0.5;
    const y = depth / 1000 - 0.5;
    const z = (position[0] + 90) / 180 - 0.5;
    setPathHistory([[x, y, z]]);
  }, []); 

  useFrame(() => {
    if (submersibleRef.current) {
      const x = (position[1] + 180) / 360 - 0.5; // longitude
      const y = depth / 1000 - 0.5; // depth
      const z = (position[0] + 90) / 180 - 0.5; // latitude

      submersibleRef.current.position.set(x, y, z);

      setPathHistory(prevHistory => {
        const newHistory = [...prevHistory, [x, y, z]];
        return newHistory.slice(-1000); // keep last 1000 points
      });
    }
  });

  return (
    <>
      <Sphere ref={submersibleRef} args={[0.02, 32, 32]}>
        <meshBasicMaterial color="yellow" />
      </Sphere>
      {pathHistory.length > 1 && (
        <Line
          points={pathHistory}
          color="yellow"
          lineWidth={2}
          dashed={false}
        />
      )}
    </>
  );
};

const AxisLabel = ({ position, text }) => (
  <Text
    position={position}
    fontSize={0.05}
    color="white"
    anchorX="center"
    anchorY="middle"
  >
    {text}
  </Text>
);

const Submersible3DView = ({ position, depth, speed }) => {
  const [, setRenderKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderKey(prev => prev + 1); // force re-render every second
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Canvas camera={{ position: [1.5, 1.5, 1.5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box args={[1, 1, 1]}>
          <meshBasicMaterial color="white" wireframe />
        </Box>
        <Submersible key={position.join(',')} position={position} depth={depth} speed={speed} />
        <OrbitControls />

        {/* x-axis (longitude) labels */}
        <AxisLabel position={[0.5, -0.55, -0.55]} text="180°E" />
        <AxisLabel position={[-0.5, -0.55, -0.55]} text="180°W" />

        {/* y-axis (depth) labels */}
        <AxisLabel position={[-0.55, 0.5, -0.55]} text="0m" />
        <AxisLabel position={[-0.55, -0.5, -0.55]} text="1000m" />

        {/* z-axis (latitude) labels */}
        <AxisLabel position={[-0.55, -0.55, 0.5]} text="90°N" />
        <AxisLabel position={[-0.55, -0.55, -0.5]} text="90°S" />
      </Canvas>
    </div>
  );
};

export default Submersible3DView;
