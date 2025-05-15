import { useState, useRef, useEffect } from 'react';

export function useParticles() {
  const [particles, setParticles] = useState([]);
  const particleId = useRef(0);
  const maxParticles = 50; // Limit total particles for performance

  const createParticles = (x, y, color) => {
    // Create a single ring particle
    const newParticle = {
      id: particleId.current++,
      x,
      y,
      color,
      life: 1, // Life from 1 to 0
      radius: 10, // Starting radius
      maxRadius: 50, // Maximum radius before fading out
      borderWidth: 2 // Ring border width
    };
    
    setParticles(prev => {
      // If we're at max particles, replace the oldest one
      if (prev.length >= maxParticles) {
        return [...prev.slice(1), newParticle];
      }
      return [...prev, newParticle];
    });
  };

  // Particle animation effect with optimized updates
  useEffect(() => {
    if (particles.length === 0) return;

    let frame;
    const animate = () => {
      setParticles(prev => 
        prev.reduce((acc, p) => {
          const life = p.life - 0.02;
          if (life <= 0) return acc;
          
          acc.push({
            ...p,
            radius: p.radius + (p.maxRadius - p.radius) * 0.1,
            life,
            borderWidth: p.borderWidth * 0.97
          });
          return acc;
        }, [])
      );
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [particles.length]); // Only re-run effect when particle count changes

  return { particles, createParticles };
} 