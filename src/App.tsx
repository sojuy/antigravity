import { useState } from 'react';
import Viewer from './components/Viewer';
import PromptInput from './components/PromptInput';

function App() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setModelUrl(url);
    } catch (error) {
      console.error("Error generating model:", error);
      alert("Failed to generate model. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '20px', textAlign: 'center', background: '#282c34', color: 'white' }}>
        <h1>Antigravity CAD Generator</h1>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, background: '#f0f0f0' }}>
          <Viewer modelUrl={modelUrl} />
        </div>
        <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
