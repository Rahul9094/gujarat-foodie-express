import { z } from 'npm:zod';
import {
  jsonResponse,
  createServiceClient,
  getAuthUserId,
  verifyHmacSha256Hex,
} from '../_shared/razorpay.ts';

const BodySchema = z.object({
  order_db_id: z.string().uuid(),
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().min(1).max(256),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'authorization, x-client-info, apikey, content-type',
      },
    });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
  if (!keySecret) {
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
  const { order_db_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    parsed.data;

  const userId = await getAuthUserId(req);
  if (!userId) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const supabase = createServiceClient();
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, user_id, payment_status, razorpay_order_id')
    .eq('id', order_db_id)
    .single();

  if (orderErr || !order) {
    return jsonResponse({ error: 'Order not found' }, 404);
  }
  if (order.user_id !== userId) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }
  if (order.razorpay_order_id !== razorpay_order_id) {
    return jsonResponse({ error: 'Order mismatch' }, 400);
  }
  if (order.payment_status === 'paid') {
    return jsonResponse({ success: true, already_paid: true });
  }

  // Razorpay checkout signature: HMAC_SHA256(order_id|payment_id, key_secret)
  const valid = await verifyHmacSha256Hex(
    `${razorpay_order_id}|${razorpay_payment_id}`,
    keySecret,
    razorpay_signature
  );
  if (!valid) {
    return jsonResponse({ success: false, error: 'Invalid payment signature' }, 400);
  }

  const { error: updateErr } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      razorpay_payment_id,
    })
    .eq('id', order.id);

  if (updateErr) {
    console.error('Failed to mark order paid:', updateErr);
    return jsonResponse({ success: false, error: 'Failed to update order' }, 500);
  }

  return jsonResponse({ success: true });
});
