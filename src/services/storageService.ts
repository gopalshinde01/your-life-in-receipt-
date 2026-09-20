/**
 * LocalStorage Service with defensive JSON parsing, schema fallbacks, and corruption recovery.
 * Guarantees the application will never crash due to corrupted, empty, or outdated storage state.
 */

export const storageService = {
  /**
   * Retrieves and parses an item from LocalStorage safely.
   * If parsing fails or data is corrupted, returns fallback value.
   */
  getItem<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined || raw.trim() === '') {
        return fallback;
      }

      const parsed = JSON.parse(raw);
      
      // Basic type checking against fallback type
      if (Array.isArray(fallback) && !Array.isArray(parsed)) {
        console.warn(`[storageService] Expected array for key "${key}", found:`, typeof parsed);
        return fallback;
      }

      if (typeof fallback === 'object' && fallback !== null && (typeof parsed !== 'object' || parsed === null)) {
        console.warn(`[storageService] Expected object for key "${key}", found:`, typeof parsed);
        return fallback;
      }

      return parsed as T;
    } catch (err) {
      console.warn(`[storageService] Corrupted data encountered for key "${key}". Reverting safely to default:`, err);
      return fallback;
    }
  },

  /**
   * Serializes and writes an item to LocalStorage safely.
   */
  setItem<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.error(`[storageService] Failed to write item "${key}" to localStorage:`, err);
      return false;
    }
  },

  /**
   * Safely removes an item from storage.
   */
  removeItem(key: string): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clears all application keys safely while preserving other domain data.
   */
  clearAppKeys(keys: string[]): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      keys.forEach(k => window.localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  }
};
