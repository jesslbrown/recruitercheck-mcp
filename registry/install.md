# Install RecruiterCheck MCP

## Option A: Hosted MCP (streamable HTTP)

Use this when your client supports remote MCP endpoints.

Endpoint:
https://mcp-server-seven-alpha.vercel.app/mcp

Required request header:
Accept: application/json, text/event-stream

Health check:
https://mcp-server-seven-alpha.vercel.app/

## Option B: Local MCP (stdio)

Prerequisites:
- Node.js 20+
- Supabase project
- Valid API key records in public.api_keys (stored as SHA-256 hashes)

Build:

cd apps/mcp-server
npm install
npm run build

Example MCP client config (stdio):

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

## Verify

Local smoke test:

cd apps/mcp-server
node scripts/mcp-smoke.mjs

Hosted initialize test via curl:

curl -sS -X POST https://mcp-server-seven-alpha.vercel.app/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  --data '{
    "jsonrpc":"2.0",
    "id":"init-1",
    "method":"initialize",
    "params":{
      "protocolVersion":"2025-03-26",
      "capabilities":{},
      "clientInfo":{"name":"curl","version":"0.1"}
    }
  }'

## Tool call requirement

Each tool input must include:
- apiKey: string

Without a valid key, the server returns a standard envelope with UNAUTHORIZED error metadata.