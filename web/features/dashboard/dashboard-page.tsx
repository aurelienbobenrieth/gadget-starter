/**
 * App dashboard page.
 *
 * Displays shop information fetched from the Gadget backend. This is
 * the default view merchants see after authenticating through Shopify.
 */
import { useFindMany } from "@gadgetinc/react";
import { api } from "~/integrations/gadget/client";
import * as m from "~/integrations/paraglide/generated/messages.js";

interface Shop {
  id: string;
  name: string;
  countryName: string;
  currency: string;
  customerEmail: string;
}

function ShopTable({ shops }: { shops: Shop[] }) {
  return (
    <>
      <s-table>
        <s-table-header>
          <s-table-row>
            <s-table-cell>{m.shop_table_name()}</s-table-cell>
            <s-table-cell>{m.shop_table_country()}</s-table-cell>
            <s-table-cell>{m.shop_table_currency()}</s-table-cell>
            <s-table-cell>{m.shop_table_customer_email()}</s-table-cell>
          </s-table-row>
        </s-table-header>
        <s-table-body>
          {shops.map((shop) => (
            <s-table-row key={shop.id}>
              <s-table-cell>{shop.name}</s-table-cell>
              <s-table-cell>{shop.countryName}</s-table-cell>
              <s-table-cell>{shop.currency}</s-table-cell>
              <s-table-cell>{shop.customerEmail}</s-table-cell>
            </s-table-row>
          ))}
        </s-table-body>
      </s-table>
      <s-box padding="base">
        <s-paragraph>
          {m.shop_data_source_hint()}{" "}
          <s-link href="/edit/model/DataModel-Shopify-Shop/data" target="_blank">
            {m.shop_data_source_link()}
          </s-link>
        </s-paragraph>
      </s-box>
    </>
  );
}

function ShopDataSection({
  fetching,
  error,
  shops,
}: {
  fetching: boolean;
  error: Error | null | undefined;
  shops: Shop[] | null | undefined;
}) {
  if (fetching) {
    return (
      <s-stack alignItems="center" padding="large">
        <s-spinner accessibilityLabel={m.shop_loading()} size="large" />
      </s-stack>
    );
  }

  if (error) {
    return (
      <s-banner tone="critical">{m.shop_error_loading({ errorMessage: error.message })}</s-banner>
    );
  }

  return <ShopTable shops={shops ?? []} />;
}

export function DashboardPage() {
  // @ts-expect-error: gadget client types not generated yet in starter
  const [{ data: shops, fetching, error }] = useFindMany(api.shopifyShop, {
    select: { id: true, name: true, countryName: true, currency: true, customerEmail: true },
  });

  return (
    <s-page heading={m.app_heading()}>
      <s-section>
        <s-stack gap="small-200" alignItems="center">
          <s-paragraph>
            {m.app_edit_page_hint()}&nbsp;
            <s-link
              href="/edit/files/web/routes/app/index.tsx?openShopifyOnboarding=true"
              target="_blank"
            >
              web/routes/app/index.tsx
            </s-link>
          </s-paragraph>
        </s-stack>
      </s-section>

      <s-section heading={m.shop_section_heading()} padding="none">
        <ShopDataSection fetching={fetching} error={error} shops={shops} />
      </s-section>
    </s-page>
  );
}
