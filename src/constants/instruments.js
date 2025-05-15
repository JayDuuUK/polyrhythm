// Available instruments with their configurations
export const instruments = {
  Synth: {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
  },
  "Soft Sine": {
    oscillator: { type: "sine" },
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1.5 }
  },
  "Crystal": {
    oscillator: { type: "sine" },
    envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.7 },
    portamento: 0.05
  },
  "Square Lead": {
    oscillator: { type: "square" },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
  },
  AMSynth: {
    harmonicity: 3,
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
  },
  FMSynth: {
    harmonicity: 2,
    modulationIndex: 3,
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
  },
  "Pluck": {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
  },
  "Bell": {
    harmonicity: 8,
    modulationIndex: 20,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.1, release: 0.7 }
  },
  MembraneSynth: {
    pitchDecay: 0.05,
    octaves: 4,
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
  },
  MetalSynth: {
    frequency: 200,
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  },
  "Kalimba": {
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.1 },
    noise: { type: "pink", volume: -20 }
  },
  "Glass": {
    harmonicity: 12,
    modulationIndex: 10,
    envelope: { attack: 0.02, decay: 0.5, sustain: 0.1, release: 1 },
    modulation: { type: "sine" },
    modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
  },
  "Marimba": {
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    filter: { type: "lowpass", frequency: 2000, Q: 1 }
  },
  "Chimes": {
    harmonicity: 10,
    modulationIndex: 50,
    envelope: { attack: 0.001, decay: 1, sustain: 0.1, release: 3 },
    modulation: { type: "square" }
  }
}; 