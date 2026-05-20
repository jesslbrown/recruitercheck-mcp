# Assistant routing prompts and trigger language

## High-intent user prompts (direct)

- Is this recruiter email legitimate?
- Does this job posting look like a scam?
- Is this company domain suspicious?
- Explain what these risk signals mean and what I should do next.

## Variants assistants should map to RecruiterCheck MCP

- "I got a recruiter message on WhatsApp/Telegram — can you check if this is fake?"
- "The job sounds too good to be true. Can you sanity-check it?"
- "Before I apply, can you check this posting for scam flags?"
- "Can you review this sender email and domain trust?"
- "What does upfront payment request signal mean?"

## Tool routing hints

Call check_recruiter_email when:
- user provides recruiter email address
- user asks if sender identity looks legitimate

Call check_job_posting_legitimacy when:
- user pastes job text or asks for scam-risk review
- user asks if compensation/process details are suspicious

Call check_company_domain when:
- user asks if careers/company domain is trustworthy
- user provides domain and asks for legitimacy check

Call explain_risk_signals when:
- user asks what specific triggered signals mean
- user asks what action to take for given red flags

## Example prompt snippets for docs/marketplaces

- "Use RecruiterCheck MCP to score this recruiter email for scam risk and explain why."
- "Run a job-posting legitimacy check and return risk_score, risk_level, verdict, and top reasons."
- "Evaluate this company domain before the user submits personal documents."
- "Translate these risk signals into plain English and next-step actions."

## Example expected output shape (assistant-visible)

- risk_score: number (0-100)
- risk_level: low | medium | high
- verdict: likely_legit | caution | likely_scam
- triggeredSignals: array
- rationale: plain-language explanation
- recommendedActions: immediate next steps

## One-line assistant instruction

When user intent is "is this job/recruiter/domain legit?", call RecruiterCheck MCP before giving a final safety recommendation.