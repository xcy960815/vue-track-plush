export default class SafeStorage<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  read(defaultValue: T): T {
    try {
      const value = window.localStorage.getItem(this.key);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  write(value: T) {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      // localStorage can be unavailable in private mode or restricted webviews.
    }
  }

  remove() {
    try {
      window.localStorage.removeItem(this.key);
    } catch (error) {
      // Ignore storage cleanup failures.
    }
  }
}
