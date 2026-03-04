# Banco de Mídia (Media Bank)

## Descrição

O Banco de Mídia é uma nova feature que permite gerenciar e organizar arquivos de mídia (imagens) dentro do aplicativo Educado. A página oferece um interface para visualizar, filtrar, buscar e editar metadados de arquivos de mídia.

## Estrutura

A feature está organizada em:

```
src/features/media/
├── api/
│   └── media.api.ts        # API para operações de mídia
├── components/
│   └── MediaTabs.ts        # Componente de abas (Cursos/Banco de mídia)
├── pages/
│   └── MediaBankPage.ts    # Página principal do banco de mídia
├── styles/
│   └── media-bank.css      # Estilos CSS da página
└── index.ts                # Exportações da feature
```

## Utilização

### Acessar a página

A página do banco de mídia está disponível na rota `/media-bank`:

```typescript
import { routes } from '@/app/routes'

// Navegar para o banco de mídia
window.location.href = routes.mediaBank
```

### API de Mídia

O arquivo `media.api.ts` fornece várias funções para interagir com o servidor:

```typescript
import { mediaApi } from '@/features/media/api/media.api'

// Obter lista de mídias
const mediaItems = await mediaApi.getMedia({ limit: 20, offset: 0 })

// Obter mídia específica
const media = await mediaApi.getMediaById('media-id')

// Upload de arquivo
const file = document.getElementById('file-input').files[0]
const uploaded = await mediaApi.uploadMedia(file, {
  title: 'My Image',
  altText: 'Description of the image',
  description: 'Detailed description',
})

// Atualizar metadados
await mediaApi.updateMedia('media-id', {
  title: 'Updated Title',
  altText: 'Updated alt text',
  description: 'Updated description',
})

// Deletar mídia
await mediaApi.deleteMedia('media-id')

// Buscar mídia
const results = await mediaApi.searchMedia('search term')
```

## Componentes

### MediaTabs

Componente que renderiza as abas de navegação entre "Cursos" e "Banco de mídia".

```typescript
import { MediaTabs } from '@/features/media'

const tabsContainer = document.getElementById('tabs')
const tabs = new MediaTabs(tabsContainer)

tabs.setOnTabChange((tabId) => {
  console.log('Tab changed to:', tabId) // 'courses' ou 'media-bank'
})

tabs.setActiveTab('media-bank')
tabs.render()
```

### MediaBankPage

Página principal que gerencia toda a interface do banco de mídia.

```typescript
import { MediaBankPage } from '@/features/media'

const container = document.getElementById('app-root')
const mediaBankPage = new MediaBankPage(container)

await mediaBankPage.init()
```

## Características

- **Abas de navegação**: Alternar entre "Cursos" e "Banco de mídia"
- **Filtros e classificação**: Ordenar por mais recentes ou realizar buscas
- **Visualização de galeria**: Galeria de miniaturas de imagens
- **Seleção de mídia**: Clicar em uma imagem para ver detalhes
- **Painel de detalhes**: Visualizar e editar metadados do arquivo
- **Campos de edição**:
  - Título (até 50 caracteres)
  - Texto alternativo (até 125 caracteres)
  - Descrição da imagem (até 200 caracteres)
- **Exclusão permanente**: Deletar arquivos de mídia
- **Carregamento paginado**: Botão para carregar mais imagens

## Estilos

Os estilos estão em `media-bank.css` e seguem o design system do projeto:

- **Cores principais**: `#35a1b1` (ativo), `#809cad` (inativo), `#28363e` (texto)
- **Tipografia**: Montserrat (600 e 700 pesos)
- **Spacing**: Baseado em múltiplos de 8px
- **Responsividade**: Ajustável para telas pequenas (até 768px)

## Integração com Rotas

A rota foi adicionada em `src/app/routes/index.ts`:

```typescript
export const routes = {
  home: '/home',
  adminHome: '/admin/home',
  courseEditor: '/course-editor',
  mediaBank: '/media-bank',  // Nova rota
}
```

E integrada no `main.ts` para renderizar corretamente quando acessada.

## Dados de Exemplo

Atualmente, a página carrega dados mockados para demonstração. Para usar com dados reais, atualize a função `loadMediaItems()` em `MediaBankPage.ts` para chamar a API real.

## Desenvolvimento Futuro

- [ ] Integração com upload de arquivos
- [ ] Paginação dinâmica
- [ ] Filtros avançados
- [ ] Ordenação customizável
- [ ] Bulk operations (seleção múltipla)
- [ ] Tags e categorias
- [ ] Histórico de versões
- [ ] Compartilhamento de mídia
