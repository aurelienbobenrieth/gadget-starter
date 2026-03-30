/**
 * Shopify Admin sidebar navigation menu.
 *
 * Configures the navigation links that appear in the Shopify Admin sidebar
 * when the app is embedded. Add or remove `<Link>` entries here to update
 * the app's navigation structure.
 *
 * @see https://shopify.dev/docs/api/app-bridge-library/reference/navigation-menu
 */
import { Link } from "@tanstack/react-router";
import { NavMenu } from "@shopify/app-bridge-react";
import * as m from "~/integrations/paraglide/generated/messages.js";

export function AppNavMenu() {
  return (
    <NavMenu>
      <Link to="/app">{m.nav_shop_information()}</Link>
    </NavMenu>
  );
}
