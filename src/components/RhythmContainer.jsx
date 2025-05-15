import React, { memo, useMemo } from 'react';
import { colors } from '../constants/colors';

const RhythmContainer = memo(({ 
  rhythm, 
  index, 
  position, 
  squareOpacity, 
  boxWidth,
  onRhythmChange,
  positions,
  gap
}) => {
  // Memoize container styles
  const containerStyle = useMemo(() => ({
    width: boxWidth + 'px',
    height: '100%',
    border: `2px solid ${colors[index]}`,
    backgroundColor: '#0f172a',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column'
  }), [boxWidth, index]);

  // Memoize square styles
  const squareStyle = useMemo(() => ({
    position: 'absolute',
    left: 0,
    width: '100%',
    height: boxWidth + 'px',
    backgroundColor: colors[index],
    top: `calc(${position} * (100% - ${boxWidth}px))`,
    opacity: squareOpacity,
    transition: 'opacity 0.05s ease-out',
    zIndex: 3
  }), [boxWidth, index, position, squareOpacity]);

  // Memoize input styles
  const inputStyle = useMemo(() => ({
    width: '50px',
    padding: '4px',
    backgroundColor: '#1f2937',
    color: 'white',
    border: `1px solid ${colors[index]}`,
    borderRadius: '4px',
    margin: '8px auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 5
  }), [index]);

  // Only render path for first container
  const shouldRenderPath = index === 0 && positions.length > 1;

  return (
    <>
      {shouldRenderPath && (
        <svg 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%',
            height: '100%', 
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          <path
            d={useMemo(() => {
              const containerHeight = window.innerHeight - 140;
              const maxTravel = containerHeight - boxWidth;
              
              const points = positions.map((pos, i) => ({
                x: i * (boxWidth + gap) + boxWidth / 2,
                y: pos * maxTravel + boxWidth / 2
              }));

              let path = `M ${points[0].x} ${points[0].y}`;
              
              for (let i = 0; i < points.length - 1; i++) {
                const current = points[i];
                const next = points[i + 1];
                const dx = next.x - current.x;
                const dy = next.y - current.y;
                const tension = 0.5;
                const cp1x = current.x + dx * tension;
                const cp1y = current.y + dy * tension;
                const cp2x = next.x - dx * tension;
                const cp2y = next.y - dy * tension;
                path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`;
              }
              
              return path;
            }, [positions, boxWidth, gap])}
            stroke="white"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        </svg>
      )}
      <div style={containerStyle}>
        <div style={squareStyle} />
        <input
          type="number"
          min="1"
          max="20"
          value={rhythm}
          onChange={(e) => {
            const newValue = Math.max(1, Math.min(20, Math.floor(+e.target.value)));
            onRhythmChange(index, newValue);
          }}
          style={inputStyle}
        />
      </div>
    </>
  );
});

RhythmContainer.displayName = 'RhythmContainer';

export { RhythmContainer }; 