import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createOrder } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
      address,
      city,
      zip,
    } = body;

    if (!items?.length || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const shippingAddress = [address, city, zip].filter(Boolean).join(", ") || null;
    const method = paymentMethod === "pix" ? "pix" : "card";

    if (!isStripeConfigured() || !stripe) {
      const order = await createOrder({
        items: JSON.stringify(items),
        total,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        shippingAddress,
        status: "demo",
        paymentMethod: method,
      });

      return NextResponse.json({
        demo: true,
        orderId: order.id,
        paymentMethod: method,
        message:
          "Modo demonstração: configure STRIPE_SECRET_KEY para pagamentos reais.",
      });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_URL ||
      "http://localhost:3000";

    const paymentTypes: ("card" | "pix")[] =
      method === "pix" ? ["pix"] : ["card"];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentTypes,
      mode: "payment",
      customer_email: customerEmail,
      line_items: items.map(
        (item: {
          title: string;
          image: string;
          price: number;
          quantity: number;
          size: string;
          color: string;
        }) => ({
          price_data: {
            currency: "brl",
            product_data: {
              name: `${item.title} - ${item.size} / ${item.color}`,
              images: item.image
                ? [
                    item.image.startsWith("http")
                      ? item.image
                      : `${origin}${item.image}`,
                  ]
                : [],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })
      ),
      success_url: `${origin}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrinho`,
      metadata: {
        customerName,
        customerPhone: customerPhone || "",
        shippingAddress: shippingAddress || "",
      },
    });

    await createOrder({
      items: JSON.stringify(items),
      total,
      customerName,
      customerEmail,
      customerPhone: customerPhone || null,
      shippingAddress,
      status: "pending",
      paymentMethod: method,
      stripeSessionId: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}