import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getProducts } from "../lib/products";
import { stripe } from "../lib/stripe";

export const checkout = {
    create: defineAction({
        accept: "form",
        input: z.object({
            id: z.number(),
        }),
        handler: async (input, context) => {
            const product = (await getProducts()).find(p => p.id === input.id);

            if (!product) {
                throw new ActionError({
                    code: "NOT_FOUND",
                    message: "no product found",
                })
            }
            console.log(product)

            const stripeSession = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                line_items: [{
                    quantity: 1,
                    price_data: {
                        unit_amount: product.amount,
                        currency: "usd",
                        product_data: {
                            name: product.title,
                            description: `Buy a single ${product.title}.`,
                        },
                    },
                }],
                metadata: {
                    // metadata that can be accessed in the webhook?
                    priceID: product.id,
                },
                success_url: context.url.origin + "/?stripe=success",
                cancel_url: context.url.origin + "/?stripe=cancel",
            });

            console.log(stripeSession)

            if (!stripeSession.url) {
                throw new ActionError({
                    code: "NOT_FOUND",
                    message: "Could not create a Stripe session",
                })
            }

            return {
                url: stripeSession.url,
            };
        },
    }),

}