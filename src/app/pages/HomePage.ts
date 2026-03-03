import { clearAccessToken } from '@/shared/api/auth-session'

export function renderHomePage(container: HTMLElement) {
  container.innerHTML = `
    <section class="home-page">
      <div class="home-card">
        <h1>EDUCADO</h1>
        <p>Login realizado com sucesso. Você está na home da plataforma.</p>
        <button id="home-logout" class="btn-primary" type="button">Sair</button>
      </div>
    </section>
  `

  const logoutButton = document.getElementById('home-logout')
  logoutButton?.addEventListener('click', () => {
    clearAccessToken()
    window.location.assign('/')
  })
}
