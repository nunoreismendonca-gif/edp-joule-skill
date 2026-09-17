'use strict';

function buildSpaceCreatedCard(space) {
  return {
    type:'AdaptiveCard', version:'1.5',
    body:[
      { type:'Container', style:'emphasis', bleed:true, items:[
        { type:'ColumnSet', columns:[
          { type:'Column', width:'auto', items:[{ type:'TextBlock', text:'🚀', size:'ExtraLarge' }]},
          { type:'Column', width:'stretch', items:[
            { type:'TextBlock', text:'Space Created Successfully', weight:'Bolder', size:'Large', color:'Light' },
            { type:'TextBlock', text:'SAP Joule Work', size:'Small', color:'Light', isSubtle:true, spacing:'None' }
          ]}
        ]}
      ]},
      { type:'TextBlock', text:space.name, weight:'Bolder', size:'ExtraLarge', spacing:'Medium' },
      { type:'TextBlock', text:space.description, wrap:true, spacing:'None' },
      { type:'ColumnSet', spacing:'Medium', columns:[
        { type:'Column', width:'stretch', items:[{ type:'Container', style:'emphasis', items:[
          { type:'TextBlock', text:'Visibility', size:'Small', isSubtle:true },
          { type:'TextBlock', text:space.visibility==='private'?'🔒 Private':'🌐 Public', weight:'Bolder', spacing:'None' }
        ]}]},
        { type:'Column', width:'stretch', items:[{ type:'Container', style:'emphasis', items:[
          { type:'TextBlock', text:'Members Invited', size:'Small', isSubtle:true },
          { type:'TextBlock', text:`${space.members.length}`, weight:'Bolder', spacing:'None' }
        ]}]},
        { type:'Column', width:'stretch', items:[{ type:'Container', style:'good', items:[
          { type:'TextBlock', text:'Status', size:'Small', isSubtle:true },
          { type:'TextBlock', text:'✅ Active', weight:'Bolder', spacing:'None' }
        ]}]}
      ]},
      ...(space.initiativeName?[{
        type:'Container', style:'accent', spacing:'Medium', items:[
          { type:'TextBlock', text:`🔗 Linked Initiative: ${space.initiativeName}`, size:'Small', weight:'Bolder' },
          { type:'TextBlock', text:'This space is connected to the AI initiative for collaboration and updates.', size:'Small', wrap:true, spacing:'None' }
        ]
      }]:[]),
      ...(space.members.length>0?[
        { type:'TextBlock', text:'Invited Members', weight:'Bolder', size:'Medium', spacing:'Medium' },
        ...space.members.map(m=>({ type:'ColumnSet', spacing:'Small', columns:[
          { type:'Column', width:'auto', items:[{ type:'TextBlock', text:'👤', size:'Small' }]},
          { type:'Column', width:'stretch', items:[{ type:'TextBlock', text:m, size:'Small' }]}
        ]}))
      ]:[]),
      ...(space.pageCards&&space.pageCards.length>0?[
        { type:'TextBlock', text:`Cards Auto-Provisioned (${space.pageCards.length})`, weight:'Bolder', size:'Medium', spacing:'Medium' },
        { type:'ColumnSet', columns:[
          { type:'Column', width:'stretch', items:space.pageCards.slice(0,Math.ceil(space.pageCards.length/2)).map(pc=>({
            type:'Container', style:'emphasis', spacing:'Small', items:[{ type:'TextBlock', text:pc.title, size:'Small', weight:'Bolder', wrap:true }]
          }))},
          { type:'Column', width:'stretch', items:space.pageCards.slice(Math.ceil(space.pageCards.length/2)).map(pc=>({
            type:'Container', style:'emphasis', spacing:'Small', items:[{ type:'TextBlock', text:pc.title, size:'Small', weight:'Bolder', wrap:true }]
          }))}
        ]}
      ]:[]),
      { type:'TextBlock', text:`🔗 Space URL: ${space.url}`, size:'Small', color:'Accent', spacing:'Medium', wrap:true }
    ],
    actions:[
      { type:'Action.OpenUrl', title:'▶ Open Space', url:space.url },
      { type:'Action.Submit', title:'➕ Invite More Members', data:{ action:'invite', spaceId:space.id } }
    ]
  };
}

function buildSpaceFormCard() {
  return {
    type:'AdaptiveCard', version:'1.5',
    body:[
      { type:'Container', style:'emphasis', bleed:true, items:[
        { type:'TextBlock', text:'🚀 Create a Joule Work Space', weight:'Bolder', size:'Large', color:'Light' },
        { type:'TextBlock', text:'Set up a collaboration space linked to an AI initiative', size:'Small', color:'Light', isSubtle:true, spacing:'None' }
      ]},
      { type:'TextBlock', text:'Space Name', weight:'Bolder', size:'Small', spacing:'Medium' },
      { type:'Input.Text', id:'spaceName', placeholder:'e.g. EDP SAP Autonomous Enterprise — Core Team', isRequired:true },
      { type:'TextBlock', text:'Description', weight:'Bolder', size:'Small', spacing:'Small' },
      { type:'Input.Text', id:'spaceDesc', placeholder:'Briefly describe the purpose of this space', isMultiline:true },
      { type:'TextBlock', text:'Link to AI Initiative (optional)', weight:'Bolder', size:'Small', spacing:'Small' },
      { type:'Input.ChoiceSet', id:'initiativeId', style:'compact', placeholder:'Select an initiative', choices:[
        { title:'— None —', value:'' },
        { title:'SAP Autonomous Enterprise', value:'sap-autonomous-enterprise' },
        { title:'Joule for Consultants', value:'joule-for-consultants' }
      ]},
      { type:'TextBlock', text:'Visibility', weight:'Bolder', size:'Small', spacing:'Small' },
      { type:'Input.ChoiceSet', id:'visibility', style:'compact', value:'private', choices:[
        { title:'🔒 Private — invite only', value:'private' },
        { title:'🌐 Public — visible to all EDP', value:'public' }
      ]},
      { type:'TextBlock', text:'Invite Members (one email per line)', weight:'Bolder', size:'Small', spacing:'Small' },
      { type:'Input.Text', id:'members', placeholder:'user@edp.com\nanother@edp.com', isMultiline:true }
    ],
    actions:[
      { type:'Action.Submit', title:'🚀 Create Space', data:{ action:'createSpace' } },
      { type:'Action.Submit', title:'Cancel', data:{ action:'cancel' } }
    ]
  };
}

module.exports = { buildSpaceCreatedCard, buildSpaceFormCard };
