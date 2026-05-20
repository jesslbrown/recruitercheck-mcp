# Install

## Prerequisites
- Node.js 20+
- Supabase project
- Valid API keys in `public.api_keys` (hashed)

## Build

cd apps/mcp-server
npm install
npm run build

## Configure MCP client

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

cd apps/mcp-server
node scripts/mcp-smoke.mjs
