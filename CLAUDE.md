# CLAUDE.md — Educado Web

## Visao Geral

Frontend SPA do Educado. Vanilla TypeScript (sem React/Vue), Vite como bundler, CSS puro. Navegacao via full page reload (window.location.assign) exceto perfil→home que usa renderizacao interna.

## Comandos

```bash
npm run dev        # Dev server (porta 3000, proxy API para localhost:5001)
npm run build      # Build de producao
npx tsc --noEmit   # Type-check sem emitir
```

## Arquitetura

```
src/
  app/
    config/        # Configuracoes
    pages/         # HomePage.ts (listagem de cursos, criacao, edicao, review)
    routes/        # Definicao de rotas { home, profile, mediaBank, ... }
    styles/        # globals.css (todos os estilos globais)
  features/
    auth/
      api/         # authApi (login, registro, perfil, avatar, password-reset)
      components/  # AuthLoginCard, AuthProfileStep, PasswordResetFlow
      pages/       # EditProfilePage
      styles/      # edit-profile.css, password-reset.css, auth-page.css
    courses/
      api/         # coursesApi, sectionsApi, activitiesApi
      editor/      # CourseEditor
      model/       # course.types.ts (Course, Section, Activity)
      styles/      # courses-home.css
    media/
      api/         # mediaApi (upload, stream, list, delete)
      components/  # MediaTabs
      pages/       # MediaBankPage
      styles/      # media-bank.css
    admin/
      api/         # Admin APIs
      pages/       # AdminUsersPage, AdminInstitutionsPage, AdminUserReviewPage
  shared/
    api/           # http.ts (fetch wrapper), auth-session.ts (localStorage)
    i18n/          # Traducoes pt-BR e en-US
    ui/            # toast, app-loader, languageSwitcher
    types/         # Tipos compartilhados
  main.ts          # Entry point, roteamento, header
```

## Padroes

### Componentes (Vanilla TS)
- Funcoes que recebem `container: HTMLElement` e renderizam via `innerHTML`
- Event listeners bindados apos render
- Re-render completo ao mudar estado (sem virtual DOM)
- Pattern: `render()` → `bindEvents()` → usuario interage → `syncFormValues()` → `render()`

### Estilos
- CSS puro em arquivos separados por feature
- Cores: #35a1b1 (teal primario), #fdfeff (branco), #141b1f (titulo), #28363e (corpo), #628397 (caption), #d62b25 (erro/perigo)
- Fonte: Montserrat (titulos, labels), Inter (corpo)
- Border radius: 8px (inputs), 12px (botoes/modais), 16px (cards), 24px (modais grandes)

### i18n
- `t('key.path')` para todas as strings visiveis
- Duas linguas: `pt-BR` e `en-US`
- Chaves organizadas: `common.*`, `auth.*`, `courses.*`, `editProfilePage.*`, `passwordReset.*`
- NUNCA hardcodar strings em portugues/ingles — sempre usar `t()`

### API Client
- `api.get/post/put/del()` em `shared/api/http.ts`
- Token JWT salvo em localStorage (`educado.accessToken`)
- User session em localStorage (`educado.currentUser`)
- Media streaming: `GET /media/:id/stream?token=jwt`

### Modais
- Overlay: `.sections-lesson-modal-overlay` (fundo escuro)
- Card: `.sections-lesson-modal-card` (branco, rounded 24px)
- Header: titulo + botao fechar (✕)
- Footer: cancelar (vermelho underline) + confirmar (teal)
- Fechar: click overlay, ESC, botao X

### Media IDs
- Preferir `item.id` (UUID do PostgreSQL)
- Fallback: `item._id ?? item.gridFsId` (retrocompatibilidade MongoDB)
- Pattern: `const id = item.id ?? item._id ?? item.gridFsId`

## Regras

1. **Validacao completa**: `npx tsc --noEmit` deve passar com zero erros. No backend: `npm run lint && npm test && npx tsc --noEmit` — os tres obrigatorios.
2. **i18n**: toda string visivel via `t()`, ambas as linguas
3. **Sem frameworks extras**: manter vanilla TS, sem React/Vue/Tailwind
4. **escapeHtml**: usar em textos do usuario, NAO usar em URLs de midia (quebra tokens)
5. **sessionStorage**: fluxo de curso usa `educado.*` keys, limpar ao sair do fluxo
6. **Token em URLs de midia**: `getMediaStreamUrl(id)` ja inclui `?token=`
