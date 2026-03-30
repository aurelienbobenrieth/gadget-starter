/**
 * Authentication gate for Shopify embedded routes.
 *
 * Renders a loading spinner while the Shopify session is being established,
 * shows a fallback when the user is unauthenticated, and renders children
 * only when fully authenticated.
 *
 * This keeps auth concerns out of individual route components.
 */
import type { ReactNode } from "react";
import { useGadget } from "@gadgetinc/react-shopify-app-bridge";
import * as m from "~/integrations/paraglide/generated/messages.js";

interface AuthGateProps {
  children: ReactNode;
  /** Rendered when the user is not authenticated. Defaults to a standard message. */
  fallback?: ReactNode;
}

export function AuthGate({ children, fallback }: AuthGateProps) {
  const { isAuthenticated, loading } = useGadget();

  if (loading) {
    return (
      <s-stack
        alignItems="center"
        justifyContent="center"
        minBlockSize={"100vh" as `${number}px`}
        inlineSize="100%"
      >
        <s-spinner accessibilityLabel={m.common_actions_loading()} size="large-100" />
      </s-stack>
    );
  }

  if (!isAuthenticated) {
    return (fallback ?? <DefaultUnauthenticatedFallback />) as React.ReactNode;
  }

  return children as React.ReactNode;
}

function DefaultUnauthenticatedFallback() {
  return (
    <s-page heading={m.auth_unauthenticated_heading()}>
      <s-section>
        <s-heading>{m.auth_must_view_in_admin()}</s-heading>
      </s-section>
    </s-page>
  );
}
