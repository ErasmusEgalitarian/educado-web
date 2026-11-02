# Plano revisado e registro TDD — `submitNewCourse`

## 1. Objetivo

Registrar de forma reproduzível a aplicação de TDD à Função 5 sem apagar,
reordenar ou atribuir retrospectivamente TDD ao trabalho anterior de Gustavo e
Hugo.

A implementação original e seus testes permanecem preservados na branch
`submitNewCourse`. O ciclo TDD acrescentado posteriormente trata um comportamento
novo: considerar um `draftCourseId` formado somente por espaços como ausência de
rascunho.

## 2. Limite da afirmação de TDD

Os módulos abaixo já estavam implementados antes da criação da branch TDD:

- `newCourseForm.ts`;
- `media-id.ts`;
- `media-reference-error.ts`;
- `submitNewCourse.ts`;
- seus respectivos arquivos de teste.

Por isso, os testes anteriores são apresentados como testes retrospectivos de
caixa-preta e caixa-branca. Não se deve afirmar que normalização, validação,
construção do payload, classificação de erros ou os modos `draft`, `next` e
`review` foram originalmente desenvolvidos com TDD.

A afirmação de TDD fica restrita ao comportamento comprovado pelos commits Red e
Green registrados na seção 5.

## 3. Preservação da entrega

Estado verificado em 2 de novembro de 2026:

| Item | Estado |
|---|---|
| Branch de trabalho | `tdd-submit-new-course` |
| Tag de preservação | `entrega-atual` |
| Commit preservado | `95c5467d864f0e6f61095513d480733a85631857` |
| Commit atual após Green | `78a7a62631e662d0402dc59a0d64c09ee245c496` |

A branch e a tag já existem e não devem ser recriadas. Os documentos não
rastreados no diretório devem ser preservados e não incluídos acidentalmente nos
commits de código. Para isso, deve-se usar `git add` com caminhos explícitos, e
não `git add .`.

## 4. Testes retrospectivos mantidos

| Módulo | Comportamentos já existentes | Classificação |
|---|---|---|
| `newCourseForm.ts` | normalização, validação e construção do payload | testes retrospectivos |
| `media-id.ts` | MongoDB, UUID e formato inválido | testes retrospectivos |
| `media-reference-error.ts` | códigos reconhecidos e erros não reconhecidos | testes retrospectivos |
| `submitNewCourse.ts` | criação, atualização, edição, modos e falhas | testes retrospectivos |

No payload, a regra correta é limitar `shortDescription` a 120 caracteres e
preservar `description`, que já deve ter sido validada com no máximo 400
caracteres.

Esses casos continuam sendo importantes para regressão e cobertura, mas não
devem ser recriados em novos commits Red–Green, pois já passam na implementação
preservada.

## 5. Ciclo TDD executado

### 5.1 Red

Commit:

```text
6806fb0f50a8670152b58af9b66cb7980954e501
test: trata identificador de rascunho com espacos
```

Foi acrescentado um teste que chama `submitNewCourse` com:

```ts
draftCourseId: '   '
```

Resultado esperado:

- tratar o identificador como ausência de rascunho;
- retornar `operation: 'create'`;
- chamar `createCourse`;
- não chamar `updateCourse`.

Na implementação preservada, a expressão `request.draftCourseId || null`
considerava a string com espaços verdadeira. Consequentemente, o teste falhava
porque a função chamava `updateCourse('   ', payload)`. Isso comprova o estado
Red sem depender de remoção artificial de código.

### 5.2 Green

Commit:

```text
78a7a62631e662d0402dc59a0d64c09ee245c496
feat: ignora rascunho com identificador em branco
```

Implementação mínima:

```ts
const draftCourseId = request.draftCourseId?.trim() || null
const targetCourseId = editCourse ? editCourse.id : draftCourseId
```

Depois da normalização, strings vazias ou formadas somente por espaços resultam
em `null`; identificadores não vazios permanecem disponíveis para atualização.

### 5.3 Refactor

Não foi necessário criar um commit de refatoração. A alteração Green já é
pequena, legível e mantém separadas a normalização do identificador e a escolha
do alvo. Criar um commit vazio ou uma mudança sem benefício apenas para completar
o nome Red–Green–Refactor não seria adequado.

## 6. Resultado da validação

Comandos executados após o Green:

| Comando | Resultado |
|---|---|
| `npm test -- --run` | 5 arquivos e 42 testes aprovados |
| `npm run test:coverage` | 5 arquivos e 42 testes aprovados |
| `npx tsc --noEmit` | concluído sem erros |
| `npm run build` | concluído com sucesso |

Cobertura dos módulos da Função 5, conforme
`coverage/coverage-summary.json`:

| Módulo | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| `newCourseForm.ts` | 100% | 100% | 100% | 100% |
| `media-id.ts` | 100% | 100% | 100% | 100% |
| `submitNewCourse.ts` | 100% | 100% | 100% | 100% |
| `media-reference-error.ts` | 100% | 100% | 100% | 100% |

O build mantém apenas o aviso não bloqueante de que o chunk principal ultrapassa
500 kB após a minificação.

## 7. Próximos ciclos

Não há outro ciclo TDD obrigatório previsto para os comportamentos já
implementados. Um novo ciclo somente deve ser iniciado quando existir requisito,
defeito ou melhoria observável ainda ausente.

Para qualquer comportamento futuro:

1. definir a entrada e o resultado esperado;
2. escrever e executar o teste, confirmando a falha pelo motivo esperado;
3. registrar o commit Red;
4. implementar apenas o necessário;
5. executar o teste isolado e a suíte completa;
6. registrar o commit Green;
7. refatorar somente se houver melhoria estrutural real.

Não se deve apagar código pronto nem reorganizar commits anteriores para criar
uma aparência artificial de TDD.

## 8. Atualização do relatório

O relatório deve declarar:

> A implementação original da Função 5 foi desenvolvida colaborativamente por
> Gustavo e Hugo e validada por testes retrospectivos de caixa-preta e
> caixa-branca. Posteriormente, o tratamento de identificadores de rascunho
> formados somente por espaços foi desenvolvido com TDD, no ciclo Red
> `6806fb0` e Green `78a7a62`.

Também deve registrar:

- 18 testes em `submitNewCourse.test.ts`;
- 41 casos introduzidos para a Função 5;
- 42 testes totais, incluindo o teste de fumaça preexistente;
- 100% de branches em `submitNewCourse.ts`;
- o novo caso de caixa-branca para identificador formado somente por espaços.

## 9. Checklist concluído

- [x] Entrega anterior preservada pela tag `entrega-atual`.
- [x] Branch `tdd-submit-new-course` criada.
- [x] Teste Red escrito antes da correção.
- [x] Falha Red explicada pelo comportamento anterior.
- [x] Implementação Green mínima registrada em commit separado.
- [x] Necessidade de Refactor avaliada.
- [x] Testes completos aprovados.
- [x] TypeScript aprovado.
- [x] Build aprovado.
- [x] Cobertura atualizada.
- [x] Testes retrospectivos separados do TDD real.
- [x] Relatório atualizado sem atribuição retroativa de TDD.
