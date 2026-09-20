import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeSelector } from '../components/common/ThemeSelector';
import { THEMES, STORAGE_KEYS } from '../constants';
import { storageService } from '../services/storageService';

describe('Theme System & Resilience', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('contains exactly the 2 requested themes in sequential order: Classic Thermal and Pure White (Light)', () => {
    expect(THEMES).toHaveLength(2);
    expect(THEMES[0].id).toBe('classic');
    expect(THEMES[0].name).toBe('Classic Thermal');
    expect(THEMES[1].id).toBe('pure-white');
    expect(THEMES[1].name).toBe('Pure White (Light)');

    THEMES.forEach(theme => {
      expect(theme.name).toBeDefined();
      expect(theme.receiptBg).toMatch(/^#/);
      expect(theme.receiptText).toMatch(/^#/);
      expect(theme.receiptBorder).toMatch(/^#/);
    });
  });

  it('safely recovers to classic theme if storage has unknown or corrupted value', () => {
    window.localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify('malicious_or_unknown_theme'));

    const saved = storageService.getItem<string>(STORAGE_KEYS.THEME, 'classic');
    const validThemes = THEMES.map(t => t.id);
    const fallbackTheme = validThemes.includes(saved as any) ? saved : 'classic';

    expect(fallbackTheme).toBe('classic');
  });

  it('renders ThemeSelector in grid mode and allows selecting Pure White', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <ThemeSelector
        currentTheme="classic"
        onSelectTheme={handleSelect}
        variant="grid"
      />
    );

    expect(screen.getByText('Classic Thermal')).toBeInTheDocument();
    expect(screen.getByText('Pure White (Light)')).toBeInTheDocument();

    const whiteBtn = screen.getByRole('radio', { name: /Pure White \(Light\)/i });
    await user.click(whiteBtn);

    expect(handleSelect).toHaveBeenCalledWith('pure-white');
  });

  it('renders ThemeSelector in compact mode and toggles between the 2 themes', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <ThemeSelector
        currentTheme="classic"
        onSelectTheme={handleSelect}
        variant="compact"
      />
    );

    const triggerBtn = screen.getByRole('button', { name: /Current visual theme/i });
    await user.click(triggerBtn);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    const whiteOption = screen.getByRole('menuitemradio', { name: /Pure White \(Light\)/i });
    await user.click(whiteOption);

    expect(handleSelect).toHaveBeenCalledWith('pure-white');
  });

  it('renders merged ThemeLanguageControl in compact mode with quick 1-click switcher and popover', async () => {
    const user = userEvent.setup();
    const handleThemeSelect = vi.fn();
    const handleLangSelect = vi.fn();

    const { ThemeLanguageControl } = await import('../components/common/ThemeLanguageControl');

    render(
      <ThemeLanguageControl
        currentTheme="classic"
        onSelectTheme={handleThemeSelect}
        currentLanguage="en"
        onSelectLanguage={handleLangSelect}
        variant="compact"
      />
    );

    // Quick 1-click switcher toggles to Pure White
    const quickToggle = screen.getByRole('button', { name: /Switch to Pure White/i });
    await user.click(quickToggle);
    expect(handleThemeSelect).toHaveBeenCalledWith('pure-white');

    // Open unified preferences popover
    const preferencesTrigger = screen.getByRole('button', { name: /Display & Language settings/i });
    await user.click(preferencesTrigger);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Theme / रंगसंगती')).toBeInTheDocument();
    expect(screen.getByText('Language / भाषा')).toBeInTheDocument();

    // Click Hindi in the merged menu
    const hindiOption = screen.getByRole('menuitemradio', { name: /हिन्दी/i });
    await user.click(hindiOption);
    expect(handleLangSelect).toHaveBeenCalledWith('hi');
  });

  it('renders merged ThemeLanguageControl in expanded sequential mode for Profile', async () => {
    const user = userEvent.setup();
    const handleThemeSelect = vi.fn();
    const handleLangSelect = vi.fn();

    const { ThemeLanguageControl } = await import('../components/common/ThemeLanguageControl');

    render(
      <ThemeLanguageControl
        currentTheme="classic"
        onSelectTheme={handleThemeSelect}
        currentLanguage="en"
        onSelectLanguage={handleLangSelect}
        variant="expanded"
      />
    );

    expect(screen.getByText(/1\. Theme Selection \/ रंगसंगती/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Language Selection \/ भाषा/i)).toBeInTheDocument();

    const whiteRadio = screen.getByRole('radio', { name: /Pure White \(Light\)/i });
    await user.click(whiteRadio);
    expect(handleThemeSelect).toHaveBeenCalledWith('pure-white');

    const marathiRadio = screen.getByRole('radio', { name: /मराठी/i });
    await user.click(marathiRadio);
    expect(handleLangSelect).toHaveBeenCalledWith('mr');
  });
});
