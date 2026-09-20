import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from '../services/storageService';

describe('Storage Service & Resilience', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and retrieves valid JSON data', () => {
    const testData = [{ id: '1', title: 'Test Activity' }];
    storageService.setItem('test_key', testData);

    const result = storageService.getItem('test_key', []);
    expect(result).toEqual(testData);
  });

  it('safely recovers from malformed/corrupted JSON without crashing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem('corrupted_key', '{this is not valid json: true]');

    const fallback = [{ id: 'fallback' }];
    const result = storageService.getItem('corrupted_key', fallback);

    expect(result).toEqual(fallback);
    warnSpy.mockRestore();
  });

  it('returns fallback value when key does not exist or is empty', () => {
    const fallback = { count: 0 };
    const result = storageService.getItem('non_existent_key', fallback);

    expect(result).toEqual(fallback);
  });

  it('safely removes items and clears keys', () => {
    storageService.setItem('k1', 'val1');
    storageService.setItem('k2', 'val2');

    storageService.removeItem('k1');
    expect(storageService.getItem('k1', null)).toBeNull();

    storageService.clearAppKeys(['k2']);
    expect(storageService.getItem('k2', null)).toBeNull();
  });
});
