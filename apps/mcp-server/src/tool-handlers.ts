import {
  calculateRiskAssessment,
  explainTriggeredSignals,
  type TriggeredSignal,
} from "./risk-engine.js";
import {
  makeError,
  parseCheckCompanyDomainInput,
  parseCheckJobPostingInput,
  parseCheckRecruiterEmailInput,
  parseExplainRiskSignalsInput,
  type CheckCompanyDomainOutput,
  type CheckJobPostingOutput,
  type CheckRecruiterEmailOutput,
  type ErrorEnvelope,
  type ExplainRiskSignalsOutput,
} from "./contracts.js";
import { isAuthSuccess, validateApiKey, type AuthResult, type AuthSuccess } from "./auth.js";
import { persistScan } from "./persistence.js";

type ToolResult =
  | CheckJobPostingOutput
  | CheckRecruiterEmailOutput
  | CheckCompanyDomainOutput
  | ExplainRiskSignalsOutput
  | ErrorEnvelope;

export interface RuntimeDeps {
  validateApiKey: (apiKey: string) => Promise<AuthResult>;
  persistScan: (args: {
    userId: string;
    apiKeyId: string;
    toolName: string;
    inputPayload: unknown;
    resultPayload: unknown;
    riskScore?: number;
    riskLevel?: string;
    verdict?: string;
  }) => Promise<void>;
}

const defaultDeps: RuntimeDeps = {
  validateApiKey,
  persistScan,
};

function normalizeSignals(signals: { signalId: string }[]): TriggeredSignal[] {
  return signals.map((signal) => ({ signalId: signal.signalId }));
}

function serializeUnknownError(error: unknown): ErrorEnvelope {
  if (error instanceof Error) {
    return makeError("INTERNAL_ERROR", error.message, false);
  }

  return makeError("INTERNAL_ERROR", "Unexpected error", false);
}

async function authAndPersist(
  deps: RuntimeDeps,
  toolName: string,
  apiKey: string,
  inputPayload: unknown,
  result: ToolResult,
): Promise<void> {
  const auth = await deps.validateApiKey(apiKey);
  if (!isAuthSuccess(auth)) {
    return;
  }

  const risk = "result" in result ? result.result : undefined;
  await deps.persistScan({
    userId: auth.userId,
    apiKeyId: auth.apiKeyId,
    toolName,
    inputPayload,
    resultPayload: result,
    riskScore: risk?.score,
    riskLevel: risk?.riskLevel,
    verdict: risk?.verdict,
  });
}

async function requireAuth(deps: RuntimeDeps, apiKey: string): Promise<AuthSuccess | ErrorEnvelope> {
  const auth = await deps.validateApiKey(apiKey);
  if (!isAuthSuccess(auth)) {
    return makeError(auth.errorCode, auth.message, auth.retryable);
  }
  return auth;
}

export async function handleCheckJobPostingLegitimacy(
  rawInput: unknown,
  deps: RuntimeDeps = defaultDeps,
): Promise<CheckJobPostingOutput | ErrorEnvelope> {
  try {
    const input = parseCheckJobPostingInput(rawInput);
    const auth = await requireAuth(deps, input.apiKey);
    if ("error" in auth) return auth;

    const result: CheckJobPostingOutput = {
      tool: "check_job_posting_legitimacy",
      result: calculateRiskAssessment(normalizeSignals(input.observedSignals ?? [])),
    };

    await deps.persistScan({
      userId: auth.userId,
      apiKeyId: auth.apiKeyId,
      toolName: result.tool,
      inputPayload: rawInput,
      resultPayload: result,
      riskScore: result.result.score,
      riskLevel: result.result.riskLevel,
      verdict: result.result.verdict,
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      return makeError("INVALID_INPUT", error.message, false);
    }
    return serializeUnknownError(error);
  }
}

export async function handleCheckRecruiterEmail(
  rawInput: unknown,
  deps: RuntimeDeps = defaultDeps,
): Promise<CheckRecruiterEmailOutput | ErrorEnvelope> {
  try {
    const input = parseCheckRecruiterEmailInput(rawInput);
    const auth = await requireAuth(deps, input.apiKey);
    if ("error" in auth) return auth;

    const result: CheckRecruiterEmailOutput = {
      tool: "check_recruiter_email",
      result: calculateRiskAssessment(normalizeSignals(input.observedSignals ?? [])),
    };

    await deps.persistScan({
      userId: auth.userId,
      apiKeyId: auth.apiKeyId,
      toolName: result.tool,
      inputPayload: rawInput,
      resultPayload: result,
      riskScore: result.result.score,
      riskLevel: result.result.riskLevel,
      verdict: result.result.verdict,
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      return makeError("INVALID_INPUT", error.message, false);
    }
    return serializeUnknownError(error);
  }
}

export async function handleCheckCompanyDomain(
  rawInput: unknown,
  deps: RuntimeDeps = defaultDeps,
): Promise<CheckCompanyDomainOutput | ErrorEnvelope> {
  try {
    const input = parseCheckCompanyDomainInput(rawInput);
    const auth = await requireAuth(deps, input.apiKey);
    if ("error" in auth) return auth;

    const result: CheckCompanyDomainOutput = {
      tool: "check_company_domain",
      result: calculateRiskAssessment(normalizeSignals(input.observedSignals ?? [])),
    };

    await deps.persistScan({
      userId: auth.userId,
      apiKeyId: auth.apiKeyId,
      toolName: result.tool,
      inputPayload: rawInput,
      resultPayload: result,
      riskScore: result.result.score,
      riskLevel: result.result.riskLevel,
      verdict: result.result.verdict,
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      return makeError("INVALID_INPUT", error.message, false);
    }
    return serializeUnknownError(error);
  }
}

export async function handleExplainRiskSignals(
  rawInput: unknown,
  deps: RuntimeDeps = defaultDeps,
): Promise<ExplainRiskSignalsOutput | ErrorEnvelope> {
  try {
    const input = parseExplainRiskSignalsInput(rawInput);
    const auth = await requireAuth(deps, input.apiKey);
    if ("error" in auth) return auth;

    const result: ExplainRiskSignalsOutput = {
      tool: "explain_risk_signals",
      explanations: explainTriggeredSignals(normalizeSignals(input.triggeredSignals)),
    };

    await deps.persistScan({
      userId: auth.userId,
      apiKeyId: auth.apiKeyId,
      toolName: result.tool,
      inputPayload: rawInput,
      resultPayload: result,
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      return makeError("INVALID_INPUT", error.message, false);
    }
    return serializeUnknownError(error);
  }
}
