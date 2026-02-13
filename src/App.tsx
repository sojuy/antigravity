import { useState } from 'react';
import { Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import { createXRStore, XR } from '@react-three/xr';

const store = createXRStore();

// Components
import { NavigationPath } from './ui/ar/NavigationPath';
import { Waypoint } from './ui/ar/Waypoint';

// Styles
import './App.css';

function App() {
  const [isNavigating, setIsNavigating] = useState(false);

  // Mock path for demonstration
  const pathPoints = [
    new Vector3(0, 0, -1),
    new Vector3(1, 0, -2),
    new Vector3(0, 0, -4)
  ];

  return (
    <>
      <button onClick={() => store.enterAR()}>Enter AR</button>

      <div className="overlay">
        <h1>Antigravity AR</h1>
        <button onClick={() => setIsNavigating(!isNavigating)}>
          {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
        </button>
      </div>

      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          {isNavigating && (
            <>
              <NavigationPath points={pathPoints} />
              <Waypoint position={new Vector3(0, 0, -4)} />
            </>
          )}

          {/* Spatial Brain Hook Integration would go here */}
          {/* <CoordinateSystem /> */}
          {/* <PlaneManager /> */}

        </XR>
      </Canvas>
    </>
  );
}

export default App;
