# Testes do formulário de novo curso

## Objetivo

Este documento descreve a modularização e a estratégia de testes da etapa de
informações gerais do fluxo de criação de cursos. A implementação separa regras
determinísticas da interface para que normalização, validação e construção do
payload possam ser testadas sem montar a página completa.

## Escopo

Estão incluídos:

- contratos dos dados do formulário;
- normalização dos valores;
- validação dos campos obrigatórios e de seus limites;
- validação do identificador da mídia;
- construção do `CreateCourseInput`;
- integração dessas funções com `HomePage.ts`;
- testes de caixa-preta, caixa-branca e MC/DC;
- geração de cobertura com Vitest e V8.

A orquestração assíncrona de API e persistência foi extraída posteriormente para
`submitNewCourse.ts` e está documentada em
[`submit-new-course.md`](submit-new-course.md).

## Arquitetura

```text
src/features/courses/new-course/
├── newCourse.types.ts
├── newCourseForm.ts
└── newCourseForm.test.ts

src/features/media/model/
├── media-id.ts
└── media-id.test.ts
```

- [`newCourse.types.ts`](../../src/features/courses/new-course/newCourse.types.ts)
  define os contratos de entrada, dados normalizados, erros, rascunho, modo de
  submissão e opções do payload.
- [`newCourseForm.ts`](../../src/features/courses/new-course/newCourseForm.ts)
  contém apenas regras puras, sem DOM, tradução, API ou armazenamento.
- [`media-id.ts`](../../src/features/media/model/media-id.ts) concentra a regra de
  formato usada tanto pelo curso quanto pelos exercícios.
- [`HomePage.ts`](../../src/app/pages/HomePage.ts) lê os elementos da interface,
  apresenta erros traduzidos e coordena os efeitos externos.

O fluxo atual é:

```text
DOM
 ↓
normalizeNewCourseForm
 ↓
validateNewCourseForm
 ↓
Mapeamento de erros para campos e traduções
 ↓
submitNewCourse (payload, API e armazenamento)
 ↓
Mensagens e navegação
```

## Funções extraídas

### `normalizeNewCourseForm`

- remove espaços externos dos campos textuais;
- preserva a dificuldade selecionada;
- cria uma cópia da lista de IDs de tags.

### `validateNewCourseForm`

- acumula os erros encontrados em vez de interromper na primeira falha;
- devolve códigos independentes de idioma e da interface;
- utiliza limites exportados pelo próprio módulo;
- delega a validação do formato da mídia ao módulo compartilhado.

### `buildCreateCoursePayload`

- produz o `CreateCourseInput` esperado por `coursesApi`;
- limita `shortDescription` a 120 caracteres;
- aplica os valores padrão de criação;
- aceita opções para preservar valores existentes durante uma edição;
- copia `tagIds` para não compartilhar uma lista mutável.

### `isValidMediaIdFormat`

Aceita identificadores no formato MongoDB de 24 caracteres hexadecimais ou no
formato UUID.

## Regras verificadas

| Campo ou saída | Regra |
|---|---|
| Título | obrigatório e com pelo menos 3 caracteres |
| Descrição | obrigatória, entre 20 e 400 caracteres |
| Categoria | obrigatória |
| Mídia | obrigatória e com ID MongoDB ou UUID |
| Descrição curta | no máximo 120 caracteres |
| Tempo estimado | `8 horas` por padrão |
| Nota de corte | `70` por padrão |
| Avaliação | `null` por padrão |

O limite máximo de 400 caracteres já existia no atributo HTML da descrição,
mas não era validado durante a submissão. Agora ele é centralizado e reutilizado
pelo atributo `maxlength`, pelo contador, pela validação no `blur` e pela
validação anterior à submissão.

## Estratégia de testes

Os testes estão em:

- [`newCourseForm.test.ts`](../../src/features/courses/new-course/newCourseForm.test.ts);
- [`media-id.test.ts`](../../src/features/media/model/media-id.test.ts).

### Caixa-preta

O particionamento de equivalência considera formulários válidos, campos
obrigatórios ausentes, comprimentos fora do intervalo, formatos válidos e
inválidos de mídia, payload padrão e payload com valores preservados da edição.

A análise de valor-limite verifica:

- título com 2 e 3 caracteres;
- descrição com 19 e 20 caracteres;
- descrição com 400 e 401 caracteres;
- descrição curta gerada a partir de uma entrada com 121 caracteres.

Os valores dos testes são definidos independentemente das constantes do código de
produção, evitando que uma constante incorreta altere simultaneamente a
implementação e a expectativa do teste.

### Caixa-branca

Após os cenários funcionais, a estrutura foi analisada para cobrir os branches de:

- campo ausente, abaixo do limite e válido;
- descrição acima do limite;
- mídia ausente, inválida e válida;
- uso de valores padrão ou opções fornecidas na construção do payload.

### MC/DC

A decisão do formato de mídia é:

```text
mongoValido || uuidValido
```

| MongoDB válido | UUID válido | Resultado |
|---:|---:|---:|
| V | F | V |
| F | V | V |
| F | F | F |

Comparar a primeira e a terceira linha demonstra a influência independente da
condição MongoDB. Comparar a segunda e a terceira demonstra a influência da
condição UUID. A cobertura de branches do Vitest não substitui essa evidência
manual de MC/DC.

## Execução

Instalação reproduzível:

```powershell
npm ci
```

Testes, cobertura e build:

```powershell
npm test
npm run test:coverage
npm run build
```

O relatório HTML é produzido em `coverage/`, diretório ignorado pelo Git.

## Evidências atuais

Na validação desta alteração:

- 3 arquivos de teste foram executados;
- 16 testes foram aprovados, incluindo o teste de fumaça preexistente;
- `newCourseForm.ts` atingiu 100% em statements, branches, functions e lines;
- `media-id.ts` atingiu 100% em statements, branches, functions e lines;
- a verificação do TypeScript e o build foram aprovados.

## Limites e evolução futura

A orquestração assíncrona foi extraída para `submitNewCourse.ts`, com
dependências de API e armazenamento explícitas e um resultado estruturado que a
página converte em mensagens e navegação. Os detalhes estão em
[`submit-new-course.md`](submit-new-course.md).

Não foi realizado teste manual integrado com o backend. O build também mantém um
aviso não bloqueante sobre o tamanho do chunk principal.
