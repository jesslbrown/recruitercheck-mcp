import { z } from "zod/v3";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  handleCheckCompanyDomain,
  handleCheckJobPostingLegitimacy,
  handleCheckRecruiterEmail,
  handleExplainRiskSignals,
} from "./tool-handlers.js";

function asTextResult(payload: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload),
      },
    ],
  };
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "recruitercheck-mcp",
    version: "0.1.0",
  });

  server.tool(
    "check_job_posting_legitimacy",
    "Assess whether a job posting contains scam risk signals.",
    {
      apiKey: z.string().min(16),
      title: z.string().min(3),
      description: z.string().min(20),
      companyName: z.string().min(2).optional(),
      recruiterEmail: z.string().optional(),
      jobPostingUrl: z.string().optional(),
      observedSignals: z.array(z.object({ signalId: z.string().min(1) })).optional(),
    },
    async (input) => asTextResult(await handleCheckJobPostingLegitimacy(input)),
  );

  server.tool(
    "check_recruiter_email",
    "Assess recruiter email legitimacy risk signals.",
    {
      apiKey: z.string().min(16),
      recruiterEmail: z.string().min(1),
      claimedCompanyDomain: z.string().min(3).optional(),
      observedSignals: z.array(z.object({ signalId: z.string().min(1) })).optional(),
    },
    async (input) => asTextResult(await handleCheckRecruiterEmail(input)),
  );

  server.tool(
    "check_company_domain",
    "Assess company domain trust and risk signals.",
    {
      apiKey: z.string().min(16),
      companyDomain: z.string().min(3),
      observedSignals: z.array(z.object({ signalId: z.string().min(1) })).optional(),
    },
    async (input) => asTextResult(await handleCheckCompanyDomain(input)),
  );

  server.tool(
    "explain_risk_signals",
    "Explain why triggered risk signals matter and what to do next.",
    {
      apiKey: z.string().min(16),
      triggeredSignals: z.array(z.object({ signalId: z.string().min(1) })).min(1),
    },
    async (input) => asTextResult(await handleExplainRiskSignals(input)),
  );

  return server;
}
