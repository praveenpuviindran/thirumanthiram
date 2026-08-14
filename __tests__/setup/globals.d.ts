// Ambient declarations for the mutable mock holders defined in jest.setup.js.
// These live on globalThis because babel-plugin-jest-hoist forbids jest.mock()
// factories from closing over module-scope bindings.
//
// Test-only. Does not affect application source typing.

declare global {
  // eslint-disable-next-line no-var
  var mockRouteParams: Record<string, string>;

  // eslint-disable-next-line no-var
  var mockRouter: {
    push: jest.Mock;
    replace: jest.Mock;
    back: jest.Mock;
    navigate: jest.Mock;
    canGoBack: jest.Mock;
    setParams: jest.Mock;
  };
}

export {};
