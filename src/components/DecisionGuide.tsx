import type { Workflow } from '../data/workflows';
import { workflows } from '../data/workflows';

interface DecisionGuideProps {
  onSelect: (workflow: Workflow) => void;
}

export function DecisionGuide({ onSelect }: DecisionGuideProps) {
  const handleCardClick = (workflowId: string) => {
    const wf = workflows.find(w => w.id === workflowId);
    if (wf) onSelect(wf);
  };

  return (
    <div className="decision-guide">
      <div className="guide-header">
        <h2>🚀 Start Here</h2>
        <p>Click a card that matches what you need — I'll guide you through the rest.</p>
      </div>

      <div className="guide-cards">
        <div className="guide-card" onClick={() => handleCardClick('idea-to-pr')}>
          <div className="guide-card-icon">💡</div>
          <div className="guide-card-content">
            <h3>I have a feature idea</h3>
            <p>Go from idea → working PR in one pipeline</p>
          </div>
        </div>

        <div className="guide-card" onClick={() => handleCardClick('interactive-prd')}>
          <div className="guide-card-icon">📋</div>
          <div className="guide-card-content">
            <h3>I have a vague idea</h3>
            <p>Answer questions, get a clear PRD first</p>
          </div>
        </div>

        <div className="guide-card" onClick={() => handleCardClick('fix-github-issue')}>
          <div className="guide-card-icon">🐛</div>
          <div className="guide-card-content">
            <h3>I found a bug</h3>
            <p>Fix it and create a PR automatically</p>
          </div>
        </div>

        <div className="guide-card" onClick={() => handleCardClick('smart-pr-review')}>
          <div className="guide-card-content">
            <div className="guide-card-icon">🔍</div>
            <h3>Review a PR</h3>
            <p>Smart adaptive review for any PR size</p>
          </div>
        </div>

        <div className="guide-card" onClick={() => handleCardClick('refactor-safely')}>
          <div className="guide-card-icon">🔄</div>
          <div className="guide-card-content">
            <h3>I need to refactor</h3>
            <p>Safe refactor with behavior checks</p>
          </div>
        </div>

        <div className="guide-card" onClick={() => handleCardClick('assist')}>
          <div className="guide-card-icon">❓</div>
          <div className="guide-card-content">
            <h3>Just help me</h3>
            <p>Questions, debugging, anything else</p>
          </div>
        </div>
      </div>
    </div>
  );
}
