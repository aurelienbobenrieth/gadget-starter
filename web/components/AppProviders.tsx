import { Link, Outlet } from "@tanstack/react-router";
import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavMenu } from "@shopify/app-bridge-react";
import { AppProvider, Box, Card, Page, Spinner, Text } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AdaptorLink } from "./AdaptorLink";
import { api } from "../api";

interface AppProvidersProps {
  location: { pathname: string; search: string };
}

export default function AppProviders({ location }: AppProvidersProps) {
  return (
    <AppProvider i18n={enTranslations} linkComponent={AdaptorLink}>
      <GadgetProvider
        type={AppType.Embedded}
        shopifyApiKey={process.env.GADGET_PUBLIC_SHOPIFY_API_KEY!}
        api={api}
        location={location}
      >
        <AuthenticatedApp />
      </GadgetProvider>
    </AppProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, loading } = useGadget();

  if (loading) {
    return (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Loading" size="large" />
      </div>
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
    <Page>
      <div style={{ height: "80px" }}>
        <Card padding="500">
          <Text variant="headingLg" as="h1">
            App must be viewed in the Shopify Admin
          </Text>
          <Box paddingBlockStart="200">
            <Text variant="bodyLg" as="p">
              Edit this page:{" "}
              <a href={`/edit/${process.env.GADGET_PUBLIC_APP_ENV}/files/web/routes/app/route.tsx`}>
                web/routes/app/route.tsx
              </a>
            </Text>
          </Box>
        </Card>
      </div>
    </Page>
  );
}
