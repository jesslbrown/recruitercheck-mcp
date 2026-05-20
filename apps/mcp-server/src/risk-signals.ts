export type SignalCategory = "job" | "email" | "domain";

export interface RiskSignalDefinition {
  id: string;
  category: SignalCategory;
  weight: number;
  explanation: string;
  recommendedAction: string;
}

export const RISK_SIGNALS: Record<string, RiskSignalDefinition> = {
  "job.upfront_payment_request": {
    id: "job.upfront_payment_request",
    category: "job",
    weight: 40,
    explanation: "The posting asks for upfront payment, which is a common fraud pattern.",
    recommendedAction: "Do not pay anything. Ask for a written offer and verify the employer independently.",
  },
  "job.salary_too_good": {
    id: "job.salary_too_good",
    category: "job",
    weight: 25,
    explanation: "Compensation looks unusually high for the role and context.",
    recommendedAction: "Compare compensation with market benchmarks and request a full job description.",
  },
  "job.urgent_off_platform_contact": {
    id: "job.urgent_off_platform_contact",
    category: "job",
    weight: 18,
    explanation: "The recruiter pushes urgent communication outside normal channels.",
    recommendedAction: "Keep communication on trusted platforms and ask for official contact points.",
  },
  "email.lookalike_domain": {
    id: "email.lookalike_domain",
    category: "email",
    weight: 22,
    explanation: "The sender domain appears to mimic a legitimate company domain.",
    recommendedAction: "Cross-check the sender domain against the company website and LinkedIn page.",
  },
  "email.generic_free_email": {
    id: "email.generic_free_email",
    category: "email",
    weight: 15,
    explanation: "Recruiter is using a free email provider instead of a corporate domain.",
    recommendedAction: "Ask for communication from a verified corporate email address.",
  },
  "domain.recent_registration": {
    id: "domain.recent_registration",
    category: "domain",
    weight: 20,
    explanation: "Company domain appears to be recently registered, which can indicate a throwaway setup.",
    recommendedAction: "Validate domain age, legal business registration, and external references.",
  },
  "domain.no_public_presence": {
    id: "domain.no_public_presence",
    category: "domain",
    weight: 20,
    explanation: "Domain has little to no credible public footprint.",
    recommendedAction: "Look for verifiable company records, team profiles, and customer references.",
  },
  "job.verifiable_company_presence": {
    id: "job.verifiable_company_presence",
    category: "job",
    weight: -12,
    explanation: "Company has verifiable public presence and consistent identity.",
    recommendedAction: "Still verify role details, but this lowers risk meaningfully.",
  },
  "email.aligned_reply_to": {
    id: "email.aligned_reply_to",
    category: "email",
    weight: -8,
    explanation: "Reply-to and sender domain are aligned and consistent with company identity.",
    recommendedAction: "Proceed with normal checks; request official interview process details.",
  },
};

export function getSignalDefinition(signalId: string): RiskSignalDefinition | undefined {
  return RISK_SIGNALS[signalId];
}
