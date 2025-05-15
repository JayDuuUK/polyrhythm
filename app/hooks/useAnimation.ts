import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { notes } from '../constants/colors';

// Helper function to calculate GCD (Greatest Common Divisor)
const gcd = (a: number, b: number): number => {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

// Helper function to calculate LCM (Least Common Multiple)
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

// Helper function to calculate LCM of an array of numbers
const lcmArray = (arr: number[]): number => arr.reduce((a, b) => lcm(a, b));

// Helper to safely get window height
const getContainerHeight = (): number => {
  if (typeof window !== 'undefined') {
    return window.innerHeight - 140;
  }
  return 800; // Default height for SSR
};

interface AnimationProps {
  isPlaying: boolean;
  speed: number;
  rhythms: number[];
  positions: number[];
  setPositions: (positions: number[]) => void;
  setSquareOpacities: (opacities: number[]) => void;
  synth: React.RefObject<Tone.PolySynth | null>;
  createParticles: (x: number, y: number, color: string) => void;
  colors: string[];
  boxWidth: number;
  onCollision: (color: string) => void;
}

// Base speed factor to scale the overall animation speed
const BASE_SPEED_FACTOR = 0.01;

export function useAnimation({
  isPlaying,
  speed,
  rhythms,
  positions,
  setPositions,
  setSquareOpacities,
  synth,
  createParticles,
  colors,
  boxWidth,
  onCollision
}: AnimationProps) {
  const lastImpactTimes = useRef<number[]>(Array(15).fill(0));
  const lastSounds = useRef<boolean[]>(Array(rhythms.length).fill(false));
  const animationFrame = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    // Only run animation on the client side
    if (typeof window === 'undefined') return;

    if (!isPlaying) {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      return;
    }

    // Reset animation state when rhythms change
    startTime.current = null;
    lastSounds.current = Array(rhythms.length).fill(false);
    lastImpactTimes.current = Array(rhythms.length).fill(performance.now() - 2000);

    // Don't restart animation if it's already running
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }

    console.log('Animation started, isPlaying:', isPlaying, 'speed:', speed, 'rhythms:', rhythms.length);

    const loop = (now: number) => {
      if (startTime.current === null) {
        startTime.current = now;
        console.log('Animation loop started at:', now);
      }

      // Calculate elapsed time in seconds since start
      const elapsedTime = (now - startTime.current) / 1000;
      
      // Get container height
      const containerHeight = getContainerHeight();
      const maxTravel = containerHeight - boxWidth;

      // Batch state updates
      const newPositions = new Array(positions.length);
      const newOpacities = new Array(positions.length);
      
      // Update all positions and handle collisions
      for (let i = 0; i < positions.length; i++) {
        // Calculate position based on rhythm and speed, scaled by base factor
        const frequency = speed * rhythms[i] * BASE_SPEED_FACTOR;
        const phase = (2 * Math.PI * frequency * elapsedTime) % (2 * Math.PI);
        const normalizedPos = (Math.sin(phase) + 1) / 2; // Normalize to 0-1 range
        
        // Store the new position
        newPositions[i] = normalizedPos;

        // Handle edge detection with a small threshold
        const threshold = 0.02;
        const atBottom = normalizedPos > (1 - threshold) && positions[i] <= normalizedPos;
        const atTop = normalizedPos < threshold && positions[i] >= normalizedPos;
        
        if ((atBottom || atTop) && !lastSounds.current[i] && synth.current) {
          // Trigger sound and visual effects
          const noteIndex = i % notes.length;
          synth.current.triggerAttackRelease(notes[noteIndex], "8n");
          
          // Calculate particle position
          const x = i * (boxWidth + 16) + boxWidth / 2;
          const y = atBottom ? containerHeight : boxWidth;
          
          // Create particles and trigger collision effect
          createParticles(x, y, colors[i]);
          onCollision(colors[i]);
          
          // Update timing references
          lastImpactTimes.current[i] = now;
          lastSounds.current[i] = true;
        } else if (!atBottom && !atTop) {
          lastSounds.current[i] = false;
        }

        // Calculate opacity based on time since last impact
        const timeSinceImpact = (now - lastImpactTimes.current[i]) / 1000;
        if (timeSinceImpact < 0.1) {
          newOpacities[i] = 1;
        } else {
          const fadeProgress = Math.min(1, (timeSinceImpact - 0.1) / 0.4);
          newOpacities[i] = Math.max(0.2, 1 - (fadeProgress * 0.8));
        }
      }

      // Batch update state
      setPositions(newPositions);
      setSquareOpacities(newOpacities);
      
      // Schedule next frame only if still playing
      if (isPlaying) {
        animationFrame.current = requestAnimationFrame(loop);
      }
    };

    // Start the animation loop
    startTime.current = null;
    animationFrame.current = requestAnimationFrame(loop);

    // Cleanup function
    return () => {
      if (animationFrame.current !== null) {
        console.log('Animation cleanup');
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
    };
  }, [isPlaying, speed, rhythms.length]); // Add rhythms.length to dependencies

  return { lastImpactTimes };
} 