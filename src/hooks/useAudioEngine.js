import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { instruments } from '../constants/instruments';

export function useAudioEngine({
  selectedInstrument,
  reverbAmount,
  bassAmount,
  masterVolume
}) {
  const synth = useRef(null);
  const reverb = useRef(null);
  const bassFilter = useRef(null);

  // Effect to handle instrument changes
  useEffect(() => {
    if (!synth.current || !bassFilter.current || !reverb.current) return;

    // Dispose of the old synth
    synth.current.dispose();

    // Create the new synth with selected instrument config
    let newSynth;
    const config = instruments[selectedInstrument];

    // Handle special cases for built-in Tone.js instruments
    if (['AMSynth', 'FMSynth', 'MembraneSynth', 'MetalSynth'].includes(selectedInstrument)) {
      const InstrumentClass = Tone[selectedInstrument];
      newSynth = new Tone.PolySynth(InstrumentClass, config);
    } else {
      // For custom instruments, use base Synth with custom config
      newSynth = new Tone.PolySynth(Tone.Synth, config);
    }

    synth.current = newSynth;

    // Set volume and connect to effects chain
    synth.current.volume.value = -10;
    synth.current.connect(bassFilter.current);
  }, [selectedInstrument]);

  // Initial setup effect
  useEffect(() => {
    // Create reverb effect
    reverb.current = new Tone.Reverb({
      decay: 2.5,
      wet: reverbAmount / 100,
      preDelay: 0.1
    }).toDestination();

    // Create bass filter
    bassFilter.current = new Tone.Filter({
      type: "lowshelf",
      frequency: 200,
      gain: 0
    });

    // Create initial synth
    const InstrumentClass = Tone[selectedInstrument];
    synth.current = new Tone.PolySynth(InstrumentClass, instruments[selectedInstrument]);

    // Set volume to a reasonable level
    synth.current.volume.value = -10;

    // Connect the signal chain: synth -> bassFilter -> reverb -> destination
    synth.current.connect(bassFilter.current);
    bassFilter.current.connect(reverb.current);

    // Initialize audio context
    Tone.context.resume();

    return () => {
      reverb.current.dispose();
      bassFilter.current.dispose();
      synth.current.dispose();
    };
  }, []);

  // Effect to handle reverb amount changes
  useEffect(() => {
    if (!reverb.current) return;
    reverb.current.wet.value = reverbAmount / 100;
  }, [reverbAmount]);

  // Effect to handle bass amount changes
  useEffect(() => {
    if (!bassFilter.current) return;
    // Convert percentage to dB gain (-12 to +12 dB range)
    const gainDB = ((bassAmount / 100) * 24) - 12;
    bassFilter.current.gain.value = gainDB;
  }, [bassAmount]);

  // Effect to handle master volume changes
  useEffect(() => {
    if (!synth.current) return;
    // Convert percentage to dB (-Infinity to 0dB range)
    const volumeDB = masterVolume === 0 ? -Infinity : ((masterVolume / 100) * 30) - 30;
    synth.current.volume.value = volumeDB;
  }, [masterVolume]);

  return { synth };
} 