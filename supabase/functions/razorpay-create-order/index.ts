import { z } from 'npm:zod';
import {
  jsonResponse,
  createServiceClient,
  getAuthUserId,
} from '../_shared/razorpay.ts';

const BodySchema = z.object({
  order_db_id: z.string().uuid(),
  amount: z.number().int().positive().max(1_000_000),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: jsonResponseHeaders() });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const keyId = Deno.env.get('RAZORPAY_KEY_ID');
  const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
  if (!keyId || !keySecret) {
    return jsonResponse({ error: 'Payment gateway is not configured yet' }, 503);
  }

  let parsed;
  try {
    parsed = BodySchema.safeParse(await req.json());
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }
  if (!parsed.success) {
    return jsonResponse({ error: parsed.error.flatten().fieldErrors }, 400);
  }
  const { order_db_id, amount } = parsed.data;

  // Only the order owner may start a payment for it.
  const userId = await getAuthUserId(req);
  if (!userId) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const supabase = createServiceClient();
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, user_id, total, payment_status, razorpay_order_id')
    .eq('id', order_db_id)
    .single();

  if (orderErr || !order) {
    return jsonResponse({ error: 'Order not found' }, 404);
  }
  if (order.user_id !== userId) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }
  if (order.payment_status === 'paid') {
    return jsonResponse({ error: 'Order is already paid' }, 409);
  }
  if (order.total !== amount) {
    return jsonResponse({ error: 'Amount mismatch with order total' }, 400);
  }

  // Reuse an existing Razorpay order if a payment attempt was already started.
  if (order.razorpay_order_id) {
    return jsonResponse({
      key_id: keyId,
      razorpay_order_id: order.razorpay_order_id,
      amount: amount * 100,
      currency: 'INR',
    });
  }

  // Create the order on Razorpay (amount must be in paise).
  const auth = btoa(`${keyId}:${keySecret}`);
  const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amount * 100,
      currency: 'INR',
      receipt: order.id,
      notes: { app: 'gujarat-foodie-express', order_id: order.id },
    }),
  });

  const rzp = await rzpRes.json();
  if (!rzpRes.ok || !rzp?.id) {
    console.error('Razorpay order creation failed:', rzp);
    return jsonResponse({ error: 'Payment gateway error' }, 502);
  }

  const { error: updateErr } = await supabase
    .from('orders')
    .update({ razorpay_order_id: rzp.id })
    .eq('id', order.id);

  if (updateErr) {
    console.error('Failed to save razorpay_order_id:', updateErr);
    return jsonResponse({ error: 'Failed to link payment to order' }, 500);
  }

  return jsonResponse({
    key_id: keyId,
    razorpay_order_id: rzp.id,
    amount: amount * 100,
    currency: 'INR',
  });
});

function jsonResponseHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
  };
}
