import {
  jsonResponse,
  createServiceClient,
  verifyHmacSha256Hex,
} from '../_shared/razorpay.ts';

/**
 * Razorpay webhook receiver.
 *
 * Configure in Razorpay Dashboard -> Settings -> Webhooks:
 *   URL:    <project-url>/functions/v1/razorpay-webhook
 *   Events: payment.captured (and optionally payment.failed)
 *   Secret: the same value stored as RAZORPAY_WEBHOOK_SECRET
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
  if (!webhookSecret) {
    return jsonResponse({ error: 'Webhook not configured' }, 503);
  }

  const signature = req.headers.get('X-Razorpay-Signature');
  if (!signature) {
    return jsonResponse({ error: 'Missing signature' }, 400);
  }

  const rawBody = await req.text();
  const valid = await verifyHmacSha256Hex(rawBody, webhookSecret, signature);
  if (!valid) {
    return jsonResponse({ error: 'Invalid signature' }, 400);
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const payment = event?.payload?.payment?.entity;
  if (!payment) {
    return jsonResponse({ received: true });
  }

  const razorpayOrderId: string | undefined = payment.order_id;
  if (!razorpayOrderId) {
    return jsonResponse({ received: true });
  }

  const supabase = createServiceClient();

  if (event.event === 'payment.captured') {
    const { data: order } = await supabase
      .from('orders')
      .select('id, payment_status')
      .eq('razorpay_order_id', razorpayOrderId)
      .maybeSingle();

    if (order && order.payment_status !== 'paid') {
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          razorpay_payment_id: payment.id,
        })
        .eq('id', order.id);
    }
  } else if (event.event === 'payment.failed') {
    // Record the failure on the order so admins can see abandoned attempts.
    await supabase
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('razorpay_order_id', razorpayOrderId)
      .neq('payment_status', 'paid');
  }

  return jsonResponse({ received: true });
});
