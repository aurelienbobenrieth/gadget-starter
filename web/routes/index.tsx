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
    <div style={styles.wrapper}>
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
    </div>
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
    <div style={styles.card}>
      <img
        src="https://assets.gadget.dev/assets/icon.svg"
        alt="App icon"
        style={{ width: "48px", height: "48px", marginBottom: "24px" }}
      />
      <h1 style={{ fontSize: "20px", fontWeight: 600, margin: "0 0 8px" }}>
        Access this app from Shopify
      </h1>
      <p style={{ fontSize: "14px", color: "#616161", margin: "0 0 24px" }}>
        Enter your store domain to get started
      </p>
      <DomainForm
        shopDomain={shopDomain}
        error={error}
        onDomainChange={onDomainChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function DomainForm({ shopDomain, error, onDomainChange, onSubmit }: LoginCardProps) {
  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="shop-domain"
        style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}
      >
        Store domain
      </label>
      <input
        id="shop-domain"
        type="text"
        placeholder="your-store.myshopify.com"
        value={shopDomain}
        onChange={(ev) => {
          onDomainChange(ev.target.value);
        }}
        style={{
          width: "100%",
          padding: "8px 12px",
          fontSize: "14px",
          border: `1px solid ${error ? "#d72c0d" : "#c9cccf"}`,
          borderRadius: "8px",
          outline: "none",
          boxSizing: "border-box" as const,
        }}
      />
      {error && (
        <p style={{ fontSize: "12px", color: "#d72c0d", margin: "4px 0 0" }}>
          {ERROR_MESSAGES[error]}
        </p>
      )}
      <button type="submit" style={styles.button}>
        Sign in
      </button>
    </form>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f6f6f7",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "440px",
    width: "100%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  button: {
    width: "100%",
    marginTop: "16px",
    padding: "10px",
    fontSize: "14px",
    fontWeight: 600,
    color: "white",
    backgroundColor: "#303030",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer" as const,
  },
};
