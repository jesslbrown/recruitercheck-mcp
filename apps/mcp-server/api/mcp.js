import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "../dist/server.js";

const app = createMcpExpressApp({ host: "0.0.0.0" });

app.post("/", async (req, res) => {
  const server = createServer();

  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

    res.on("close", () => {
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error("MCP HTTP request failed", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

app.get("/", (_req, res) => {
  res.status(200).json({ ok: true, service: "recruitercheck-mcp", transport: "streamable-http" });
});

export default app;
