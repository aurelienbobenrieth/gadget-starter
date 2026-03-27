// From https://polaris.shopify.com/components/utilities/app-provider#using-linkcomponent
import { Link } from "@tanstack/react-router";
import type { AppProviderProps } from "@shopify/polaris";
import type { ComponentProps } from "react";

const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

export function AdaptorLink({
  children,
  url = "",
  external,
  ...rest
}: ComponentProps<NonNullable<AppProviderProps["linkComponent"]>>) {
  if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
    rest.target = "_blank";
    rest.rel = "noopener noreferrer";
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }

  // Only pass props that are valid for an anchor element to TanStack Router's Link.
  // Polaris may pass extra props (e.g. `preload` as string) that conflict with
  // TanStack Router's stricter types, so we extract only what we need.
  const { preload: _preload, ...anchorProps } = rest as Record<string, unknown>;

  return (
    <Link to={url} {...anchorProps}>
      {children}
    </Link>
  );
}
