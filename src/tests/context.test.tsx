import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LifeProvider, useLifeContext } from '../context/LifeContext';

const TestConsumer: React.FC = () => {
  const { lifeData, theme, language } = useLifeContext();
  return (
    <div>
      <span data-testid="user-name">{lifeData.profile.name}</span>
      <span data-testid="active-theme">{theme.theme}</span>
      <span data-testid="active-lang">{language.language}</span>
    </div>
  );
};

describe('LifeContext and LifeProvider', () => {
  it('provides lifeData, theme, and language to descendant consumers', () => {
    render(
      <LifeProvider>
        <TestConsumer />
      </LifeProvider>
    );

    expect(screen.getByTestId('user-name')).toHaveTextContent(/Alex Rivera|Gopal Shinde/i);
    expect(screen.getByTestId('active-theme')).toHaveTextContent(/classic|pure-white/i);
    expect(screen.getByTestId('active-lang')).toHaveTextContent(/en|hi|mr/i);
  });

  it('throws error when useLifeContext is used outside of LifeProvider', () => {
    // Suppress console.error in test for expected error boundary test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(/useLifeContext must be used within a LifeProvider/i);
    spy.mockRestore();
  });
});
