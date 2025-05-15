import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { notes } from '../constants/colors';

// Helper function to calculate GCD (Greatest Common Divisor)
const gcd = (a, b) => {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

// Helper function to calculate LCM (Least Common Multiple)
const lcm = (a, b) => (a * b) / gcd(a, b);

// Helper function to calculate LCM of an array of numbers
const lcmArray = (arr) => arr.reduce((a, b) => lcm(a, b));

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
}) {
  const lastImpactTimes = useRef(Array(15).fill(0));
  const lastSounds = useRef(Array(rhythms.length).fill(false));
  const animationFrame = useRef(null);
  const startTime = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      return;
    }

    const loop = (now) => {
      if (!startTime.current) {
        startTime.current = now;
      }

      // Calculate elapsed time in seconds since start
      const elapsedTime = (now - startTime.current) / 1000;
      
      // Pre-calculate container height
      const containerHeight = window.innerHeight - 140;

      // Batch state updates
      const newPositions = new Array(positions.length);
      const newOpacities = new Array(positions.length);
      
      // Update all positions and handle collisions
      for (let i = 0; i < positions.length; i++) {
        // Calculate position based on rhythm and speed
        const frequency = (speed / 60) * rhythms[i];
        const phase = (2 * Math.PI * elapsedTime * frequency) % (2 * Math.PI);
        const newPos = (Math.sin(phase - Math.PI/2) + 1) / 2;

        // Handle edge detection
        const atBottom = newPos > 0.995 && positions[i] <= newPos;
        const atTop = newPos < 0.005 && positions[i] >= newPos;
        
        if ((atBottom || atTop) && !lastSounds.current[i] && synth.current) {
          const noteIndex = i % notes.length;
          synth.current.triggerAttackRelease(notes[noteIndex], "8n");
          const x = i * (boxWidth + 16) + boxWidth / 2;
          const y = atBottom ? containerHeight - boxWidth : 0;
          createParticles(x, y, colors[i]);
          onCollision(colors[i]);
          lastImpactTimes.current[i] = now;
          lastSounds.current[i] = true;
        } else if (!atBottom && !atTop) {
          lastSounds.current[i] = false;
        }

        newPositions[i] = newPos;

        // Calculate opacity
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
      
      animationFrame.current = requestAnimationFrame(loop);
    };

    Tone.start();
    startTime.current = null;
    lastSounds.current = Array(rhythms.length).fill(false);
    lastImpactTimes.current = Array(rhythms.length).fill(performance.now() - 2000);
    animationFrame.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isPlaying, speed, rhythms.length]);

  return { lastImpactTimes };
} 