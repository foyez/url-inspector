import {
  breakpoints,
  colors,
  fontWeights,
  radii,
  spacing,
  styleUtils,
  zIndices,
} from "@/styles";
import { css } from "@emotion/react";
import type { HTMLProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "error" | "text";

type ButtonProps = {
  type?: "submit" | "button";
  children: ReactNode;
  variant?: ButtonVariant;
} & HTMLProps<HTMLButtonElement>;

function Button({
  type = "button",
  children,
  variant = "primary",
  disabled = false,
  ...btnAttributes
}: ButtonProps) {
  return (
    <button
      type={type}
      css={styles.button(variant, disabled)}
      {...btnAttributes}
    >
      <span css={styles.buttonContent}>{children}</span>
    </button>
  );
}

export default Button;

const styles = {
  button: (variant: ButtonVariant, disabled: boolean) => css`
    ${styleUtils.resetButton}
    display: inline-block;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 0;
    padding: ${spacing.sm} ${spacing.md};
    border-radius: ${radii.sm};
    z-index: ${zIndices.base};
    transition: all 150ms ease-in-out;
    position: relative;

    // to make responsive
    ${breakpoints.sm} {
    }

    ${variant === "primary" &&
    css`
      background-color: ${colors.actionPrimaryDefault};
      color: ${colors.white};

      &:hover {
        background-color: ${colors.actionPrimaryHover};
      }

      &:active {
        background-color: ${colors.actionPrimaryFocus};
      }

      ${disabled &&
      css`
        background-color: ${colors.actionPrimaryDisabled};
        color: ${colors.textDisabled};
      `}
    `}

    ${variant === "secondary" &&
    css`
      color: ${colors.textDefault};
      font-weight: ${fontWeights.normal};
      border: 1px solid ${colors.actionOutlineDefault};
      transition: border-color 0.2s ease;
      background-color: ${colors.bgWhite};

      $:hover {
        color: ${colors.textPrimary};
        border-color: ${colors.actionOutlineHover};
        background-color: ${colors.bgWhite};
      }

      &:active {
        color: ${colors.textPrimary};
        border-color: ${colors.actionOutlineFocus};
      }

      ${disabled &&
      css`
        color: ${colors.textDisabled};
        border-color: ${colors.actionOutlineDisabled};
      `}
    `}

    ${variant === "error" &&
    css`
      background-color: ${colors.actionErrorDefault};
      color: ${colors.white};

      &:hover {
        background-color: ${colors.actionErrorHover};
      }

      &:active {
        background-color: ${colors.actionErrorFocus};
      }

      ${disabled &&
      css`
        background-color: ${colors.actionErrorDisabled};
        color: ${colors.textDisabled};
      `}
    `}

    ${variant === "text" &&
    css`
      color: ${colors.textDefault};
      font-weight: ${fontWeights.normal};

      &:hover {
        color: ${colors.textPrimary};
      }

      &:active {
        color: ${colors.textPrimary};
      }

      ${disabled &&
      css`
        color: ${colors.textDisabled};
      `}
    `}
  `,
  buttonContent: css`
    display: flex;
    align-items: center;
  `,
};
