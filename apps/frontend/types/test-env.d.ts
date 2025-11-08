// types/test-env.d.ts

/// <reference types="@testing-library/jest-dom" />

import { MatcherFunction } from '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(expected: string | RegExp): R;
      toHaveAttribute(attr: string, value?: string | RegExp): R;
      toHaveClass(...className: string[]): R;
      toHaveStyle(css: string | object): R;
      toBeVisible(): R;
      toBeEmptyDOMElement(): R;
      toContainElement(element: HTMLElement | null): R;
      toHaveFocus(): R;
      toHaveFormValues(expectedValues: Record<string, unknown>): R;
      toBeChecked(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toHaveErrorMessage(expected: string | RegExp): R;
      toHaveValue(expectedValue?: string | string[] | number): R;
    }
  }
}