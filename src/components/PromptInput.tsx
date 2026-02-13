import React, { useState } from 'react';

interface PromptInputProps {
    onGenerate: (prompt: string) => void;
    isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your Gridfinity or HSW part (e.g., '3x2 bin with magnets')"
                style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading}
                style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
                {isLoading ? 'Generating...' : 'Generate'}
            </button>
        </form>
    );
};

export default PromptInput;
