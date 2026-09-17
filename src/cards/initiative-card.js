'use strict';

const STATUS_CONFIG = {
  on_track:  { label: 'On Track',  color: 'Good',      icon: '🟢' },
  at_risk:   { label: 'At Risk',   color: 'Warning',   icon: '🟡' },
  delayed:   { label: 'Delayed',   color: 'Attention', icon: '🔴' },
  completed: { label: 'Completed', color: 'Accent',    icon: '✅' }
};

const SEVERITY_COLOR = { high: '🔴', medium: '🟡', low: '🟢' };

function buildInitiativeCard(initiative) {
  const cfg = STATUS_CONFIG[initiative.status] || STATUS_CONFIG.on_track;
  const doneMilestones = initiative.milestones.filter(m => m.done).length;
  const totalMilestones = initiative.milestones.length;

  const card = {
    type: 'AdaptiveCard',
    version: '1.5',
    body: [
      {
        type: 'Container', style: 'emphasis', bleed: true,
        items: [{ type: 'ColumnSet', columns: [
          { type: 'Column', width: 'stretch', items: [
            { type: 'TextBlock', text: initiative.name, weight: 'Bolder', size: 'Large', wrap: true, color: 'Light' },
            { type: 'TextBlock', text: initiative.description, size: 'Small', wrap: true, color: 'Light', spacing: 'None', isSubtle: true }
          ]},
          { type: 'Column', width: 'auto', items: [
            { type: 'TextBlock', text: `${cfg.icon} ${cfg.label}`, weight: 'Bolder', color: cfg.color, horizontalAlignment: 'Right' },
            { type: 'TextBlock', text: `Phase: ${initiative.phase}`, size: 'Small', horizontalAlignment: 'Right', color: 'Light', spacing: 'None', isSubtle: true }
          ]}
        ]}]
      },
      { type: 'TextBlock', text: `Progress: **${initiative.progress}%**  ·  Owner: ${initiative.owner}  ·  Target: ${initiative.targetDate}`, size: 'Small', wrap: true, spacing: 'Medium' },
      { type: 'ColumnSet', spacing: 'Small', columns: [
        { type: 'Column', width: `${initiative.progress}`, items: [
          { type: 'Container', style: initiative.status === 'at_risk' ? 'warning' : initiative.status === 'delayed' ? 'attention' : 'good', height: '8px', items: [] }
        ]},
        { type: 'Column', width: `${100 - initiative.progress}`, items: [
          { type: 'Container', style: 'default', height: '8px', items: [] }
        ]}
      ]},
      { type: 'Container', spacing: 'Medium', style: 'accent', items: [
        { type: 'TextBlock', text: '💡 Business Value', weight: 'Bolder', size: 'Small' },
        { type: 'TextBlock', text: initiative.businessValue, wrap: true, size: 'Small', spacing: 'None' }
      ]},
      { type: 'TextBlock', text: 'Key Metrics', weight: 'Bolder', size: 'Medium', spacing: 'Medium' },
      { type: 'ColumnSet', columns: buildKpiColumns(initiative.kpis) },
      { type: 'TextBlock', text: `Milestones  (${doneMilestones}/${totalMilestones} complete)`, weight: 'Bolder', size: 'Medium', spacing: 'Medium' },
      ...initiative.milestones.map(m => ({
        type: 'ColumnSet', spacing: 'Small',
        columns: [
          { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: m.done ? '✅' : '⬜', size: 'Small' }]},
          { type: 'Column', width: 'stretch', items: [{ type: 'TextBlock', text: m.label, size: 'Small', color: m.done ? 'Good' : 'Default', isSubtle: m.done }]},
          { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: m.date, size: 'Small', isSubtle: true, horizontalAlignment: 'Right' }]}
        ]
      }))
    ]
  };

  if (initiative.risks.length > 0) {
    card.body.push(
      { type: 'TextBlock', text: 'Risks & Issues', weight: 'Bolder', size: 'Medium', spacing: 'Medium', color: 'Attention' },
      ...initiative.risks.map(r => ({
        type: 'ColumnSet', spacing: 'Small',
        columns: [
          { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: SEVERITY_COLOR[r.severity] || '🟡', size: 'Small' }]},
          { type: 'Column', width: 'stretch', items: [{ type: 'TextBlock', text: r.label, size: 'Small', wrap: true }]}
        ]
      }))
    );
  }

  return card;
}

function buildKpiColumns(kpis) {
  const entries = Object.entries(kpis);
  const columns = [];
  for (let i = 0; i < entries.length; i += 2) {
    const pair = entries.slice(i, i + 2);
    columns.push({
      type: 'Column', width: 'stretch',
      items: pair.map(([key, val]) => ({
        type: 'Container', style: 'emphasis', items: [
          { type: 'TextBlock', text: val, weight: 'Bolder', size: 'Medium', horizontalAlignment: 'Center' },
          { type: 'TextBlock', text: key, size: 'Small', isSubtle: true, horizontalAlignment: 'Center', spacing: 'None', wrap: true }
        ]
      }))
    });
  }
  return columns;
}

module.exports = { buildInitiativeCard };
