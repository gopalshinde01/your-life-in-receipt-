import React from 'react';

export interface DotLeaderItemProps {
  label: string;
  value: string;
  subLabel?: string;
  isBold?: boolean;
}

export const DotLeaderItem: React.FC<DotLeaderItemProps> = ({
  label,
  value,
  subLabel,
  isBold = false,
}) => {
  return (
    <div className={`dot-leader-row py-0.5 text-xs sm:text-sm ${isBold ? 'font-bold' : 'font-normal'}`}>
      <span className="dot-leader-left flex items-baseline gap-1">
        <span>{label}</span>
        {subLabel && <span className="text-[10px] text-neutral-500">({subLabel})</span>}
      </span>
      <span className="dot-leader-filler" aria-hidden="true" />
      <span className="dot-leader-right font-mono font-medium">{value}</span>
    </div>
  );
};
