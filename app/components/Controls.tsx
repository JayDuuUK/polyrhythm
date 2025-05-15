import React from 'react';
import { instruments } from '../constants/instruments';

const buttonStyle = {
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '4px',
  fontWeight: 'bold',
  cursor: 'pointer',
  margin: '0 8px'
} as const;

interface ControlsProps {
  masterVolume: number;
  setMasterVolume: (value: number) => void;
  selectedInstrument: string;
  setSelectedInstrument: (value: string) => void;
  speed: number;
  setBpm: (value: number) => void;
  removeRhythm: () => void;
  addRhythm: () => void;
  isPlaying: boolean;
  toggleTransport: () => void;
  reverbAmount: number;
  setReverbAmount: (value: number) => void;
  bassAmount: number;
  setBassAmount: (value: number) => void;
  rhythmsLength: number;
  glowIntensity: number;
  setGlowIntensity: (value: number) => void;
}

export function Controls({
  masterVolume,
  setMasterVolume,
  selectedInstrument,
  setSelectedInstrument,
  speed,
  setBpm,
  removeRhythm,
  addRhythm,
  isPlaying,
  toggleTransport,
  reverbAmount,
  setReverbAmount,
  bassAmount,
  setBassAmount,
  rhythmsLength,
  glowIntensity,
  setGlowIntensity
}: ControlsProps) {
  return (
    <div style={{ 
      width: '100%',
      display: 'flex', 
      justifyContent: 'center',
      padding: '20px 0',
      gap: '24px',
      backgroundColor: 'black',
      zIndex: 4
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label>Glow:</label>
        <input
          type="range"
          min="1"
          max="80"
          value={glowIntensity}
          onChange={(e) => setGlowIntensity(Number(e.target.value))}
          style={{
            width: '120px',
            accentColor: '#3b82f6'
          }}
        />
        <span>{glowIntensity}%</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={masterVolume}
          onChange={(e) => setMasterVolume(Number(e.target.value))}
          style={{
            width: '120px',
            accentColor: '#3b82f6'
          }}
        />
        <span>{masterVolume}%</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label>Instrument:</label>
        <select
          value={selectedInstrument}
          onChange={(e) => setSelectedInstrument(e.target.value)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#1f2937',
            color: 'white',
            border: '1px solid #374151',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {Object.keys(instruments).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label>Speed:</label>
        <input
          type="number"
          min="0.1"
          max="200"
          step="0.1"
          value={speed}
          onChange={(e) => {
            const newSpeed = Math.max(0.1, Math.min(200, Number(e.target.value)));
            console.log('Speed changed to:', newSpeed);
            setBpm(newSpeed);
          }}
          style={{
            width: '60px',
            padding: '4px 8px',
            backgroundColor: '#1f2937',
            color: 'white',
            border: '1px solid #374151',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={removeRhythm} style={buttonStyle} disabled={rhythmsLength <= 2}>
          Remove Rhythm
        </button>
        <button onClick={toggleTransport} style={buttonStyle}>
          {isPlaying ? "Stop" : "Start"}
        </button>
        <button onClick={addRhythm} style={buttonStyle} disabled={rhythmsLength >= 15}>
          Add Rhythm
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label>Reverb:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={reverbAmount}
          onChange={(e) => setReverbAmount(Number(e.target.value))}
          style={{
            width: '120px',
            accentColor: '#3b82f6'
          }}
        />
        <span>{reverbAmount}%</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label>Bass:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={bassAmount}
          onChange={(e) => setBassAmount(Number(e.target.value))}
          style={{
            width: '120px',
            accentColor: '#3b82f6'
          }}
        />
        <span>{bassAmount}%</span>
      </div>
    </div>
  );
} 