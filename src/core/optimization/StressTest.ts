import { Vector3, Quaternion, Euler } from 'three';

/**
 * Self-Annealing Stress Test
 * 
 * Concept:
 * Start with a "high temperature" (high randomness/chaos).
 * If the system remains stable (FPS > threshold), lower the temperature (refine the inputs).
 * If the system stutters, raise the temperature (look for the breaking point).
 * 
 * Actually, for stress testing, we usually want to find the breakage, so we might reverse the annealing:
 * Start calm, and heat up until it breaks.
 */
export class StressRunner {
    private temperature: number = 0.0; // 0.0 to 1.0 (Chaos factor)
    private frameCount: number = 0;
    private lastTime: number = performance.now();
    private fpsHistory: number[] = [];

    constructor() {
        console.log('[StressRunner] Initialized. Standing by.');
    }

    public update() {
        this.frameCount++;
        const now = performance.now();
        const delta = now - this.lastTime;

        if (delta >= 1000) {
            const fps = (this.frameCount / delta) * 1000;
            this.shortTermAnalysis(fps);

            this.frameCount = 0;
            this.lastTime = now;
        }

        if (this.temperature > 0) {
            this.injectChaos(this.temperature);
        }
    }

    private shortTermAnalysis(fps: number) {
        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > 5) this.fpsHistory.shift();

        const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
        console.log(`[StressRunner] FPS: ${fps.toFixed(1)} | Avg: ${avgFps.toFixed(1)} | Temp: ${this.temperature.toFixed(2)}`);

        // Annealing Logic:
        // If performance is good (60+ FPS), increase stress (Heat up).
        // If performance drops (< 30 FPS), we found a limit.
        if (avgFps > 55) {
            this.temperature = Math.min(1.0, this.temperature + 0.05);
        } else if (avgFps < 30) {
            console.warn('[StressRunner] Performance degradation detected! System struggling.');
            // In a real annealing process, we might back off here.
            // this.temperature = Math.max(0.0, this.temperature - 0.1);
        }
    }

    private injectChaos(intensity: number) {
        // 1. Math Stress: Perform useless vector calculations
        const iterations = Math.floor(1000 * intensity);
        for (let i = 0; i < iterations; i++) {
            const v = new Vector3(Math.random(), Math.random(), Math.random());
            v.applyQuaternion(new Quaternion().setFromEuler(new Euler(Math.random(), 0, 0)));
        }

        // 2. Allocation Stress: Create garbage objects
        if (Math.random() < intensity * 0.1) {
            const junk = new Array(1000).fill(0).map(() => new Vector3());
            // Prevent unused variable error
            (window as any)._junk = junk;
        }
    }

    public start() {
        this.temperature = 0.1;
        console.log('[StressRunner] Starting stress test sequence...');
    }

    public stop() {
        this.temperature = 0;
        console.log('[StressRunner] Stress test stopped.');
    }
}

// Global Singleton
export const stressTest = new StressRunner();
