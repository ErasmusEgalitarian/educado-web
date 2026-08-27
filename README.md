# Educado Web

Frontend web da plataforma **Educado**, uma plataforma educacional gamificada voltada para catadores de materiais recicláveis no Brasil, desenvolvida na parceria entre a **Universidade de Brasília (UnB)** e a **Aalborg University (Dinamarca)**.

- Aplicação no ar: https://educado.tominho.com
- API: https://api-educado.tominho.com
- Documentação da API (Swagger UI): https://api-educado.tominho.com/docs

## O que é o Educado Web

SPA (single page application) que cobre quatro públicos numa única aplicação:

- **Painel de criação de conteúdo** (autenticado, papéis `USER` e `ADMIN`): gestão de cursos, seções e atividades, banco de mídia, dashboard e perfil.
- **Administração** (`ADMIN`): usuários, instituições e revisão de cadastros.
- **Site público** (sem autenticação): landing, about, solution, institutions, contact e o fluxo de login/cadastro.
- **Visão estudante mobile** (rotas `/student/*`): meus cursos, explorar, perfil, certificados, leaderboard, avaliação e detalhe de curso.

Este repositório é apenas o frontend. O backend fica em `educado-api` e o app mobile em `educado-app`.

## Stack

A stack é deliberadamente enxuta: **TypeScript puro, sem framework de UI**.

- **TypeScript** ~5.9, modo `strict`, com `noUnusedLocals`, `noUnusedParameters` e `noFallthroughCasesInSwitch`.
- **Vite** ~7.3 como bundler e dev server.
- **CSS puro**, um arquivo de estilo por feature, sem Tailwind nem pré-processador.
- Dependências de runtime: `axios` e `flatpickr` (date pickers).
- Roteamento e i18n são caseiros: roteador SPA sobre a History API (`src/app/router.ts`) e camada de tradução própria (`src/shared/i18n/index.ts`).

Não há React, Vue, Svelte, biblioteca de estado nem biblioteca de roteamento. Renderização é feita por funções `render*(container, ...)` que escrevem `innerHTML` e bindam listeners depois, com re-render completo na mudança de estado.

> Nota: `axios` está declarado em `package.json`, mas o cliente HTTP em uso hoje (`src/shared/api/http.ts`) é um wrapper sobre o `fetch` nativo.

## Pré-requisitos

- **Node.js 20** ou superior (o build em Docker usa `node:20-alpine`).
- **npm** (o repo versiona `package-lock.json`, então use `npm ci` para instalação reprodutível).
- Uma instância da `educado-api` acessível, local (porta 5001 por padrão) ou remota.

## Rodando em desenvolvimento

```bash
npm ci
npm run dev
```

O dev server sobe em **http://localhost:3000**. Ele também expõe um proxy `/api` apontando para `http://localhost:5001` (com rewrite removendo o prefixo `/api`), configurado em `vite.config.ts`.

Atenção: o código resolve a base da API por `VITE_API_URL` (default `http://localhost:5001`), ou seja, as chamadas batem direto na API e não passam pelo proxy `/api` por padrão. Em dev, garanta que o CORS do backend aceite `http://localhost:3000`.

## Variáveis de ambiente

Só existe uma variável, e ela é lida via `import.meta.env.VITE_API_URL`:

| Variável | Descrição | Dev | Produção |
| --- | --- | --- | --- |
| `VITE_API_URL` | URL base da educado-api | `http://localhost:5001` | `https://api-educado.tominho.com` |

Copie o exemplo versionado e ajuste se precisar:

```bash
cp .env.example .env
```

O conteudo para desenvolvimento local e:

```bash
VITE_API_URL=http://localhost:5001
```

O `.env` está no `.gitignore` e não deve ser versionado. `VITE_API_URL` é uma URL de ambiente, não um segredo: não há chave nem credencial embutida no frontend. A autenticação é por JWT obtido no login e guardado no `localStorage`.

Como o Vite injeta a variável em **build time**, mudar `VITE_API_URL` exige rebuildar o bundle.

## Build

```bash
npm run build     # roda tsc (type-check) e depois vite build, gerando dist/
npm run preview   # serve o conteúdo de dist/ localmente
```

Não há suíte de testes nem lint neste repositório. O gate de qualidade local é o type-check:

```bash
npx tsc --noEmit
```

Precisa passar com zero erros antes de abrir PR.

## Docker e produção

O `Dockerfile` é multi-stage:

1. **Build**: `node:20-alpine`, roda `npm ci` e `npm run build`. Recebe `VITE_API_URL` via `ARG`/`ENV`, que o Vite embute no bundle.
2. **Serve**: `nginx:alpine`, copia `nginx.conf` para `/etc/nginx/conf.d/default.conf` e o `dist/` para `/usr/share/nginx/html`. Expõe a porta 80.

```bash
docker build --build-arg VITE_API_URL=https://api-educado.tominho.com -t educado-web .
docker run -p 8080:80 educado-web
```

O `nginx.conf` cuida do essencial de uma SPA:

- fallback de rota: `try_files $uri $uri/ /index.html`, para que qualquer path caia no `index.html`;
- gzip para texto, CSS, JS, JSON e SVG;
- cache de 1 ano com `immutable` para `/assets/` (nomes de arquivo hasheados pelo Vite) e 30 dias para imagens e ícones.

## Estrutura de pastas

```
src/
  main.ts                     # entry point: bootstrap, header, orquestra o render por rota
  vite-env.d.ts
  app/
    router.ts                 # roteador SPA (history.pushState)
    routes/index.ts           # mapa central de paths
    pages/HomePage.ts         # home autenticada (cursos: listagem, criação, edição, review)
    styles/globals.css
  features/
    auth/                     # login, cadastro, perfil, reset de senha
    courses/                  # cursos, seções, atividades, tags e o editor de curso
    media/                    # banco de mídia: upload, stream, listagem, delete
    admin/                    # usuários, instituições, revisão de cadastro
    dashboard/                # dashboard
    public/                   # site institucional
    student/                  # visão mobile do estudante (/student/*)
  shared/
    api/http.ts               # wrapper de fetch (api.get/post/put/patch/del + ApiError)
    api/auth-session.ts       # token e usuário corrente no localStorage
    i18n/index.ts             # traduções pt-BR e en-US, t()/setLanguage/subscribeLanguage
    ui/                       # toast, loader global, seletor de idioma
    types/index.ts
public/                       # imagens e ícones servidos como estáticos
Dockerfile
nginx.conf
vite.config.ts
```

Cada feature tem a mesma anatomia (`api/`, `pages/`, `components/`, `styles/`) e expõe um `index.ts` que reexporta os renders consumidos pelo `main.ts`. O alias `@/` aponta para `src/`, configurado tanto no `vite.config.ts` quanto no `tsconfig.json`.

## Internacionalização

Toda string visível passa por `t('chave.aninhada')`. As duas árvores de tradução, `pt-BR` e `en-US`, ficam inteiras em `src/shared/i18n/index.ts`. Texto de UI hardcodado não é aceito: string nova entra nas duas línguas.

## Contribuindo

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir um PR, e o [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Para reportar vulnerabilidade, veja o [SECURITY.md](SECURITY.md).

## Licença

Apache License 2.0. Veja o arquivo [LICENSE](LICENSE).

Copyright 2026 Educado Project (University of Brasilia and Aalborg University)
