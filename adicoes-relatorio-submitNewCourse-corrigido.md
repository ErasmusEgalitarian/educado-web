# Planejamento dos Testes — complemento da Função 5

Como parte do fluxo de criação e edição de cursos, a equipe selecionou também a função interna `submitNewCourse`, originalmente implementada como uma *closure* de `renderNewCourseScreen` em `src/app/pages/HomePage.ts`, linhas 1172 a 1329 do commit `3dfe5398`. A função foi escolhida porque concentrava leitura do DOM, normalização, validação, construção do *payload*, escolha entre criação e atualização, chamadas à API, persistência local, tratamento de erros, mensagens e renderização. Apesar de sua importância, não existiam testes unitários que permitissem exercer essas responsabilidades isoladamente.

O trabalho foi dividido em duas etapas complementares. Gustavo ficou responsável pelos contratos, normalização, validação, construção do *payload* e validação do identificador de mídia. Hugo ficou responsável pela orquestração assíncrona, incluindo criação ou atualização, preservação de dados durante a edição, modos de submissão, armazenamento, classificação das falhas da API e resultados devolvidos à página. O achado estrutural e a correção proposta foram registrados na [issue #40](https://github.com/ErasmusEgalitarian/educado-web/issues/40).

# Descrição das Técnicas Utilizadas

A construção dos testes da Função 5 foi dividida entre as branches `submitNewCourse-Gustavo` e `submitNewCourse-Hugo`, posteriormente reunidas na branch `submitNewCourse`.

**Caixa-preta:** partição de equivalência e análise de valor limite sobre os campos do formulário (obrigatórios, comprimentos e formato da mídia) e sobre os fluxos de submissão (criação, rascunho, edição, modos `draft`, `next` e `review`, sucessos e falhas). O comportamento esperado foi derivado da interface e do código existente.

**Caixa-branca (MC/DC):** a partir da estrutura da função, foram identificadas as decisões de validação, criação ou atualização, aplicação de valores padrão, ordem dos efeitos e classificação de erros. Para a decisão `mongoValido || uuidValido`, foi montada a tabela verdade e identificados os pares que demonstram a influência independente de cada condição.

**TDD (Red–Green):** após a implementação original, um novo caso demonstrou que um identificador de rascunho formado somente por espaços era tratado como existente. O teste foi registrado primeiro no commit Red `6806fb0`; a normalização mínima foi implementada no commit Green `78a7a62`. Os demais casos permanecem classificados como testes retrospectivos, pois o código correspondente já existia antes deles.

## 5.5 Função 5: `submitNewCourse`

A `submitNewCourse` era uma função interna assíncrona de `renderNewCourseScreen`, acionada ao salvar um rascunho, avançar para as seções ou abrir a revisão. Seu código original está disponível no [commit de referência, linhas 1172 a 1329](https://github.com/ErasmusEgalitarian/educado-web/blob/3dfe5398ec89579ee1b0a8ef7922d72c5b4c8433/src/app/pages/HomePage.ts#L1172-L1329).

**Propósito:** validar os dados gerais do curso, decidir se a operação deve criar ou atualizar, persistir o curso devolvido pela API e encaminhar o usuário para a próxima etapa do fluxo.

**Comportamento original:** a mesma *closure* lia elementos HTML, normalizava e validava valores, construía o *payload*, escolhia a chamada de API, manipulava o `sessionStorage`, tratava falhas, exibia mensagens e renderizava telas. A concentração dessas responsabilidades tornava necessário montar praticamente toda a página para testar uma única decisão.

**Achado estrutural:** não foi identificado um defeito funcional conhecido no comportamento original, mas o alto acoplamento impedia o teste unitário da orquestração e aumentava o risco de regressões. O achado foi classificado com severidade média.

**Refatoração realizada:** Gustavo extraiu `normalizeNewCourseForm`, `validateNewCourseForm`, `buildCreateCoursePayload` e `isValidMediaIdFormat`. Hugo extraiu a orquestração para `submitNewCourse.ts`, ampliou os contratos de entrada e resultado e criou `classifyMediaReferenceError`. O `HomePage.ts` permaneceu responsável por DOM, traduções, mensagens e renderização.

```text
HomePage.ts
  → normalizeNewCourseForm
  → validateNewCourseForm
  → submitNewCourse
      ├─ buildCreateCoursePayload
      ├─ createCourse ou updateCourse
      ├─ persistência local
      ├─ desativação no modo draft
      └─ resultado estruturado
  → mensagens, erros de campo e renderização
```

### 5.5.1 Testes Existentes

Antes da alteração, não havia teste unitário específico para a `submitNewCourse`. O teste de fumaça preexistente montava parte da página, mas não verificava sistematicamente as combinações de criação, atualização de rascunho, edição, modos de submissão, falhas intermediárias e ordem dos efeitos.

As regras de formulário e a orquestração estavam incorporadas em uma *closure* não exportada. Por isso, suas responsabilidades não podiam ser chamadas diretamente nem medidas separadamente no relatório de cobertura. Para exercitar um ramo seria necessário preparar o DOM, o armazenamento, as APIs, as mensagens e a navegação da página.

### 5.5.2 Projeto dos Casos de Teste

O projeto começou pela perspectiva de caixa-preta, derivando casos a partir das entradas e saídas observáveis. Em seguida, a caixa-branca complementou os cenários com ramos internos e a análise MC/DC do identificador de mídia.

#### 5.5.2.1 Caixa-preta

##### 5.5.2.1.1 Comportamento especificado

O formulário deve aceitar somente dados que satisfaçam as regras de título, descrição, categoria e mídia. Depois da validação, a submissão deve decidir entre criar um curso, atualizar um rascunho ou atualizar um curso em edição. O modo `draft` deve salvar e desativar o curso; o modo `next` deve encaminhar para as seções; e o modo `review` deve encaminhar para a revisão. Falhas de referência de mídia devem ser distinguidas de falhas gerais.

##### 5.5.2.1.2 Condições de entrada e classes de equivalência

| Condição de entrada | Classes válidas | Classes inválidas |
|---|---|---|
| Título | Texto com 3 ou mais caracteres | Ausente ou com menos de 3 caracteres |
| Descrição | Entre 20 e 400 caracteres | Ausente, abaixo de 20 ou acima de 400 caracteres |
| Categoria | Identificador não vazio | Ausente ou vazia |
| Mídia | MongoDB de 24 hexadecimais ou UUID | Ausente ou em outro formato |
| Fluxo | Criação, rascunho existente ou edição | Estado inconsistente não representado pelos contratos |
| Modo | `draft`, `next` ou `review` | Valor fora da união tipada |
| Resposta da API | Sucesso, falha de mídia ou falha geral | Resposta incompatível com o contrato da API |

##### 5.5.2.1.3 Saídas esperadas

| Condição | Saída esperada |
|---|---|
| Formulário inválido | Códigos de erro acumulados, sem chamada à submissão |
| Criação sem rascunho | `createCourse` e resultado compatível com o modo |
| Rascunho existente | `updateCourse(draftCourseId)` |
| Curso em edição | `updateCourse(editCourse.id)` com valores preservados |
| Modo `draft` | Curso persistido, desativado e dados locais limpos |
| Modo `next` | Resultado `navigateToSections` |
| Modo `review` | Resultado `navigateToReview` |
| Falha de mídia | Resultado `mediaReferenceError` sem persistência ou navegação |
| Falha geral | Resultado `submitError` com o fluxo e a operação executada |

##### 5.5.2.1.4 Valores limite

- Título: 2 e 3 caracteres.
- Descrição mínima: 19 e 20 caracteres.
- Descrição máxima: 400 e 401 caracteres.
- Descrição curta: entrada com 121 caracteres, limitada a 120 no *payload*.
- Nota de corte em edição: `0`, para provar que o valor não é substituído pelo padrão `70`.
- Identificador de rascunho: string formada somente por espaços, equivalente à ausência de identificador.

##### 5.5.2.1.5 Casos de teste

| Grupo | Cenários exercitados | Resultado esperado |
|---|---|---|
| CP01–CP12 | Normalização, limites, obrigatórios, mídia e construção do *payload* | Dados normalizados, erros corretos e *payload* compatível |
| CP13–CP15 | ID MongoDB, UUID e formato inválido | Aceitar os dois formatos válidos e rejeitar o restante |
| CP16–CP18 | Criação nos modos `next`, `review` e `draft` | Criar e devolver o resultado correspondente ao modo |
| CP19–CP20 | Rascunho existente nos modos `next` e `draft` | Atualizar o mesmo curso, sem criar duplicata |
| CP21–CP24 | Edição: preservação, `next`, `draft` e prioridade sobre rascunho | Atualizar o curso editado e preservar os valores existentes |
| CP25–CP26 | Falha de mídia durante criação e edição | Devolver `mediaReferenceError` sem persistir ou navegar |
| CP27–CP28 | Falha geral durante criação e edição | Devolver `submitError` com o fluxo correto |
| CP29 | Falha de desativação após persistência | Manter o curso salvo e não limpar os dados locais |
| CP30 | Identificador de rascunho formado somente por espaços | Tratar como ausência, criar o curso e não chamar a atualização |

#### 5.5.2.2 Caixa-branca (complementar)

##### 5.5.2.2.1 Critério adotado

A análise estrutural procurou cobrir os lados verdadeiro e falso de cada decisão relevante, valores que poderiam ser confundidos com ausência e todas as categorias reconhecidas pelo classificador de erros. A decisão composta da mídia foi analisada com MC/DC.

##### 5.5.2.2.2 Tabela de decisões e condições

| Decisão | Condição avaliada | Resultado verdadeiro | Resultado falso |
|---|---|---|---|
| D1 | Título ausente (`!title`) | Adiciona `TITLE_REQUIRED` | Avalia D2 |
| D2 | Título menor que 3 | Adiciona `TITLE_TOO_SHORT` | Título aceito |
| D3 | Descrição ausente (`!description`) | Adiciona `DESCRIPTION_REQUIRED` | Avalia D4 |
| D4 | Descrição menor que 20 | Adiciona `DESCRIPTION_TOO_SHORT` | Avalia D5 |
| D5 | Descrição maior que 400 | Adiciona `DESCRIPTION_TOO_LONG` | Descrição aceita |
| D6 | Categoria ausente (`!category`) | Adiciona `CATEGORY_REQUIRED` | Categoria aceita |
| D7 | Mídia ausente (`!imageMediaId`) | Adiciona `IMAGE_REQUIRED` | Avalia D8 |
| D8 | Formato da mídia inválido | Adiciona `IMAGE_INVALID_FORMAT` | Mídia aceita |
| D9 | Nenhum erro (`errors.length === 0`) | Formulário válido | Formulário inválido |
| D10 | MongoDB válido ou UUID válido | Formato de mídia aceito | Formato rejeitado |
| D11 | `estimatedTime` informado | Preserva o valor | Usa `8 horas` |
| D12 | `passingThreshold` não é nulo/indefinido | Preserva o valor, inclusive `0` | Usa `70` |
| D13 | `rating` não é nulo/indefinido | Preserva a avaliação | Usa `null` |
| D14 | `editCourse` informado | Fluxo `edit`, preserva dados e usa seu ID | Fluxo `create`; considera o rascunho |
| D15 | Existe `targetCourseId` | Chama `updateCourse` | Chama `createCourse` |
| D16 | Modo igual a `draft` | Desativa, limpa dados e retorna `draftSaved` | Avalia D18 |
| D17 | Fluxo igual a `edit` dentro de `draft` | Limpa o estado local de edição | Mantém esse estado ausente |
| D18 | Modo igual a `next` | Retorna `navigateToSections` | Retorna `navigateToReview` |
| D19 | Erro possui código de mídia reconhecido | Retorna `mediaReferenceError` | Retorna `submitError` |
| D20 | `draftCourseId?.trim()` produz valor não vazio | Usa o identificador normalizado | Trata como ausência de rascunho |

##### 5.5.2.2.3 Tabela MC/DC da mídia

A decisão analisada foi `mongoValido || uuidValido`.

| MongoDB válido | UUID válido | Resultado |
|:---:|:---:|:---:|
| V | F | V |
| F | V | V |
| F | F | F |

Comparar a primeira e a terceira linha demonstra a influência independente da condição MongoDB. Comparar a segunda e a terceira demonstra a influência independente da condição UUID.

##### 5.5.2.2.4 Casos de teste caixa-branca

| Grupo | Ramo estrutural | Evidência esperada |
|---|---|---|
| CB01 | `draftCourseId` igual a string vazia | Tratar como ausência e chamar `createCourse` |
| CB02 | Edição sem tempo estimado e sem avaliação | Aplicar `8 horas` e `null` |
| CB03 | Nota de corte igual a `0` | Preservar `0`, sem aplicar o padrão `70` |
| CB04–CB08 | Cinco códigos de referência de mídia reconhecidos | Retornar o mesmo código classificado |
| CB09 | Código de API desconhecido | Retornar `null` no classificador |
| CB10 | `ApiError` sem código | Retornar `null` no classificador |
| CB11 | Erro comum, fora de `ApiError` | Retornar `null` e seguir como falha geral |
| CB12 | `draftCourseId` formado somente por espaços | Normalizar para ausência e chamar `createCourse` |

##### 5.5.2.2.5 Cobertura estrutural alcançada

Os testes cobrem todos os ramos planejados de normalização, validação, construção do *payload*, criação ou atualização, persistência, modos de submissão e classificação de erros. Depois do caso para identificador formado somente por espaços, o V8 passou a reportar 100% de *branches* em `submitNewCourse.ts`.

### 5.5.3 Implementação dos Testes

Os testes foram implementados nos arquivos abaixo:

- [`newCourseForm.test.ts`](https://github.com/ErasmusEgalitarian/educado-web/blob/95c5467d864f0e6f61095513d480733a85631857/src/features/courses/new-course/newCourseForm.test.ts): 12 testes;
- [`media-id.test.ts`](https://github.com/ErasmusEgalitarian/educado-web/blob/95c5467d864f0e6f61095513d480733a85631857/src/features/media/model/media-id.test.ts): 3 testes;
- [`submitNewCourse.test.ts`](https://github.com/ErasmusEgalitarian/educado-web/blob/78a7a62631e662d0402dc59a0d64c09ee245c496/src/features/courses/new-course/submitNewCourse.test.ts): 18 testes;
- [`media-reference-error.test.ts`](https://github.com/ErasmusEgalitarian/educado-web/blob/95c5467d864f0e6f61095513d480733a85631857/src/features/media/model/media-reference-error.test.ts): 8 casos executados, considerando os cinco valores do `it.each`.

API e armazenamento foram substituídos por funções `vi.fn`. Além de devolver resultados controlados, os *mocks* registram as chamadas em uma lista, permitindo verificar a operação, os argumentos, o curso persistido e a ordem dos efeitos.

**Contribuição de Gustavo:** commits [`f7bfac2`](https://github.com/ErasmusEgalitarian/educado-web/commit/f7bfac2), [`fdf91f7`](https://github.com/ErasmusEgalitarian/educado-web/commit/fdf91f7), [`9b51dbf`](https://github.com/ErasmusEgalitarian/educado-web/commit/9b51dbf), [`f109a10`](https://github.com/ErasmusEgalitarian/educado-web/commit/f109a10) e [`bccafd6`](https://github.com/ErasmusEgalitarian/educado-web/commit/bccafd6), revisados no [PR #33](https://github.com/ErasmusEgalitarian/educado-web/pull/33).

**Contribuição de Hugo:** commits [`324261f`](https://github.com/ErasmusEgalitarian/educado-web/commit/324261f), [`0d4ab59`](https://github.com/ErasmusEgalitarian/educado-web/commit/0d4ab59), [`3363570`](https://github.com/ErasmusEgalitarian/educado-web/commit/3363570), [`1b8560f`](https://github.com/ErasmusEgalitarian/educado-web/commit/1b8560f), [`03e40c2`](https://github.com/ErasmusEgalitarian/educado-web/commit/03e40c2), [`c25bfab`](https://github.com/ErasmusEgalitarian/educado-web/commit/c25bfab) e [`340ba75`](https://github.com/ErasmusEgalitarian/educado-web/commit/340ba75), revisados no [PR #34](https://github.com/ErasmusEgalitarian/educado-web/pull/34).

As duas contribuições foram consolidadas no [PR #41](https://github.com/ErasmusEgalitarian/educado-web/pull/41), da branch `submitNewCourse` para `developer`.

**Evidência de TDD posterior:** a implementação original não é apresentada como TDD, pois parte do código antecedeu seus testes. Na branch `tdd-submit-new-course`, Gustavo acrescentou primeiro o teste para `draftCourseId: '   '`. No commit Red `6806fb0`, o teste falhava porque a string com espaços era considerada um identificador existente e acionava `updateCourse`. No commit Green `78a7a62`, a expressão `request.draftCourseId?.trim() || null` passou a tratar esse valor como ausência e a acionar `createCourse`. Não foi necessário um commit de refatoração, pois a correção mínima já ficou legível e delimitada.

### 5.5.4 Resultado da Execução

Em 2 de novembro de 2026, a branch `tdd-submit-new-course` foi validada com os seguintes comandos:

| Verificação | Resultado |
|---|---|
| `npm test -- --run` | 5 arquivos e 42 testes aprovados |
| `npm run test:coverage` | 5 arquivos e 42 testes aprovados com relatório V8 |
| `npx tsc --noEmit` | Concluído sem erros |
| `npm run build` | Concluído com sucesso |

Ao todo, foram introduzidos 41 novos casos executados. O total de 42 inclui também o teste de fumaça preexistente. O *build* manteve apenas o aviso não bloqueante de que o *chunk* principal possui aproximadamente 585 kB após a minificação.

### 5.5.5 Cobertura

| Módulo | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| `newCourseForm.ts` | 100% | 100% | 100% | 100% |
| `media-id.ts` | 100% | 100% | 100% | 100% |
| `submitNewCourse.ts` | 100% | 100% | 100% | 100% |
| `media-reference-error.ts` | 100% | 100% | 100% | 100% |

Antes da refatoração, as responsabilidades estavam misturadas em uma *closure* sem teste unitário dedicado e não podiam ser medidas separadamente. Depois da extração, cada módulo passou a possuir testes diretos e cobertura estrutural própria. Com o caso adicional para identificador composto somente por espaços, os quatro módulos analisados alcançaram 100% nas métricas registradas.

**Limitações:** não foi realizado teste manual integrado com o backend nem verificação específica com os papéis `USER` e `ADMIN`. A alteração não modifica o *layout*. Ao editar e salvar como rascunho, a mensagem de atualização bem-sucedida agora aparece somente depois que a desativação termina com sucesso; se a desativação falhar, apenas a mensagem de erro é exibida.

# Análise Crítica — complemento da Função 5

O trabalho evidenciou a complementaridade entre caixa-preta e caixa-branca. A caixa-preta derivou os casos das regras observáveis do formulário e dos resultados esperados para criação, edição e rascunho. A caixa-branca revelou situações menos evidentes pela interface, como a prioridade do curso em edição, a preservação de uma nota de corte igual a zero, o tratamento de identificadores vazios ou formados somente por espaços e a distinção entre `ApiError` e erro comum.

A principal limitação de testabilidade estava no desenho original de `HomePage.ts`. A extração das regras puras e a injeção das dependências reduziram a preparação dos testes: as entradas passaram a ser declaradas diretamente, e resultados e chamadas puderam ser observados sem montar a aplicação completa. A ordem `create/update → saveCourse → deactivateCourse → limpeza local` também foi convertida em uma expectativa executável, reduzindo o risco de apagar dados ou apresentar mensagens incoerentes.

As métricas de cobertura orientaram a análise, mas não substituíram a avaliação manual. A tabela MC/DC demonstrou a influência independente de MongoDB e UUID. O ciclo TDD acrescentou uma regressão executável para o identificador com espaços e elevou a cobertura de branches de `submitNewCourse.ts` a 100%, sem atribuir TDD retroativamente aos casos anteriores.

# Conclusão — complemento da Função 5

A refatoração da `submitNewCourse` transformou uma *closure* extensa e acoplada em módulos com responsabilidades delimitadas. As regras de formulário, construção do *payload*, validação da mídia, classificação de erros e orquestração assíncrona passaram a ser testadas diretamente, enquanto `HomePage.ts` permaneceu responsável pela interface.

As contribuições de Gustavo e Hugo, somadas ao ciclo TDD posterior, introduziram 41 casos executados. Com o teste preexistente, a branch final apresentou 5 arquivos e 42 testes aprovados, TypeScript sem erros e *build* concluído. Os quatro módulos analisados alcançaram 100% em *statements*, *branches*, funções e linhas. Além da cobertura, a nova estrutura tornou explícitos os contratos de criação, atualização, preservação de valores, ordem dos efeitos e representação de sucessos e falhas.

## Conclusão das perspectivas

### A Caixa-Preta

A perspectiva de caixa-preta demonstrou que o comportamento observável da função atende aos fluxos especificados. As classes de equivalência e os valores-limite verificaram entradas válidas e inválidas do formulário, criação de cursos, atualização de rascunhos, edição de cursos, modos `draft`, `next` e `review`, além de falhas de mídia e falhas gerais. Dessa forma, os testes confirmaram que cada combinação relevante de entrada produz o resultado esperado sem depender da implementação interna.

### A Caixa-Branca

A perspectiva de caixa-branca, por sua vez, complementou a análise ao percorrer as decisões e os ramos internos da implementação. A tabela de decisões e condições evidenciou os caminhos de validação, aplicação de valores padrão, escolha entre criação e atualização, persistência, desativação e classificação de erros. A análise MC/DC da expressão `mongoValido || uuidValido` comprovou a influência independente de cada condição. Em conjunto com a cobertura estrutural, essa perspectiva reduziu o risco de ramos não exercitados e confirmou a consistência da orquestração assíncrona.

Consideradas em conjunto, as duas perspectivas oferecem uma avaliação complementar: a caixa-preta verifica se a função faz o que foi especificado, enquanto a caixa-branca verifica se suas decisões internas relevantes foram exercitadas. O resultado é uma base de testes mais confiável para futuras alterações no fluxo de submissão de cursos.
