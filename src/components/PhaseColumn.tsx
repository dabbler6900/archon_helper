import type { ReactNode } from 'react';
import type { Phase } from '../data/workflows';
import { phaseConfig } from '../data/workflows';

interface PhaseColumnProps {
  phase: Phase;
  children: ReactNode;
}

export function PhaseColumn({ phase, children }: PhaseColumnProps) {
  const config = phaseConfig[phase];

  return (
    <div className="phase-column">
      <div className="phase-header" style={{ background: config.bg }}>
        <span className="phase-icon">{config.icon}</span>
        <span className="phase-label">{config.label}</span>
      </div>
      <div className="phase-content">
        {children}
      </div>
    </div>
  );
}
