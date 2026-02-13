import React, { useRef } from 'react';
import { Vector3, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

interface WaypointProps {
    position: Vector3;
    color?: string;
    label?: string;
}

export const Waypoint: React.FC<WaypointProps> = ({ position, color = '#ff00ff' }) => {
    const meshRef = useRef<Mesh>(null);

    // Animation loop: Bob up and down and rotate
    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.getElapsedTime();
            // Bobbing
            meshRef.current.position.y = position.y + Math.sin(t * 2) * 0.1;
            // Rotation
            meshRef.current.rotation.y += 0.02;
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <octahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
            </mesh>
            {/* Ground shadow/anchor indicator */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.1, 0.15, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} />
            </mesh>
        </group>
    );
};
