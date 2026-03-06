const APP_LOADER_ID = 'app-global-loader'
const MIN_LOADER_DURATION_MS = 300

let visibleSince = 0

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function ensureLoaderElement() {
  let loader = document.getElementById(APP_LOADER_ID) as HTMLDivElement | null
  if (loader) return loader

  loader = document.createElement('div')
  loader.id = APP_LOADER_ID
  loader.className = 'app-global-loader'
  loader.setAttribute('aria-live', 'polite')
  loader.setAttribute('aria-label', 'Carregando aplicação')
  loader.innerHTML = `
    <div class="app-global-loader-content">
      <img src="/images/logo_black240.png" alt="EDUCADO" class="app-global-loader-logo">
    </div>
  `

  document.body.appendChild(loader)
  return loader
}

export function showAppLoader() {
  const loader = ensureLoaderElement()
  visibleSince = Date.now()
  document.body.classList.remove('app-ready')
  document.body.classList.add('app-booting')
  loader.classList.add('is-visible')
}

export async function hideAppLoader() {
  const loader = ensureLoaderElement()
  const elapsed = Date.now() - visibleSince
  const remaining = Math.max(0, MIN_LOADER_DURATION_MS - elapsed)

  if (remaining > 0) {
    await sleep(remaining)
  }

  loader.classList.remove('is-visible')
  document.body.classList.remove('app-booting')
  document.body.classList.add('app-ready')
}
