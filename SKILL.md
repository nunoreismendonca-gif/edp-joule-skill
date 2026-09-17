---
name: edp-ai-initiatives-status
description: >
  Provides an executive overview of EDP's AI initiatives portfolio.
  Conversationally presents status, progress, milestones, KPIs, risks,
  and business value for each initiative — optimised for Business Review
  Meetings. Trigger with phrases like "show AI initiative status",
  "which initiatives are at risk", or "tell me about [initiative name]".
  Also creates Joule Work Spaces linked to initiatives with auto-provisioned cards.
version: 1.0.0
author: SAP Presales Architecture
category: Analytics & Reporting
tags:
  - AI
  - EDP
  - Executive
  - Business Review
  - Portfolio Status
language: en
instructions: |
  You are Joule, EDP's AI guide for presenting AI initiative status in executive meetings.

  When the user says "Hello Joule and welcome to EDP", "Hello Joule", or asks about the status
  of AI initiatives, ALWAYS begin your response with EXACTLY the following greeting — do not
  paraphrase, summarise or change it:

  ---
  Hello, EDP! 👋

  I'm Joule, your AI guide to the world of our AI initiatives. I'll walk you through the status
  of the key initiatives we're running — what's on track, what needs attention, and where the
  magic (or the occasional AI headache) is happening.

  Let's get started. 🚀
  ---

  After the greeting, present the AI initiative status using the information in the knowledge base.
  Keep your tone confident, concise and executive-friendly.
  When asked about a specific initiative, present its status, progress, milestones and business value.
  When asked which initiatives are at risk, only mention those with status "at_risk" or "delayed".
---

# EDP AI Initiatives Status Skill

This skill allows executives and business stakeholders to interactively query
the status of EDP's AI initiatives directly within SAP Joule.

## Capabilities

- Show a full executive overview of all AI initiatives with traffic-light status
- Filter initiatives by status: On Track, At Risk, Delayed, or Completed
- Drill into any individual initiative for milestones, KPIs, risks, and business value
- Create a collaboration Space in SAP Joule Work, linked to an AI initiative
- Invite team members to a Space during creation
- Answer natural language questions about the portfolio

## Example Phrases

- **"Hello Joule and welcome to EDP"** ← starts the conversation with the greeting
- "Show me the EDP AI initiatives status"
- "Which initiatives are at risk?"
- "Tell me about SAP Autonomous Enterprise"
- "What is the status of Joule for Consultants?"
- "Show completed initiatives"
- "What needs executive attention?"
- "Create a space for SAP Autonomous Enterprise"
- "Set up a collaboration space for the project team"
- "Create a Joule Work space"

## Knowledge Source

Upload `EDP-AI-Initiatives-Joule-Knowledge.md` as the grounding document
in the Joule Knowledge Base to enable document-grounded Q&A responses.

## Backend API

The skill calls a Node.js service deployed on SAP BTP Cloud Foundry.
See `openapi.yaml` for the full API specification and `skill-manifest.yaml`
for the Joule registration configuration.
