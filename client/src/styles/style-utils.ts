import { css } from "@emotion/react";
import { fonts } from "./typography";

export const styleUtils = {
  flexCenter: (dir: "row" | "col" = "row") => css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: ${dir === "col" ? "column" : "row"};
  `,
  resetButton: css`
    background: none;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    text-align: inherit;
    font-family: ${fonts.body};
    cursor: pointer;
  `,
};
