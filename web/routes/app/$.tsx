import { createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/app/$")({
  component: Error404,
});

function Error404() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const appURL = process.env.GADGET_PUBLIC_SHOPIFY_APP_URL;

    if (appURL && location.pathname === new URL(appURL).pathname) {
      navigate({ to: "/app", replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <s-page heading="Page not found">
      <s-section>
        <s-paragraph>404 — The page you&apos;re looking for doesn&apos;t exist.</s-paragraph>
      </s-section>
    </s-page>
  );
}
