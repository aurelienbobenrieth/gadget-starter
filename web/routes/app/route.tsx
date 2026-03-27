import { createFileRoute, redirect, useLocation } from "@tanstack/react-router";
import AppProviders from "../../components/AppProviders";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    const searchParams = new URLSearchParams(location.searchStr);
    if (!searchParams.has("shop")) {
      throw redirect({ to: "/" });
    }
  },
  component: AppWrapper,
});

function AppWrapper() {
  const location = useLocation();

  return <AppProviders location={{ pathname: location.pathname, search: location.searchStr }} />;
}
