import '@testing-library/jest-dom';

// Polyfill window.matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill window.print for JSDOM
Object.defineProperty(window, 'print', {
  writable: true,
  value: () => {},
});

// Polyfill HTMLCanvasElement.prototype.getContext for JSDOM
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (() => {
    return {
      clearRect: () => {},
      save: () => {},
      translate: () => {},
      rotate: () => {},
      restore: () => {},
      fillRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      measureText: () => ({ width: 0 }),
    } as unknown as RenderingContext;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

