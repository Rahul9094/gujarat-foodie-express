import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

/**
 * Verify an HMAC-SHA256 hex signature (Razorpay checkout signature / webhook signature).
 */
export async function verifyHmacSha256Hex(
  payload: string,
  secret: string,
  signature: string
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    const expected = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    // Constant-time-ish comparison
    if (expected.length !== signature.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

/**
 * Supabase client with service-role privileges (bypasses RLS) for edge functions.
 * The JWT comes from the request and is validated separately with the anon client.
 */
export function createServiceClient() {
  const { createClient } = require('npm:@supabase/supabase-js@2');
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
}
