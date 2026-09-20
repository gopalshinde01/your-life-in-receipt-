import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Root Render', () => {
  it('renders the App component without throwing or crashing', async () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    // Check that header or main content appears
    expect(screen.getAllByRole('banner').length).toBeGreaterThanOrEqual(1);
  });
});
