import type { Workflow } from '../data/workflows';

interface WorkflowDetailProps {
  workflow: Workflow;
  onBack: () => void;
  onUse: (workflow: Workflow) => void;
}

export function WorkflowDetail({ workflow, onBack, onUse }: WorkflowDetailProps) {
  return (
    <div className="workflow-detail">
      <button className="back-btn" onClick={onBack}>← Back to Hub</button>

      <div className="detail-header" style={{ borderColor: workflow.accentColor }}>
        <div className="detail-title-row">
          <h2 className="detail-name">{workflow.name}</h2>
          <span className="phase-badge" style={{ background: workflow.accentColor }}>
            {workflow.phase.toUpperCase()}
          </span>
        </div>
        <p className="detail-description">{workflow.description}</p>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>🎯 When to Use</h3>
          <p>{workflow.whenToUse}</p>
        </div>

        <div className="detail-card">
          <h3>🚫 Not For</h3>
          <p>{workflow.notFor}</p>
        </div>

        <div className="detail-card">
          <h3>⚡ Technical Info</h3>
          <ul>
            <li><strong>Nodes:</strong> {workflow.nodes}</li>
            <li><strong>Type:</strong> {workflow.type}</li>
            <li><strong>Complexity:</strong> {workflow.complexity}</li>
          </ul>
        </div>

        <div className="detail-card">
          <h3>💬 Triggers</h3>
          <div className="triggers">
            {workflow.trigger.map(t => (
              <span key={t} className="trigger-tag">"{t}"</span>
            ))}
          </div>
        </div>
      </div>

      <button
        className="use-btn"
        style={{ background: workflow.accentColor }}
        onClick={() => onUse(workflow)}
      >
        Use this Workflow
      </button>
    </div>
  );
}
