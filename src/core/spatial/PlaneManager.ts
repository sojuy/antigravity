import { Vector3, Matrix4 } from 'three';

// Interface matching WebXR Plane structure
export interface DetectedPlane {
    id: string;
    orientation: 'Horizontal' | 'Vertical' | 'Any';
    pose: {
        transform: { matrix: Float32Array };
    };
    polygon: DOMPointReadOnly[];
}

/**
 * Manages the detection and selection of surfaces in the AR environment.
 */
export class PlaneManager {
    private planes: Map<string, DetectedPlane> = new Map();
    private floorPlaneId: string | null = null;

    constructor() { }

    /**
     * Updates the internal list of planes from the XR frame data.
     * @param detectedPlanes List of planes from the WebXR session.
     */
    public updatePlanes(detectedPlanes: DetectedPlane[]) {
        detectedPlanes.forEach(plane => {
            this.planes.set(plane.id, plane);
        });

        // Automatically try to find the floor if we haven't locked one
        if (!this.floorPlaneId) {
            this.detectFloor();
        }
    }

    /**
     * Attempts to identify the floor based on Y-position and orientation.
     * In AR, y=0 is often the initialization height, but we look for the lowest large horizontal plane.
     */
    private detectFloor() {
        let lowestY = Infinity;
        let candidates: DetectedPlane[] = [];

        this.planes.forEach(plane => {
            if (plane.orientation === 'Horizontal') {
                const matrix = new Matrix4().fromArray(plane.pose.transform.matrix);
                const position = new Vector3().setFromMatrixPosition(matrix);

                // Basic heuristic: Floor is usually below the camera (which starts at ~1.5m)
                // Adjust threshold based on real-world testing.
                if (position.y < lowestY) {
                    lowestY = position.y;
                    candidates.push(plane);
                }
            }
        });

        // Select the lowest horizontal plane as the floor candidate
        if (candidates.length > 0) {
            // Sort by Y position (ascending)
            candidates.sort((a, b) => {
                const posA = new Vector3().setFromMatrixPosition(new Matrix4().fromArray(a.pose.transform.matrix));
                const posB = new Vector3().setFromMatrixPosition(new Matrix4().fromArray(b.pose.transform.matrix));
                return posA.y - posB.y;
            });

            this.floorPlaneId = candidates[0].id;
            console.log(`[PlaneManager] Floor detected: ${this.floorPlaneId} at Y=${lowestY.toFixed(2)}`);
        }
    }

    public getFloor(): DetectedPlane | undefined {
        return this.floorPlaneId ? this.planes.get(this.floorPlaneId) : undefined;
    }

    public getAllPlanes(): DetectedPlane[] {
        return Array.from(this.planes.values());
    }
}
