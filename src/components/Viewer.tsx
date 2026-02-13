import React, { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders';

interface ViewerProps {
    modelUrl: string | null;
}

const Viewer: React.FC<ViewerProps> = ({ modelUrl }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);

        // Camera
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
        camera.attachControl(canvasRef.current, true);
        camera.wheelPrecision = 50;

        // Light
        new HemisphericLight("light", new Vector3(1, 1, 0), scene);

        // Load Model
        if (modelUrl) {
            SceneLoader.Append("", modelUrl, scene, (scene) => {
                // Optional: Zoom to fit
                scene.createDefaultCameraOrLight(true, true, true);
                if (scene.activeCamera) {
                    scene.activeCamera.attachControl(canvasRef.current, true);
                }
            });
        }

        // Render Loop
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Resize
        window.addEventListener('resize', () => {
            engine.resize();
        });

        return () => {
            scene.dispose();
            engine.dispose();
        };
    }, [modelUrl]);

    return (
        <canvas ref={canvasRef} style={{ width: '100%', height: '600px', outline: 'none' }} />
    );
};

export default Viewer;
