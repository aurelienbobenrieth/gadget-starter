/**
 * 404 — Not found page.
 *
 * Catches unmatched `/app/*` routes and shows a friendly error.
 * If the current path matches the Shopify app URL root, it silently
 * redirects to `/app` (handles the initial Shopify redirect).
 */
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { env } from "~/configs/env";
import * as m from "~/integrations/paraglide/generated/messages.js";

export function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const appURL = env.shopifyAppUrl;

    if (appURL && location.pathname === new URL(appURL).pathname) {
      navigate({ to: "/app", replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <s-page heading={m.common_errors_page_not_found()}>
      <s-section>
        <s-paragraph>{m.common_errors_not_found_description()}</s-paragraph>
      </s-section>
    </s-page>
  );
}
