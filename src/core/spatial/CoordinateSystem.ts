import { Vector3, Quaternion, Matrix4 } from 'three';

/**
 * Represents a position and orientation in 3D space.
 */
export interface Pose {
    position: Vector3;
    orientation: Quaternion;
}

/**
 * Manages the transformation between the AR Session/Local space
 * and the Persistent/Global space.
 */
export class CoordinateManager {
    private localToGlobalMatrix: Matrix4;
    private globalToLocalMatrix: Matrix4;
    private isAligned: boolean = false;

    constructor() {
        this.localToGlobalMatrix = new Matrix4();
        this.globalToLocalMatrix = new Matrix4();
    }

    /**
     * Aligns the local AR coordinate system with a global anchor.
     * This is typically called when an image marker or visual feature is recognized.
     * 
     * @param localPose The pose of the anchor in current AR session coordinates.
     * @param globalPose The known pose of the anchor in the global map.
     */
    public align(localPose: Pose, globalPose: Pose): void {
        // effective_transform = global * inverse(local)
        // This simplifies the logic: we want a matrix M such that M * local = global

        const localMatrix = new Matrix4().compose(
            localPose.position,
            localPose.orientation,
            new Vector3(1, 1, 1)
        );

        const globalMatrix = new Matrix4().compose(
            globalPose.position,
            globalPose.orientation,
            new Vector3(1, 1, 1)
        );

        // M = G * inverse(L)
        const inverseLocal = localMatrix.clone().invert();
        this.localToGlobalMatrix.multiplyMatrices(globalMatrix, inverseLocal);

        // Update the reverse transform
        this.globalToLocalMatrix.copy(this.localToGlobalMatrix).invert();
        this.isAligned = true;

        console.log('[CoordinateManager] Aligned to global anchor.');
    }

    public toGlobal(localPose: Pose): Pose {
        if (!this.isAligned) {
            console.warn('[CoordinateManager] Not aligned. Returning raw local pose.');
            return localPose;
        }

        const mat = new Matrix4().compose(
            localPose.position,
            localPose.orientation,
            new Vector3(1, 1, 1)
        );

        mat.premultiply(this.localToGlobalMatrix);

        const position = new Vector3();
        const orientation = new Quaternion();
        const scale = new Vector3();

        mat.decompose(position, orientation, scale);

        return { position, orientation };
    }

    public toLocal(globalPose: Pose): Pose {
        if (!this.isAligned) return globalPose; // Basic assumption

        const mat = new Matrix4().compose(
            globalPose.position,
            globalPose.orientation,
            new Vector3(1, 1, 1)
        );

        mat.premultiply(this.globalToLocalMatrix);

        const position = new Vector3();
        const orientation = new Quaternion();
        const scale = new Vector3();

        mat.decompose(position, orientation, scale);

        return { position, orientation };
    }
}
