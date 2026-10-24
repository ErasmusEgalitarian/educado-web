# Testes da submissão de novo curso

## Objetivo

Este documento descreve a extração da orquestração assíncrona da submissão do
formulário de novo curso, antes localizada na função `submitNewCourse` de
`HomePage.ts`, e a estratégia de testes do novo módulo.

A etapa anterior, que trata normalização, validação e construção do payload,
está documentada em [`new-course-form.md`](new-course-form.md).

## Escopo

Estão incluídos:

- decisão entre criar um curso e atualizar um rascunho ou curso existente;
- preservação dos valores do curso editado;
- tratamento dos modos `draft`, `next` e `review`;
- desativação ao salvar como rascunho;
- efeitos de persistência por meio de uma interface injetável;
- classificação das falhas da API, incluindo erros de referência de mídia;
- resultado estruturado consumido por `HomePage.ts`.

Leitura do DOM, mensagens traduzidas, `toast`, atualização da view salva e
renderização das telas continuam sob responsabilidade da página.

## Arquitetura

```text
src/features/courses/new-course/
├── newCourse.types.ts
├── newCourseForm.ts
├── newCourseForm.test.ts
├── submitNewCourse.ts
└── submitNewCourse.test.ts

src/features/media/model/
├── media-id.ts
├── media-id.test.ts
├── media-reference-error.ts
└── media-reference-error.test.ts
```

```text
HomePage.ts
  ├─ lê o DOM
  ├─ normaliza e valida
  ├─ chama submitNewCourse com API e armazenamento
  └─ converte o resultado em mensagens e renderização

submitNewCourse.ts
  ├─ constrói o payload (preservando valores na edição)
  ├─ decide criar ou atualizar
  ├─ persiste o curso retornado
  ├─ trata draft/next/review
  └─ devolve um resultado estruturado
```

O módulo não importa `HomePage.ts`, não acessa elementos HTML, não chama `t()`,
`nt()` nem `toast` e não renderiza telas.

## Contrato

### Entrada

`submitNewCourse(request, dependencies)` recebe:

| Campo | Descrição |
|---|---|
| `request.mode` | `draft`, `next` ou `review` |
| `request.form` | `NormalizedNewCourseForm` previamente validado |
| `request.draftCourseId` | ID do rascunho já criado neste fluxo, se houver |
| `request.editCourse` | curso em edição (`id`, `estimatedTime`, `passingThreshold`, `rating`), se houver |
| `dependencies.api` | `createCourse`, `updateCourse` e `deactivateCourse` |
| `dependencies.storage` | `saveCourse`, `clearLocalDrafts` e `clearEditCourse` |

Na página, `api` é o próprio `coursesApi`. `storage.saveCourse` grava o curso
retornado e o rascunho do formulário no `sessionStorage`; `clearLocalDrafts` e
`clearEditCourse` removem as chaves correspondentes.

### Decisão de criação ou atualização

| Situação | Operação |
|---|---|
| `editCourse` informado | `updateCourse(editCourse.id)` com tempo estimado, nota de corte e avaliação preservados |
| apenas `draftCourseId` informado | `updateCourse(draftCourseId)` com valores padrão |
| nenhum dos dois | `createCourse` com valores padrão |

Quando `editCourse` e `draftCourseId` coexistem, a edição tem prioridade, como no
comportamento anterior.

### Resultado

Todos os resultados incluem `flow` (`create` ou `edit`) e `operation`
(`create` ou `update`).

| `status` | Quando | Dados adicionais |
|---|---|---|
| `draftSaved` | modo `draft` concluído | `course` |
| `navigateToSections` | modo `next` concluído | `course` |
| `navigateToReview` | modo `review` concluído | `course` |
| `mediaReferenceError` | API recusou a mídia | `code`, `error` |
| `submitError` | qualquer outra falha | `error` |

A página usa `operation` para escolher entre as mensagens de criação e de
atualização bem-sucedidas e `flow` para escolher entre as mensagens genéricas de
falha de criação e de edição.

### Ordem dos efeitos

```text
create/update → storage.saveCourse
  draft: → deactivateCourse → storage.clearLocalDrafts → storage.clearEditCourse (só na edição)
```

Se a desativação falhar, o curso já persistido permanece salvo e os dados locais
não são limpos, preservando o momento em que cada efeito ocorria antes da
extração.

### Classificação de erros de mídia

[`media-reference-error.ts`](../../src/features/media/model/media-reference-error.ts)
expõe `classifyMediaReferenceError`, que reconhece em um `ApiError` os códigos
`VALIDATION_ERROR`, `INVALID_MEDIA_ID`, `MEDIA_NOT_FOUND`, `MEDIA_INACTIVE` e
`FORBIDDEN`. A mesma função é usada pela página para as mensagens dos exercícios,
de modo que curso e exercício compartilham a regra de classificação e mantêm
apenas as traduções separadas.

## Estratégia de testes

Os testes estão em:

- [`submitNewCourse.test.ts`](../../src/features/courses/new-course/submitNewCourse.test.ts);
- [`media-reference-error.test.ts`](../../src/features/media/model/media-reference-error.test.ts).

API e armazenamento são substituídos por funções `vi.fn` que registram as
chamadas em uma lista, permitindo verificar a operação solicitada, o curso
retornado, o resultado de navegação, os efeitos de persistência e a ordem entre
eles.

### Caixa-preta

As classes de equivalência combinam o fluxo (criação sem rascunho, rascunho
existente e edição) com o modo de submissão e o desfecho da API:

| Fluxo | `draft` | `next` | `review` | Falha de mídia | Falha geral |
|---|:-:|:-:|:-:|:-:|:-:|
| Criação sem rascunho | ✓ | ✓ | ✓ | ✓ | ✓ |
| Rascunho existente | ✓ | ✓ | | | |
| Edição | ✓ | ✓ | ✓ | ✓ | ✓ |

Também é verificada a falha da desativação após a persistência do curso.

### Caixa-branca

Após os cenários funcionais, foram adicionados casos para os branches de:

- `draftCourseId` vazio tratado como ausência de rascunho;
- edição com tempo estimado vazio e avaliação ausente, que recebem os valores
  padrão;
- nota de corte `0` preservada na edição;
- prioridade da edição sobre um rascunho armazenado;
- erro que não é `ApiError`.

Para o classificador de mídia, são cobertos todos os códigos reconhecidos, um
código desconhecido, um `ApiError` sem código e um erro comum.

## Evidências atuais

Na validação desta alteração:

- 5 arquivos de teste foram executados e 41 testes foram aprovados;
- `submitNewCourse.ts` atingiu 100% em statements, functions e lines e 95% em
  branches;
- `media-reference-error.ts`, `newCourseForm.ts` e `media-id.ts` atingiram 100%
  em todas as métricas;
- a verificação do TypeScript e o build foram aprovados.

O único branch apontado como não coberto em `submitNewCourse.ts` é o caminho
implícito do `if (mode === 'draft')`. Ele é exercitado pelos testes dos modos
`next` e `review`, que alcançam as linhas seguintes; a marcação decorre da forma
como o V8 contabiliza blocos contendo `await`.

## Limites

Não foi realizado teste manual integrado com o backend. Na edição em modo
`draft`, a mensagem de atualização bem-sucedida passa a ser exibida após a
desativação, junto com a mensagem de desativação, em vez de antes dela; se a
desativação falhar, apenas a mensagem de erro é exibida.
