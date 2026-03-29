/**
 * TypeScript declarations for Shopify Polaris Web Components (s-* custom elements).
 * These components are loaded via the Polaris CDN script and work as native HTML elements.
 * @see https://shopify.dev/docs/api/app-home/web-components
 */

import "react";

type PolarisSpacing =
  | "none"
  | "small-100"
  | "small-200"
  | "small-300"
  | "small-400"
  | "small"
  | "base"
  | "large"
  | "large-100";

type PolarisDirection = "inline" | "block";

interface PolarisBaseProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

interface SPageProps extends PolarisBaseProps {
  heading?: string;
  "inline-size"?: "small" | "base" | "large";
}

interface SSectionProps extends PolarisBaseProps {
  heading?: string;
  padding?: "base" | "none";
  accessibilityLabel?: string;
}

interface SBoxProps extends PolarisBaseProps {
  padding?: PolarisSpacing;
  paddingBlock?: PolarisSpacing;
  paddingBlockStart?: PolarisSpacing;
  paddingBlockEnd?: PolarisSpacing;
  paddingInline?: PolarisSpacing;
  paddingInlineStart?: PolarisSpacing;
  paddingInlineEnd?: PolarisSpacing;
  background?: "base" | "subdued" | "transparent";
  border?: "base" | "none";
  borderRadius?: "base" | "none";
  display?: "auto" | "none";
  overflow?: "hidden" | "visible";
  maxBlockSize?: string;
  maxInlineSize?: string;
  inlineSize?: string;
}

interface SStackProps extends PolarisBaseProps {
  direction?: PolarisDirection;
  gap?: PolarisSpacing;
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "space-between";
  paddingBlock?: PolarisSpacing;
  paddingBlockStart?: PolarisSpacing;
  paddingBlockEnd?: PolarisSpacing;
  paddingInline?: PolarisSpacing;
}

interface SGridProps extends PolarisBaseProps {
  gap?: PolarisSpacing;
  gridTemplateColumns?: string;
  alignItems?: "start" | "center" | "end" | "stretch";
  background?: "base" | "subdued" | "transparent";
  border?: "base" | "none";
  borderRadius?: "base" | "none";
  padding?: PolarisSpacing;
}

interface SHeadingProps extends PolarisBaseProps {
  accessibilityRole?: "none" | "presentation" | "heading";
  lineClamp?: number;
  accessibilityVisibility?: "visible" | "hidden" | "exclusive";
}

interface SParagraphProps extends PolarisBaseProps {
  color?: "subdued";
}

interface STextProps extends PolarisBaseProps {
  color?: "subdued";
}

interface SButtonProps extends PolarisBaseProps {
  variant?: "primary" | "secondary" | "tertiary";
  tone?: "neutral" | "critical" | "success";
  icon?: string;
  href?: string;
  slot?: string;
  accessibilityLabel?: string;
  onClick?: (event: Event) => void;
  disabled?: boolean;
}

interface SLinkProps extends PolarisBaseProps {
  href?: string;
  target?: "_blank" | "_self";
  slot?: string;
}

interface SClickableProps extends PolarisBaseProps {
  href?: string;
  accessibilityLabel?: string;
  border?: "base" | "none";
  borderRadius?: "base" | "none";
  padding?: PolarisSpacing;
  paddingBlock?: PolarisSpacing;
  paddingInline?: PolarisSpacing;
  inlineSize?: string;
}

interface SBadgeProps extends PolarisBaseProps {
  tone?: "success" | "warning" | "critical" | "info";
  icon?: string;
}

interface SBannerProps extends PolarisBaseProps {
  tone?: "info" | "success" | "warning" | "critical";
  dismissible?: boolean;
  onDismiss?: (event: Event) => void;
}

interface SSpinnerProps extends PolarisBaseProps {
  accessibilityLabel: string;
  size?: "base" | "large" | "large-100";
}

interface SDividerProps extends PolarisBaseProps {
  direction?: "inline" | "block";
}

interface SImageProps extends PolarisBaseProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill";
}

interface SThumbnailProps extends PolarisBaseProps {
  size?: "small" | "base" | "large";
  src: string;
  alt: string;
}

interface SCheckboxProps extends PolarisBaseProps {
  label?: string;
  checked?: boolean;
  onInput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
}

type STableProps = PolarisBaseProps;
type STableHeaderProps = PolarisBaseProps;
type STableBodyProps = PolarisBaseProps;
type STableRowProps = PolarisBaseProps;
type STableCellProps = PolarisBaseProps;

interface STextFieldProps extends PolarisBaseProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onInput?: (event: Event) => void;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "s-page": SPageProps;
      "s-section": SSectionProps;
      "s-box": SBoxProps;
      "s-stack": SStackProps;
      "s-grid": SGridProps;
      "s-heading": SHeadingProps;
      "s-paragraph": SParagraphProps;
      "s-text": STextProps;
      "s-button": SButtonProps;
      "s-link": SLinkProps;
      "s-clickable": SClickableProps;
      "s-badge": SBadgeProps;
      "s-banner": SBannerProps;
      "s-spinner": SSpinnerProps;
      "s-divider": SDividerProps;
      "s-image": SImageProps;
      "s-thumbnail": SThumbnailProps;
      "s-checkbox": SCheckboxProps;
      "s-table": STableProps;
      "s-table-header": STableHeaderProps;
      "s-table-body": STableBodyProps;
      "s-table-row": STableRowProps;
      "s-table-cell": STableCellProps;
      "s-text-field": STextFieldProps;
    }
  }
}
