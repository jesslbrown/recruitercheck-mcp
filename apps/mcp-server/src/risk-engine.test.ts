import { test } from "node:test";
import { strict as assert } from "node:assert";
import {
  calculateRiskAssessment,
  getRiskLevel,
  getVerdict,
  explainTriggeredSignals,
  type TriggeredSignal,
} from "./risk-engine.js";

test("maps score thresholds to risk levels", () => {
  assert.equal(getRiskLevel(0), "low");
  assert.equal(getRiskLevel(34), "low");
  assert.equal(getRiskLevel(35), "medium");
  assert.equal(getRiskLevel(64), "medium");
  assert.equal(getRiskLevel(65), "high");
  assert.equal(getRiskLevel(100), "high");
});

test("maps risk levels to verdict", () => {
  assert.equal(getVerdict("low"), "likely_legit");
  assert.equal(getVerdict("medium"), "needs_review");
  assert.equal(getVerdict("high"), "likely_scam");
});

test("calculates deterministic score and clamps to 0-100", () => {
  const triggered: TriggeredSignal[] = [
    { signalId: "job.upfront_payment_request" },
    { signalId: "email.lookalike_domain" },
    { signalId: "job.salary_too_good" },
    { signalId: "job.verifiable_company_presence" },
  ];

  const first = calculateRiskAssessment(triggered);
  const second = calculateRiskAssessment(triggered);

  assert.deepEqual(first, second);
  assert.equal(first.score, 100);
  assert.equal(first.riskLevel, "high");
  assert.equal(first.verdict, "likely_scam");
});

test("explainability maps triggered signals to plain-language explanations and actions", () => {
  const explanations = explainTriggeredSignals([
    { signalId: "email.generic_free_email" },
    { signalId: "domain.recent_registration" },
  ]);

  assert.equal(explanations.length, 2);
  assert.match(explanations[0].explanation, /free email/i);
  assert.match(explanations[0].recommendedAction, /corporate email/i);
  assert.match(explanations[1].explanation, /recently registered/i);
});
