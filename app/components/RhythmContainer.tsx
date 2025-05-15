import React, { memo, useMemo } from 'react';
import { colors } from '../constants/colors';

interface RhythmContainerProps {
  rhythm: number;
  index: number;
  position: number;
  squareOpacity: number;
  boxWidth: number;
  onRhythmChange: (index: number, value: number) => void;
  positions: number[];
  gap: number;
}

const RhythmContainer = memo(({ 
  rhythm, 
  index, 
  position, 
  squareOpacity, 
  boxWidth,
  onRhythmChange
}: RhythmContainerProps) => {
  // Memoize container styles
  const containerStyle = useMemo(() => ({
    width: boxWidth + 'px',
    height: '100%',
    border: `2px solid ${colors[index]}`,
    backgroundColor: '#0f172a',
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column' as const
  }), [boxWidth, index]);

  // Memoize square styles
  const squareStyle = useMemo(() => ({
    position: 'absolute' as const,
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
    textAlign: 'center' as const,
    position: 'relative' as const,
    zIndex: 5
  }), [index]);

  return (
    <div style={containerStyle}>
      <div style={squareStyle} />
      <input
        type="number"
        min="1"
        max="20"
        value={rhythm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = Math.max(1, Math.min(20, Math.floor(+e.target.value)));
          onRhythmChange(index, newValue);
        }}
        style={inputStyle}
      />
    </div>
  );
});

RhythmContainer.displayName = 'RhythmContainer';

export { RhythmContainer }; 