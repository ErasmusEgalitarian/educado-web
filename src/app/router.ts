type RouteListener = (path: string) => void

const listeners = new Set<RouteListener>()

function getNormalizedPath(path: string) {
  if (!path) return window.location.pathname + window.location.search

  try {
    const url = new URL(path, window.location.origin)
    return `${url.pathname}${url.search}`
  } catch {
    return path
  }
}

function emit() {
  const path = getCurrentPath()
  listeners.forEach((listener) => listener(path))
}

window.addEventListener('popstate', emit)

export function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}`
}

export function navigate(path: string) {
  const nextPath = getNormalizedPath(path)
  if (nextPath === getCurrentPath()) return

  window.history.pushState(null, '', nextPath)
  emit()
}

export function replace(path: string) {
  const nextPath = getNormalizedPath(path)
  if (nextPath === getCurrentPath()) return

  window.history.replaceState(null, '', nextPath)
  emit()
}

export function subscribeToRoute(listener: RouteListener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
