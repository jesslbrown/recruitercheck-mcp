# Phase 7 Registry Submission Pack

Last updated: 2026-05-19
Primary repo: https://github.com/jesslbrown/recruitercheck-mcp
Production MCP endpoint (streamable HTTP): https://mcp-server-seven-alpha.vercel.app/mcp
Health endpoint: https://mcp-server-seven-alpha.vercel.app/

Important protocol note:
- MCP HTTP clients must send:
  - Accept: application/json, text/event-stream

## Universal listing copy

Name:
RecruiterCheck MCP

Tagline:
Real-time scam-risk checks for job postings, recruiter emails, and company domains.

Short description:
RecruiterCheck MCP helps assistants detect hiring scams before users apply or reply. It provides deterministic risk scoring and plain-language explanations for suspicious job listings, recruiter emails, and company domains.

Long description:
RecruiterCheck MCP is a production MCP server for a high-frequency trust question: "Is this job opportunity legit, or a scam?" It exposes four focused tools that assistants can call during normal job-search conversations. Each call validates API access, computes deterministic risk output, and logs scan events for auditing. The server supports stdio (local) and streamable HTTP (hosted) transports.

Core user intents supported:
- "Is this recruiter legit?"
- "Does this job post look fake?"
- "Is this company domain suspicious?"
- "What do these scam signals mean and what should I do next?"

## Tool list to include in all submissions

- check_job_posting_legitimacy
- check_recruiter_email
- check_company_domain
- explain_risk_signals

## Compatibility statement

Compatible with MCP-capable clients and assistants, including:
- Claude Desktop / Claude Code
- Cursor
- Cline
- Windsurf
- Hermes
- Other MCP clients supporting stdio or streamable HTTP

## Evidence links

- Repo: https://github.com/jesslbrown/recruitercheck-mcp
- README: https://github.com/jesslbrown/recruitercheck-mcp/blob/main/README.md
- Install guide: https://github.com/jesslbrown/recruitercheck-mcp/blob/main/registry/install.md
- Prompt routing hints: https://github.com/jesslbrown/recruitercheck-mcp/blob/main/registry/prompts.md

## Smithery submission notes

Submission URL:
https://smithery.ai/

Checklist:
- Public GitHub repo is accessible
- README includes setup and env vars
- Tool names and usage examples documented
- MCP server is runnable from listed entrypoint

Suggested Smithery form copy:
- Category: Security / Trust & Safety
- Transport(s): stdio, streamable HTTP
- Entrypoint (local stdio): apps/mcp-server/dist/index.js
- Hosted endpoint: https://mcp-server-seven-alpha.vercel.app/mcp
- Required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

## MCP.so submission notes

Site note (from listing page): submissions are handled via GitHub issue.
Directory URL:
https://mcp.so/

Submission payload draft:
- Server name: RecruiterCheck MCP
- GitHub: https://github.com/jesslbrown/recruitercheck-mcp
- Description: MCP server for scam-risk checks on job postings, recruiter emails, and company domains.
- Why useful: high-frequency job-search trust decision; actionable scoring and explanations.
- Tool list: include all 4 tools
- Install docs: link to registry/install.md

## Glama MCP submission notes

Submission URL:
https://glama.ai/

Checklist:
- Public repo + clear README
- Explicit user intent triggers in docs
- Practical examples with expected responses

Suggested listing bullets:
- "Use this when user asks if a recruiter/job/domain is legit"
- "Deterministic score and risk-level output"
- "Built for fast pre-application safety checks"

## GitHub metadata (set in repo settings)

Description:
MCP server for real-time job scam risk checks (job postings, recruiter emails, and company domains).

Topics:
mcp, model-context-protocol, recruiter, job-scam, fraud-detection, supabase, typescript, ai-safety

## Submission status tracker

- [ ] Smithery submitted
- [ ] MCP.so submitted
- [ ] Glama submitted
- [ ] Listings approved/live

## Post-submission verification

After each listing is live, verify:
- listing includes all 4 tools
- install instructions are accurate
- endpoint/repo links are correct
- prompt routing language is preserved
