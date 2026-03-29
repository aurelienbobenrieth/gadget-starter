import { Link, Outlet } from "@tanstack/react-router";
import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavMenu } from "@shopify/app-bridge-react";
import { api } from "../api";

interface AppProvidersProps {
  location: { pathname: string; search: string };
}

export default function AppProviders({ location }: AppProvidersProps) {
  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={process.env.GADGET_PUBLIC_SHOPIFY_API_KEY!}
      api={api}
      location={location}
    >
      <AuthenticatedApp />
    </GadgetProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, loading } = useGadget();

  if (loading) {
    return (
      <s-stack
        alignItems="center"
        justifyContent="center"
        style={{ height: "100vh", width: "100%" }}
      >
        <s-spinner accessibilityLabel="Loading" size="large-100" />
      </s-stack>
    );
  }

  return isAuthenticated ? <EmbeddedApp /> : <UnauthenticatedApp />;
}

function EmbeddedApp() {
  return (
    <>
      <Outlet />
      <NavMenu>
        <Link to="/app">Shop Information</Link>
      </NavMenu>
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <s-page heading="Unauthenticated">
      <s-section>
        <s-heading>App must be viewed in the Shopify Admin</s-heading>
        <s-box paddingBlockStart="base">
          <s-paragraph>
            Edit this page:{" "}
            <s-link
              href={`/edit/${process.env.GADGET_PUBLIC_APP_ENV}/files/web/routes/app/route.tsx`}
            >
              web/routes/app/route.tsx
            </s-link>
          </s-paragraph>
        </s-box>
      </s-section>
    </s-page>
  );
}
