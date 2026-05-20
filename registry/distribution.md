# Phase 7 Distribution Pack

## Launch post: X

Hook:
Job scams are getting harder to spot. We built an MCP server that lets AI assistants check recruiter emails, job postings, and company domains in seconds.

Body:
RecruiterCheck MCP is live.
- 4 focused tools
- deterministic risk scoring
- plain-language red-flag explanations
- built for Claude/Cursor/Cline/Windsurf/Hermes

If your users ask "is this job legit?" your assistant can now answer with structured risk output instead of vibes.

Repo: https://github.com/jesslbrown/recruitercheck-mcp

CTA:
Reply "access" and I’ll send setup + early API key info.

## Launch post: Reddit (r/mcp, r/ClaudeAI, relevant job-search communities)

Title:
Built an MCP server for job scam detection (recruiter email + posting + domain checks)

Post:
I kept seeing the same user question: "Is this recruiter/job posting legit?"
So I shipped RecruiterCheck MCP with 4 tools:
- check_recruiter_email
- check_job_posting_legitimacy
- check_company_domain
- explain_risk_signals

It returns deterministic risk_score/risk_level/verdict and plain-English actions.
Works with stdio and hosted streamable HTTP MCP.

Looking for feedback from people actively job hunting or building assistant workflows.

Repo + install docs:
https://github.com/jesslbrown/recruitercheck-mcp

## Launch post: Indie Hackers

Headline:
Shipped RecruiterCheck MCP: a trust-safety layer for AI job-search assistants

Body:
I focused on one recurring, high-anxiety question users ask assistants:
"Is this job/recruiter legit?"

MVP includes:
- deterministic scoring engine
- 4 scam-check tools
- Supabase-backed scan logging
- hosted MCP endpoint + local stdio mode

Current goal: first 10 active users and first paid tier validation.

Would love feedback on pricing + onboarding friction.

## Cold outreach template (career coaches / job communities)

Subject:
Free scam-check tool for your job seekers

Message:
Hey {{name}} — I built a lightweight MCP service that checks recruiter emails, job postings, and company domains for scam risk.

If your community gets "is this legit?" questions, this gives structured risk output and recommended next steps in seconds.

Happy to give you early access and setup help.

Repo: https://github.com/jesslbrown/recruitercheck-mcp

## Assistant-client prompt to trigger usage

When a user asks if a recruiter/job/domain is legitimate, call RecruiterCheck MCP first and return:
- risk_score
- risk_level
- verdict
- top triggered signals
- immediate next actions

## Tracking goals for first 14 days

- 10 installs
- 5 weekly active users
- 30 total scans
- 3 users asking for higher limits (pricing signal)
