/**
 * Safe JSON localStorage wrapper used by the exposure queue.
 *
 * @template T Stored value type.
 */
export default class SafeStorage<T> {
  private key: string;

  /**
   * @param {string} key localStorage key used to persist data.
   */
  constructor(key: string) {
    this.key = key;
  }

  /**
   * @param {T} defaultValue Fallback value returned when storage is empty or unavailable.
   * @returns {T} Parsed storage value or the provided fallback value.
   */
  read(defaultValue: T): T {
    try {
      const value = window.localStorage.getItem(this.key);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  /**
   * @param {T} value Value to serialize and write to localStorage.
   */
  write(value: T) {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      // localStorage can be unavailable in private mode or restricted webviews.
    }
  }

  /**
   * Removes the configured key from localStorage.
   */
  remove() {
    try {
      window.localStorage.removeItem(this.key);
    } catch (error) {
      // Ignore storage cleanup failures.
    }
  }
}
