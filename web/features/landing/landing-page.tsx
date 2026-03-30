/**
 * Unauthenticated landing page.
 *
 * Shown to merchants who visit the app URL directly (without the
 * `?shop` query parameter). Prompts them to enter their Shopify store
 * domain so we can redirect into the Shopify Admin install flow.
 */
import { useState } from "react";
import { env } from "~/configs/env";
import * as m from "~/integrations/paraglide/generated/messages.js";

function validateShopifyDomain(input: string) {
  const trimmed = input.trim();

  if (!trimmed.length) {
    return { isValid: false, error: "empty" } as const;
  }

  if (!trimmed.includes(".myshopify.com")) {
    return { isValid: false, error: "invalid" } as const;
  }

  const normalized = trimmed.toLowerCase().replace(/\.myshopify\.com$/, "");
  const domainPattern = /^[a-z0-9-]+$/;
  if (!domainPattern.test(normalized)) {
    return { isValid: false, error: "invalid" } as const;
  }

  return { isValid: true, normalizedDomain: normalized } as const;
}

const ERROR_MESSAGES = {
  empty: () => m.landing_errors_empty_domain(),
  invalid: () => m.landing_errors_invalid_domain(),
};

export function LandingPage() {
  const [shopDomain, setShopDomain] = useState("");
  const [error, setError] = useState<"empty" | "invalid" | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validation = validateShopifyDomain(shopDomain);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    window.location.href = `https://${validation.normalizedDomain}.myshopify.com/admin/apps/${env.shopifyApiKey}`;
  };

  return (
    <s-stack alignItems="center" justifyContent="center" minBlockSize={"100vh" as `${number}px`}>
      <LoginCard
        shopDomain={shopDomain}
        error={error}
        onDomainChange={(value) => {
          setShopDomain(value);
          if (error) {
            setError(null);
          }
        }}
        onSubmit={handleSubmit}
      />
    </s-stack>
  );
}

interface LoginCardProps {
  shopDomain: string;
  error: "empty" | "invalid" | null;
  onDomainChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

function LoginCard({ shopDomain, error, onDomainChange, onSubmit }: LoginCardProps) {
  return (
    <s-box
      padding="large"
      background="base"
      borderRadius="base"
      border="base"
      maxInlineSize="440px"
      inlineSize="100%"
    >
      <s-stack gap="small-200" alignItems="center">
        <s-heading>{m.landing_heading()}</s-heading>
        <s-paragraph color="subdued">{m.landing_subheading()}</s-paragraph>
      </s-stack>
      <s-box paddingBlockStart="base">
        <DomainForm
          shopDomain={shopDomain}
          error={error}
          onDomainChange={onDomainChange}
          onSubmit={onSubmit}
        />
      </s-box>
    </s-box>
  );
}

function DomainForm({ shopDomain, error, onDomainChange, onSubmit }: LoginCardProps) {
  return (
    <form onSubmit={onSubmit}>
      <s-stack gap="small-200">
        <s-text-field
          label={m.common_labels_store_domain()}
          value={shopDomain}
          placeholder={m.landing_placeholder_store_domain()}
          onInput={(ev: Event) => {
            onDomainChange((ev.target as HTMLInputElement).value);
          }}
        />
        {error && <s-text color="subdued">{ERROR_MESSAGES[error]()}</s-text>}
        <s-button
          variant="primary"
          onClick={() => onSubmit(new Event("submit") as unknown as React.FormEvent)}
        >
          {m.common_actions_sign_in()}
        </s-button>
      </s-stack>
    </form>
  );
}
