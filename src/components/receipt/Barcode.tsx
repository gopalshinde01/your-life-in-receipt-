import React from 'react';

export interface BarcodeProps {
  value: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ value }) => {
  // Generate deterministic bar widths from string characters
  const bars: number[] = [];
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    bars.push((charCode % 3) + 1);
    bars.push(((charCode >> 1) % 2) + 1);
    bars.push(((charCode >> 2) % 3) + 1);
  }

  return (
    <div className="flex flex-col items-center my-3" aria-label={`Receipt barcode: ${value}`}>
      <div className="flex items-end justify-center h-12 gap-[2px] w-full max-w-[240px] px-2" aria-hidden="true">
        {bars.map((width, idx) => (
          <div
            key={idx}
            className="bg-current self-stretch"
            style={{ width: `${width * 1.5}px` }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] sm:text-xs opacity-75 mt-1 tracking-widest uppercase">
        {value}
      </span>
    </div>
  );
};
