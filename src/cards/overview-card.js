'use strict';

const STATUS_CONFIG = {
  on_track:  { label: 'On Track',  icon: '🟢', style: 'good'      },
  at_risk:   { label: 'At Risk',   icon: '🟡', style: 'warning'   },
  delayed:   { label: 'Delayed',   icon: '🔴', style: 'attention' },
  completed: { label: 'Completed', icon: '✅', style: 'accent'    }
};

function buildOverviewCard(initiatives, filterStatus) {
  const filtered = filterStatus ? initiatives.filter(i => i.status === filterStatus) : initiatives;
  const counts = initiatives.reduce((acc, i) => { acc[i.status] = (acc[i.status] || 0) + 1; return acc; }, {});
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return {
    type: 'AdaptiveCard', version: '1.5',
    body: [
      // Greeting — only shown on the initial (unfiltered) overview
      ...(!filterStatus ? [{
        type: 'Container', style: 'accent', bleed: true, items: [
          { type: 'TextBlock', text: 'Hello, EDP! 👋', weight: 'Bolder', size: 'Large', color: 'Light' },
          { type: 'TextBlock', wrap: true, color: 'Light', spacing: 'Small',
            text: "I'm Joule, your AI guide to the world of our AI initiatives. I'll walk you through the status of the key initiatives we're running — what's on track, what needs attention, and where the magic (or the occasional AI headache) is happening.\n\nLet's get started. 🚀" }
        ]
      }] : []),
      { type: 'Container', style: 'emphasis', bleed: true, items: [
        { type: 'ColumnSet', columns: [
          { type: 'Column', width: 'stretch', items: [
            { type: 'TextBlock', text: '⚡ EDP AI Initiatives', weight: 'Bolder', size: 'ExtraLarge', color: 'Light' },
            { type: 'TextBlock', text: 'Executive Status Review', size: 'Medium', color: 'Light', spacing: 'None', isSubtle: true }
          ]},
          { type: 'Column', width: 'auto', items: [
            { type: 'TextBlock', text: today, size: 'Small', color: 'Light', isSubtle: true, horizontalAlignment: 'Right' },
            { type: 'TextBlock', text: `${initiatives.length} Initiatives`, weight: 'Bolder', color: 'Light', horizontalAlignment: 'Right', spacing: 'None' }
          ]}
        ]}
      ]},
      { type: 'ColumnSet', spacing: 'Medium',
        columns: Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
          type: 'Column', width: 'stretch', items: [{
            type: 'Container', style: cfg.style, items: [
              { type: 'TextBlock', text: `${counts[key] || 0}`, weight: 'Bolder', size: 'ExtraLarge', horizontalAlignment: 'Center' },
              { type: 'TextBlock', text: `${cfg.icon} ${cfg.label}`, size: 'Small', horizontalAlignment: 'Center', spacing: 'None', wrap: true }
            ]
          }]
        }))
      },
      ...(filterStatus ? [{ type: 'TextBlock', text: `Showing: ${STATUS_CONFIG[filterStatus].icon} ${STATUS_CONFIG[filterStatus].label}`, weight: 'Bolder', spacing: 'Medium', color: 'Accent' }] : []),
      { type: 'TextBlock', text: 'Initiative Status at a Glance', weight: 'Bolder', size: 'Medium', spacing: 'Medium' },
      ...buildInitiativeTiles(filtered)
    ],
    actions: [
      { type: 'Action.Submit', title: '🟢 On Track',  data: { action: 'filter', status: 'on_track' } },
      { type: 'Action.Submit', title: '🟡 At Risk',   data: { action: 'filter', status: 'at_risk' } },
      { type: 'Action.Submit', title: '🔴 Delayed',   data: { action: 'filter', status: 'delayed' } },
      { type: 'Action.Submit', title: '✅ Completed', data: { action: 'filter', status: 'completed' } }
    ]
  };
}

function buildInitiativeTiles(initiatives) {
  const rows = [];
  for (let i = 0; i < initiatives.length; i += 2) {
    const pair = initiatives.slice(i, i + 2);
    rows.push({
      type: 'ColumnSet', spacing: 'Small',
      columns: pair.map(init => {
        const cfg = STATUS_CONFIG[init.status];
        return {
          type: 'Column', width: 'stretch', items: [{
            type: 'Container', style: cfg.style,
            selectAction: { type: 'Action.Submit', data: { action: 'detail', id: init.id } },
            items: [
              { type: 'ColumnSet', columns: [
                { type: 'Column', width: 'stretch', items: [{ type: 'TextBlock', text: init.name, weight: 'Bolder', size: 'Small', wrap: true }]},
                { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: cfg.icon, size: 'Medium', horizontalAlignment: 'Right' }]}
              ]},
              { type: 'TextBlock', text: `${init.progress}%  ·  ${init.phase}`, size: 'Small', isSubtle: true, spacing: 'None' },
              { type: 'ColumnSet', spacing: 'None', columns: [
                { type: 'Column', width: `${init.progress}`, items: [{ type: 'Container', style: cfg.style, height: '6px', items: [] }]},
                { type: 'Column', width: `${100 - init.progress}`, items: [{ type: 'Container', style: 'default', height: '6px', items: [] }]}
              ]},
              { type: 'TextBlock', text: `🎯 ${init.targetDate}`, size: 'Small', spacing: 'Small' }
            ]
          }]
        };
      })
    });
  }
  return rows;
}

module.exports = { buildOverviewCard };
