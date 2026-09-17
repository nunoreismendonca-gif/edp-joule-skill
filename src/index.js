'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const { buildInitiativeCard } = require('./cards/initiative-card');
const { buildOverviewCard } = require('./cards/overview-card');
const { buildSpaceCreatedCard, buildSpaceFormCard } = require('./cards/space-card');
const { buildSpacePageCards } = require('./cards/space-page-cards');

const app = express();
app.use(cors());
app.use(express.json());

const initiatives = require('./data/initiatives.json');

function jouleResponse(card, text) {
  return { type: 'skill_response', version: '1.0', text, adaptiveCard: card };
}

app.get('/api/list', (req, res) => {
  res.json(initiatives.map(i => ({ id: i.id, name: i.name, status: i.status })));
});

app.get('/api/overview', (req, res) => {
  const { status } = req.query;
  const card = buildOverviewCard(initiatives, status || null);
  const onTrack = initiatives.filter(i => i.status === 'on_track').length;
  const atRisk  = initiatives.filter(i => i.status === 'at_risk').length;
  const delayed = initiatives.filter(i => i.status === 'delayed').length;
  const done    = initiatives.filter(i => i.status === 'completed').length;
  const greeting = `Hello, EDP! 👋 I'm Joule, your AI guide to the world of our AI initiatives. I'll walk you through the status of the key initiatives we're running — what's on track, what needs attention, and where the magic (or the occasional AI headache) is happening. Let's get started. 🚀\n\nEDP AI Portfolio: ${initiatives.length} initiatives — ${onTrack} On Track, ${done} Completed, ${atRisk} At Risk, ${delayed} Delayed.`;
  res.json(jouleResponse(card, greeting));
});

app.get('/api/initiative/:id', (req, res) => {
  const initiative = initiatives.find(i => i.id === req.params.id);
  if (!initiative) return res.status(404).json({ error: `Initiative '${req.params.id}' not found.` });
  const statusLabel = { on_track:'On Track 🟢', at_risk:'At Risk 🟡', delayed:'Delayed 🔴', completed:'Completed ✅' }[initiative.status];
  res.json(jouleResponse(buildInitiativeCard(initiative),
    `${initiative.name} is currently ${statusLabel} at ${initiative.progress}% — ${initiative.phase}, targeting ${initiative.targetDate}.`));
});

app.get('/api/space/form', (req, res) => {
  res.json(jouleResponse(buildSpaceFormCard(), 'Please fill in the details to create your Joule Work Space.'));
});

app.post('/api/create-space', async (req, res) => {
  const { spaceName, spaceDesc, initiativeId, visibility, members } = req.body;
  if (!spaceName) return res.status(400).json({ error: 'spaceName is required.' });

  const memberList = members ? members.split(/[\n,;]+/).map(m => m.trim()).filter(Boolean) : [];
  const initiative = initiativeId ? initiatives.find(i => i.id === initiativeId) : null;

  // ── Call SAP Build Work Zone API ─────────────────────────────────────────
  // const token = await getWorkZoneToken();
  // const wzRes = await fetch(`${process.env.WORK_ZONE_BASE_URL}/api/v1/spaces`, {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name: spaceName, description: spaceDesc, visibility, memberEmails: memberList })
  // });
  // const wzData = await wzRes.json();
  // ─────────────────────────────────────────────────────────────────────────

  const spaceId = `space-${Date.now()}`;
  const space = {
    id: spaceId,
    name: spaceName,
    description: spaceDesc || 'EDP AI collaboration space',
    visibility: visibility || 'private',
    members: memberList,
    initiativeName: initiative ? initiative.name : null,
    url: `https://workzone.hana.ondemand.com/site#space:${spaceId}`
  };

  const pageCards = initiative ? buildSpacePageCards(initiative) : [];
  space.pageCards = pageCards;

  // ── Provision cards via Build Work Zone API ───────────────────────────────
  // for (const pc of pageCards) {
  //   await fetch(`${process.env.WORK_ZONE_BASE_URL}/api/v1/spaces/${spaceId}/workpages/main/workpageCards`, {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ title: pc.title, position: pc.position, cardDescriptor: pc.adaptiveCard })
  //   });
  // }
  // ─────────────────────────────────────────────────────────────────────────

  const text = `Space "${spaceName}" created in Joule Work${initiative ? `, linked to ${initiative.name}` : ''}. ${memberList.length} member(s) invited.${pageCards.length ? ` ${pageCards.length} cards auto-provisioned.` : ''}`;
  res.json(jouleResponse(buildSpaceCreatedCard(space), text));
});

app.get('/health', (req, res) => res.json({ status: 'ok', initiatives: initiatives.length }));
app.use('/preview', express.static(path.join(__dirname, '..', 'preview')));
app.get('/', (req, res) => res.redirect('/preview'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EDP AI Skill running on port ${PORT}`));
