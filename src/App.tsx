import { useState, useCallback } from 'react';
import { workflows, type Workflow, type Phase, phaseConfig } from './data/workflows';
import { WorkflowCard } from './components/WorkflowCard';
import { WorkflowDetail } from './components/WorkflowDetail';
import { DecisionTree } from './components/DecisionTree';
import { DecisionGuide } from './components/DecisionGuide';
import './App.css';

type View = 'hub' | 'browse' | 'tree' | 'detail';

function App() {
  const [view, setView] = useState<View>('hub');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleWorkflowSelect = useCallback((workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setView('detail');
  }, []);

  const handleBack = useCallback(() => {
    setSelectedWorkflow(null);
    setView(selectedPhase ? 'browse' : 'hub');
  }, [selectedPhase]);

  const handleBrowsePhase = useCallback((phase: Phase) => {
    setSelectedPhase(phase);
    setView('browse');
  }, []);

  const handleExportMd = useCallback(() => {
    const content = generateMarkdown();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'archon-workflows.md';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const filteredWorkflows = searchQuery
    ? workflows.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.trigger.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : selectedPhase
      ? workflows.filter(w => w.phase === selectedPhase)
      : workflows;

  if (view === 'detail' && selectedWorkflow) {
    return (
      <div className="app">
        <WorkflowDetail
          workflow={selectedWorkflow}
          onBack={handleBack}
          onUse={handleWorkflowSelect}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">🏛️ Archon Hub</h1>
          <p className="app-subtitle">Your workflow command center</p>
        </div>
        <div className="header-actions">
          <button className="header-btn" onClick={() => setView('hub')}>Hub</button>
          <button className="header-btn" onClick={() => setView('browse')}>Browse</button>
          <button className="header-btn" onClick={() => setView('tree')}>Tree</button>
          <button className="header-btn export-btn" onClick={handleExportMd}>Export .md</button>
        </div>
      </header>

      {view === 'hub' && (
        <div className="hub-view">
          <DecisionGuide onSelect={handleWorkflowSelect} />

          <section className="phase-nav">
            <h2>Or browse by phase:</h2>
            <div className="phase-buttons">
              {(['plan', 'build', 'review', 'fix', 'maintain', 'special'] as Phase[]).map(phase => {
                const config = phaseConfig[phase];
                return (
                  <button
                    key={phase}
                    className="phase-nav-btn"
                    style={{ background: config.bg }}
                    onClick={() => handleBrowsePhase(phase)}
                  >
                    {config.icon} {config.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="quick-search">
            <input
              type="text"
              placeholder="🔍 Search workflows..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <div className="search-results">
                {filteredWorkflows.map(w => (
                  <div
                    key={w.id}
                    className="search-result-item"
                    onClick={() => handleWorkflowSelect(w)}
                  >
                    <span className="result-name">{w.name}</span>
                    <span className="result-phase" style={{ color: phaseConfig[w.phase].bg }}>
                      {w.phase}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {view === 'browse' && (
        <div className="browse-view">
          <div className="browse-header">
            <button className="back-btn" onClick={() => { setSelectedPhase(null as any); setView('hub'); }}>
              ← Back
            </button>
            <h2>
              {selectedPhase ? (
                <>
                  <span style={{ color: phaseConfig[selectedPhase].bg }}>
                    {phaseConfig[selectedPhase].icon} {phaseConfig[selectedPhase].label}
                  </span>
                  {' '}Workflows
                </>
              ) : (
                'All Workflows'
              )}
            </h2>
            {!selectedPhase && (
              <div className="phase-filter-chips">
                {(['plan', 'build', 'review', 'fix', 'maintain', 'special'] as Phase[]).map(phase => (
                  <button
                    key={phase}
                    className="chip"
                    style={{ background: phaseConfig[phase].bg }}
                    onClick={() => handleBrowsePhase(phase)}
                  >
                    {phaseConfig[phase].icon} {phaseConfig[phase].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {searchQuery && (
            <p className="search-info">
              Found {filteredWorkflows.length} result(s) for "{searchQuery}"
            </p>
          )}

          <div className="workflows-grid">
            {filteredWorkflows.map(w => (
              <WorkflowCard
                key={w.id}
                workflow={w}
                onClick={() => handleWorkflowSelect(w)}
              />
            ))}
          </div>
        </div>
      )}

      {view === 'tree' && (
        <div className="tree-view">
          <DecisionTree onSelect={handleWorkflowSelect} />
        </div>
      )}

      <footer className="app-footer">
        <p>19 workflows · Phase-coded · Exportable · WSL-ready</p>
      </footer>
    </div>
  );
}

function generateMarkdown(): string {
  const groups: Record<string, { label: string; icon: string; workflows: Workflow[] }> = {
    plan: { label: '📋 Planning', icon: '📋', workflows: [] },
    build: { label: '🔨 Build / Implement', icon: '🔨', workflows: [] },
    review: { label: '🔍 Review', icon: '🔍', workflows: [] },
    fix: { label: '🐛 Fix Issues', icon: '🐛', workflows: [] },
    maintain: { label: '🛠️ Maintain', icon: '🛠️', workflows: [] },
    special: { label: '🎯 Special', icon: '🎯', workflows: [] },
  };

  workflows.forEach(w => {
    if (groups[w.phase]) groups[w.phase].workflows.push(w);
  });

  let md = `# Archon Workflow Map

> Generated from Archon Hub — browsable, exportable, runnable.
> ${new Date().toISOString().split('T')[0]}

## Quick Decision Tree

\`\`\`
WHAT DO YOU WANT TO DO?
├── Bug/Problem     → create-issue / fix-github-issue / issue-review-full
├── Feature Idea    → interactive-prd / idea-to-pr / adversarial-dev / ralph-dag
├── Review PR       → smart-pr-review / comprehensive-pr-review / validate-pr
├── Refactor        → refactor-safely / architect / resolve-conflicts
└── Just Help       → assist
\`\`\`

## All Workflows
`;

  Object.entries(groups).forEach(([, { label, workflows: ws }]) => {
    md += `\n### ${label}\n\n`;
    ws.forEach(w => {
      md += `#### \`${w.name}\`\n`;
      md += `- **Description:** ${w.description}\n`;
      md += `- **When to use:** ${w.whenToUse}\n`;
      md += `- **Not for:** ${w.notFor}\n`;
      md += `- **Nodes:** ${w.nodes} · **Type:** ${w.type} · **Complexity:** ${w.complexity}\n`;
      md += `- **Triggers:** ${w.trigger.map(t => `"${t}"`).join(', ')}\n\n`;
    });
  });

  md += `\n---\n*Generated from Archon Hub*\n`;
  return md;
}

export default App;
