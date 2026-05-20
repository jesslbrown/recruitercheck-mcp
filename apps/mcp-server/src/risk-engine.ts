import { getSignalDefinition } from "./risk-signals.js";

export type RiskLevel = "low" | "medium" | "high";
export type Verdict = "likely_legit" | "needs_review" | "likely_scam";

export interface TriggeredSignal {
  signalId: string;
}

export interface SignalExplanation {
  signalId: string;
  weight: number;
  explanation: string;
  recommendedAction: string;
}

export interface RiskAssessmentResult {
  score: number;
  riskLevel: RiskLevel;
  verdict: Verdict;
  totalWeight: number;
  triggeredCount: number;
  unknownSignalIds: string[];
}

const BASE_SCORE = 30;

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 65) {
    return "high";
  }

  if (score >= 35) {
    return "medium";
  }

  return "low";
}

export function getVerdict(riskLevel: RiskLevel): Verdict {
  if (riskLevel === "high") {
    return "likely_scam";
  }

  if (riskLevel === "medium") {
    return "needs_review";
  }

  return "likely_legit";
}

export function calculateRiskAssessment(triggeredSignals: TriggeredSignal[]): RiskAssessmentResult {
  let totalWeight = 0;
  const unknownSignalIds: string[] = [];

  for (const signal of triggeredSignals) {
    const definition = getSignalDefinition(signal.signalId);

    if (!definition) {
      unknownSignalIds.push(signal.signalId);
      continue;
    }

    totalWeight += definition.weight;
  }

  const score = clampScore(BASE_SCORE + totalWeight);
  const riskLevel = getRiskLevel(score);

  return {
    score,
    riskLevel,
    verdict: getVerdict(riskLevel),
    totalWeight,
    triggeredCount: triggeredSignals.length,
    unknownSignalIds,
  };
}

export function explainTriggeredSignals(triggeredSignals: TriggeredSignal[]): SignalExplanation[] {
  const explanations: SignalExplanation[] = [];

  for (const signal of triggeredSignals) {
    const definition = getSignalDefinition(signal.signalId);
    if (!definition) {
      continue;
    }

    explanations.push({
      signalId: definition.id,
      weight: definition.weight,
      explanation: definition.explanation,
      recommendedAction: definition.recommendedAction,
    });
  }

  return explanations;
}
