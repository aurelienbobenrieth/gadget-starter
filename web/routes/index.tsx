import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

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
  component: UnauthenticatedLanding,
});

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
  empty: "Please enter your Shopify store domain",
  invalid: "Please enter a valid Shopify domain (e.g., your-store.myshopify.com)",
};

function UnauthenticatedLanding() {
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

    const apiKey = process.env.GADGET_PUBLIC_SHOPIFY_API_KEY;
    window.location.href = `https://${validation.normalizedDomain}.myshopify.com/admin/apps/${apiKey}`;
  };

  return (
    <s-stack alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
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
        <s-heading>Access this app from Shopify</s-heading>
        <s-paragraph color="subdued">Enter your store domain to get started</s-paragraph>
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
          label="Store domain"
          value={shopDomain}
          placeholder="your-store.myshopify.com"
          onInput={(ev: Event) => {
            onDomainChange((ev.target as HTMLInputElement).value);
          }}
        />
        {error && <s-text color="subdued">{ERROR_MESSAGES[error]}</s-text>}
        <s-button variant="primary" onClick={onSubmit}>
          Sign in
        </s-button>
      </s-stack>
    </form>
  );
}
