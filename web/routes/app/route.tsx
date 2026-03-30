import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { syncShopifyLocale } from "~/integrations/paraglide/sync-shopify-locale";
import { EmbeddedAppProvider } from "~/integrations/shopify/embedded-app-provider";
import { AuthGate } from "~/integrations/shopify/auth-gate";
import { AppNavMenu } from "~/integrations/shopify/app-nav-menu";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    const searchParams = new URLSearchParams(location.searchStr);
    if (!searchParams.has("shop")) {
      throw redirect({ to: "/" });
    }

    syncShopifyLocale(searchParams);
  },
  component: AppWrapper,
});

/**
 * Root layout for all `/app/*` routes.
 *
 * Composes the Shopify integration layers in order:
 * 1. EmbeddedAppProvider — establishes the Shopify Admin iframe context
 * 2. AuthGate — blocks rendering until the merchant session is verified
 * 3. AppNavMenu — registers sidebar navigation in the Shopify Admin
 * 4. Outlet — renders the matched child route
 */
function AppWrapper() {
  const location = useLocation();

  return (
    <EmbeddedAppProvider location={{ pathname: location.pathname, search: location.searchStr }}>
      <AuthGate>
        <Outlet />
        <AppNavMenu />
      </AuthGate>
    </EmbeddedAppProvider>
  );
}
