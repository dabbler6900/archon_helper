import { phaseConfig, complexityConfig } from '../data/workflows';
import type { Workflow } from '../data/workflows';

interface WorkflowCardProps {
  workflow: Workflow;
  onClick: () => void;
}

export function WorkflowCard({ workflow, onClick }: WorkflowCardProps) {
  const phase = phaseConfig[workflow.phase];
  const complexity = complexityConfig[workflow.complexity];

  return (
    <div className="workflow-card" onClick={onClick}>
      <div className="card-header" style={{ borderColor: workflow.accentColor }}>
        <h3 className="card-name">{workflow.name}</h3>
        <span className="node-count">{workflow.nodes} nodes</span>
      </div>
      <p className="card-description">{workflow.description}</p>
      <div className="card-footer">
        <span className="phase-tag" style={{ background: phase.bg, color: phase.color }}>
          {phase.icon} {phase.label}
        </span>
        <span className="complexity-tag" style={{ color: complexity.color }}>
          {complexity.label}
        </span>
      </div>
    </div>
  );
}
