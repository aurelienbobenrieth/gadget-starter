/// <reference types="vite/client" />
import { type ReactNode, lazy, Suspense } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gadget App" },
    ],
    links: [
      { rel: "stylesheet", href: "https://assets.gadget.dev/assets/reset.min.css" },
      { rel: "preconnect", href: "https://fonts.googleapis.com/" },
      { rel: "preconnect", href: "https://fonts.gstatic.com/", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://cdn.shopify.com/" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@450;550;650;700&display=swap",
      },
    ],
    scripts: [{ src: "https://assets.gadget.dev/assets/web-performance.min.js", defer: true }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
