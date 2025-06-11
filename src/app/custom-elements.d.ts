import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vaadin-date-time-picker': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        label?: string;
        value?: string;
        step?: number;
        min?: string;
        max?: string;
        disabled?: boolean;
        readonly?: boolean;
      };
    }
  }
}
