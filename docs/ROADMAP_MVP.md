# RecruiterCheck MCP — MVP Roadmap (30-day speed-to-launch)

Status: Phases 1-5 complete. Phase 6 next.
Owner model: gpt-5.3-codex (profile: recruitercheck-mcp)
Scope discipline: strict MVP only.

## 0) Non-negotiable scope

Build ONLY:
1. MCP server in Node.js/TypeScript
2. Deterministic risk scoring engine
3. 4 MCP tools:
   - check_job_posting_legitimacy
   - check_recruiter_email
   - check_company_domain
   - explain_risk_signals
4. Supabase tables:
   - users
   - api_keys
   - scans
   - flagged_domains
5. Simple API key auth
6. Minimal landing page
7. README
8. MCP registry publishing assets

Do NOT build:
- dashboards/admin panel
- browser/mobile extensions
- advanced agents/autonomous workflows
- complex scraping infra
- enterprise features

## 1) Sequence of execution (what to do, in order)

## Phase 1 — Repo + skeleton (Day 1)
Goal: create runnable skeleton fast.

Tasks:
- Initialize repo structure:
  - apps/mcp-server
  - web/landing
  - supabase/migrations
  - docs
- Add TypeScript config and minimal package scripts.
- Add MCP server bootstrap with tool registration stubs only.

Exit criteria:
- MCP server starts locally.
- Tools are registered (even if stubbed).

## Phase 2 — Deterministic scoring core (Day 1–2)
Goal: scoring works before persistence.

Tasks:
- Implement weighted signal catalog (no ML).
- Implement risk score (0–100), risk level mapping, verdict mapping.
- Implement explainability mapping from signal -> plain language + action.

Exit criteria:
- Same input returns same score/verdict every run.
- Unit checks for threshold edges pass.

## Phase 3 — Tool contracts + handlers (Day 2–3)
Goal: 4 tools fully contract-compliant.

Tasks:
- Implement tool IO schemas:
  - check_job_posting_legitimacy
  - check_recruiter_email
  - check_company_domain
  - explain_risk_signals
- Add standard error envelope:
  - { error: { code, message, retryable } }
- Ensure each tool can run with deterministic mock/live-light checks.

Exit criteria:
- All 4 tools callable from MCP client.
- Invalid input returns schema-safe errors.

## Phase 4 — Supabase + API key auth (Day 3–4)
Goal: persistence and auth are operational.

Tasks:
- Create migrations for users, api_keys, scans, flagged_domains.
- Add indexes:
  - api_keys(key_hash)
  - scans(user_id, created_at desc)
  - scans(tool_name, created_at desc)
  - flagged_domains(domain, active)
- Implement API key validation in middleware.
- Store scan outputs for each tool execution.

Exit criteria:
- Calls without valid key are rejected.
- Valid key calls persist scan rows.

## Phase 5 — Minimal launch surface (Day 4–5)
Goal: launchable package.

Tasks:
- Minimal landing page:
  - headline
  - core question
  - how it works (3 steps)
  - API key request CTA
- README:
  - install
  - env vars
  - local run
  - example calls
- Registry assets:
  - manifest/config metadata
  - usage prompts
  - submission notes (Smithery / MCP.so / Glama)

Exit criteria:
- New user can install and run in <10 minutes.

## Phase 6 — Local validation + deploy (Day 5–6)
Goal: stable MVP in production.

Tasks:
- Local test pass on all 4 tools.
- Deploy to Cloudflare Workers or Vercel (choose one, not both now).
- Smoke test from MCP client.

Exit criteria:
- Public endpoint reachable.
- Registry submission-ready docs complete.

## 2) Week-1 execution checklist

Day 1:
- [x] Repo skeleton
- [x] MCP bootstrap with registered tools

Day 2:
- [x] Deterministic scoring + explainability
- [x] Edge-case tests for thresholds

Day 3:
- [x] Implement 4 tool handlers
- [x] Input validation + errors

Day 4:
- [x] Supabase migrations
- [x] API key auth middleware
- [x] Persist scans

Day 5:
- [x] Landing page + README
- [x] Registry asset package

Day 6:
- [ ] Deploy + smoke test
- [ ] Fix blocking defects only

Day 7:
- [ ] Registry submissions
- [ ] Start distribution prompts in assistants

## 3) Definition of Done (MVP)

MVP is done when ALL are true:
- 4 MCP tools work end-to-end with auth.
- Deterministic scoring/explanations are stable.
- Supabase persistence works for scans/keys.
- Minimal docs/landing/registry assets complete.
- Deployed endpoint usable by assistants.

## 4) Immediate next actions

1. Archive stale parent planning task (old crash artifact).
2. Create implementation Kanban tasks for Phase 1 only.
3. Start coding from MCP server skeleton (small commits).

---
This roadmap is intentionally lean to optimize for launchability and first revenue in <30 days.