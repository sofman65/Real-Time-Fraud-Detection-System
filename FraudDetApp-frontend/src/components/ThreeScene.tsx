import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

// Cube Component that rotates
const RotatingCube: React.FC = () => {
    const meshRef = useRef<Mesh>(null);

    // Rotate the cube
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={"#00FFBC"} />
        </mesh>
    );
};

const ThreeScene: React.FC = () => {
    return (
        <Canvas style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}>
            {/* Lighting for the 3D Scene */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            {/* Multiple rotating cubes */}
            <RotatingCube />
            <RotatingCube />
            <RotatingCube />
        </Canvas>
    );
};

export default ThreeScene;
