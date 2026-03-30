import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "~/features/error/not-found-page";

export const Route = createFileRoute("/app/$")({
  component: NotFoundPage,
});
