import { createHash } from "node:crypto";
import { getSupabaseClient } from "./supabase.js";

export interface AuthSuccess {
  userId: string;
  apiKeyId: string;
}

export interface AuthFailure {
  errorCode: string;
  message: string;
  retryable: boolean;
}

export type AuthResult = AuthSuccess | AuthFailure;

function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey, "utf8").digest("hex");
}

function isAuthSuccess(result: AuthResult): result is AuthSuccess {
  return "userId" in result;
}

export async function validateApiKey(apiKey: string): Promise<AuthResult> {
  if (!apiKey || apiKey.trim().length < 16) {
    return {
      errorCode: "UNAUTHORIZED",
      message: "Invalid API key format",
      retryable: false,
    };
  }

  try {
    const supabase = getSupabaseClient();
    const keyHash = hashApiKey(apiKey.trim());

    const { data, error } = await supabase
      .from("api_keys")
      .select("id,user_id,revoked")
      .eq("key_hash", keyHash)
      .maybeSingle();

    if (error) {
      return {
        errorCode: "AUTH_BACKEND_ERROR",
        message: `Auth backend error: ${error.message}`,
        retryable: true,
      };
    }

    if (!data || data.revoked) {
      return {
        errorCode: "UNAUTHORIZED",
        message: "API key is invalid or revoked",
        retryable: false,
      };
    }

    await supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", data.id);

    return {
      userId: data.user_id,
      apiKeyId: data.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown auth error";
    return {
      errorCode: "AUTH_CONFIG_ERROR",
      message,
      retryable: false,
    };
  }
}

export { isAuthSuccess };
