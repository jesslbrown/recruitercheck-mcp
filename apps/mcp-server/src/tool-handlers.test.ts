import { test } from "node:test";
import { strict as assert } from "node:assert";
import {
  handleCheckCompanyDomain,
  handleCheckJobPostingLegitimacy,
  handleCheckRecruiterEmail,
  handleExplainRiskSignals,
  type RuntimeDeps,
} from "./tool-handlers.js";

const okDeps: RuntimeDeps = {
  validateApiKey: async () => ({ userId: "user-1", apiKeyId: "key-1" }),
  persistScan: async () => {},
};

test("check_job_posting_legitimacy returns assessment for valid input", async () => {
  const result = await handleCheckJobPostingLegitimacy(
    {
      apiKey: "test_api_key_1234567890",
      title: "Remote Data Entry Assistant",
      description: "Work from home role with immediate onboarding and training provided.",
      observedSignals: [{ signalId: "job.salary_too_good" }],
    },
    okDeps,
  );

  assert.equal("tool" in result ? result.tool : undefined, "check_job_posting_legitimacy");
});

test("check_recruiter_email returns invalid input envelope on bad email", async () => {
  const result = await handleCheckRecruiterEmail(
    { apiKey: "test_api_key_1234567890", recruiterEmail: "not-an-email" },
    okDeps,
  );
  assert.equal("error" in result, true);
  if ("error" in result) {
    assert.equal(result.error.code, "INVALID_INPUT");
    assert.equal(result.error.retryable, false);
  }
});

test("check_company_domain returns assessment for valid input", async () => {
  const result = await handleCheckCompanyDomain(
    {
      apiKey: "test_api_key_1234567890",
      companyDomain: "example.com",
      observedSignals: [{ signalId: "domain.recent_registration" }],
    },
    okDeps,
  );

  assert.equal("tool" in result ? result.tool : undefined, "check_company_domain");
});

test("explain_risk_signals returns invalid input envelope for empty list", async () => {
  const result = await handleExplainRiskSignals(
    { apiKey: "test_api_key_1234567890", triggeredSignals: [] },
    okDeps,
  );
  assert.equal("error" in result, true);
  if ("error" in result) {
    assert.equal(result.error.code, "INVALID_INPUT");
  }
});

test("returns unauthorized when api key validation fails", async () => {
  const result = await handleCheckRecruiterEmail(
    { apiKey: "badbadbadbadbadbad", recruiterEmail: "person@example.com" },
    {
      validateApiKey: async () => ({ errorCode: "UNAUTHORIZED", message: "invalid", retryable: false }),
      persistScan: async () => {},
    },
  );

  assert.equal("error" in result, true);
  if ("error" in result) {
    assert.equal(result.error.code, "UNAUTHORIZED");
  }
});
