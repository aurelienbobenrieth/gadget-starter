/**
 * Syncs the Shopify merchant's locale with Paraglide.
 *
 * Shopify sends the admin user's preferred language as a `locale` query
 * parameter (e.g. `?locale=fr` or `?locale=fr-FR`). This function extracts
 * the base language tag and sets it as the active Paraglide locale — without
 * triggering a page reload — so all downstream components render translated.
 *
 * Call this in the `/app` route's `beforeLoad` hook.
 *
 * @see https://shopify.dev/docs/apps/build/localize-your-app
 */
import { setLocale, isLocale } from "./generated/runtime.js";

export function syncShopifyLocale(searchParams: URLSearchParams): void {
  const shopifyLocale = searchParams.get("locale");
  if (!shopifyLocale) {
    return;
  }

  // Shopify may send full BCP-47 tags like "fr-FR" — we only need the language.
  const [baseLocale] = shopifyLocale.split("-");
  const normalizedLocale = baseLocale!.toLowerCase();

  if (isLocale(normalizedLocale)) {
    setLocale(normalizedLocale, { reload: false });
  }
}
