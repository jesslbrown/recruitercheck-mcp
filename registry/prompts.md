# Example prompts

- Is this recruiter email legitimate? `john.recruiting@gmail-careers.com`
- Analyze this job posting for scam risk before I apply.
- Does this company domain look suspicious: `careers-microsoft-jobs.net`?
- Explain these triggered signals: `newly_registered_domain`, `upfront_payment_request`.

# Tool routing hints for assistants

Call `check_recruiter_email` when user asks if a recruiter email is legit.
Call `check_job_posting_legitimacy` when user pastes a job description.
Call `check_company_domain` when user asks about domain trust.
Call `explain_risk_signals` when user asks what a risk signal means.