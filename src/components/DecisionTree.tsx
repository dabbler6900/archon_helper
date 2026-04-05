import { useState } from 'react';
import { workflows } from '../data/workflows';
import type { Workflow } from '../data/workflows';

interface DecisionNode {
  id: string;
  label: string;
  emoji: string;
  options: { label: string; emoji: string; target: string | Workflow }[];
}

const decisionTree: DecisionNode[] = [
  {
    id: 'root',
    label: 'What do you want to do?',
    emoji: '🎯',
    options: [
      { label: 'Bug/Problem', emoji: '🐛', target: 'bug-category' },
      { label: 'Feature Idea', emoji: '💡', target: 'idea-category' },
      { label: 'Review PR', emoji: '🔍', target: 'review-category' },
      { label: 'Refactor', emoji: '🔄', target: 'maintain-category' },
      { label: 'Just Help', emoji: '❓', target: 'assist' },
    ],
  },
  {
    id: 'bug-category',
    label: 'What do you want to do with this bug?',
    emoji: '🐛',
    options: [
      { label: 'Just report it', emoji: '📝', target: 'create-issue' },
      { label: 'Fix it + PR', emoji: '🔧', target: 'fix-github-issue' },
      { label: 'Critical - Full review', emoji: '🚨', target: 'issue-review-full' },
    ],
  },
  {
    id: 'idea-category',
    label: 'How clear is your idea?',
    emoji: '💡',
    options: [
      { label: 'Vague - Need to flesh out', emoji: '🤔', target: 'interactive-prd' },
      { label: 'Clear - Go build it!', emoji: '🚀', target: 'idea-to-pr' },
      { label: 'App from scratch', emoji: '🏗️', target: 'adversarial-dev' },
      { label: 'Have user stories', emoji: '📋', target: 'ralph-dag' },
    ],
  },
  {
    id: 'review-category',
    label: 'What kind of review?',
    emoji: '🔍',
    options: [
      { label: 'Quick check', emoji: '⚡', target: 'smart-pr-review' },
      { label: 'Thorough - 5 agents', emoji: '🔬', target: 'comprehensive-pr-review' },
      { label: 'Prove fix works', emoji: '✅', target: 'validate-pr' },
    ],
  },
  {
    id: 'maintain-category',
    label: 'What maintenance task?',
    emoji: '🛠️',
    options: [
      { label: 'Safe refactor', emoji: '🔄', target: 'refactor-safely' },
      { label: 'Architecture sweep', emoji: '🏗️', target: 'architect' },
      { label: 'Fix merge conflicts', emoji: '⚔️', target: 'resolve-conflicts' },
    ],
  },
];

export function DecisionTree({ onSelect }: { onSelect: (workflow: Workflow) => void }) {
  const [history, setHistory] = useState<string[]>(['root']);
  const currentId = history[history.length - 1];

  const currentNode = decisionTree.find(n => n.id === currentId)!;

  const handleSelect = (target: string | Workflow) => {
    if (typeof target === 'string') {
      setHistory(prev => [...prev, target]);
    } else {
      onSelect(target);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleReset = () => {
    setHistory(['root']);
  };

  const workflow = currentId.endsWith('-issue') || currentId.endsWith('-pr') || currentId === 'assist' || currentId.includes('-')
    ? workflows.find(w => w.id === currentId)
    : undefined;

  return (
    <div className="decision-tree">
      <div className="tree-header">
        <button className="tree-nav-btn" onClick={handleBack} disabled={history.length === 1}>
          ← Back
        </button>
        <button className="tree-nav-btn" onClick={handleReset}>
          🔄 Reset
        </button>
        <span className="tree-breadcrumb">
          {history.map((id, i) => {
            const node = decisionTree.find(n => n.id === id);
            return i > 0 ? ` → ${node?.emoji} ${node?.label}` : '';
          })}
        </span>
      </div>

      <div className="tree-current">
        <div className="tree-question">
          <span className="tree-emoji">{currentNode.emoji}</span>
          <h3>{currentNode.label}</h3>
        </div>

        <div className="tree-options">
          {currentNode.options.map((option, i) => (
            <button
              key={i}
              className="tree-option"
              onClick={() => handleSelect(option.target)}
            >
              <span className="option-emoji">{option.emoji}</span>
              <span className="option-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {workflow && (
        <div className="tree-workflow-preview">
          <h4>📦 {workflow.name}</h4>
          <p>{workflow.description}</p>
          <div className="preview-meta">
            <span>{workflow.nodes} nodes</span>
            <span>{workflow.complexity}</span>
          </div>
          <button
            className="use-workflow-btn"
            onClick={() => onSelect(workflow)}
          >
            Use this Workflow →
          </button>
        </div>
      )}
    </div>
  );
}
