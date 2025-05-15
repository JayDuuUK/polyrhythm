// Vite + React + Tone.js
// Polyrhythm Visualizer

import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as Tone from "tone";
import { Controls } from "./components/Controls";
import { RhythmContainer } from "./components/RhythmContainer";
import { Particles } from "./components/Particles";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useParticles } from "./hooks/useParticles";
import { useAnimation } from "./hooks/useAnimation";
import { colors, notes } from "./constants/colors";

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setBpm] = useState(0.5);
  const [rhythms, setRhythms] = useState([1, 2, 3, 4, 5]);
  const [positions, setPositions] = useState(Array(5).fill(0.5));
  const [reverbAmount, setReverbAmount] = useState(50);
  const [bassAmount, setBassAmount] = useState(50);
  const [selectedInstrument, setSelectedInstrument] = useState("Synth");
  const [squareOpacities, setSquareOpacities] = useState(Array(5).fill(1));
  const [masterVolume, setMasterVolume] = useState(75);
  const [latestCollisionColor, setLatestCollisionColor] = useState(colors[0]);
  const [glowIntensity, setGlowIntensity] = useState(13); // 13% default opacity
  const [currentGlow, setCurrentGlow] = useState(13); // Actual glow value including pulse

  // Effect to handle glow pulsing
  useEffect(() => {
    setCurrentGlow(glowIntensity);
  }, [glowIntensity]);

  const handleCollision = useCallback((color) => {
    setLatestCollisionColor(color);
    // Spike the glow to 100% on collision
    setCurrentGlow(100);
    // Animate back to base intensity
    const startTime = performance.now();
    const duration = 500; // 500ms animation
    
    const animateGlow = (currentTime) => {
      const elapsed = currentTime - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        const newGlow = glowIntensity + (100 - glowIntensity) * (1 - eased);
        setCurrentGlow(newGlow);
        requestAnimationFrame(animateGlow);
      } else {
        setCurrentGlow(glowIntensity);
      }
    };
    
    requestAnimationFrame(animateGlow);
  }, [glowIntensity]);

  const { synth } = useAudioEngine({
    selectedInstrument,
    reverbAmount,
    bassAmount,
    masterVolume
  });

  const { particles, createParticles } = useParticles();

  useAnimation({
    isPlaying,
    speed,
    rhythms,
    positions,
    setPositions,
    setSquareOpacities,
    synth,
    createParticles,
    colors,
    boxWidth: 80,
    onCollision: handleCollision
  });

  const addRhythm = useCallback(() => {
    if (rhythms.length >= 15) return; // Maximum 15 rhythms
    const nextRhythm = rhythms[rhythms.length - 1] + 1;
    setRhythms(prev => [...prev, nextRhythm]);
    setPositions(prev => [...prev, 0.5]); // Start new squares in the middle
  }, [rhythms]);

  const removeRhythm = useCallback(() => {
    if (rhythms.length <= 2) return; // Minimum 2 rhythms
    setRhythms(prev => prev.slice(0, -1));
    setPositions(prev => prev.slice(0, -1));
  }, [rhythms.length]);

  const toggleTransport = useCallback(async () => {
    if (!isPlaying) {
      // Make sure Tone.js is initialized and the audio context is running
      await Tone.start();
      // Small delay to ensure audio context is fully running
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    setIsPlaying(prev => !prev);
  }, [isPlaying]);

  const handleRhythmChange = useCallback((index, newValue) => {
    setRhythms(prev => {
      const newRhythms = [...prev];
      newRhythms[index] = newValue;
      return newRhythms;
    });
  }, []);

  const boxWidth = 80;
  const gap = 16;

  // Memoize the background style
  const backgroundStyle = useMemo(() => {
    // Calculate gradient spread based on number of rhythms
    const spread = Math.min(100, 70 + (rhythms.length * 2));
    
    return {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: `radial-gradient(circle at center, 
        ${latestCollisionColor}${Math.round(currentGlow).toString(16).padStart(2, '0')} 0%, 
        ${latestCollisionColor}${Math.round(currentGlow * 0.7).toString(16).padStart(2, '0')} 35%,
        ${latestCollisionColor}${Math.round(currentGlow * 0.3).toString(16).padStart(2, '0')} 65%,
        #000000 ${spread}%)`,
      color: 'white',
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      transition: 'background 0.3s ease-out'
    };
  }, [latestCollisionColor, currentGlow, rhythms.length]);

  // Memoize the container style
  const containerStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${rhythms.length}, ${boxWidth}px)`,
    gap: `${gap}px`,
    position: 'relative',
    height: 'calc(100vh - 140px)',
    backgroundColor: 'black',
    alignSelf: 'center'
  }), [rhythms.length, boxWidth, gap]);

  return (
    <div style={backgroundStyle}>
      {/* Main visualization container */}
      <div style={containerStyle}>
        <Particles particles={particles} />

        {rhythms.map((rhythm, i) => (
          <RhythmContainer
            key={i}
            rhythm={rhythm}
            index={i}
            position={positions[i]}
            squareOpacity={squareOpacities[i]}
            boxWidth={boxWidth}
            onRhythmChange={handleRhythmChange}
            positions={positions}
            gap={gap}
          />
        ))}
      </div>

      <Controls
        masterVolume={masterVolume}
        setMasterVolume={setMasterVolume}
        selectedInstrument={selectedInstrument}
        setSelectedInstrument={setSelectedInstrument}
        speed={speed}
        setBpm={setBpm}
        removeRhythm={removeRhythm}
        addRhythm={addRhythm}
        isPlaying={isPlaying}
        toggleTransport={toggleTransport}
        reverbAmount={reverbAmount}
        setReverbAmount={setReverbAmount}
        bassAmount={bassAmount}
        setBassAmount={setBassAmount}
        rhythmsLength={rhythms.length}
        glowIntensity={glowIntensity}
        setGlowIntensity={setGlowIntensity}
      />
    </div>
  );
}