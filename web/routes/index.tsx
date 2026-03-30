import { createFileRoute, redirect } from "@tanstack/react-router";
import { LandingPage } from "~/features/landing/landing-page";

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    const searchParams = new URLSearchParams(location.searchStr);
    if (searchParams.get("shop")) {
      throw redirect({
        to: "/app",
        search: Object.fromEntries(searchParams.entries()),
      });
    }
  },
  component: LandingPage,
});
