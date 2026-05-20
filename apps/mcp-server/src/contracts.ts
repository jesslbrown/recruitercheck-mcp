export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export function makeError(code: string, message: string, retryable = false): ErrorEnvelope {
  return { error: { code, message, retryable } };
}

export interface TriggeredSignalInput {
  signalId: string;
}

interface AuthInput {
  apiKey: string;
}

export interface CheckJobPostingInput extends AuthInput {
  title: string;
  description: string;
  companyName?: string;
  recruiterEmail?: string;
  jobPostingUrl?: string;
  observedSignals?: TriggeredSignalInput[];
}

export interface CheckRecruiterEmailInput extends AuthInput {
  recruiterEmail: string;
  claimedCompanyDomain?: string;
  observedSignals?: TriggeredSignalInput[];
}

export interface CheckCompanyDomainInput extends AuthInput {
  companyDomain: string;
  observedSignals?: TriggeredSignalInput[];
}

export interface ExplainRiskSignalsInput extends AuthInput {
  triggeredSignals: TriggeredSignalInput[];
}

export interface AssessmentResult {
  score: number;
  riskLevel: "low" | "medium" | "high";
  verdict: "likely_legit" | "needs_review" | "likely_scam";
  totalWeight: number;
  triggeredCount: number;
  unknownSignalIds: string[];
}

export interface SignalExplanation {
  signalId: string;
  weight: number;
  explanation: string;
  recommendedAction: string;
}

export interface CheckJobPostingOutput {
  tool: "check_job_posting_legitimacy";
  result: AssessmentResult;
}

export interface CheckRecruiterEmailOutput {
  tool: "check_recruiter_email";
  result: AssessmentResult;
}

export interface CheckCompanyDomainOutput {
  tool: "check_company_domain";
  result: AssessmentResult;
}

export interface ExplainRiskSignalsOutput {
  tool: "explain_risk_signals";
  explanations: SignalExplanation[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function parseApiKey(input: Record<string, unknown>): string {
  const apiKey = input.apiKey;
  if (!isString(apiKey) || apiKey.trim().length < 16) {
    throw new Error("apiKey must be provided");
  }
  return apiKey.trim();
}

function parseSignals(value: unknown): TriggeredSignalInput[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new Error("observedSignals/triggeredSignals must be an array");
  }

  const parsed: TriggeredSignalInput[] = [];
  for (const item of value) {
    if (!isObject(item) || !isString(item.signalId) || item.signalId.trim().length < 1) {
      throw new Error("each signal must include non-empty signalId");
    }
    parsed.push({ signalId: item.signalId.trim() });
  }
  return parsed;
}

export function parseCheckJobPostingInput(input: unknown): CheckJobPostingInput {
  if (!isObject(input)) throw new Error("input must be an object");
  const title = input.title;
  const description = input.description;
  if (!isString(title) || title.trim().length < 3) throw new Error("title must be at least 3 characters");
  if (!isString(description) || description.trim().length < 20) {
    throw new Error("description must be at least 20 characters");
  }

  const recruiterEmail = input.recruiterEmail;
  if (recruiterEmail !== undefined && (!isString(recruiterEmail) || !isEmail(recruiterEmail))) {
    throw new Error("recruiterEmail must be a valid email");
  }

  const jobPostingUrl = input.jobPostingUrl;
  if (jobPostingUrl !== undefined && (!isString(jobPostingUrl) || !isUrl(jobPostingUrl))) {
    throw new Error("jobPostingUrl must be a valid URL");
  }

  const companyName = input.companyName;
  if (companyName !== undefined && (!isString(companyName) || companyName.trim().length < 2)) {
    throw new Error("companyName must be at least 2 characters when provided");
  }

  return {
    apiKey: parseApiKey(input),
    title: title.trim(),
    description: description.trim(),
    companyName: isString(companyName) ? companyName.trim() : undefined,
    recruiterEmail: isString(recruiterEmail) ? recruiterEmail.trim().toLowerCase() : undefined,
    jobPostingUrl: isString(jobPostingUrl) ? jobPostingUrl.trim() : undefined,
    observedSignals: parseSignals(input.observedSignals),
  };
}

export function parseCheckRecruiterEmailInput(input: unknown): CheckRecruiterEmailInput {
  if (!isObject(input)) throw new Error("input must be an object");
  const recruiterEmail = input.recruiterEmail;
  if (!isString(recruiterEmail) || !isEmail(recruiterEmail)) {
    throw new Error("recruiterEmail must be a valid email");
  }

  const claimedCompanyDomain = input.claimedCompanyDomain;
  if (claimedCompanyDomain !== undefined && (!isString(claimedCompanyDomain) || claimedCompanyDomain.trim().length < 3)) {
    throw new Error("claimedCompanyDomain must be at least 3 characters when provided");
  }

  return {
    apiKey: parseApiKey(input),
    recruiterEmail: recruiterEmail.trim().toLowerCase(),
    claimedCompanyDomain: isString(claimedCompanyDomain) ? claimedCompanyDomain.trim().toLowerCase() : undefined,
    observedSignals: parseSignals(input.observedSignals),
  };
}

export function parseCheckCompanyDomainInput(input: unknown): CheckCompanyDomainInput {
  if (!isObject(input)) throw new Error("input must be an object");
  const companyDomain = input.companyDomain;
  if (!isString(companyDomain) || companyDomain.trim().length < 3) {
    throw new Error("companyDomain must be at least 3 characters");
  }

  return {
    apiKey: parseApiKey(input),
    companyDomain: companyDomain.trim().toLowerCase(),
    observedSignals: parseSignals(input.observedSignals),
  };
}

export function parseExplainRiskSignalsInput(input: unknown): ExplainRiskSignalsInput {
  if (!isObject(input)) throw new Error("input must be an object");
  const triggeredSignals = parseSignals(input.triggeredSignals);
  if (triggeredSignals.length < 1) {
    throw new Error("triggeredSignals must include at least one item");
  }
  return {
    apiKey: parseApiKey(input),
    triggeredSignals,
  };
}
