import type { ReactNode } from 'react';
import type { Phase } from '../data/workflows';
import { phaseConfig } from '../data/workflows';

interface PhaseSectionProps {
  phase: Phase;
  title: string;
  emoji: string;
  children: ReactNode;
}

export function PhaseSection({ phase, title, emoji, children }: PhaseSectionProps) {
  const config = phaseConfig[phase];

  return (
    <section className="phase-section" data-phase={phase}>
      <div className="section-header" style={{ background: config.bg }}>
        <span className="section-emoji">{emoji}</span>
        <h2 className="section-title">{title}</h2>
        <span className="section-phase-tag">{config.label}</span>
      </div>
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}
