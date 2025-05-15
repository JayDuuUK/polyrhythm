import React, { memo, useMemo } from 'react';

const Particle = memo(({ particle }) => {
  const style = useMemo(() => ({
    position: 'absolute',
    left: particle.x,
    top: particle.y,
    width: particle.radius * 2 + 'px',
    height: particle.radius * 2 + 'px',
    border: `${particle.borderWidth}px solid ${particle.color}`,
    borderRadius: '50%',
    opacity: particle.life,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 4
  }), [
    particle.x,
    particle.y,
    particle.radius,
    particle.borderWidth,
    particle.color,
    particle.life
  ]);

  return <div style={style} />;
});

const Particles = memo(({ particles }) => {
  return (
    <>
      {particles.map(particle => (
        <Particle key={particle.id} particle={particle} />
      ))}
    </>
  );
});

Particle.displayName = 'Particle';
Particles.displayName = 'Particles';

export { Particles }; 