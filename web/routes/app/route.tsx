import { createFileRoute, redirect, useLocation } from "@tanstack/react-router";
import { setLocale, isLocale } from "../../paraglide/runtime.js";
import AppProviders from "../../components/AppProviders";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    const searchParams = new URLSearchParams(location.searchStr);
    if (!searchParams.has("shop")) {
      throw redirect({ to: "/" });
    }

    // Shopify sends the merchant's locale via the `locale` query parameter.
    // Sync it with Paraglide so all downstream components render in the right language.
    const shopifyLocale = searchParams.get("locale");
    if (shopifyLocale) {
      // Shopify may send full locale tags like "fr-FR" — extract the base language.
      const [baseLocale] = shopifyLocale.split("-");
      const normalizedLocale = baseLocale!.toLowerCase();
      if (isLocale(normalizedLocale)) {
        setLocale(normalizedLocale, { reload: false });
      }
    }
  },
  component: AppWrapper,
});

function AppWrapper() {
  const location = useLocation();

  return <AppProviders location={{ pathname: location.pathname, search: location.searchStr }} />;
}
