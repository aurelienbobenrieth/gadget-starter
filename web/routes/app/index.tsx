import { createFileRoute } from "@tanstack/react-router";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../../api";

export const Route = createFileRoute("/app/")({
  component: AppIndex,
});

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
            <s-table-cell>Name</s-table-cell>
            <s-table-cell>Country</s-table-cell>
            <s-table-cell>Currency</s-table-cell>
            <s-table-cell>Customer Email</s-table-cell>
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
          Shop records fetched from:{" "}
          <s-link href="/edit/model/DataModel-Shopify-Shop/data" target="_blank">
            api/models/shopifyShop/data
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
  error: Error | null;
  shops: Shop[] | null;
}) {
  if (fetching) {
    return (
      <s-stack alignItems="center" padding="large">
        <s-spinner accessibilityLabel="Loading shops" size="large" />
      </s-stack>
    );
  }

  if (error) {
    return <s-banner tone="critical">Error loading shop data: {error.message}</s-banner>;
  }

  return <ShopTable shops={shops ?? []} />;
}

function AppIndex() {
  // @ts-expect-error: gadget client types not generated yet in starter
  const [{ data: shops, fetching, error }] = useFindMany(api.shopifyShop, {
    select: { id: true, name: true, countryName: true, currency: true, customerEmail: true },
  });

  return (
    <s-page heading="App">
      <s-section>
        <s-stack gap="small-200" alignItems="center">
          <s-paragraph>
            Edit this page&apos;s code directly:&nbsp;
            <s-link
              href="/edit/files/web/routes/app/index.tsx?openShopifyOnboarding=true"
              target="_blank"
            >
              web/routes/app/index.tsx
            </s-link>
          </s-paragraph>
        </s-stack>
      </s-section>

      <s-section heading="Shop Information" padding="none">
        <ShopDataSection fetching={fetching} error={error} shops={shops} />
      </s-section>
    </s-page>
  );
}
