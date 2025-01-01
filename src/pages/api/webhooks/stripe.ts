import type { APIRoute } from "astro";
import { STRIPE_SIGNING_SECRET } from "astro:env/server";
import { stripe } from "../../../lib/stripe";
import type Stripe from "stripe";

interface Metadata {
    priceId: string;
}

export const POST: APIRoute = async ({ request }) => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 400,
            headers: { "Content-Type": "application-json", },
        });
    }

    try {
        const event = stripe.webhooks.constructEvent(
            await request.text(),
            signature,
            STRIPE_SIGNING_SECRET,
        );

        const completedEvent = event.data.object as Stripe.Checkout.Session & {
            metadata: Metadata
        };

        if (event.type === "checkout.session.completed") {
            console.log("paid", completedEvent.amount_total);
            console.log("metadata", completedEvent.metadata);
        }
        else if (event.type === "checkout.session.expired") {
            console.log("paid", completedEvent.amount_total);
            console.log("expired", completedEvent.metadata);
        }

        return new Response(JSON.stringify({ success: true, error: null }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: (error as { message: string }).message,
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }


}