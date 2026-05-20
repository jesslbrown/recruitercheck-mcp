# RecruiterCheck MCP

RecruiterCheck is an MCP server that helps users quickly assess scam risk in job postings, recruiter emails, and company domains.

## What it provides

Tools:
- check_job_posting_legitimacy
- check_recruiter_email
- check_company_domain
- explain_risk_signals

Each tool:
- requires an API key
- returns deterministic risk scoring output
- persists scan events to Supabase

## Repo structure

- apps/mcp-server: TypeScript MCP server
- supabase/migrations: SQL migrations
- apps/landing: minimal landing page
- registry: registry submission assets

## Quick start

1) Install deps

cd apps/mcp-server
npm install

2) Set env

export SUPABASE_URL="https://<project-ref>.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

3) Build

npm run build

4) Run server

npm run start

## Apply database schema

From repo root:

supabase link --project-ref <project-ref>
supabase db push

Migration file applied for MVP:
- supabase/migrations/202605180001_mvp_core.sql

Creates:
- public.users
- public.api_keys
- public.flagged_domains
- public.scans

## API key model

The server expects `apiKey` in each tool input.
`api_keys.key_hash` stores SHA-256 of API keys.

Recommended flow:
1) generate key in your backend
2) hash with SHA-256
3) store hash in public.api_keys with user_id
4) give raw key to customer once

## Local smoke test

cd apps/mcp-server
node scripts/mcp-smoke.mjs

## MCP client config example

Use this in local MCP-capable clients:

{
  "mcpServers": {
    "recruitercheck": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/recruitercheck-mcp/apps/mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "https://<project-ref>.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "<service-role-key>"
      }
    }
  }
}

## Landing page

Minimal page is at:
- apps/landing/index.html

## Registry assets

See:
- registry/mcp.json
- registry/install.md
- registry/prompts.md
- registry/submissions.md
- registry/distribution.md

## Hosted MCP endpoint (production)

- Health: https://mcp-server-seven-alpha.vercel.app/
- MCP: https://mcp-server-seven-alpha.vercel.app/mcp
- Required header: Accept: application/json, text/event-stream

## Status

Roadmap status is tracked in:
- docs/ROADMAP_MVP.md
