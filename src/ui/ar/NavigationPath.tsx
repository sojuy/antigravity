import React, { useMemo } from 'react';
import { Vector3, CatmullRomCurve3 } from 'three';
// extend removed as unused

/**
 * Props for the NavigationPath component.
 * @param points Array of Vector3 points defining the path.
 * @param color Color of the path (default: cyan).
 * @param width Radius of the path tube (default: 0.1).
 */
interface NavigationPathProps {
    points: Vector3[];
    color?: string;
    width?: number;
}

export const NavigationPath: React.FC<NavigationPathProps> = ({
    points,
    color = '#00ffff',
    width = 0.05
}) => {

    // Memoize the curve generation to avoid recalculating on every frame unless points change
    const pathGeometry = useMemo(() => {
        if (points.length < 2) return null;

        // Create a smooth curve passing through all points
        const curve = new CatmullRomCurve3(points);
        return curve;
    }, [points]);

    if (!pathGeometry) return null;

    return (
        <mesh>
            <tubeGeometry args={[pathGeometry, 64, width, 8, false]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
            />
        </mesh>
    );
};
