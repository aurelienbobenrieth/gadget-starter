/**
 * Centralized environment variable access.
 *
 * All process.env reads in /web must go through this module.
 * Import from "~/configs/env" instead of using process.env directly.
 */

export const env = {
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === "production",
  shopifyApiKey: process.env.GADGET_PUBLIC_SHOPIFY_API_KEY!,
  shopifyAppUrl: process.env.GADGET_PUBLIC_SHOPIFY_APP_URL!,
} as const;
