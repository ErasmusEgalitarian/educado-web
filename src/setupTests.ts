import '@testing-library/jest-dom/vitest'

// Depending on the Node major installed, Node's own (experimental) global
// `localStorage` can end up shadowing jsdom's real implementation with a
// stub that has no working methods (`localStorage.getItem is not a
// function`). To keep tests deterministic across Node versions and CI, use a
// small in-memory implementation instead of relying on either Node's or
// jsdom's built-in storage.
class MemoryStorage implements Storage {
  private store = new Map<string, string>()

  get length() {
    return this.store.size
  }

  clear() {
    this.store.clear()
  }

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.store.delete(key)
  }

  setItem(key: string, value: string) {
    this.store.set(key, String(value))
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
})
