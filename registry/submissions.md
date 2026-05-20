# Registry submission notes

## Smithery
- Repo must include runnable MCP server and install instructions.
- Point to `apps/mcp-server/dist/index.js` stdio entry.
- Include environment variables:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
- Include tool list and practical prompt examples.

## MCP.so
- Provide concise description emphasizing when assistants should call this MCP.
- Add compatibility notes: Claude, Cursor, Cline, Windsurf, ChatGPT-compatible MCP clients.
- Include setup JSON snippet from `registry/install.md`.

## Glama MCP
- Ensure metadata and README explain clear user intent triggers:
  - "is this recruiter legit"
  - "is this job posting a scam"
  - "is this company domain suspicious"
- Add screenshots or terminal captures of successful tool responses.

## GitHub metadata
Suggested repository description:
"MCP server for real-time job scam risk checks (job postings, recruiter emails, and company domains)."

Suggested topics:
- mcp
- model-context-protocol
- recruiter
- job-scam
- fraud-detection
- supabase
- typescript
- ai-safety
