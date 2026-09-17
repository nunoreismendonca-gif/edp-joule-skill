'use strict';

const STATUS_STYLE = { on_track:'good', at_risk:'warning', delayed:'attention', completed:'accent' };
const STATUS_LABEL = { on_track:'🟢 On Track', at_risk:'🟡 At Risk', delayed:'🔴 Delayed', completed:'✅ Completed' };

function buildSpacePageCards(initiative) {
  return [
    {
      id:'card-status', title:'📊 Initiative Status', position:1,
      adaptiveCard:{
        type:'AdaptiveCard', version:'1.5',
        body:[
          { type:'Container', style:STATUS_STYLE[initiative.status], bleed:true, items:[
            { type:'TextBlock', text:initiative.name, weight:'Bolder', size:'Large', color:'Light' },
            { type:'TextBlock', text:initiative.description, size:'Small', color:'Light', wrap:true, isSubtle:true, spacing:'None' }
          ]},
          { type:'ColumnSet', spacing:'Medium', columns:[
            { type:'Column', width:'stretch', items:[{ type:'Container', style:'emphasis', items:[
              { type:'TextBlock', text:'Status', size:'Small', isSubtle:true },
              { type:'TextBlock', text:STATUS_LABEL[initiative.status], weight:'Bolder', spacing:'None' }
            ]}]},
            { type:'Column', width:'stretch', items:[{ type:'Container', style:'emphasis', items:[
              { type:'TextBlock', text:'Progress', size:'Small', isSubtle:true },
              { type:'TextBlock', text:`${initiative.progress}%`, weight:'Bolder', spacing:'None' }
            ]}]},
            { type:'Column', width:'stretch', items:[{ type:'Container', style:'emphasis', items:[
              { type:'TextBlock', text:'Phase', size:'Small', isSubtle:true },
              { type:'TextBlock', text:initiative.phase, weight:'Bolder', spacing:'None', wrap:true }
            ]}]}
          ]},
          { type:'TextBlock', text:`Owner: ${initiative.owner}  ·  Target: ${initiative.targetDate}`, size:'Small', spacing:'Small' },
          { type:'ColumnSet', spacing:'Small', columns:[
            { type:'Column', width:`${initiative.progress}`, items:[{ type:'Container', style:STATUS_STYLE[initiative.status], height:'10px', items:[] }]},
            { type:'Column', width:`${100-initiative.progress}`, items:[{ type:'Container', style:'default', height:'10px', items:[] }]}
          ]}
        ]
      }
    },
    {
      id:'card-milestones', title:'🗓 Milestone Tracker', position:2,
      adaptiveCard:{
        type:'AdaptiveCard', version:'1.5',
        body:[
          { type:'Container', style:'emphasis', bleed:true, items:[
            { type:'TextBlock', text:'🗓 Milestone Tracker', weight:'Bolder', size:'Medium', color:'Light' },
            { type:'TextBlock', text:`${initiative.milestones.filter(m=>m.done).length} of ${initiative.milestones.length} complete`, size:'Small', color:'Light', isSubtle:true, spacing:'None' }
          ]},
          ...initiative.milestones.map(m=>({
            type:'ColumnSet', spacing:'Small',
            columns:[
              { type:'Column', width:'auto', items:[{ type:'TextBlock', text:m.done?'✅':'⬜', size:'Medium' }]},
              { type:'Column', width:'stretch', items:[{ type:'TextBlock', text:m.label, color:m.done?'Good':'Default', isSubtle:m.done, wrap:true }]},
              { type:'Column', width:'auto', items:[{ type:'TextBlock', text:m.date, size:'Small', isSubtle:true, horizontalAlignment:'Right' }]}
            ]
          }))
        ]
      }
    },
    {
      id:'card-kpis', title:'📈 KPI Dashboard', position:3,
      adaptiveCard:{
        type:'AdaptiveCard', version:'1.5',
        body:[
          { type:'Container', style:'emphasis', bleed:true, items:[
            { type:'TextBlock', text:'📈 Key Performance Indicators', weight:'Bolder', size:'Medium', color:'Light' }
          ]},
          { type:'ColumnSet', spacing:'Medium', columns: buildKpiCols(initiative.kpis) }
        ]
      }
    },
    {
      id:'card-risks', title:'⚠️ Risk Register', position:4,
      adaptiveCard:{
        type:'AdaptiveCard', version:'1.5',
        body:[
          { type:'Container', style:initiative.risks.length?'attention':'good', bleed:true, items:[
            { type:'TextBlock', text:'⚠️ Risk Register', weight:'Bolder', size:'Medium', color:'Light' },
            { type:'TextBlock', text:initiative.risks.length?`${initiative.risks.length} active risk(s)`:'No active risks', size:'Small', color:'Light', isSubtle:true, spacing:'None' }
          ]},
          ...(initiative.risks.length===0
            ?[{ type:'TextBlock', text:'✅ No risks identified. Initiative is on track.', spacing:'Medium', color:'Good', wrap:true }]
            :initiative.risks.map(r=>({
                type:'Container', style:r.severity==='high'?'attention':r.severity==='medium'?'warning':'default', spacing:'Small',
                items:[{ type:'ColumnSet', columns:[
                  { type:'Column', width:'auto', items:[{ type:'TextBlock', text:r.severity==='high'?'🔴':r.severity==='medium'?'🟡':'🟢' }]},
                  { type:'Column', width:'stretch', items:[{ type:'TextBlock', text:r.label, wrap:true, size:'Small' }]},
                  { type:'Column', width:'auto', items:[{ type:'TextBlock', text:r.severity.toUpperCase(), size:'Small', weight:'Bolder', color:r.severity==='high'?'Attention':'Warning' }]}
                ]}]
              }))
          )
        ]
      }
    },
    {
      id:'card-value', title:'💡 Business Value', position:5,
      adaptiveCard:{
        type:'AdaptiveCard', version:'1.5',
        body:[
          { type:'Container', style:'accent', bleed:true, items:[
            { type:'TextBlock', text:'💡 Business Value & Impact', weight:'Bolder', size:'Medium', color:'Light' }
          ]},
          { type:'TextBlock', text:initiative.businessValue, wrap:true, size:'Medium', spacing:'Medium', weight:'Bolder' },
          { type:'TextBlock', text:'Expected Outcomes', weight:'Bolder', size:'Small', spacing:'Medium', color:'Accent' },
          { type:'ColumnSet', columns:buildKpiCols(initiative.kpis) }
        ]
      }
    }
  ];
}

function buildKpiCols(kpis) {
  const entries = Object.entries(kpis);
  const cols = [];
  for (let i=0;i<entries.length;i+=2) {
    const pair = entries.slice(i,i+2);
    cols.push({ type:'Column', width:'stretch',
      items:pair.map(([k,v])=>({ type:'Container', style:'emphasis', spacing:'Small', items:[
        { type:'TextBlock', text:v, weight:'Bolder', size:'Large', horizontalAlignment:'Center', color:'Accent' },
        { type:'TextBlock', text:k, size:'Small', isSubtle:true, horizontalAlignment:'Center', spacing:'None', wrap:true }
      ]}))
    });
  }
  return cols;
}

module.exports = { buildSpacePageCards };
