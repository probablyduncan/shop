import { STRIPE_SECRET_KEY } from "astro:env/server";
import Stripe from "stripe";

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
});