import { getSupabaseClient } from "./supabase.js";

export interface PersistScanInput {
  userId: string;
  apiKeyId: string;
  toolName: string;
  inputPayload: unknown;
  resultPayload: unknown;
  riskScore?: number;
  riskLevel?: string;
  verdict?: string;
}

export async function persistScan(input: PersistScanInput): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("scans").insert({
      user_id: input.userId,
      api_key_id: input.apiKeyId,
      tool_name: input.toolName,
      input_payload: input.inputPayload,
      result_payload: input.resultPayload,
      risk_score: input.riskScore ?? null,
      risk_level: input.riskLevel ?? null,
      verdict: input.verdict ?? null,
    });

    if (error) {
      console.error(`Failed to persist scan: ${error.message}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown persistence error";
    console.error(`Failed to persist scan: ${message}`);
  }
}
