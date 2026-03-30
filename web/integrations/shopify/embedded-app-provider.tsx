/**
 * Shopify embedded app context provider.
 *
 * Wraps the application in Gadget's Shopify App Bridge integration, which
 * handles OAuth, session tokens, and embedded app communication with the
 * Shopify Admin. This is the outermost provider for all `/app` routes.
 *
 * @see https://docs.gadget.dev/guides/connections/shopify
 */
import type { ReactNode } from "react";
import { AppType, Provider as GadgetProvider } from "@gadgetinc/react-shopify-app-bridge";
import { env } from "~/configs/env";
import { api } from "~/integrations/gadget/client";

interface EmbeddedAppProviderProps {
  /** Current location, forwarded to App Bridge for iframe routing sync. */
  location: { pathname: string; search: string };
  children: ReactNode;
}

export function EmbeddedAppProvider({ location, children }: EmbeddedAppProviderProps) {
  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={env.shopifyApiKey}
      api={api}
      location={location}
    >
      {children}
    </GadgetProvider>
  );
}
