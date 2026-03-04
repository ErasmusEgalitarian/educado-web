(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const h of document.querySelectorAll('link[rel="modulepreload"]'))r(h);new MutationObserver(h=>{for(const d of h)if(d.type==="childList")for(const s of d.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function e(h){const d={};return h.integrity&&(d.integrity=h.integrity),h.referrerPolicy&&(d.referrerPolicy=h.referrerPolicy),h.crossOrigin==="use-credentials"?d.credentials="include":h.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function r(h){if(h.ep)return;h.ep=!0;const d=e(h);fetch(h.href,d)}})();const on="educado.language",jt={"pt-BR":{common:{language:"Idioma",portuguese:"Português",english:"English"},auth:{hero:{onboardingLabel:"Slides de onboarding",slideAria:"Slide {{index}}",slide1:{title:"Junte-se a nós para transformar vidas a partir do seu conhecimento",description:"Oferecemos acesso a conteúdo personalizado para pessoas que precisam, melhorando condições de vida e oportunidades de emprego"},slide2:{title:"Para criadores de conteúdo",description:"Divulgue seu trabalho e alcance um público ainda maior. Mostre suas ideias para quem quer aprender e se inspirar."},slide3:{title:"Cadastre-se agora e ajude a fazer a diferença!",description:"Faça parte de uma comunidade que facilita o acesso a conteúdos relevantes e incentiva o compartilhamento de conhecimento de forma simples e prática."}},landing:{title:"Boas vindas ao EDUCADO!",description:"Cadastre-se agora e ajude a promover seu trabalho e atingir um público mais amplo por meio da criação de conteúdo.",register:"Cadastrar",alreadyHaveAccount:"Já possui uma conta?",login:"Entrar"},register:{back:"Voltar",title:"Crie uma conta gratuita",firstName:"Nome",firstNamePlaceholder:"Nome",lastName:"Sobrenome",lastNamePlaceholder:"Sobrenome",email:"Email",emailPlaceholder:"seuemail@gmail.com",password:"Senha",passwordPlaceholder:"*******",confirmPassword:"Confirmar senha",confirmPasswordPlaceholder:"*******",passwordHintLine1:"MÍNIMO DE 8 CARACTERES",passwordHintLine2:"PELO MENOS UMA LETRA",submit:"Cadastrar",alreadyHaveAccount:"Já possui uma conta?",loginNow:"Entre agora",showPassword:"Mostrar senha",hidePassword:"Ocultar senha",showConfirmPassword:"Mostrar confirmação de senha",hideConfirmPassword:"Ocultar confirmação de senha",errors:{invalidEmail:"EMAIL INVÁLIDO",passwordMismatch:"SENHAS NÃO COINCIDEM",emailAlreadyExists:"EMAIL JÁ CADASTRADO",passwordPolicy:"SENHA FORA DA POLÍTICA",requiredField:"CAMPO OBRIGATÓRIO",generic:"NÃO FOI POSSÍVEL CONCLUIR O CADASTRO",rateLimited:"MUITAS TENTATIVAS. TENTE NOVAMENTE EM INSTANTES",authAfterRegisterFailed:"NÃO FOI POSSÍVEL AUTENTICAR APÓS O CADASTRO. TENTE ENTRAR NOVAMENTE.",accountNotApproved:"CONTA AINDA NÃO APROVADA PARA LOGIN. AGUARDE A ANÁLISE."},feedback:{submitting:"Enviando cadastro...",success:"Conta criada! Complete seu perfil para análise."}},login:{back:"Voltar",title:"Bem-vindo(a) de volta!",email:"Email",emailPlaceholder:"seuemail@gmail.com",password:"Senha",passwordPlaceholder:"*******",forgotPassword:"Esqueceu a senha?",submit:"Entrar",noAccount:"Ainda não tem conta?",registerNow:"Cadastre-se agora",showPassword:"Mostrar senha",hidePassword:"Ocultar senha",waiting:{title:"Aguarde aprovação",description:"Seu cadastro está em análise e você receberá um retorno em até x dias. Fique de olho no seu e-mail, avisaremos assim que tudo estiver pronto!",close:"Fechar"},errors:{invalidCredentials:"EMAIL OU SENHA INVÁLIDOS",accountPending:"SUA CONTA ESTÁ EM ANÁLISE. AGUARDE APROVAÇÃO.",accountRejected:"SEU CADASTRO FOI REPROVADO. CONTATE O SUPORTE.",requiredField:"CAMPO OBRIGATÓRIO",invalidEmail:"EMAIL INVÁLIDO",generic:"NÃO FOI POSSÍVEL FAZER LOGIN. TENTE NOVAMENTE."},feedback:{submitting:"Entrando...",success:"Login realizado com sucesso!"}},profile:{title:"Que bom que você quer fazer parte do Educado!",description:"Precisamos de algumas informações para aprovar seu acesso de criador de conteúdo. Retornaremos com uma resposta via e-mail.",characters:"caracteres",backToRegister:"Voltar para o cadastro",submit:"Enviar para análise",sections:{motivations:{title:"Motivações",description:"Queremos saber mais sobre você! Nos conte suas motivações para fazer parte do Educado.",placeholder:"Escreva aqui por que você quer fazer parte do projeto"},academicBackground:{title:"Formação Acadêmica",entryTitle:"Experiência acadêmica",description:"Conte brevemente sua formação acadêmica e principais aprendizados.",placeholder:"Descreva sua formação acadêmica",levelLabel:"Formação",statusLabel:"Status",courseLabel:"Curso",institutionLabel:"Instituição",startLabel:"Início",endLabel:"Fim",coursePlaceholder:"Curso",institutionPlaceholder:"Instituição",addAnother:"Adicionar outra formação",levelOptions:{higher:"Superior",postgraduate:"Pós-graduação",technical:"Técnico"},statusOptions:{inProgress:"Em andamento",completed:"Concluído"}},professionalExperience:{title:"Experiências profissionais",entryTitle:"Experiência profissional",description:"Compartilhe suas experiências profissionais mais relevantes.",placeholder:"Descreva suas experiências profissionais",companyLabel:"Empresa",roleLabel:"Cargo",startLabel:"Início",endLabel:"Fim",activitiesLabel:"Descrição das atividades",companyPlaceholder:"Empresa",rolePlaceholder:"Cargo",activitiesPlaceholder:"Escreva aqui as suas responsabilidades",currentJob:"Meu emprego atual",addAnother:"Adicionar outra experiência"}},common:{selectPlaceholder:"Selecione",monthYearPlaceholder:"Mês / Ano",removeItem:"Remover",openCalendar:"Abrir calendário"},errors:{minChars:"{{field}}: mínimo de {{min}} caracteres",completeSection:"Preencha todos os campos de {{field}}",requiredField:"{{field}} é obrigatório",startNotFuture:"{{field}} não pode ser maior que o mês atual",endAfterStart:"{{field}} deve ser maior que o início",unauthorized:"Sua sessão expirou. Faça login novamente para continuar.",invalidTransition:"Não foi possível enviar nesta etapa. Atualize a página e tente novamente.",generic:"Não foi possível enviar seu perfil agora."},feedback:{submitting:"Enviando perfil para análise...",successPendingReview:"Perfil enviado! Seu cadastro está em análise.",success:"Perfil atualizado com sucesso."},confirmation:{title:"Enviar para análise",message:"Você tem certeza que deseja enviar o formulário de aplicação? Essa ação não pode ser desfeita.",cancel:"Cancelar",continue:"Continuar",close:"Fechar"},waiting:{title:"Aguarde aprovação",successTitle:"Solicitação concluída com sucesso!",successDescription:"Seu cadastro está em análise e você receberá um retorno em até x dias. Fique de olho no seu e-mail, avisaremos assim que tudo estiver pronto!",close:"Fechar"}}},courses:{sections:{title:"Seções do curso",workload:"Carga horária",hours:"horas",attentionTitle:"Fique atento!",attentionMessage:"Você pode adicionar até 10 itens em cada seção, entre aulas e exercícios.",defaultSectionTitle:"Nome da seção",sectionLabel:"Seção {{index}}",sectionName:"Seção {{index}}",addLesson:"Adicionar Aula",addExercise:"Adicionar Exercício",or:"ou",items:"itens",newSection:"Nova seção",nextReview:"Avançar para a revisão",reviewSoon:"A etapa de revisão será habilitada na próxima fase.",maxItemsError:"Máximo de 10 itens por seção.",deleteModal:{title:"Remover seção",message:"Tem certeza que deseja remover esta seção?",cancel:"Cancelar",confirm:"Remover"},cancelCourseModal:{title:"Cancelar criação do curso",message:"Tem certeza que deseja cancelar? O curso será apagado permanentemente.",cancel:"Voltar",confirm:"Apagar curso"},fields:{name:"Nome",namePlaceholder:"Nome da seção",description:"Descrição",descriptionPlaceholder:"Descrição da seção"},modal:{title:"Adicionar Aula {{index}}",editTitle:"Atualizar Aula {{index}}",close:"Fechar",cancel:"Cancelar",submit:"Adicionar Aula",editSubmit:"Atualizar Aula",success:"Aula adicionada com sucesso.",updateSuccess:"Aula atualizada com sucesso.",videoTooLong:"O vídeo deve ter no máximo 3 minutos.",characters:"caracteres",fields:{name:"Nome",namePlaceholder:"Nome da Aula",contentType:"Tipo de conteúdo",videoUpload:"Upload do vídeo",videoSelect:"Selecionar vídeo",videoHint:"O vídeo deve ser de até 3 minutos",finalQuestion:"Pergunta final",videoQuestion:"Pergunta",videoQuestionPlaceholder:"Insira sua pergunta aqui.",alternatives:"Alternativas",alternativePlaceholder:"Escreva a alternativa {{letter}} aqui",addAlternative:"Adicionar alternativa",removeAlternative:"Remover alternativa",alternativesHint:"Comece com 2 alternativas e adicione até 4.",trueFalseHint:"Selecione a alternativa correta entre Verdadeiro e Falso.",trueOption:"Verdadeiro",falseOption:"Falso",correctAlternative:"Essa é a alternativa correta.",correctAlternativeRequired:"Selecione a alternativa correta.",firstText:"Insira o bloco de texto",firstTextPlaceholder:"Insira seu texto aqui.",secondText:"Insira o segundo bloco de texto",secondTextPlaceholder:"Insira seu texto aqui."},contentTypes:{video:"Vídeo",styledText:"Texto Estilizado"}},exerciseModal:{title:"Adicionar Exercício {{index}}",editTitle:"Atualizar Exercício {{index}}",close:"Fechar",cancel:"Cancelar",submit:"Adicionar Exercício",editSubmit:"Atualizar Exercício",success:"Exercício adicionado com sucesso.",updateSuccess:"Exercício atualizado com sucesso.",fields:{title:"Título",titlePlaceholder:"Escreva o título do exercício",contentType:"Tipo de conteúdo",question:"Pergunta",questionPlaceholder:"Insira sua pergunta aqui.",includeImage:"Adicionar imagem",imageUpload:"Upload da imagem",imageSelect:"Selecionar imagem",imageHint:"Adicione uma imagem para o enunciado (opcional).",alternatives:"Alternativas",alternativePlaceholder:"Escreva a alternativa {{letter}} aqui",addAlternative:"Adicionar alternativa",removeAlternative:"Remover alternativa",alternativesHint:"Comece com 2 alternativas e adicione até 4.",correctAlternative:"Essa é a alternativa correta.",correctAlternativeRequired:"Selecione a alternativa correta."},contentTypes:{multipleChoice:"Múltipla Escolha",trueFalse:"Verdadeiro ou Falso"}},readModal:{title:"Visualizar atividade",close:"Fechar",section:"Seção {{index}}",activityName:"Nome da atividade",activityType:"Tipo de conteúdo",textBody:"Texto",question:"Pergunta",alternatives:"Alternativas",correct:"Correta"}},newCourse:{title:"Novo Curso",generalInfo:"Informações gerais",sections:"Seções do curso",review:"Revisar curso",saveDraft:"Salvar como rascunho",fields:{name:"Nome do Curso",namePlaceholder:"Nome do curso",difficulty:"Nível",category:"Categoria",categoryPlaceholder:"Selecione a categoria",description:"Descrição",descriptionPlaceholder:"Conte mais sobre o curso",image:"Imagem da capa",imagePlaceholder:"Cole a URL da imagem",imageDrop:"Arraste e solte a imagem aqui",or:"ou",imageSend:"Clique para enviar",imageHint:"O arquivo deve conter no máximo 10Mb",tags:"Tags",tagsPlaceholder:"Digite e pressione Enter para adicionar tag"},difficultyOptions:{beginner:"Iniciante",intermediate:"Intermediário",advanced:"Avançado"},ctas:{back:"Voltar para anterior",cancel:"Cancelar",next:"Avançar para seções"},errors:{titleRequired:"Nome do curso é obrigatório.",titleMin:"Nome do curso deve ter pelo menos 3 caracteres.",descriptionRequired:"Descrição é obrigatória.",descriptionMin:"Descrição deve ter pelo menos 20 caracteres.",categoryRequired:"Categoria é obrigatória.",imageRequired:"Imagem da capa é obrigatória.",tagsLimit:"Máximo de 20 tags por curso.",tagCreate:"Não foi possível criar a tag.",requiredFields:"Preencha os campos obrigatórios."}},review:{title:"Revisar curso",alert:"Navegue pelo seu curso na visualização do aluno antes de publicá-lo.",publish:"Publicar Curso",publishSuccess:"Curso publicado com sucesso.",loadError:"Não foi possível carregar os dados da revisão.",missingDraft:"Não há curso em rascunho para revisar.",generalInfo:{title:"Informações do curso",name:"Nome",category:"Categoria",level:"Nível",time:"Tempo do curso",description:"Descrição",tags:"Tags",noTags:"Sem tags"},sections:{title:"Seções do curso",empty:"Nenhuma seção cadastrada.",itemTitle:"Seção {{index}}",lessons:"aulas",exercises:"exercícios"}},home:{title:"Confira seus cursos",newCourse:"Novo Curso",search:"Buscar curso",sortBy:"Ordenar por",sortOptions:{newest:"Mais recentes",oldest:"Mais antigos",nameAsc:"Nome (A-Z)",nameDesc:"Nome (Z-A)"},edit:"Editar",view:"Visualizar",activate:"Ativar",deactivate:"Desativar",delete:"Excluir",statusActive:"Ativo",statusInactive:"Inativo",confirmDelete:"Tem certeza que deseja excluir este curso?",feedback:{loading:"Carregando cursos...",loadError:"Falha ao carregar cursos.",createSoon:"A criação de curso será habilitada na próxima etapa.",createPromptTitle:"Digite o título do novo curso:",defaultDescription:"descrição inicial do curso para começar a edição.",defaultShortDescription:"Descrição inicial do curso",createSuccess:"Curso criado com sucesso.",createError:"Não foi possível criar o curso.",viewSuccess:"Curso carregado com sucesso.",updateSuccess:"Curso atualizado com sucesso.",activateSuccess:"Curso ativado com sucesso.",deactivateSuccess:"Curso desativado com sucesso.",deleteSuccess:"Curso excluído com sucesso.",actionError:"Não foi possível concluir a ação no curso.",editPrompt:"Atualize o título do curso:"},empty:{title:"Comece agora",description:"Você ainda não criou nenhum curso. Clique no botão abaixo e siga o passo a passo para desenvolver o seu primeiro curso.",createButton:"Novo Curso"},noCourses:"Nenhum curso encontrado.",sidebar:{greeting:"Olá, {{name}}",progress:"Progresso",courses:"Cursos",students:"Estudantes",certificates:"Certificados",rating:"Avaliação",activities:"Atividades",noData:"Não há dados suficiente",noActivities:"Nenhuma atividade"}}}},"en-US":{common:{language:"Language",portuguese:"Português",english:"English"},auth:{hero:{onboardingLabel:"Onboarding slides",slideAria:"Slide {{index}}",slide1:{title:"Join us to transform lives through your knowledge",description:"We offer personalized content access for people in need, improving living conditions and job opportunities."},slide2:{title:"For content creators",description:"Promote your work and reach an even wider audience. Share your ideas with people who want to learn and be inspired."},slide3:{title:"Sign up now and help make a difference!",description:"Be part of a community that makes relevant content more accessible and encourages simple, practical knowledge sharing."}},landing:{title:"Welcome to EDUCADO!",description:"Sign up now and help promote your work while reaching a wider audience through content creation.",register:"Sign up",alreadyHaveAccount:"Already have an account?",login:"Log in"},register:{back:"Back",title:"Create your free account",firstName:"First name",firstNamePlaceholder:"First name",lastName:"Last name",lastNamePlaceholder:"Last name",email:"Email",emailPlaceholder:"youremail@gmail.com",password:"Password",passwordPlaceholder:"*******",confirmPassword:"Confirm password",confirmPasswordPlaceholder:"*******",passwordHintLine1:"MINIMUM 8 CHARACTERS",passwordHintLine2:"AT LEAST ONE LETTER",submit:"Sign up",alreadyHaveAccount:"Already have an account?",loginNow:"Log in now",showPassword:"Show password",hidePassword:"Hide password",showConfirmPassword:"Show confirm password",hideConfirmPassword:"Hide confirm password",errors:{invalidEmail:"INVALID EMAIL",passwordMismatch:"PASSWORDS DO NOT MATCH",emailAlreadyExists:"EMAIL ALREADY REGISTERED",passwordPolicy:"PASSWORD DOES NOT MEET POLICY",requiredField:"REQUIRED FIELD",generic:"WE COULD NOT COMPLETE THE REGISTRATION",rateLimited:"TOO MANY ATTEMPTS. TRY AGAIN SOON",authAfterRegisterFailed:"COULD NOT AUTHENTICATE AFTER REGISTRATION. PLEASE LOG IN AGAIN.",accountNotApproved:"ACCOUNT IS NOT APPROVED FOR LOGIN YET. PLEASE WAIT FOR REVIEW."},feedback:{submitting:"Submitting registration...",success:"Account created! Complete your profile for review."}},login:{back:"Back",title:"Welcome back!",email:"Email",emailPlaceholder:"youremail@gmail.com",password:"Password",passwordPlaceholder:"*******",forgotPassword:"Forgot your password?",submit:"Log in",noAccount:"Don't have an account?",registerNow:"Sign up now",showPassword:"Show password",hidePassword:"Hide password",waiting:{title:"Waiting for approval",description:"Your registration is under review and you will receive a response within x days. Keep an eye on your email and we will notify you as soon as everything is ready!",close:"Close"},errors:{invalidCredentials:"INVALID EMAIL OR PASSWORD",accountPending:"YOUR ACCOUNT IS UNDER REVIEW. PLEASE WAIT FOR APPROVAL.",accountRejected:"YOUR REGISTRATION WAS REJECTED. CONTACT SUPPORT.",requiredField:"REQUIRED FIELD",invalidEmail:"INVALID EMAIL",generic:"COULD NOT LOG IN. PLEASE TRY AGAIN."},feedback:{submitting:"Signing in...",success:"Login successful!"}},profile:{title:"Great to see you want to join Educado!",description:"We need a few details to approve your creator access. We will get back to you by email.",characters:"characters",backToRegister:"Back to registration",submit:"Submit for review",sections:{motivations:{title:"Motivations",description:"We want to know more about you! Tell us your motivations to join Educado.",placeholder:"Write here why you want to be part of the project"},academicBackground:{title:"Academic Background",entryTitle:"Academic experience",description:"Briefly describe your academic background and key learnings.",placeholder:"Describe your academic background",levelLabel:"Education level",statusLabel:"Status",courseLabel:"Course",institutionLabel:"Institution",startLabel:"Start",endLabel:"End",coursePlaceholder:"Course",institutionPlaceholder:"Institution",addAnother:"Add another education",levelOptions:{higher:"Higher education",postgraduate:"Postgraduate",technical:"Technical"},statusOptions:{inProgress:"In progress",completed:"Completed"}},professionalExperience:{title:"Professional Experience",entryTitle:"Professional experience",description:"Share your most relevant professional experiences.",placeholder:"Describe your professional experience",companyLabel:"Company",roleLabel:"Role",startLabel:"Start",endLabel:"End",activitiesLabel:"Activities description",companyPlaceholder:"Company",rolePlaceholder:"Role",activitiesPlaceholder:"Write your responsibilities here",currentJob:"My current job",addAnother:"Add another experience"}},common:{selectPlaceholder:"Select",monthYearPlaceholder:"Month / Year",removeItem:"Remove",openCalendar:"Open calendar"},errors:{minChars:"{{field}}: minimum {{min}} characters",completeSection:"Fill all fields in {{field}}",requiredField:"{{field}} is required",startNotFuture:"{{field}} cannot be later than current month",endAfterStart:"{{field}} must be later than start date",unauthorized:"Your session expired. Please log in again to continue.",invalidTransition:"Could not submit at this stage. Refresh and try again.",generic:"Could not submit your profile right now."},feedback:{submitting:"Submitting profile for review...",successPendingReview:"Profile submitted! Your registration is under review.",success:"Profile updated successfully."},confirmation:{title:"Submit for review",message:"Are you sure you want to submit the application form? This action cannot be undone.",cancel:"Cancel",continue:"Continue",close:"Close"},waiting:{title:"Waiting for approval",successTitle:"Request completed successfully!",successDescription:"Your registration is under review and you will receive a response within x days. Keep an eye on your email and we will notify you as soon as everything is ready!",close:"Close"}}},courses:{sections:{title:"Course sections",workload:"Workload",hours:"hours",attentionTitle:"Attention!",attentionMessage:"You can add up to 10 items in each section, including lessons and exercises.",defaultSectionTitle:"Section name",sectionLabel:"Section {{index}}",sectionName:"Section {{index}}",addLesson:"Add Lesson",addExercise:"Add Exercise",or:"or",items:"items",newSection:"New section",nextReview:"Next to review",reviewSoon:"The review step will be enabled in the next phase.",maxItemsError:"Maximum 10 items per section.",deleteModal:{title:"Remove section",message:"Are you sure you want to remove this section?",cancel:"Cancel",confirm:"Remove"},cancelCourseModal:{title:"Cancel course creation",message:"Are you sure you want to cancel? The course will be permanently deleted.",cancel:"Go back",confirm:"Delete course"},fields:{name:"Name",namePlaceholder:"Section name",description:"Description",descriptionPlaceholder:"Section description"},modal:{title:"Add Lesson {{index}}",editTitle:"Update Lesson {{index}}",close:"Close",cancel:"Cancel",submit:"Add Lesson",editSubmit:"Update Lesson",success:"Lesson added successfully.",updateSuccess:"Lesson updated successfully.",videoTooLong:"The video must be up to 3 minutes.",characters:"characters",fields:{name:"Name",namePlaceholder:"Lesson name",contentType:"Content type",videoUpload:"Video upload",videoSelect:"Select video",videoHint:"The video must be up to 3 minutes",finalQuestion:"Final question",videoQuestion:"Question",videoQuestionPlaceholder:"Type your question here.",alternatives:"Alternatives",alternativePlaceholder:"Write alternative {{letter}} here",addAlternative:"Add alternative",removeAlternative:"Remove alternative",alternativesHint:"Start with 2 alternatives and add up to 4.",trueFalseHint:"Select the correct option between True and False.",trueOption:"True",falseOption:"False",correctAlternative:"This is the correct alternative.",correctAlternativeRequired:"Select the correct alternative.",firstText:"Enter the text block",firstTextPlaceholder:"Type your text here.",secondText:"Enter the second text block",secondTextPlaceholder:"Type your text here."},contentTypes:{video:"Video",styledText:"Styled Text"}},exerciseModal:{title:"Add Exercise {{index}}",editTitle:"Update Exercise {{index}}",close:"Close",cancel:"Cancel",submit:"Add Exercise",editSubmit:"Update Exercise",success:"Exercise added successfully.",updateSuccess:"Exercise updated successfully.",fields:{title:"Title",titlePlaceholder:"Type the exercise title",contentType:"Content type",question:"Question",questionPlaceholder:"Type your question here.",includeImage:"Add image",imageUpload:"Image upload",imageSelect:"Select image",imageHint:"Add an image for the statement (optional).",alternatives:"Alternatives",alternativePlaceholder:"Write alternative {{letter}} here",addAlternative:"Add alternative",removeAlternative:"Remove alternative",alternativesHint:"Start with 2 alternatives and add up to 4.",correctAlternative:"This is the correct alternative.",correctAlternativeRequired:"Select the correct alternative."},contentTypes:{multipleChoice:"Multiple Choice",trueFalse:"True or False"}},readModal:{title:"View activity",close:"Close",section:"Section {{index}}",activityName:"Activity name",activityType:"Content type",textBody:"Text",question:"Question",alternatives:"Alternatives",correct:"Correct"}},newCourse:{title:"New Course",generalInfo:"General information",sections:"Course sections",review:"Review course",saveDraft:"Save as draft",fields:{name:"Course name",namePlaceholder:"Course name",difficulty:"Level",category:"Category",categoryPlaceholder:"Select category",description:"Description",descriptionPlaceholder:"Tell more about the course",image:"Cover image",imagePlaceholder:"Paste image URL",imageDrop:"Drag and drop the image here",or:"or",imageSend:"Click to upload",imageHint:"File must be up to 10Mb",tags:"Tags",tagsPlaceholder:"Type and press Enter to add tag"},difficultyOptions:{beginner:"Beginner",intermediate:"Intermediate",advanced:"Advanced"},ctas:{back:"Back to previous",cancel:"Cancel",next:"Next to sections"},errors:{titleRequired:"Course name is required.",titleMin:"Course name must be at least 3 characters.",descriptionRequired:"Description is required.",descriptionMin:"Description must be at least 20 characters.",categoryRequired:"Category is required.",imageRequired:"Cover image is required.",tagsLimit:"Maximum 20 tags per course.",tagCreate:"Could not create tag.",requiredFields:"Please fill in required fields."}},review:{title:"Review course",alert:"Preview your course in the student view before publishing it.",publish:"Publish Course",publishSuccess:"Course published successfully.",loadError:"Could not load review data.",missingDraft:"There is no draft course to review.",generalInfo:{title:"Course information",name:"Name",category:"Category",level:"Level",time:"Course time",description:"Description",tags:"Tags",noTags:"No tags"},sections:{title:"Course sections",empty:"No sections added yet.",itemTitle:"Section {{index}}",lessons:"lessons",exercises:"exercises"}},home:{title:"Check your courses",newCourse:"New Course",search:"Search course",sortBy:"Sort by",sortOptions:{newest:"Newest",oldest:"Oldest",nameAsc:"Name (A-Z)",nameDesc:"Name (Z-A)"},edit:"Edit",view:"View",activate:"Activate",deactivate:"Deactivate",delete:"Delete",statusActive:"Active",statusInactive:"Inactive",confirmDelete:"Are you sure you want to delete this course?",feedback:{loading:"Loading courses...",loadError:"Failed to load courses.",createSoon:"Course creation will be enabled in the next step.",createPromptTitle:"Enter the new course title:",defaultDescription:"initial course description to start editing.",defaultShortDescription:"Initial course description",createSuccess:"Course created successfully.",createError:"Could not create course.",viewSuccess:"Course loaded successfully.",updateSuccess:"Course updated successfully.",activateSuccess:"Course activated successfully.",deactivateSuccess:"Course deactivated successfully.",deleteSuccess:"Course deleted successfully.",actionError:"Could not complete the course action.",editPrompt:"Update the course title:"},empty:{title:"Get started",description:"You haven't created any courses yet. Click the button below and follow the steps to develop your first course.",createButton:"New Course"},noCourses:"No courses found.",sidebar:{greeting:"Hello, {{name}}",progress:"Progress",courses:"Courses",students:"Students",certificates:"Certificates",rating:"Rating",activities:"Activities",noData:"Not enough data",noActivities:"No activities"}}}}};let bt=hn();const Rt=new Set;function hn(){const t=localStorage.getItem(on);return t==="pt-BR"||t==="en-US"?t:navigator.language.toLowerCase().startsWith("pt")?"pt-BR":"en-US"}function Qt(t,i){const e=i.split(".").reduce((r,h)=>{if(!(!r||typeof r=="string"))return r[h]},t);return typeof e=="string"?e:void 0}function Wt(t,i){return i?Object.entries(i).reduce((e,[r,h])=>e.replace(new RegExp(`{{${r}}}`,"g"),String(h)),t):t}function rn(){document.documentElement.lang=bt}function Dt(){return bt}function bn(t){bt!==t&&(bt=t,localStorage.setItem(on,t),rn(),Rt.forEach(i=>i(t)))}function vt(t){return Rt.add(t),()=>Rt.delete(t)}function o(t,i){const e=Qt(jt[bt],t);if(e)return Wt(e,i);const r=Qt(jt["pt-BR"],t);return r?Wt(r,i):t}rn();function Jt(t){let i=0,e;const r=[{titleKey:"auth.hero.slide1.title",descriptionKey:"auth.hero.slide1.description",image:"/images/onboarding-slide.jpg"},{titleKey:"auth.hero.slide2.title",descriptionKey:"auth.hero.slide2.description",image:"/images/onboarding-slide.jpg"},{titleKey:"auth.hero.slide3.title",descriptionKey:"auth.hero.slide3.description",image:"/images/onboarding-slide.jpg"}],h=()=>{t.innerHTML=`
      <div class="auth-hero">
        <div class="auth-hero-carousel">
          ${r.map((x,P)=>`
                <article class="auth-hero-slide ${P===i?"active":""}" style="background-image: url('${x.image}')">
                  <div class="auth-hero-overlay"></div>
                  <div class="auth-hero-content">
                    <h1>${o(x.titleKey)}</h1>
                    <p>${o(x.descriptionKey)}</p>
                  </div>
                </article>
              `).join("")}
        </div>
        <div class="hero-dots" role="tablist" aria-label="${o("auth.hero.onboardingLabel")}">
          ${r.map((x,P)=>`<button type="button" class="hero-dot ${P===i?"active":""}" data-index="${P}" aria-label="${o("auth.hero.slideAria",{index:P+1})}"></button>`).join("")}
        </div>
      </div>
    `;const d=Array.from(t.querySelectorAll(".auth-hero-slide")),s=Array.from(t.querySelectorAll(".hero-dot")),l=t.querySelector(".auth-hero-carousel"),k=x=>{i=x,d.forEach((P,V)=>{P.classList.toggle("active",V===x)}),s.forEach((P,V)=>{P.classList.toggle("active",V===x)})},O=()=>{const x=(i+1)%r.length;k(x)},m=()=>{const x=(i-1+r.length)%r.length;k(x)};s.forEach(x=>{x.addEventListener("click",()=>{const P=Number(x.dataset.index);k(P)})}),l?.addEventListener("click",x=>{if(x.target.closest(".hero-dot"))return;const V=l.getBoundingClientRect(),z=x.clientX-V.left,M=V.width*.3;if(z<=M){m();return}z>=V.width-M&&O()}),e&&window.clearInterval(e),e=window.setInterval(()=>{O()},5e3)};h(),vt(()=>h())}const Ht="educado.accessToken",Vt="educado.currentUser";function yn(){return localStorage.getItem(Ht)}function wn(t){localStorage.setItem(Ht,t)}function sn(){const t=localStorage.getItem(Vt);if(!t)return null;try{return JSON.parse(t)}catch{return null}}function En(t){localStorage.setItem(Vt,JSON.stringify(t))}function cn(){localStorage.removeItem(Ht),localStorage.removeItem(Vt)}const Cn="http://localhost:5001";class yt extends Error{status;code;fieldErrors;payload;constructor(i,e){const r=e&&typeof e=="object"?e:{};super(r.message??`Request failed with status ${i}`),this.name="ApiError",this.status=i,this.code=r.code,this.fieldErrors=r.fieldErrors,this.payload=e}}async function zt(t){const i=await t.text();if(i)try{return JSON.parse(i)}catch{return{message:i}}}async function Et(t,i){const e=new Headers(i.headers??{});if(e.set("Content-Type","application/json"),i.auth){const h=yn();h&&e.set("Authorization",`Bearer ${h}`)}const r=await fetch(`${Cn}${t}`,{...i,headers:e,body:i.body!==void 0?JSON.stringify(i.body):void 0});if(!r.ok){const h=await zt(r);throw r.status===401&&cn(),new yt(r.status,h)}if(r.status!==204)return await zt(r)}const fe={get:(t,i)=>Et(t,{...i,method:"GET"}),post:(t,i,e)=>Et(t,{...e,method:"POST",body:i}),put:(t,i,e)=>Et(t,{...e,method:"PUT",body:i}),del:(t,i)=>Et(t,{...i,method:"DELETE"})},xt={register:t=>fe.post("/auth/registrations",t),login:async t=>{const i=await fe.post("/auth/login",t);return wn(i.accessToken),En(i.user),i},upsertProfileByUserId:(t,i)=>fe.put(`/auth/registrations/${t}/profile`,i),upsertMyProfile:t=>fe.put("/auth/registrations/me/profile",t,{auth:!0}),getMyStatus:()=>fe.get("/auth/registrations/me/status",{auth:!0}),listAdminRegistrations:(t="PENDING_REVIEW")=>fe.get(`/admin/registrations?status=${t}`,{auth:!0}),approveRegistration:t=>fe.post(`/admin/registrations/${t}/approve`,void 0,{auth:!0}),rejectRegistration:(t,i)=>fe.post(`/admin/registrations/${t}/reject`,i,{auth:!0})};function H(t,i){const e=document.querySelector(".message");e&&e.remove();const r=document.createElement("div");r.className=`message ${i}`,r.textContent=t,document.body.appendChild(r),setTimeout(()=>r.remove(),3e3)}function Sn(t,i){let e="landing";const r=()=>{if(t.innerHTML=`
      <div class="auth-card">
        ${e==="landing"?h():d()}
      </div>
    `,e==="landing"){s();return}l()},h=()=>`
    <div class="auth-card-content">
      <div class="auth-icon" aria-hidden="true">
        <img src="/images/logo_black240.png" alt="" class="auth-icon-image">
      </div>
      <div class="auth-card-text">
        <h2>${o("auth.landing.title")}</h2>
        <p>
          ${o("auth.landing.description")}
        </p>
      </div>
      <div class="auth-card-actions">
        <button id="register-btn" class="btn-primary">${o("auth.landing.register")}</button>
        <p class="login-link">
          ${o("auth.landing.alreadyHaveAccount")} <a id="login-btn" href="#">${o("auth.landing.login")}</a>
        </p>
      </div>
    </div>
  `,d=()=>`
    <section class="register-start" aria-labelledby="register-title">
      <button id="register-back" class="register-back" type="button" aria-label="${o("auth.register.back")}">
        <span class="register-back-icon" aria-hidden="true">&#x2039;</span>
        <span>${o("auth.register.back")}</span>
      </button>

      <form id="register-form" class="register-form" novalidate>
        <h2 id="register-title" class="register-title">${o("auth.register.title")}</h2>

        <div class="register-fields">
          <div class="register-grid-two">
            <label class="register-field" data-field="firstName">
              <span class="register-label">${o("auth.register.firstName")} <strong>*</strong></span>
              <input id="register-first-name" name="firstName" type="text" placeholder="${o("auth.register.firstNamePlaceholder")}" autocomplete="given-name" required>
            </label>
            <label class="register-field" data-field="lastName">
              <span class="register-label">${o("auth.register.lastName")} <strong>*</strong></span>
              <input id="register-last-name" name="lastName" type="text" placeholder="${o("auth.register.lastNamePlaceholder")}" autocomplete="family-name" required>
            </label>
          </div>

          <label class="register-field" data-field="email">
            <span class="register-label">${o("auth.register.email")} <strong>*</strong></span>
            <input id="register-email" name="email" type="email" placeholder="${o("auth.register.emailPlaceholder")}" autocomplete="email" required>
            <small id="register-email-hint" class="register-field-hint" aria-live="polite"></small>
          </label>

          <label class="register-field" data-field="password">
            <span class="register-label">${o("auth.register.password")} <strong>*</strong></span>
            <div class="register-password-wrap">
              <input id="register-password" name="password" type="password" placeholder="${o("auth.register.passwordPlaceholder")}" autocomplete="new-password" minlength="8" required>
              <button class="register-eye" type="button" data-toggle-password="register-password" aria-label="${o("auth.register.showPassword")}">
                <img class="register-eye-icon" src="/icons/visibility.png" alt="" aria-hidden="true">
              </button>
            </div>
            <small id="register-password-hint" class="register-password-hint">${o("auth.register.passwordHintLine1")}<br>${o("auth.register.passwordHintLine2")}</small>
          </label>

          <label class="register-field" data-field="confirmPassword">
            <span class="register-label">${o("auth.register.confirmPassword")} <strong>*</strong></span>
            <div class="register-password-wrap">
              <input id="register-confirm-password" name="confirmPassword" type="password" placeholder="${o("auth.register.confirmPasswordPlaceholder")}" autocomplete="new-password" minlength="8" required>
              <button class="register-eye" type="button" data-toggle-password="register-confirm-password" aria-label="${o("auth.register.showConfirmPassword")}">
                <img class="register-eye-icon" src="/icons/visibility.png" alt="" aria-hidden="true">
              </button>
            </div>
            <small id="register-confirm-password-hint" class="register-field-hint" aria-live="polite"></small>
          </label>
        </div>

        <div class="register-actions">
          <button id="register-submit" class="btn-primary register-submit" type="submit" disabled>${o("auth.register.submit")}</button>
          <p class="login-link register-login-link">
            ${o("auth.register.alreadyHaveAccount")} <a id="register-login-link" href="#">${o("auth.register.loginNow")}</a>
          </p>
        </div>
      </form>
    </section>
  `,s=()=>{const k=t.querySelector("#register-btn"),O=t.querySelector("#login-btn");k?.addEventListener("click",()=>{e="register",r(),t.scrollTo({top:0,behavior:"auto"})}),O?.addEventListener("click",m=>{m.preventDefault(),i?.onOpenLogin?.()})},l=()=>{const k=t.querySelector("#register-back"),O=t.querySelector("#register-form"),m=t.querySelector("#register-login-link"),x=t.querySelector("#register-submit"),P=t.querySelector("#register-first-name"),V=t.querySelector("#register-last-name"),z=t.querySelector("#register-email"),M=t.querySelector("#register-password"),G=t.querySelector("#register-confirm-password"),U=t.querySelector('[data-field="firstName"]'),ne=t.querySelector('[data-field="lastName"]'),T=t.querySelector('[data-field="email"]'),ee=t.querySelector('[data-field="password"]'),te=t.querySelector('[data-field="confirmPassword"]'),ae=t.querySelector("#register-email-hint"),Z=t.querySelector("#register-password-hint"),re=t.querySelector("#register-confirm-password-hint"),w={firstName:!1,lastName:!1,email:!1,password:!1,confirmPassword:!1},p={},y=q=>/[a-zA-Z]/.test(q),F=q=>/.+@.+\..+/.test(q),Q=(q,ve,oe)=>{q?.classList.toggle("is-invalid",oe),ve&&ve.setAttribute("aria-invalid",oe?"true":"false")},se=(q,ve)=>{q&&(q.textContent=ve,q.classList.toggle("is-visible",!!ve))},R=q=>{p[q]&&delete p[q]},W=q=>{switch(q){case"EMAIL_INVALID":return o("auth.register.errors.invalidEmail");case"EMAIL_ALREADY_EXISTS":return o("auth.register.errors.emailAlreadyExists");case"PASSWORD_POLICY":return o("auth.register.errors.passwordPolicy");case"PASSWORD_MISMATCH":return o("auth.register.errors.passwordMismatch");default:return o("auth.register.errors.requiredField")}},ge=(q,ve)=>{const oe=q.querySelector("img");if(!oe)return;const A=ve.type==="password";oe.src=A?"/icons/visibility.png":"/icons/visibility_off.png"},ce=()=>{const q=!!P?.value.trim(),ve=!!V?.value.trim(),A=!!z?.value.trim()&&F(z?.value??""),u=M?.value??"",I=G?.value??"",D=!!u,$=!!I,Y=D&&u.length>=8&&y(u),Ae=$&&u===I,J=p.firstName??"",be=p.lastName??"",Ie=p.email??"",Ne=p.password??"",ke=p.confirmPassword??"";Q(U,P,w.firstName&&!q||!!J),Q(ne,V,w.lastName&&!ve||!!be),Q(T,z,w.email&&!A||!!Ie),Q(ee,M,w.password&&!Y||!!Ne),Q(te,G,w.confirmPassword&&!Ae||!!ke),se(ae,Ie||(w.email&&!A?o("auth.register.errors.invalidEmail"):"")),se(re,ke||(w.confirmPassword&&!Ae?o("auth.register.errors.passwordMismatch"):"")),Z?.classList.toggle("is-invalid-text",!!Ne||w.password&&!Y),Ne?Z.textContent=Ne:Z.innerHTML=`${o("auth.register.passwordHintLine1")}<br>${o("auth.register.passwordHintLine2")}`;const de=!!(q&&ve&&A&&Y&&Ae);x&&(x.disabled=!de)};k?.addEventListener("click",()=>{e="landing",r(),t.scrollTo({top:0,behavior:"auto"})}),m?.addEventListener("click",q=>{q.preventDefault(),i?.onOpenLogin?.()}),[{key:"firstName",input:P},{key:"lastName",input:V},{key:"email",input:z},{key:"password",input:M},{key:"confirmPassword",input:G}].forEach(({key:q,input:ve})=>{ve?.addEventListener("input",()=>{R(q),!w[q]&&(ve.value.length>0||q==="confirmPassword")&&(w[q]=!0),ce()}),ve?.addEventListener("blur",()=>{w[q]=!0,ce()})}),t.querySelectorAll("[data-toggle-password]").forEach(q=>{q.addEventListener("click",()=>{const A=q.dataset.togglePassword;if(!A)return;const u=t.querySelector(`#${A}`);if(!u)return;const I=u.type==="password";u.type=I?"text":"password";const D=A==="register-confirm-password",$=o(D?"auth.register.hideConfirmPassword":"auth.register.hidePassword"),Y=o(D?"auth.register.showConfirmPassword":"auth.register.showPassword");q.setAttribute("aria-label",I?$:Y),ge(q,u)});const ve=q.dataset.togglePassword;if(!ve)return;const oe=t.querySelector(`#${ve}`);oe&&ge(q,oe)}),O?.addEventListener("submit",q=>{if(q.preventDefault(),x?.disabled){w.firstName=!0,w.lastName=!0,w.email=!0,w.password=!0,w.confirmPassword=!0,ce();return}const ve={firstName:P?.value.trim()??"",lastName:V?.value.trim()??"",email:z?.value.trim()??"",password:M?.value??"",confirmPassword:G?.value??""};x.disabled=!0,H(o("auth.register.feedback.submitting"),"loading"),xt.register(ve).then(oe=>{if(H(o("auth.register.feedback.success"),"success"),i?.onRegistrationCompleted){i.onRegistrationCompleted(oe.userId);return}e="landing",r(),t.scrollTo({top:0,behavior:"auto"})}).catch(oe=>{if(!(oe instanceof yt)){H(o("auth.register.errors.generic"),"error"),ce();return}if(oe.code==="EMAIL_ALREADY_EXISTS"){w.email=!0,p.email=o("auth.register.errors.emailAlreadyExists"),ce();return}if(oe.code==="RATE_LIMITED"){H(o("auth.register.errors.rateLimited"),"error"),ce();return}if(oe.code==="VALIDATION_ERROR"&&oe.fieldErrors){[{apiField:"firstName",key:"firstName"},{apiField:"lastName",key:"lastName"},{apiField:"email",key:"email"},{apiField:"password",key:"password"},{apiField:"confirmPassword",key:"confirmPassword"}].forEach(({apiField:u,key:I})=>{const D=oe.fieldErrors?.[u];D&&(w[I]=!0,p[I]=W(D))}),ce();return}H(o("auth.register.errors.generic"),"error"),ce()})}),ce()};r(),vt(()=>r())}var Lt=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],ut={_disable:[],allowInput:!1,allowInvalidPreload:!1,altFormat:"F j, Y",altInput:!1,altInputClass:"form-control input",animate:typeof window=="object"&&window.navigator.userAgent.indexOf("MSIE")===-1,ariaDateFormat:"F j, Y",autoFillDefaultTime:!0,clickOpens:!0,closeOnSelect:!0,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:!1,enableSeconds:!1,enableTime:!1,errorHandler:function(t){return typeof console<"u"&&console.warn(t)},getWeek:function(t){var i=new Date(t.getTime());i.setHours(0,0,0,0),i.setDate(i.getDate()+3-(i.getDay()+6)%7);var e=new Date(i.getFullYear(),0,4);return 1+Math.round(((i.getTime()-e.getTime())/864e5-3+(e.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:!1,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:!1,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:!1,showMonths:1,static:!1,time_24hr:!1,weekNumbers:!1,wrap:!1},wt={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(t){var i=t%100;if(i>3&&i<21)return"th";switch(i%10){case 1:return"st";case 2:return"nd";case 3:return"rd";default:return"th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:!1},_e=function(t,i){return i===void 0&&(i=2),("000"+t).slice(i*-1)},Je=function(t){return t===!0?1:0};function Kt(t,i){var e;return function(){var r=this,h=arguments;clearTimeout(e),e=setTimeout(function(){return t.apply(r,h)},i)}}var Pt=function(t){return t instanceof Array?t:[t]};function Pe(t,i,e){if(e===!0)return t.classList.add(i);t.classList.remove(i)}function me(t,i,e){var r=window.document.createElement(t);return i=i||"",e=e||"",r.className=i,e!==void 0&&(r.textContent=e),r}function Ct(t){for(;t.firstChild;)t.removeChild(t.firstChild)}function ln(t,i){if(i(t))return t;if(t.parentNode)return ln(t.parentNode,i)}function St(t,i){var e=me("div","numInputWrapper"),r=me("input","numInput "+t),h=me("span","arrowUp"),d=me("span","arrowDown");if(navigator.userAgent.indexOf("MSIE 9.0")===-1?r.type="number":(r.type="text",r.pattern="\\d*"),i!==void 0)for(var s in i)r.setAttribute(s,i[s]);return e.appendChild(r),e.appendChild(h),e.appendChild(d),e}function Ye(t){try{if(typeof t.composedPath=="function"){var i=t.composedPath();return i[0]}return t.target}catch{return t.target}}var Nt=function(){},$t=function(t,i,e){return e.months[i?"shorthand":"longhand"][t]},An={D:Nt,F:function(t,i,e){t.setMonth(e.months.longhand.indexOf(i))},G:function(t,i){t.setHours((t.getHours()>=12?12:0)+parseFloat(i))},H:function(t,i){t.setHours(parseFloat(i))},J:function(t,i){t.setDate(parseFloat(i))},K:function(t,i,e){t.setHours(t.getHours()%12+12*Je(new RegExp(e.amPM[1],"i").test(i)))},M:function(t,i,e){t.setMonth(e.months.shorthand.indexOf(i))},S:function(t,i){t.setSeconds(parseFloat(i))},U:function(t,i){return new Date(parseFloat(i)*1e3)},W:function(t,i,e){var r=parseInt(i),h=new Date(t.getFullYear(),0,2+(r-1)*7,0,0,0,0);return h.setDate(h.getDate()-h.getDay()+e.firstDayOfWeek),h},Y:function(t,i){t.setFullYear(parseFloat(i))},Z:function(t,i){return new Date(i)},d:function(t,i){t.setDate(parseFloat(i))},h:function(t,i){t.setHours((t.getHours()>=12?12:0)+parseFloat(i))},i:function(t,i){t.setMinutes(parseFloat(i))},j:function(t,i){t.setDate(parseFloat(i))},l:Nt,m:function(t,i){t.setMonth(parseFloat(i)-1)},n:function(t,i){t.setMonth(parseFloat(i)-1)},s:function(t,i){t.setSeconds(parseFloat(i))},u:function(t,i){return new Date(parseFloat(i))},w:Nt,y:function(t,i){t.setFullYear(2e3+parseFloat(i))}},ct={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},ht={Z:function(t){return t.toISOString()},D:function(t,i,e){return i.weekdays.shorthand[ht.w(t,i,e)]},F:function(t,i,e){return $t(ht.n(t,i,e)-1,!1,i)},G:function(t,i,e){return _e(ht.h(t,i,e))},H:function(t){return _e(t.getHours())},J:function(t,i){return i.ordinal!==void 0?t.getDate()+i.ordinal(t.getDate()):t.getDate()},K:function(t,i){return i.amPM[Je(t.getHours()>11)]},M:function(t,i){return $t(t.getMonth(),!0,i)},S:function(t){return _e(t.getSeconds())},U:function(t){return t.getTime()/1e3},W:function(t,i,e){return e.getWeek(t)},Y:function(t){return _e(t.getFullYear(),4)},d:function(t){return _e(t.getDate())},h:function(t){return t.getHours()%12?t.getHours()%12:12},i:function(t){return _e(t.getMinutes())},j:function(t){return t.getDate()},l:function(t,i){return i.weekdays.longhand[t.getDay()]},m:function(t){return _e(t.getMonth()+1)},n:function(t){return t.getMonth()+1},s:function(t){return t.getSeconds()},u:function(t){return t.getTime()},w:function(t){return t.getDay()},y:function(t){return String(t.getFullYear()).substring(2)}},dn=function(t){var i=t.config,e=i===void 0?ut:i,r=t.l10n,h=r===void 0?wt:r,d=t.isMobile,s=d===void 0?!1:d;return function(l,k,O){var m=O||h;return e.formatDate!==void 0&&!s?e.formatDate(l,k,m):k.split("").map(function(x,P,V){return ht[x]&&V[P-1]!=="\\"?ht[x](l,m,e):x!=="\\"?x:""}).join("")}},qt=function(t){var i=t.config,e=i===void 0?ut:i,r=t.l10n,h=r===void 0?wt:r;return function(d,s,l,k){if(!(d!==0&&!d)){var O=k||h,m,x=d;if(d instanceof Date)m=new Date(d.getTime());else if(typeof d!="string"&&d.toFixed!==void 0)m=new Date(d);else if(typeof d=="string"){var P=s||(e||ut).dateFormat,V=String(d).trim();if(V==="today")m=new Date,l=!0;else if(e&&e.parseDate)m=e.parseDate(d,P);else if(/Z$/.test(V)||/GMT$/.test(V))m=new Date(d);else{for(var z=void 0,M=[],G=0,U=0,ne="";G<P.length;G++){var T=P[G],ee=T==="\\",te=P[G-1]==="\\"||ee;if(ct[T]&&!te){ne+=ct[T];var ae=new RegExp(ne).exec(d);ae&&(z=!0)&&M[T!=="Y"?"push":"unshift"]({fn:An[T],val:ae[++U]})}else ee||(ne+=".")}m=!e||!e.noCalendar?new Date(new Date().getFullYear(),0,1,0,0,0,0):new Date(new Date().setHours(0,0,0,0)),M.forEach(function(Z){var re=Z.fn,w=Z.val;return m=re(m,w,O)||m}),m=z?m:void 0}}if(!(m instanceof Date&&!isNaN(m.getTime()))){e.errorHandler(new Error("Invalid date provided: "+x));return}return l===!0&&m.setHours(0,0,0,0),m}}};function Ue(t,i,e){return e===void 0&&(e=!0),e!==!1?new Date(t.getTime()).setHours(0,0,0,0)-new Date(i.getTime()).setHours(0,0,0,0):t.getTime()-i.getTime()}var In=function(t,i,e){return t>Math.min(i,e)&&t<Math.max(i,e)},Ot=function(t,i,e){return t*3600+i*60+e},Dn=function(t){var i=Math.floor(t/3600),e=(t-i*3600)/60;return[i,e,t-i*3600-e*60]},xn={DAY:864e5};function Ft(t){var i=t.defaultHour,e=t.defaultMinute,r=t.defaultSeconds;if(t.minDate!==void 0){var h=t.minDate.getHours(),d=t.minDate.getMinutes(),s=t.minDate.getSeconds();i<h&&(i=h),i===h&&e<d&&(e=d),i===h&&e===d&&r<s&&(r=t.minDate.getSeconds())}if(t.maxDate!==void 0){var l=t.maxDate.getHours(),k=t.maxDate.getMinutes();i=Math.min(i,l),i===l&&(e=Math.min(k,e)),i===l&&e===k&&(r=t.maxDate.getSeconds())}return{hours:i,minutes:e,seconds:r}}typeof Object.assign!="function"&&(Object.assign=function(t){for(var i=[],e=1;e<arguments.length;e++)i[e-1]=arguments[e];if(!t)throw TypeError("Cannot convert undefined or null to object");for(var r=function(l){l&&Object.keys(l).forEach(function(k){return t[k]=l[k]})},h=0,d=i;h<d.length;h++){var s=d[h];r(s)}return t});var Me=function(){return Me=Object.assign||function(t){for(var i,e=1,r=arguments.length;e<r;e++){i=arguments[e];for(var h in i)Object.prototype.hasOwnProperty.call(i,h)&&(t[h]=i[h])}return t},Me.apply(this,arguments)},Gt=function(){for(var t=0,i=0,e=arguments.length;i<e;i++)t+=arguments[i].length;for(var r=Array(t),h=0,i=0;i<e;i++)for(var d=arguments[i],s=0,l=d.length;s<l;s++,h++)r[h]=d[s];return r},$n=300;function Tn(t,i){var e={config:Me(Me({},ut),Se.defaultConfig),l10n:wt};e.parseDate=qt({config:e.config,l10n:e.l10n}),e._handlers=[],e.pluginElements=[],e.loadedPlugins=[],e._bind=M,e._setHoursFromDate=P,e._positionCalendar=et,e.changeMonth=ve,e.changeYear=$,e.clear=oe,e.close=A,e.onMouseOver=Ie,e._createElement=me,e.createDay=ae,e.destroy=u,e.isEnabled=Y,e.jumpToDate=ne,e.updateValue=qe,e.open=ke,e.redraw=v,e.set=j,e.setDate=Fe,e.toggle=it;function r(){e.utils={getDaysInMonth:function(n,a){return n===void 0&&(n=e.currentMonth),a===void 0&&(a=e.currentYear),n===1&&(a%4===0&&a%100!==0||a%400===0)?29:e.l10n.daysInMonth[n]}}}function h(){e.element=e.input=t,e.isOpen=!1,ye(),Oe(),Ve(),De(),r(),e.isMobile||te(),U(),(e.selectedDates.length||e.config.noCalendar)&&(e.config.enableTime&&P(e.config.noCalendar?e.latestSelectedDateObj:void 0),qe(!1)),l();var n=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!e.isMobile&&n&&et(),ie("onReady")}function d(){var n;return((n=e.calendarContainer)===null||n===void 0?void 0:n.getRootNode()).activeElement||document.activeElement}function s(n){return n.bind(e)}function l(){var n=e.config;n.weekNumbers===!1&&n.showMonths===1||n.noCalendar!==!0&&window.requestAnimationFrame(function(){if(e.calendarContainer!==void 0&&(e.calendarContainer.style.visibility="hidden",e.calendarContainer.style.display="block"),e.daysContainer!==void 0){var a=(e.days.offsetWidth+1)*n.showMonths;e.daysContainer.style.width=a+"px",e.calendarContainer.style.width=a+(e.weekWrapper!==void 0?e.weekWrapper.offsetWidth:0)+"px",e.calendarContainer.style.removeProperty("visibility"),e.calendarContainer.style.removeProperty("display")}})}function k(n){if(e.selectedDates.length===0){var a=e.config.minDate===void 0||Ue(new Date,e.config.minDate)>=0?new Date:new Date(e.config.minDate.getTime()),c=Ft(e.config);a.setHours(c.hours,c.minutes,c.seconds,a.getMilliseconds()),e.selectedDates=[a],e.latestSelectedDateObj=a}n!==void 0&&n.type!=="blur"&&dt(n);var f=e._input.value;x(),qe(),e._input.value!==f&&e._debouncedChange()}function O(n,a){return n%12+12*Je(a===e.l10n.amPM[1])}function m(n){switch(n%24){case 0:case 12:return 12;default:return n%12}}function x(){if(!(e.hourElement===void 0||e.minuteElement===void 0)){var n=(parseInt(e.hourElement.value.slice(-2),10)||0)%24,a=(parseInt(e.minuteElement.value,10)||0)%60,c=e.secondElement!==void 0?(parseInt(e.secondElement.value,10)||0)%60:0;e.amPM!==void 0&&(n=O(n,e.amPM.textContent));var f=e.config.minTime!==void 0||e.config.minDate&&e.minDateHasTime&&e.latestSelectedDateObj&&Ue(e.latestSelectedDateObj,e.config.minDate,!0)===0,S=e.config.maxTime!==void 0||e.config.maxDate&&e.maxDateHasTime&&e.latestSelectedDateObj&&Ue(e.latestSelectedDateObj,e.config.maxDate,!0)===0;if(e.config.maxTime!==void 0&&e.config.minTime!==void 0&&e.config.minTime>e.config.maxTime){var E=Ot(e.config.minTime.getHours(),e.config.minTime.getMinutes(),e.config.minTime.getSeconds()),_=Ot(e.config.maxTime.getHours(),e.config.maxTime.getMinutes(),e.config.maxTime.getSeconds()),L=Ot(n,a,c);if(L>_&&L<E){var K=Dn(E);n=K[0],a=K[1],c=K[2]}}else{if(S){var N=e.config.maxTime!==void 0?e.config.maxTime:e.config.maxDate;n=Math.min(n,N.getHours()),n===N.getHours()&&(a=Math.min(a,N.getMinutes())),a===N.getMinutes()&&(c=Math.min(c,N.getSeconds()))}if(f){var B=e.config.minTime!==void 0?e.config.minTime:e.config.minDate;n=Math.max(n,B.getHours()),n===B.getHours()&&a<B.getMinutes()&&(a=B.getMinutes()),a===B.getMinutes()&&(c=Math.max(c,B.getSeconds()))}}V(n,a,c)}}function P(n){var a=n||e.latestSelectedDateObj;a&&a instanceof Date&&V(a.getHours(),a.getMinutes(),a.getSeconds())}function V(n,a,c){e.latestSelectedDateObj!==void 0&&e.latestSelectedDateObj.setHours(n%24,a,c||0,0),!(!e.hourElement||!e.minuteElement||e.isMobile)&&(e.hourElement.value=_e(e.config.time_24hr?n:(12+n)%12+12*Je(n%12===0)),e.minuteElement.value=_e(a),e.amPM!==void 0&&(e.amPM.textContent=e.l10n.amPM[Je(n>=12)]),e.secondElement!==void 0&&(e.secondElement.value=_e(c)))}function z(n){var a=Ye(n),c=parseInt(a.value)+(n.delta||0);(c/1e3>1||n.key==="Enter"&&!/[^\d]/.test(c.toString()))&&$(c)}function M(n,a,c,f){if(a instanceof Array)return a.forEach(function(S){return M(n,S,c,f)});if(n instanceof Array)return n.forEach(function(S){return M(S,a,c,f)});n.addEventListener(a,c,f),e._handlers.push({remove:function(){return n.removeEventListener(a,c,f)}})}function G(){ie("onChange")}function U(){if(e.config.wrap&&["open","close","toggle","clear"].forEach(function(c){Array.prototype.forEach.call(e.element.querySelectorAll("[data-"+c+"]"),function(f){return M(f,"click",e[c])})}),e.isMobile){Ze();return}var n=Kt(Ne,50);if(e._debouncedChange=Kt(G,$n),e.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&M(e.daysContainer,"mouseover",function(c){e.config.mode==="range"&&Ie(Ye(c))}),M(e._input,"keydown",be),e.calendarContainer!==void 0&&M(e.calendarContainer,"keydown",be),!e.config.inline&&!e.config.static&&M(window,"resize",n),window.ontouchstart!==void 0?M(window.document,"touchstart",D):M(window.document,"mousedown",D),M(window.document,"focus",D,{capture:!0}),e.config.clickOpens===!0&&(M(e._input,"focus",e.open),M(e._input,"click",e.open)),e.daysContainer!==void 0&&(M(e.monthNav,"click",rt),M(e.monthNav,["keyup","increment"],z),M(e.daysContainer,"click",g)),e.timeContainer!==void 0&&e.minuteElement!==void 0&&e.hourElement!==void 0){var a=function(c){return Ye(c).select()};M(e.timeContainer,["increment"],k),M(e.timeContainer,"blur",k,{capture:!0}),M(e.timeContainer,"click",T),M([e.hourElement,e.minuteElement],["focus","click"],a),e.secondElement!==void 0&&M(e.secondElement,"focus",function(){return e.secondElement&&e.secondElement.select()}),e.amPM!==void 0&&M(e.amPM,"click",function(c){k(c)})}e.config.allowInput&&M(e._input,"blur",J)}function ne(n,a){var c=n!==void 0?e.parseDate(n):e.latestSelectedDateObj||(e.config.minDate&&e.config.minDate>e.now?e.config.minDate:e.config.maxDate&&e.config.maxDate<e.now?e.config.maxDate:e.now),f=e.currentYear,S=e.currentMonth;try{c!==void 0&&(e.currentYear=c.getFullYear(),e.currentMonth=c.getMonth())}catch(E){E.message="Invalid date supplied: "+c,e.config.errorHandler(E)}a&&e.currentYear!==f&&(ie("onYearChange"),Q()),a&&(e.currentYear!==f||e.currentMonth!==S)&&ie("onMonthChange"),e.redraw()}function T(n){var a=Ye(n);~a.className.indexOf("arrow")&&ee(n,a.classList.contains("arrowUp")?1:-1)}function ee(n,a,c){var f=n&&Ye(n),S=c||f&&f.parentNode&&f.parentNode.firstChild,E=Re("increment");E.delta=a,S&&S.dispatchEvent(E)}function te(){var n=window.document.createDocumentFragment();if(e.calendarContainer=me("div","flatpickr-calendar"),e.calendarContainer.tabIndex=-1,!e.config.noCalendar){if(n.appendChild(W()),e.innerContainer=me("div","flatpickr-innerContainer"),e.config.weekNumbers){var a=q(),c=a.weekWrapper,f=a.weekNumbers;e.innerContainer.appendChild(c),e.weekNumbers=f,e.weekWrapper=c}e.rContainer=me("div","flatpickr-rContainer"),e.rContainer.appendChild(ce()),e.daysContainer||(e.daysContainer=me("div","flatpickr-days"),e.daysContainer.tabIndex=-1),F(),e.rContainer.appendChild(e.daysContainer),e.innerContainer.appendChild(e.rContainer),n.appendChild(e.innerContainer)}e.config.enableTime&&n.appendChild(ge()),Pe(e.calendarContainer,"rangeMode",e.config.mode==="range"),Pe(e.calendarContainer,"animate",e.config.animate===!0),Pe(e.calendarContainer,"multiMonth",e.config.showMonths>1),e.calendarContainer.appendChild(n);var S=e.config.appendTo!==void 0&&e.config.appendTo.nodeType!==void 0;if((e.config.inline||e.config.static)&&(e.calendarContainer.classList.add(e.config.inline?"inline":"static"),e.config.inline&&(!S&&e.element.parentNode?e.element.parentNode.insertBefore(e.calendarContainer,e._input.nextSibling):e.config.appendTo!==void 0&&e.config.appendTo.appendChild(e.calendarContainer)),e.config.static)){var E=me("div","flatpickr-wrapper");e.element.parentNode&&e.element.parentNode.insertBefore(E,e.element),E.appendChild(e.element),e.altInput&&E.appendChild(e.altInput),E.appendChild(e.calendarContainer)}!e.config.static&&!e.config.inline&&(e.config.appendTo!==void 0?e.config.appendTo:window.document.body).appendChild(e.calendarContainer)}function ae(n,a,c,f){var S=Y(a,!0),E=me("span",n,a.getDate().toString());return E.dateObj=a,E.$i=f,E.setAttribute("aria-label",e.formatDate(a,e.config.ariaDateFormat)),n.indexOf("hidden")===-1&&Ue(a,e.now)===0&&(e.todayDateElem=E,E.classList.add("today"),E.setAttribute("aria-current","date")),S?(E.tabIndex=-1,tt(a)&&(E.classList.add("selected"),e.selectedDateElem=E,e.config.mode==="range"&&(Pe(E,"startRange",e.selectedDates[0]&&Ue(a,e.selectedDates[0],!0)===0),Pe(E,"endRange",e.selectedDates[1]&&Ue(a,e.selectedDates[1],!0)===0),n==="nextMonthDay"&&E.classList.add("inRange")))):E.classList.add("flatpickr-disabled"),e.config.mode==="range"&&lt(a)&&!tt(a)&&E.classList.add("inRange"),e.weekNumbers&&e.config.showMonths===1&&n!=="prevMonthDay"&&f%7===6&&e.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+e.config.getWeek(a)+"</span>"),ie("onDayCreate",E),E}function Z(n){n.focus(),e.config.mode==="range"&&Ie(n)}function re(n){for(var a=n>0?0:e.config.showMonths-1,c=n>0?e.config.showMonths:-1,f=a;f!=c;f+=n)for(var S=e.daysContainer.children[f],E=n>0?0:S.children.length-1,_=n>0?S.children.length:-1,L=E;L!=_;L+=n){var K=S.children[L];if(K.className.indexOf("hidden")===-1&&Y(K.dateObj))return K}}function w(n,a){for(var c=n.className.indexOf("Month")===-1?n.dateObj.getMonth():e.currentMonth,f=a>0?e.config.showMonths:-1,S=a>0?1:-1,E=c-e.currentMonth;E!=f;E+=S)for(var _=e.daysContainer.children[E],L=c-e.currentMonth===E?n.$i+a:a<0?_.children.length-1:0,K=_.children.length,N=L;N>=0&&N<K&&N!=(a>0?K:-1);N+=S){var B=_.children[N];if(B.className.indexOf("hidden")===-1&&Y(B.dateObj)&&Math.abs(n.$i-N)>=Math.abs(a))return Z(B)}e.changeMonth(S),p(re(S),0)}function p(n,a){var c=d(),f=Ae(c||document.body),S=n!==void 0?n:f?c:e.selectedDateElem!==void 0&&Ae(e.selectedDateElem)?e.selectedDateElem:e.todayDateElem!==void 0&&Ae(e.todayDateElem)?e.todayDateElem:re(a>0?1:-1);S===void 0?e._input.focus():f?w(S,a):Z(S)}function y(n,a){for(var c=(new Date(n,a,1).getDay()-e.l10n.firstDayOfWeek+7)%7,f=e.utils.getDaysInMonth((a-1+12)%12,n),S=e.utils.getDaysInMonth(a,n),E=window.document.createDocumentFragment(),_=e.config.showMonths>1,L=_?"prevMonthDay hidden":"prevMonthDay",K=_?"nextMonthDay hidden":"nextMonthDay",N=f+1-c,B=0;N<=f;N++,B++)E.appendChild(ae("flatpickr-day "+L,new Date(n,a-1,N),N,B));for(N=1;N<=S;N++,B++)E.appendChild(ae("flatpickr-day",new Date(n,a,N),N,B));for(var le=S+1;le<=42-c&&(e.config.showMonths===1||B%7!==0);le++,B++)E.appendChild(ae("flatpickr-day "+K,new Date(n,a+1,le%S),le,B));var Ce=me("div","dayContainer");return Ce.appendChild(E),Ce}function F(){if(e.daysContainer!==void 0){Ct(e.daysContainer),e.weekNumbers&&Ct(e.weekNumbers);for(var n=document.createDocumentFragment(),a=0;a<e.config.showMonths;a++){var c=new Date(e.currentYear,e.currentMonth,1);c.setMonth(e.currentMonth+a),n.appendChild(y(c.getFullYear(),c.getMonth()))}e.daysContainer.appendChild(n),e.days=e.daysContainer.firstChild,e.config.mode==="range"&&e.selectedDates.length===1&&Ie()}}function Q(){if(!(e.config.showMonths>1||e.config.monthSelectorType!=="dropdown")){var n=function(f){return e.config.minDate!==void 0&&e.currentYear===e.config.minDate.getFullYear()&&f<e.config.minDate.getMonth()?!1:!(e.config.maxDate!==void 0&&e.currentYear===e.config.maxDate.getFullYear()&&f>e.config.maxDate.getMonth())};e.monthsDropdownContainer.tabIndex=-1,e.monthsDropdownContainer.innerHTML="";for(var a=0;a<12;a++)if(n(a)){var c=me("option","flatpickr-monthDropdown-month");c.value=new Date(e.currentYear,a).getMonth().toString(),c.textContent=$t(a,e.config.shorthandCurrentMonth,e.l10n),c.tabIndex=-1,e.currentMonth===a&&(c.selected=!0),e.monthsDropdownContainer.appendChild(c)}}}function se(){var n=me("div","flatpickr-month"),a=window.document.createDocumentFragment(),c;e.config.showMonths>1||e.config.monthSelectorType==="static"?c=me("span","cur-month"):(e.monthsDropdownContainer=me("select","flatpickr-monthDropdown-months"),e.monthsDropdownContainer.setAttribute("aria-label",e.l10n.monthAriaLabel),M(e.monthsDropdownContainer,"change",function(_){var L=Ye(_),K=parseInt(L.value,10);e.changeMonth(K-e.currentMonth),ie("onMonthChange")}),Q(),c=e.monthsDropdownContainer);var f=St("cur-year",{tabindex:"-1"}),S=f.getElementsByTagName("input")[0];S.setAttribute("aria-label",e.l10n.yearAriaLabel),e.config.minDate&&S.setAttribute("min",e.config.minDate.getFullYear().toString()),e.config.maxDate&&(S.setAttribute("max",e.config.maxDate.getFullYear().toString()),S.disabled=!!e.config.minDate&&e.config.minDate.getFullYear()===e.config.maxDate.getFullYear());var E=me("div","flatpickr-current-month");return E.appendChild(c),E.appendChild(f),a.appendChild(E),n.appendChild(a),{container:n,yearElement:S,monthElement:c}}function R(){Ct(e.monthNav),e.monthNav.appendChild(e.prevMonthNav),e.config.showMonths&&(e.yearElements=[],e.monthElements=[]);for(var n=e.config.showMonths;n--;){var a=se();e.yearElements.push(a.yearElement),e.monthElements.push(a.monthElement),e.monthNav.appendChild(a.container)}e.monthNav.appendChild(e.nextMonthNav)}function W(){return e.monthNav=me("div","flatpickr-months"),e.yearElements=[],e.monthElements=[],e.prevMonthNav=me("span","flatpickr-prev-month"),e.prevMonthNav.innerHTML=e.config.prevArrow,e.nextMonthNav=me("span","flatpickr-next-month"),e.nextMonthNav.innerHTML=e.config.nextArrow,R(),Object.defineProperty(e,"_hidePrevMonthArrow",{get:function(){return e.__hidePrevMonthArrow},set:function(n){e.__hidePrevMonthArrow!==n&&(Pe(e.prevMonthNav,"flatpickr-disabled",n),e.__hidePrevMonthArrow=n)}}),Object.defineProperty(e,"_hideNextMonthArrow",{get:function(){return e.__hideNextMonthArrow},set:function(n){e.__hideNextMonthArrow!==n&&(Pe(e.nextMonthNav,"flatpickr-disabled",n),e.__hideNextMonthArrow=n)}}),e.currentYearElement=e.yearElements[0],Xe(),e.monthNav}function ge(){e.calendarContainer.classList.add("hasTime"),e.config.noCalendar&&e.calendarContainer.classList.add("noCalendar");var n=Ft(e.config);e.timeContainer=me("div","flatpickr-time"),e.timeContainer.tabIndex=-1;var a=me("span","flatpickr-time-separator",":"),c=St("flatpickr-hour",{"aria-label":e.l10n.hourAriaLabel});e.hourElement=c.getElementsByTagName("input")[0];var f=St("flatpickr-minute",{"aria-label":e.l10n.minuteAriaLabel});if(e.minuteElement=f.getElementsByTagName("input")[0],e.hourElement.tabIndex=e.minuteElement.tabIndex=-1,e.hourElement.value=_e(e.latestSelectedDateObj?e.latestSelectedDateObj.getHours():e.config.time_24hr?n.hours:m(n.hours)),e.minuteElement.value=_e(e.latestSelectedDateObj?e.latestSelectedDateObj.getMinutes():n.minutes),e.hourElement.setAttribute("step",e.config.hourIncrement.toString()),e.minuteElement.setAttribute("step",e.config.minuteIncrement.toString()),e.hourElement.setAttribute("min",e.config.time_24hr?"0":"1"),e.hourElement.setAttribute("max",e.config.time_24hr?"23":"12"),e.hourElement.setAttribute("maxlength","2"),e.minuteElement.setAttribute("min","0"),e.minuteElement.setAttribute("max","59"),e.minuteElement.setAttribute("maxlength","2"),e.timeContainer.appendChild(c),e.timeContainer.appendChild(a),e.timeContainer.appendChild(f),e.config.time_24hr&&e.timeContainer.classList.add("time24hr"),e.config.enableSeconds){e.timeContainer.classList.add("hasSeconds");var S=St("flatpickr-second");e.secondElement=S.getElementsByTagName("input")[0],e.secondElement.value=_e(e.latestSelectedDateObj?e.latestSelectedDateObj.getSeconds():n.seconds),e.secondElement.setAttribute("step",e.minuteElement.getAttribute("step")),e.secondElement.setAttribute("min","0"),e.secondElement.setAttribute("max","59"),e.secondElement.setAttribute("maxlength","2"),e.timeContainer.appendChild(me("span","flatpickr-time-separator",":")),e.timeContainer.appendChild(S)}return e.config.time_24hr||(e.amPM=me("span","flatpickr-am-pm",e.l10n.amPM[Je((e.latestSelectedDateObj?e.hourElement.value:e.config.defaultHour)>11)]),e.amPM.title=e.l10n.toggleTitle,e.amPM.tabIndex=-1,e.timeContainer.appendChild(e.amPM)),e.timeContainer}function ce(){e.weekdayContainer?Ct(e.weekdayContainer):e.weekdayContainer=me("div","flatpickr-weekdays");for(var n=e.config.showMonths;n--;){var a=me("div","flatpickr-weekdaycontainer");e.weekdayContainer.appendChild(a)}return he(),e.weekdayContainer}function he(){if(e.weekdayContainer){var n=e.l10n.firstDayOfWeek,a=Gt(e.l10n.weekdays.shorthand);n>0&&n<a.length&&(a=Gt(a.splice(n,a.length),a.splice(0,n)));for(var c=e.config.showMonths;c--;)e.weekdayContainer.children[c].innerHTML=`
      <span class='flatpickr-weekday'>
        `+a.join("</span><span class='flatpickr-weekday'>")+`
      </span>
      `}}function q(){e.calendarContainer.classList.add("hasWeeks");var n=me("div","flatpickr-weekwrapper");n.appendChild(me("span","flatpickr-weekday",e.l10n.weekAbbreviation));var a=me("div","flatpickr-weeks");return n.appendChild(a),{weekWrapper:n,weekNumbers:a}}function ve(n,a){a===void 0&&(a=!0);var c=a?n:n-e.currentMonth;c<0&&e._hidePrevMonthArrow===!0||c>0&&e._hideNextMonthArrow===!0||(e.currentMonth+=c,(e.currentMonth<0||e.currentMonth>11)&&(e.currentYear+=e.currentMonth>11?1:-1,e.currentMonth=(e.currentMonth+12)%12,ie("onYearChange"),Q()),F(),ie("onMonthChange"),Xe())}function oe(n,a){if(n===void 0&&(n=!0),a===void 0&&(a=!0),e.input.value="",e.altInput!==void 0&&(e.altInput.value=""),e.mobileInput!==void 0&&(e.mobileInput.value=""),e.selectedDates=[],e.latestSelectedDateObj=void 0,a===!0&&(e.currentYear=e._initialDate.getFullYear(),e.currentMonth=e._initialDate.getMonth()),e.config.enableTime===!0){var c=Ft(e.config),f=c.hours,S=c.minutes,E=c.seconds;V(f,S,E)}e.redraw(),n&&ie("onChange")}function A(){e.isOpen=!1,e.isMobile||(e.calendarContainer!==void 0&&e.calendarContainer.classList.remove("open"),e._input!==void 0&&e._input.classList.remove("active")),ie("onClose")}function u(){e.config!==void 0&&ie("onDestroy");for(var n=e._handlers.length;n--;)e._handlers[n].remove();if(e._handlers=[],e.mobileInput)e.mobileInput.parentNode&&e.mobileInput.parentNode.removeChild(e.mobileInput),e.mobileInput=void 0;else if(e.calendarContainer&&e.calendarContainer.parentNode)if(e.config.static&&e.calendarContainer.parentNode){var a=e.calendarContainer.parentNode;if(a.lastChild&&a.removeChild(a.lastChild),a.parentNode){for(;a.firstChild;)a.parentNode.insertBefore(a.firstChild,a);a.parentNode.removeChild(a)}}else e.calendarContainer.parentNode.removeChild(e.calendarContainer);e.altInput&&(e.input.type="text",e.altInput.parentNode&&e.altInput.parentNode.removeChild(e.altInput),delete e.altInput),e.input&&(e.input.type=e.input._type,e.input.classList.remove("flatpickr-input"),e.input.removeAttribute("readonly")),["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach(function(c){try{delete e[c]}catch{}})}function I(n){return e.calendarContainer.contains(n)}function D(n){if(e.isOpen&&!e.config.inline){var a=Ye(n),c=I(a),f=a===e.input||a===e.altInput||e.element.contains(a)||n.path&&n.path.indexOf&&(~n.path.indexOf(e.input)||~n.path.indexOf(e.altInput)),S=!f&&!c&&!I(n.relatedTarget),E=!e.config.ignoredFocusElements.some(function(_){return _.contains(a)});S&&E&&(e.config.allowInput&&e.setDate(e._input.value,!1,e.config.altInput?e.config.altFormat:e.config.dateFormat),e.timeContainer!==void 0&&e.minuteElement!==void 0&&e.hourElement!==void 0&&e.input.value!==""&&e.input.value!==void 0&&k(),e.close(),e.config&&e.config.mode==="range"&&e.selectedDates.length===1&&e.clear(!1))}}function $(n){if(!(!n||e.config.minDate&&n<e.config.minDate.getFullYear()||e.config.maxDate&&n>e.config.maxDate.getFullYear())){var a=n,c=e.currentYear!==a;e.currentYear=a||e.currentYear,e.config.maxDate&&e.currentYear===e.config.maxDate.getFullYear()?e.currentMonth=Math.min(e.config.maxDate.getMonth(),e.currentMonth):e.config.minDate&&e.currentYear===e.config.minDate.getFullYear()&&(e.currentMonth=Math.max(e.config.minDate.getMonth(),e.currentMonth)),c&&(e.redraw(),ie("onYearChange"),Q())}}function Y(n,a){var c;a===void 0&&(a=!0);var f=e.parseDate(n,void 0,a);if(e.config.minDate&&f&&Ue(f,e.config.minDate,a!==void 0?a:!e.minDateHasTime)<0||e.config.maxDate&&f&&Ue(f,e.config.maxDate,a!==void 0?a:!e.maxDateHasTime)>0)return!1;if(!e.config.enable&&e.config.disable.length===0)return!0;if(f===void 0)return!1;for(var S=!!e.config.enable,E=(c=e.config.enable)!==null&&c!==void 0?c:e.config.disable,_=0,L=void 0;_<E.length;_++){if(L=E[_],typeof L=="function"&&L(f))return S;if(L instanceof Date&&f!==void 0&&L.getTime()===f.getTime())return S;if(typeof L=="string"){var K=e.parseDate(L,void 0,!0);return K&&K.getTime()===f.getTime()?S:!S}else if(typeof L=="object"&&f!==void 0&&L.from&&L.to&&f.getTime()>=L.from.getTime()&&f.getTime()<=L.to.getTime())return S}return!S}function Ae(n){return e.daysContainer!==void 0?n.className.indexOf("hidden")===-1&&n.className.indexOf("flatpickr-disabled")===-1&&e.daysContainer.contains(n):!1}function J(n){var a=n.target===e._input,c=e._input.value.trimEnd()!==ot();a&&c&&!(n.relatedTarget&&I(n.relatedTarget))&&e.setDate(e._input.value,!0,n.target===e.altInput?e.config.altFormat:e.config.dateFormat)}function be(n){var a=Ye(n),c=e.config.wrap?t.contains(a):a===e._input,f=e.config.allowInput,S=e.isOpen&&(!f||!c),E=e.config.inline&&c&&!f;if(n.keyCode===13&&c){if(f)return e.setDate(e._input.value,!0,a===e.altInput?e.config.altFormat:e.config.dateFormat),e.close(),a.blur();e.open()}else if(I(a)||S||E){var _=!!e.timeContainer&&e.timeContainer.contains(a);switch(n.keyCode){case 13:_?(n.preventDefault(),k(),b()):g(n);break;case 27:n.preventDefault(),b();break;case 8:case 46:c&&!e.config.allowInput&&(n.preventDefault(),e.clear());break;case 37:case 39:if(!_&&!c){n.preventDefault();var L=d();if(e.daysContainer!==void 0&&(f===!1||L&&Ae(L))){var K=n.keyCode===39?1:-1;n.ctrlKey?(n.stopPropagation(),ve(K),p(re(1),0)):p(void 0,K)}}else e.hourElement&&e.hourElement.focus();break;case 38:case 40:n.preventDefault();var N=n.keyCode===40?1:-1;e.daysContainer&&a.$i!==void 0||a===e.input||a===e.altInput?n.ctrlKey?(n.stopPropagation(),$(e.currentYear-N),p(re(1),0)):_||p(void 0,N*7):a===e.currentYearElement?$(e.currentYear-N):e.config.enableTime&&(!_&&e.hourElement&&e.hourElement.focus(),k(n),e._debouncedChange());break;case 9:if(_){var B=[e.hourElement,e.minuteElement,e.secondElement,e.amPM].concat(e.pluginElements).filter(function(ue){return ue}),le=B.indexOf(a);if(le!==-1){var Ce=B[le+(n.shiftKey?-1:1)];n.preventDefault(),(Ce||e._input).focus()}}else!e.config.noCalendar&&e.daysContainer&&e.daysContainer.contains(a)&&n.shiftKey&&(n.preventDefault(),e._input.focus());break}}if(e.amPM!==void 0&&a===e.amPM)switch(n.key){case e.l10n.amPM[0].charAt(0):case e.l10n.amPM[0].charAt(0).toLowerCase():e.amPM.textContent=e.l10n.amPM[0],x(),qe();break;case e.l10n.amPM[1].charAt(0):case e.l10n.amPM[1].charAt(0).toLowerCase():e.amPM.textContent=e.l10n.amPM[1],x(),qe();break}(c||I(a))&&ie("onKeyDown",n)}function Ie(n,a){if(a===void 0&&(a="flatpickr-day"),!(e.selectedDates.length!==1||n&&(!n.classList.contains(a)||n.classList.contains("flatpickr-disabled")))){for(var c=n?n.dateObj.getTime():e.days.firstElementChild.dateObj.getTime(),f=e.parseDate(e.selectedDates[0],void 0,!0).getTime(),S=Math.min(c,e.selectedDates[0].getTime()),E=Math.max(c,e.selectedDates[0].getTime()),_=!1,L=0,K=0,N=S;N<E;N+=xn.DAY)Y(new Date(N),!0)||(_=_||N>S&&N<E,N<f&&(!L||N>L)?L=N:N>f&&(!K||N<K)&&(K=N));var B=Array.from(e.rContainer.querySelectorAll("*:nth-child(-n+"+e.config.showMonths+") > ."+a));B.forEach(function(le){var Ce=le.dateObj,ue=Ce.getTime(),ze=L>0&&ue<L||K>0&&ue>K;if(ze){le.classList.add("notAllowed"),["inRange","startRange","endRange"].forEach(function(Te){le.classList.remove(Te)});return}else if(_&&!ze)return;["startRange","inRange","endRange","notAllowed"].forEach(function(Te){le.classList.remove(Te)}),n!==void 0&&(n.classList.add(c<=e.selectedDates[0].getTime()?"startRange":"endRange"),f<c&&ue===f?le.classList.add("startRange"):f>c&&ue===f&&le.classList.add("endRange"),ue>=L&&(K===0||ue<=K)&&In(ue,f,c)&&le.classList.add("inRange"))})}}function Ne(){e.isOpen&&!e.config.static&&!e.config.inline&&et()}function ke(n,a){if(a===void 0&&(a=e._positionElement),e.isMobile===!0){if(n){n.preventDefault();var c=Ye(n);c&&c.blur()}e.mobileInput!==void 0&&(e.mobileInput.focus(),e.mobileInput.click()),ie("onOpen");return}else if(e._input.disabled||e.config.inline)return;var f=e.isOpen;e.isOpen=!0,f||(e.calendarContainer.classList.add("open"),e._input.classList.add("active"),ie("onOpen"),et(a)),e.config.enableTime===!0&&e.config.noCalendar===!0&&e.config.allowInput===!1&&(n===void 0||!e.timeContainer.contains(n.relatedTarget))&&setTimeout(function(){return e.hourElement.select()},50)}function de(n){return function(a){var c=e.config["_"+n+"Date"]=e.parseDate(a,e.config.dateFormat),f=e.config["_"+(n==="min"?"max":"min")+"Date"];c!==void 0&&(e[n==="min"?"minDateHasTime":"maxDateHasTime"]=c.getHours()>0||c.getMinutes()>0||c.getSeconds()>0),e.selectedDates&&(e.selectedDates=e.selectedDates.filter(function(S){return Y(S)}),!e.selectedDates.length&&n==="min"&&P(c),qe()),e.daysContainer&&(v(),c!==void 0?e.currentYearElement[n]=c.getFullYear().toString():e.currentYearElement.removeAttribute(n),e.currentYearElement.disabled=!!f&&c!==void 0&&f.getFullYear()===c.getFullYear())}}function ye(){var n=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],a=Me(Me({},JSON.parse(JSON.stringify(t.dataset||{}))),i),c={};e.config.parseDate=a.parseDate,e.config.formatDate=a.formatDate,Object.defineProperty(e.config,"enable",{get:function(){return e.config._enable},set:function(B){e.config._enable=Be(B)}}),Object.defineProperty(e.config,"disable",{get:function(){return e.config._disable},set:function(B){e.config._disable=Be(B)}});var f=a.mode==="time";if(!a.dateFormat&&(a.enableTime||f)){var S=Se.defaultConfig.dateFormat||ut.dateFormat;c.dateFormat=a.noCalendar||f?"H:i"+(a.enableSeconds?":S":""):S+" H:i"+(a.enableSeconds?":S":"")}if(a.altInput&&(a.enableTime||f)&&!a.altFormat){var E=Se.defaultConfig.altFormat||ut.altFormat;c.altFormat=a.noCalendar||f?"h:i"+(a.enableSeconds?":S K":" K"):E+(" h:i"+(a.enableSeconds?":S":"")+" K")}Object.defineProperty(e.config,"minDate",{get:function(){return e.config._minDate},set:de("min")}),Object.defineProperty(e.config,"maxDate",{get:function(){return e.config._maxDate},set:de("max")});var _=function(B){return function(le){e.config[B==="min"?"_minTime":"_maxTime"]=e.parseDate(le,"H:i:S")}};Object.defineProperty(e.config,"minTime",{get:function(){return e.config._minTime},set:_("min")}),Object.defineProperty(e.config,"maxTime",{get:function(){return e.config._maxTime},set:_("max")}),a.mode==="time"&&(e.config.noCalendar=!0,e.config.enableTime=!0),Object.assign(e.config,c,a);for(var L=0;L<n.length;L++)e.config[n[L]]=e.config[n[L]]===!0||e.config[n[L]]==="true";Lt.filter(function(B){return e.config[B]!==void 0}).forEach(function(B){e.config[B]=Pt(e.config[B]||[]).map(s)}),e.isMobile=!e.config.disableMobile&&!e.config.inline&&e.config.mode==="single"&&!e.config.disable.length&&!e.config.enable&&!e.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(var L=0;L<e.config.plugins.length;L++){var K=e.config.plugins[L](e)||{};for(var N in K)Lt.indexOf(N)>-1?e.config[N]=Pt(K[N]).map(s).concat(e.config[N]):typeof a[N]>"u"&&(e.config[N]=K[N])}a.altInputClass||(e.config.altInputClass=Le().className+" "+e.config.altInputClass),ie("onParseConfig")}function Le(){return e.config.wrap?t.querySelector("[data-input]"):t}function Oe(){typeof e.config.locale!="object"&&typeof Se.l10ns[e.config.locale]>"u"&&e.config.errorHandler(new Error("flatpickr: invalid locale "+e.config.locale)),e.l10n=Me(Me({},Se.l10ns.default),typeof e.config.locale=="object"?e.config.locale:e.config.locale!=="default"?Se.l10ns[e.config.locale]:void 0),ct.D="("+e.l10n.weekdays.shorthand.join("|")+")",ct.l="("+e.l10n.weekdays.longhand.join("|")+")",ct.M="("+e.l10n.months.shorthand.join("|")+")",ct.F="("+e.l10n.months.longhand.join("|")+")",ct.K="("+e.l10n.amPM[0]+"|"+e.l10n.amPM[1]+"|"+e.l10n.amPM[0].toLowerCase()+"|"+e.l10n.amPM[1].toLowerCase()+")";var n=Me(Me({},i),JSON.parse(JSON.stringify(t.dataset||{})));n.time_24hr===void 0&&Se.defaultConfig.time_24hr===void 0&&(e.config.time_24hr=e.l10n.time_24hr),e.formatDate=dn(e),e.parseDate=qt({config:e.config,l10n:e.l10n})}function et(n){if(typeof e.config.position=="function")return void e.config.position(e,n);if(e.calendarContainer!==void 0){ie("onPreCalendarPosition");var a=n||e._positionElement,c=Array.prototype.reduce.call(e.calendarContainer.children,(function(vn,gn){return vn+gn.offsetHeight}),0),f=e.calendarContainer.offsetWidth,S=e.config.position.split(" "),E=S[0],_=S.length>1?S[1]:null,L=a.getBoundingClientRect(),K=window.innerHeight-L.bottom,N=E==="above"||E!=="below"&&K<c&&L.top>c,B=window.pageYOffset+L.top+(N?-c-2:a.offsetHeight+2);if(Pe(e.calendarContainer,"arrowTop",!N),Pe(e.calendarContainer,"arrowBottom",N),!e.config.inline){var le=window.pageXOffset+L.left,Ce=!1,ue=!1;_==="center"?(le-=(f-L.width)/2,Ce=!0):_==="right"&&(le-=f-L.width,ue=!0),Pe(e.calendarContainer,"arrowLeft",!Ce&&!ue),Pe(e.calendarContainer,"arrowCenter",Ce),Pe(e.calendarContainer,"arrowRight",ue);var ze=window.document.body.offsetWidth-(window.pageXOffset+L.right),Te=le+f>window.document.body.offsetWidth,st=ze+f>window.document.body.offsetWidth;if(Pe(e.calendarContainer,"rightMost",Te),!e.config.static)if(e.calendarContainer.style.top=B+"px",!Te)e.calendarContainer.style.left=le+"px",e.calendarContainer.style.right="auto";else if(!st)e.calendarContainer.style.left="auto",e.calendarContainer.style.right=ze+"px";else{var nt=Ge();if(nt===void 0)return;var Ee=window.document.body.offsetWidth,we=Math.max(0,Ee/2-f/2),Ke=".flatpickr-calendar.centerMost:before",Mt=".flatpickr-calendar.centerMost:after",fn=nt.cssRules.length,pn="{left:"+L.left+"px;right:auto;}";Pe(e.calendarContainer,"rightMost",!1),Pe(e.calendarContainer,"centerMost",!0),nt.insertRule(Ke+","+Mt+pn,fn),e.calendarContainer.style.left=we+"px",e.calendarContainer.style.right="auto"}}}}function Ge(){for(var n=null,a=0;a<document.styleSheets.length;a++){var c=document.styleSheets[a];if(c.cssRules){try{c.cssRules}catch{continue}n=c;break}}return n??at()}function at(){var n=document.createElement("style");return document.head.appendChild(n),n.sheet}function v(){e.config.noCalendar||e.isMobile||(Q(),Xe(),F())}function b(){e._input.focus(),window.navigator.userAgent.indexOf("MSIE")!==-1||navigator.msMaxTouchPoints!==void 0?setTimeout(e.close,0):e.close()}function g(n){n.preventDefault(),n.stopPropagation();var a=function(B){return B.classList&&B.classList.contains("flatpickr-day")&&!B.classList.contains("flatpickr-disabled")&&!B.classList.contains("notAllowed")},c=ln(Ye(n),a);if(c!==void 0){var f=c,S=e.latestSelectedDateObj=new Date(f.dateObj.getTime()),E=(S.getMonth()<e.currentMonth||S.getMonth()>e.currentMonth+e.config.showMonths-1)&&e.config.mode!=="range";if(e.selectedDateElem=f,e.config.mode==="single")e.selectedDates=[S];else if(e.config.mode==="multiple"){var _=tt(S);_?e.selectedDates.splice(parseInt(_),1):e.selectedDates.push(S)}else e.config.mode==="range"&&(e.selectedDates.length===2&&e.clear(!1,!1),e.latestSelectedDateObj=S,e.selectedDates.push(S),Ue(S,e.selectedDates[0],!0)!==0&&e.selectedDates.sort(function(B,le){return B.getTime()-le.getTime()}));if(x(),E){var L=e.currentYear!==S.getFullYear();e.currentYear=S.getFullYear(),e.currentMonth=S.getMonth(),L&&(ie("onYearChange"),Q()),ie("onMonthChange")}if(Xe(),F(),qe(),!E&&e.config.mode!=="range"&&e.config.showMonths===1?Z(f):e.selectedDateElem!==void 0&&e.hourElement===void 0&&e.selectedDateElem&&e.selectedDateElem.focus(),e.hourElement!==void 0&&e.hourElement!==void 0&&e.hourElement.focus(),e.config.closeOnSelect){var K=e.config.mode==="single"&&!e.config.enableTime,N=e.config.mode==="range"&&e.selectedDates.length===2&&!e.config.enableTime;(K||N)&&b()}G()}}var C={locale:[Oe,he],showMonths:[R,l,ce],minDate:[ne],maxDate:[ne],positionElement:[We],clickOpens:[function(){e.config.clickOpens===!0?(M(e._input,"focus",e.open),M(e._input,"click",e.open)):(e._input.removeEventListener("focus",e.open),e._input.removeEventListener("click",e.open))}]};function j(n,a){if(n!==null&&typeof n=="object"){Object.assign(e.config,n);for(var c in n)C[c]!==void 0&&C[c].forEach(function(f){return f()})}else e.config[n]=a,C[n]!==void 0?C[n].forEach(function(f){return f()}):Lt.indexOf(n)>-1&&(e.config[n]=Pt(a));e.redraw(),qe(!0)}function pe(n,a){var c=[];if(n instanceof Array)c=n.map(function(f){return e.parseDate(f,a)});else if(n instanceof Date||typeof n=="number")c=[e.parseDate(n,a)];else if(typeof n=="string")switch(e.config.mode){case"single":case"time":c=[e.parseDate(n,a)];break;case"multiple":c=n.split(e.config.conjunction).map(function(f){return e.parseDate(f,a)});break;case"range":c=n.split(e.l10n.rangeSeparator).map(function(f){return e.parseDate(f,a)});break}else e.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(n)));e.selectedDates=e.config.allowInvalidPreload?c:c.filter(function(f){return f instanceof Date&&Y(f,!1)}),e.config.mode==="range"&&e.selectedDates.sort(function(f,S){return f.getTime()-S.getTime()})}function Fe(n,a,c){if(a===void 0&&(a=!1),c===void 0&&(c=e.config.dateFormat),n!==0&&!n||n instanceof Array&&n.length===0)return e.clear(a);pe(n,c),e.latestSelectedDateObj=e.selectedDates[e.selectedDates.length-1],e.redraw(),ne(void 0,a),P(),e.selectedDates.length===0&&e.clear(!1),qe(a),a&&ie("onChange")}function Be(n){return n.slice().map(function(a){return typeof a=="string"||typeof a=="number"||a instanceof Date?e.parseDate(a,void 0,!0):a&&typeof a=="object"&&a.from&&a.to?{from:e.parseDate(a.from,void 0),to:e.parseDate(a.to,void 0)}:a}).filter(function(a){return a})}function De(){e.selectedDates=[],e.now=e.parseDate(e.config.now)||new Date;var n=e.config.defaultDate||((e.input.nodeName==="INPUT"||e.input.nodeName==="TEXTAREA")&&e.input.placeholder&&e.input.value===e.input.placeholder?null:e.input.value);n&&pe(n,e.config.dateFormat),e._initialDate=e.selectedDates.length>0?e.selectedDates[0]:e.config.minDate&&e.config.minDate.getTime()>e.now.getTime()?e.config.minDate:e.config.maxDate&&e.config.maxDate.getTime()<e.now.getTime()?e.config.maxDate:e.now,e.currentYear=e._initialDate.getFullYear(),e.currentMonth=e._initialDate.getMonth(),e.selectedDates.length>0&&(e.latestSelectedDateObj=e.selectedDates[0]),e.config.minTime!==void 0&&(e.config.minTime=e.parseDate(e.config.minTime,"H:i")),e.config.maxTime!==void 0&&(e.config.maxTime=e.parseDate(e.config.maxTime,"H:i")),e.minDateHasTime=!!e.config.minDate&&(e.config.minDate.getHours()>0||e.config.minDate.getMinutes()>0||e.config.minDate.getSeconds()>0),e.maxDateHasTime=!!e.config.maxDate&&(e.config.maxDate.getHours()>0||e.config.maxDate.getMinutes()>0||e.config.maxDate.getSeconds()>0)}function Ve(){if(e.input=Le(),!e.input){e.config.errorHandler(new Error("Invalid input element specified"));return}e.input._type=e.input.type,e.input.type="text",e.input.classList.add("flatpickr-input"),e._input=e.input,e.config.altInput&&(e.altInput=me(e.input.nodeName,e.config.altInputClass),e._input=e.altInput,e.altInput.placeholder=e.input.placeholder,e.altInput.disabled=e.input.disabled,e.altInput.required=e.input.required,e.altInput.tabIndex=e.input.tabIndex,e.altInput.type="text",e.input.setAttribute("type","hidden"),!e.config.static&&e.input.parentNode&&e.input.parentNode.insertBefore(e.altInput,e.input.nextSibling)),e.config.allowInput||e._input.setAttribute("readonly","readonly"),We()}function We(){e._positionElement=e.config.positionElement||e._input}function Ze(){var n=e.config.enableTime?e.config.noCalendar?"time":"datetime-local":"date";e.mobileInput=me("input",e.input.className+" flatpickr-mobile"),e.mobileInput.tabIndex=1,e.mobileInput.type=n,e.mobileInput.disabled=e.input.disabled,e.mobileInput.required=e.input.required,e.mobileInput.placeholder=e.input.placeholder,e.mobileFormatStr=n==="datetime-local"?"Y-m-d\\TH:i:S":n==="date"?"Y-m-d":"H:i:S",e.selectedDates.length>0&&(e.mobileInput.defaultValue=e.mobileInput.value=e.formatDate(e.selectedDates[0],e.mobileFormatStr)),e.config.minDate&&(e.mobileInput.min=e.formatDate(e.config.minDate,"Y-m-d")),e.config.maxDate&&(e.mobileInput.max=e.formatDate(e.config.maxDate,"Y-m-d")),e.input.getAttribute("step")&&(e.mobileInput.step=String(e.input.getAttribute("step"))),e.input.type="hidden",e.altInput!==void 0&&(e.altInput.type="hidden");try{e.input.parentNode&&e.input.parentNode.insertBefore(e.mobileInput,e.input.nextSibling)}catch{}M(e.mobileInput,"change",function(a){e.setDate(Ye(a).value,!1,e.mobileFormatStr),ie("onChange"),ie("onClose")})}function it(n){if(e.isOpen===!0)return e.close();e.open(n)}function ie(n,a){if(e.config!==void 0){var c=e.config[n];if(c!==void 0&&c.length>0)for(var f=0;c[f]&&f<c.length;f++)c[f](e.selectedDates,e.input.value,e,a);n==="onChange"&&(e.input.dispatchEvent(Re("change")),e.input.dispatchEvent(Re("input")))}}function Re(n){var a=document.createEvent("Event");return a.initEvent(n,!0,!0),a}function tt(n){for(var a=0;a<e.selectedDates.length;a++){var c=e.selectedDates[a];if(c instanceof Date&&Ue(c,n)===0)return""+a}return!1}function lt(n){return e.config.mode!=="range"||e.selectedDates.length<2?!1:Ue(n,e.selectedDates[0])>=0&&Ue(n,e.selectedDates[1])<=0}function Xe(){e.config.noCalendar||e.isMobile||!e.monthNav||(e.yearElements.forEach(function(n,a){var c=new Date(e.currentYear,e.currentMonth,1);c.setMonth(e.currentMonth+a),e.config.showMonths>1||e.config.monthSelectorType==="static"?e.monthElements[a].textContent=$t(c.getMonth(),e.config.shorthandCurrentMonth,e.l10n)+" ":e.monthsDropdownContainer.value=c.getMonth().toString(),n.value=c.getFullYear().toString()}),e._hidePrevMonthArrow=e.config.minDate!==void 0&&(e.currentYear===e.config.minDate.getFullYear()?e.currentMonth<=e.config.minDate.getMonth():e.currentYear<e.config.minDate.getFullYear()),e._hideNextMonthArrow=e.config.maxDate!==void 0&&(e.currentYear===e.config.maxDate.getFullYear()?e.currentMonth+1>e.config.maxDate.getMonth():e.currentYear>e.config.maxDate.getFullYear()))}function ot(n){var a=n||(e.config.altInput?e.config.altFormat:e.config.dateFormat);return e.selectedDates.map(function(c){return e.formatDate(c,a)}).filter(function(c,f,S){return e.config.mode!=="range"||e.config.enableTime||S.indexOf(c)===f}).join(e.config.mode!=="range"?e.config.conjunction:e.l10n.rangeSeparator)}function qe(n){n===void 0&&(n=!0),e.mobileInput!==void 0&&e.mobileFormatStr&&(e.mobileInput.value=e.latestSelectedDateObj!==void 0?e.formatDate(e.latestSelectedDateObj,e.mobileFormatStr):""),e.input.value=ot(e.config.dateFormat),e.altInput!==void 0&&(e.altInput.value=ot(e.config.altFormat)),n!==!1&&ie("onValueUpdate")}function rt(n){var a=Ye(n),c=e.prevMonthNav.contains(a),f=e.nextMonthNav.contains(a);c||f?ve(c?-1:1):e.yearElements.indexOf(a)>=0?a.select():a.classList.contains("arrowUp")?e.changeYear(e.currentYear+1):a.classList.contains("arrowDown")&&e.changeYear(e.currentYear-1)}function dt(n){n.preventDefault();var a=n.type==="keydown",c=Ye(n),f=c;e.amPM!==void 0&&c===e.amPM&&(e.amPM.textContent=e.l10n.amPM[Je(e.amPM.textContent===e.l10n.amPM[0])]);var S=parseFloat(f.getAttribute("min")),E=parseFloat(f.getAttribute("max")),_=parseFloat(f.getAttribute("step")),L=parseInt(f.value,10),K=n.delta||(a?n.which===38?1:-1:0),N=L+_*K;if(typeof f.value<"u"&&f.value.length===2){var B=f===e.hourElement,le=f===e.minuteElement;N<S?(N=E+N+Je(!B)+(Je(B)&&Je(!e.amPM)),le&&ee(void 0,-1,e.hourElement)):N>E&&(N=f===e.hourElement?N-E-Je(!e.amPM):S,le&&ee(void 0,1,e.hourElement)),e.amPM&&B&&(_===1?N+L===23:Math.abs(N-L)>_)&&(e.amPM.textContent=e.l10n.amPM[Je(e.amPM.textContent===e.l10n.amPM[0])]),f.value=_e(N)}}return h(),e}function mt(t,i){for(var e=Array.prototype.slice.call(t).filter(function(s){return s instanceof HTMLElement}),r=[],h=0;h<e.length;h++){var d=e[h];try{if(d.getAttribute("data-fp-omit")!==null)continue;d._flatpickr!==void 0&&(d._flatpickr.destroy(),d._flatpickr=void 0),d._flatpickr=Tn(d,i||{}),r.push(d._flatpickr)}catch(s){console.error(s)}}return r.length===1?r[0]:r}typeof HTMLElement<"u"&&typeof HTMLCollection<"u"&&typeof NodeList<"u"&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(t){return mt(this,t)},HTMLElement.prototype.flatpickr=function(t){return mt([this],t)});var Se=function(t,i){return typeof t=="string"?mt(window.document.querySelectorAll(t),i):t instanceof Node?mt([t],i):mt(t,i)};Se.defaultConfig={};Se.l10ns={en:Me({},wt),default:Me({},wt)};Se.localize=function(t){Se.l10ns.default=Me(Me({},Se.l10ns.default),t)};Se.setDefaults=function(t){Se.defaultConfig=Me(Me({},Se.defaultConfig),t)};Se.parseDate=qt({});Se.formatDate=dn({});Se.compareDates=Ue;typeof jQuery<"u"&&typeof jQuery.fn<"u"&&(jQuery.fn.flatpickr=function(t){return mt(this,t)});Date.prototype.fp_incr=function(t){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+(typeof t=="string"?parseInt(t,10):t))};typeof window<"u"&&(window.flatpickr=Se);function kn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var It={exports:{}},Mn=It.exports,Zt;function Ln(){return Zt||(Zt=1,(function(t,i){(function(e,r){t.exports=r()})(Mn,(function(){var e=function(){return e=Object.assign||function(O){for(var m,x=1,P=arguments.length;x<P;x++){m=arguments[x];for(var V in m)Object.prototype.hasOwnProperty.call(m,V)&&(O[V]=m[V])}return O},e.apply(this,arguments)},r=function(k,O,m){return m.months[O?"shorthand":"longhand"][k]};function h(k){for(;k.firstChild;)k.removeChild(k.firstChild)}function d(k){try{if(typeof k.composedPath=="function"){var O=k.composedPath();return O[0]}return k.target}catch{return k.target}}var s={shorthand:!1,dateFormat:"F Y",altFormat:"F Y",theme:"light"};function l(k){var O=e(e({},s),k);return function(m){m.config.dateFormat=O.dateFormat,m.config.altFormat=O.altFormat;var x={monthsContainer:null};function P(){if(m.rContainer){h(m.rContainer);for(var p=0;p<m.monthElements.length;p++){var y=m.monthElements[p];y.parentNode&&y.parentNode.removeChild(y)}}}function V(){m.rContainer&&(x.monthsContainer=m._createElement("div","flatpickr-monthSelect-months"),x.monthsContainer.tabIndex=-1,z(),m.rContainer.appendChild(x.monthsContainer),m.calendarContainer.classList.add("flatpickr-monthSelect-theme-"+O.theme))}function z(){if(x.monthsContainer){h(x.monthsContainer);for(var p=document.createDocumentFragment(),y=0;y<12;y++){var F=m.createDay("flatpickr-monthSelect-month",new Date(m.currentYear,y),0,y);F.dateObj.getMonth()===new Date().getMonth()&&F.dateObj.getFullYear()===new Date().getFullYear()&&F.classList.add("today"),F.textContent=r(y,O.shorthand,m.l10n),F.addEventListener("click",ne),p.appendChild(F)}x.monthsContainer.appendChild(p),m.config.minDate&&m.currentYear===m.config.minDate.getFullYear()?m.prevMonthNav.classList.add("flatpickr-disabled"):m.prevMonthNav.classList.remove("flatpickr-disabled"),m.config.maxDate&&m.currentYear===m.config.maxDate.getFullYear()?m.nextMonthNav.classList.add("flatpickr-disabled"):m.nextMonthNav.classList.remove("flatpickr-disabled")}}function M(){m._bind(m.prevMonthNav,"click",function(p){p.preventDefault(),p.stopPropagation(),m.changeYear(m.currentYear-1),U(),z()}),m._bind(m.nextMonthNav,"click",function(p){p.preventDefault(),p.stopPropagation(),m.changeYear(m.currentYear+1),U(),z()}),m._bind(x.monthsContainer,"mouseover",function(p){m.config.mode==="range"&&m.onMouseOver(d(p),"flatpickr-monthSelect-month")})}function G(){if(m.rContainer&&m.selectedDates.length){for(var p=m.rContainer.querySelectorAll(".flatpickr-monthSelect-month.selected"),y=0;y<p.length;y++)p[y].classList.remove("selected");var F=m.selectedDates[0].getMonth(),Q=m.rContainer.querySelector(".flatpickr-monthSelect-month:nth-child("+(F+1)+")");Q&&Q.classList.add("selected")}}function U(){var p=m.selectedDates[0];if(p&&(p=new Date(p),p.setFullYear(m.currentYear),m.config.minDate&&p<m.config.minDate&&(p=m.config.minDate),m.config.maxDate&&p>m.config.maxDate&&(p=m.config.maxDate),m.currentYear=p.getFullYear()),m.currentYearElement.value=String(m.currentYear),m.rContainer){var y=m.rContainer.querySelectorAll(".flatpickr-monthSelect-month");y.forEach(function(F){F.dateObj.setFullYear(m.currentYear),m.config.minDate&&F.dateObj<m.config.minDate||m.config.maxDate&&F.dateObj>m.config.maxDate?F.classList.add("flatpickr-disabled"):F.classList.remove("flatpickr-disabled")})}G()}function ne(p){p.preventDefault(),p.stopPropagation();var y=d(p);if(y instanceof Element&&!y.classList.contains("flatpickr-disabled")&&!y.classList.contains("notAllowed")&&(T(y.dateObj),m.config.closeOnSelect)){var F=m.config.mode==="single",Q=m.config.mode==="range"&&m.selectedDates.length===2;(F||Q)&&m.close()}}function T(p){var y=new Date(m.currentYear,p.getMonth(),p.getDate()),F=[];switch(m.config.mode){case"single":F=[y];break;case"multiple":F.push(y);break;case"range":m.selectedDates.length===2?F=[y]:(F=m.selectedDates.concat([y]),F.sort(function(Q,se){return Q.getTime()-se.getTime()}));break}m.setDate(F,!0),G()}var ee={37:-1,39:1,40:3,38:-3};function te(p,y,F,Q){var se=ee[Q.keyCode]!==void 0;if(!(!se&&Q.keyCode!==13)&&!(!m.rContainer||!x.monthsContainer)){var R=m.rContainer.querySelector(".flatpickr-monthSelect-month.selected"),W=Array.prototype.indexOf.call(x.monthsContainer.children,document.activeElement);if(W===-1){var ge=R||x.monthsContainer.firstElementChild;ge.focus(),W=ge.$i}se?x.monthsContainer.children[(12+W+ee[Q.keyCode])%12].focus():Q.keyCode===13&&x.monthsContainer.contains(document.activeElement)&&T(document.activeElement.dateObj)}}function ae(){var p;((p=m.config)===null||p===void 0?void 0:p.mode)==="range"&&m.selectedDates.length===1&&m.clear(!1),m.selectedDates.length||z()}function Z(){O._stubbedCurrentMonth=m._initialDate.getMonth(),m._initialDate.setMonth(O._stubbedCurrentMonth),m.currentMonth=O._stubbedCurrentMonth}function re(){O._stubbedCurrentMonth&&(m._initialDate.setMonth(O._stubbedCurrentMonth),m.currentMonth=O._stubbedCurrentMonth,delete O._stubbedCurrentMonth)}function w(){if(x.monthsContainer!==null)for(var p=x.monthsContainer.querySelectorAll(".flatpickr-monthSelect-month"),y=0;y<p.length;y++)p[y].removeEventListener("click",ne)}return{onParseConfig:function(){m.config.enableTime=!1},onValueUpdate:G,onKeyDown:te,onReady:[Z,P,V,M,G,function(){m.config.onClose.push(ae),m.loadedPlugins.push("monthSelect")}],onDestroy:[re,w,function(){m.config.onClose=m.config.onClose.filter(function(p){return p!==ae})}]}}}return l}))})(It)),It.exports}var Pn=Ln();const Nn=kn(Pn);var gt={exports:{}},On=gt.exports,Xt;function Fn(){return Xt||(Xt=1,(function(t,i){(function(e,r){r(i)})(On,(function(e){var r=typeof window<"u"&&window.flatpickr!==void 0?window.flatpickr:{l10ns:{}},h={weekdays:{shorthand:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],longhand:["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"]},months:{shorthand:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],longhand:["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]},rangeSeparator:" até ",time_24hr:!0};r.l10ns.pt=h;var d=r.l10ns;e.Portuguese=h,e.default=d,Object.defineProperty(e,"__esModule",{value:!0})}))})(gt,gt.exports)),gt.exports}var Bn=Fn();function Rn(t,i){let e="motivations",r=!1,h=!1;const d={motivations:"",academicEntries:[O()],professionalEntries:[m()]};let s={};const l=u=>u.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),k=u=>l(u);function O(){return{educationLevel:"",status:"",course:"",institution:"",startDate:"",endDate:""}}function m(){return{company:"",role:"",startDate:"",endDate:"",isCurrentJob:!1,activities:""}}const x=400,P={motivations:30,academicBackground:20,professionalExperience:20},V=()=>d.academicEntries.map((u,I)=>`${o("auth.profile.sections.academicBackground.entryTitle")} ${I+1}: ${u.educationLevel} | ${u.status} | ${u.course} | ${u.institution} | ${u.startDate} - ${u.endDate}`).join(`
`),z=()=>d.professionalEntries.map((u,I)=>{const D=u.isCurrentJob?o("auth.profile.sections.professionalExperience.currentJob"):u.endDate;return`${o("auth.profile.sections.professionalExperience.entryTitle")} ${I+1}: ${u.company} | ${u.role} | ${u.startDate} - ${D} | ${u.activities}`}).join(`
`),M=()=>d.motivations.trim().length>=P.motivations,G=u=>{const I=Z(u);if(!I)return!1;const D=new Date,$=new Date(D.getFullYear(),D.getMonth(),1);return I<=$},U=(u,I)=>{const D=Z(u),$=Z(I);return!D||!$?!1:$>D},ne=u=>!!(u.educationLevel&&u.status&&u.course.trim()&&u.institution.trim()&&G(u.startDate)&&U(u.startDate,u.endDate)),T=()=>d.academicEntries.length===0?!1:d.academicEntries.every(ne)&&V().length>=P.academicBackground,ee=u=>{const I=u.isCurrentJob||!!u.endDate.trim(),D=u.isCurrentJob?!0:U(u.startDate,u.endDate);return!!(u.company.trim()&&u.role.trim()&&G(u.startDate)&&I&&D&&u.activities.trim().length>=20)},te=()=>d.professionalEntries.length===0?!1:d.professionalEntries.every(ee)&&z().length>=P.professionalExperience,ae=()=>M()&&T()&&te(),Z=u=>{const I=/^(\d{2})\/(\d{4})$/.exec(u.trim());if(!I)return null;const D=Number(I[1]),$=Number(I[2]);return D<1||D>12?null:new Date($,D-1,1)},re=u=>new Date(u.getFullYear(),u.getMonth()+1,1),w=u=>{const I=u.dataset.academicIndex;if(I!==void 0){const $=Number(I);return Number.isNaN($)?null:d.academicEntries[$]?.startDate??null}const D=u.dataset.professionalIndex;if(D!==void 0){const $=Number(D);return Number.isNaN($)?null:d.professionalEntries[$]?.startDate??null}return null},p=u=>{const I=u.dataset.academicIndex;if(I!==void 0)return t.querySelector(`#academic-end-${I}`);const D=u.dataset.professionalIndex;return D!==void 0?t.querySelector(`#professional-end-${D}`):null},y=()=>{const u=t.querySelector('[data-profile-counter="motivations"]');u&&(u.textContent=`${d.motivations.length} / ${x} ${o("auth.profile.characters")}`),d.professionalEntries.forEach((I,D)=>{const $=t.querySelector(`[data-profile-counter="professionalExperience-${D}"]`);$&&($.textContent=`${I.activities.length} / ${x} ${o("auth.profile.characters")}`)})},F=(u,I)=>{const D=t.querySelector(`[data-profile-error="${u}"]`);D&&(D.textContent=I,D.classList.toggle("is-visible",!!I))},Q=(u,I)=>{t.querySelector(u)?.closest(".auth-profile-input")?.classList.toggle("is-invalid",I)},se=(u,I)=>{t.querySelector(u)?.closest(".auth-profile-field")?.classList.toggle("is-invalid",I)},R=()=>{t.querySelectorAll(".auth-profile-input.is-invalid").forEach(u=>u.classList.remove("is-invalid")),t.querySelectorAll(".auth-profile-field.is-invalid").forEach(u=>u.classList.remove("is-invalid"))},W=()=>{R(),se('[data-profile-input="motivations"]',d.motivations.trim().length<P.motivations),d.academicEntries.forEach((u,I)=>{const D=`[data-academic-index="${I}"]`;Q(`${D}[data-academic-field="educationLevel"]`,!u.educationLevel),Q(`${D}[data-academic-field="status"]`,!u.status),Q(`${D}[data-academic-field="course"]`,!u.course.trim()),Q(`${D}[data-academic-field="institution"]`,!u.institution.trim()),Q(`${D}[data-academic-field="startDate"]`,!G(u.startDate)),Q(`${D}[data-academic-field="endDate"]`,!U(u.startDate,u.endDate))}),d.professionalEntries.forEach((u,I)=>{const D=`[data-professional-index="${I}"]`;Q(`${D}[data-professional-field="company"]`,!u.company.trim()),Q(`${D}[data-professional-field="role"]`,!u.role.trim()),Q(`${D}[data-professional-field="startDate"]`,!G(u.startDate));const $=u.isCurrentJob?!1:!U(u.startDate,u.endDate);Q(`${D}[data-professional-field="endDate"]`,$),se(`${D}[data-professional-field="activities"]`,u.activities.trim().length<20)})},ge=()=>{for(const u of d.academicEntries){if(!u.educationLevel)return o("auth.profile.errors.requiredField",{field:o("auth.profile.sections.academicBackground.levelLabel")});if(!u.status)return o("auth.profile.errors.requiredField",{field:o("auth.profile.sections.academicBackground.statusLabel")});if(!u.course.trim())return o("auth.profile.errors.requiredField",{field:o("auth.profile.sections.academicBackground.courseLabel")});if(!u.institution.trim())return o("auth.profile.errors.requiredField",{field:o("auth.profile.sections.academicBackground.institutionLabel")});if(!G(u.startDate))return o("auth.profile.errors.startNotFuture",{field:o("auth.profile.sections.academicBackground.startLabel")});if(!U(u.startDate,u.endDate))return o("auth.profile.errors.endAfterStart",{field:o("auth.profile.sections.academicBackground.endLabel")})}return null},ce=()=>{for(const u of d.professionalEntries){if(!u.company.trim())return o("auth.profile.errors.requiredField",{field:o("auth.profile.sections.professionalExperience.companyLabel")});if(!u.role.trim())return o("auth.profile.errors.requiredField",{field:o("auth.profile.sections.professionalExperience.roleLabel")});if(!G(u.startDate))return o("auth.profile.errors.startNotFuture",{field:o("auth.profile.sections.professionalExperience.startLabel")});if(!u.isCurrentJob&&!U(u.startDate,u.endDate))return o("auth.profile.errors.endAfterStart",{field:o("auth.profile.sections.professionalExperience.endLabel")});if(u.activities.trim().length<20)return o("auth.profile.errors.minChars",{field:o("auth.profile.sections.professionalExperience.activitiesLabel"),min:20})}return null},he=()=>(s={},M()||(s.motivations=o("auth.profile.errors.minChars",{field:o("auth.profile.sections.motivations.title"),min:P.motivations})),T()||(s.academicBackground=ge()??o("auth.profile.errors.completeSection",{field:o("auth.profile.sections.academicBackground.title")})),te()||(s.professionalExperience=ce()??o("auth.profile.errors.completeSection",{field:o("auth.profile.sections.professionalExperience.title")})),["motivations","academicBackground","professionalExperience"].forEach(u=>{F(u,s[u]??"")}),W(),Object.keys(s).length===0),q=()=>{const u=t.querySelector("#profile-submit-btn");u&&(u.disabled=h||!ae())},ve=u=>{const I=t.querySelector(`[data-profile-trigger="${u}"]`),D=t.querySelector(`[data-profile-content="${u}"]`);if(!I||!D)return;const $=e===u;I.classList.toggle("is-active",$),D.classList.toggle("is-open",$),I.addEventListener("click",()=>{e=u,A()})},oe=()=>{["motivations","academicBackground","professionalExperience"].forEach(J=>ve(J)),t.querySelectorAll("[data-academic-add]").forEach(J=>{J.addEventListener("click",()=>{d.academicEntries.push(O()),A()})}),t.querySelectorAll("[data-academic-remove-index]").forEach(J=>{J.addEventListener("click",()=>{const be=Number(J.getAttribute("data-academic-remove-index"));Number.isNaN(be)||d.academicEntries.length<=1||(d.academicEntries.splice(be,1),A())})}),t.querySelectorAll("[data-professional-add]").forEach(J=>{J.addEventListener("click",()=>{d.professionalEntries.push(m()),A()})}),t.querySelectorAll("[data-professional-remove-index]").forEach(J=>{J.addEventListener("click",()=>{const be=Number(J.getAttribute("data-professional-remove-index"));Number.isNaN(be)||d.professionalEntries.length<=1||(d.professionalEntries.splice(be,1),A())})}),t.addEventListener("input",J=>{const be=J.target,Ie=be.closest('[data-profile-input="motivations"]');Ie&&(d.motivations=Ie.value,s.motivations="");const Ne=be.closest("[data-academic-index][data-academic-field]");if(Ne){const de=Number(Ne.getAttribute("data-academic-index")),ye=Ne.getAttribute("data-academic-field");!Number.isNaN(de)&&ye&&d.academicEntries[de]&&(d.academicEntries[de][ye]=Ne.value,s.academicBackground="")}const ke=be.closest("[data-professional-index][data-professional-field]");if(ke){const de=Number(ke.getAttribute("data-professional-index")),ye=ke.getAttribute("data-professional-field");if(!Number.isNaN(de)&&ye&&d.professionalEntries[de]){if(ye==="isCurrentJob"){d.professionalEntries[de][ye]=ke.checked,ke.checked&&(d.professionalEntries[de].endDate=""),s.professionalExperience="",A();return}else d.professionalEntries[de][ye]=ke.value;s.professionalExperience=""}}W(),y(),q()}),t.querySelector("#profile-back-btn")?.addEventListener("click",()=>i.onBackToRegister()),t.querySelector("#profile-form")?.addEventListener("submit",J=>{J.preventDefault(),he()&&(r=!0,A())}),t.querySelector("#profile-confirm-cancel")?.addEventListener("click",()=>{r=!1,A()}),t.querySelector("#profile-confirm-close")?.addEventListener("click",()=>{r=!1,A()}),t.querySelector("#profile-confirm-continue")?.addEventListener("click",async()=>{if(!h){h=!0,q(),H(o("auth.profile.feedback.submitting"),"loading");try{const J={motivations:d.motivations.trim(),academicBackground:V(),professionalExperience:z()},be=i.registrationUserId?await xt.upsertProfileByUserId(i.registrationUserId,J):await xt.upsertMyProfile(J);if(r=!1,be.registrationStatus==="PENDING_REVIEW"){i.onProfileSubmittedForReview?.();return}H(o("auth.profile.feedback.success"),"success")}catch(J){J instanceof yt&&J.code==="UNAUTHORIZED"?H(o("auth.profile.errors.unauthorized"),"error"):J instanceof yt&&J.code==="INVALID_STATUS_TRANSITION"?H(o("auth.profile.errors.invalidTransition"),"error"):H(o("auth.profile.errors.generic"),"error")}finally{h=!1,q()}}}),Array.from(t.querySelectorAll('[data-month-picker="true"]')).forEach(J=>{if(J.disabled)return;const be=J.dataset.academicField??J.dataset.professionalField,Ie=be==="startDate",ke=be==="endDate"?Z(w(J)??""):null,de=ke?re(ke):void 0,ye=new Date,Le=new Date(ye.getFullYear(),ye.getMonth(),1),Oe=Se(J,{locale:Dt()==="pt-BR"?Bn.Portuguese:void 0,disableMobile:!0,dateFormat:"m/Y",allowInput:!0,clickOpens:!0,defaultDate:J.value||void 0,maxDate:Ie?Le:void 0,minDate:de,plugins:[Nn({shorthand:!0,dateFormat:"m/Y",altFormat:"F Y"})],onChange:()=>{if(Ie){const Ge=p(J);if(Ge){const at=Z(J.value),v=Ge._flatpickr;if(at){const b=re(at);v?.set("minDate",b);const g=Z(Ge.value);g&&g<=at&&(Ge.value="",Ge.dispatchEvent(new Event("input",{bubbles:!0})))}else v?.set("minDate",void 0)}}J.dispatchEvent(new Event("input",{bubbles:!0}))}});t.querySelector(`[data-date-open-for="${J.id}"]`)?.addEventListener("click",()=>{J.disabled||Oe.open()})}),y(),W(),q()},A=()=>{const u=M(),I=T(),D=te();t.innerHTML=`
      <section class="auth-profile-step">
        <div class="auth-profile-shell">
          <div class="auth-profile-heading">
            <h2>${o("auth.profile.title")}</h2>
            <p>${o("auth.profile.description")}</p>
          </div>

          <form id="profile-form" class="auth-profile-form" novalidate>
            <article class="auth-profile-card ${e==="motivations"?"is-expanded":""} ${u?"is-complete":""}">
              <button type="button" class="auth-profile-card-header ${e==="motivations"?"is-active":""}" data-profile-trigger="motivations">
                <span class="auth-profile-card-icon">⌄</span>
                <span>${o("auth.profile.sections.motivations.title")}</span>
                <span class="auth-profile-card-status">${u?"✓":""}</span>
              </button>
              <div class="auth-profile-card-content ${e==="motivations"?"is-open":""}" data-profile-content="motivations">
                <p class="auth-profile-card-description">${o("auth.profile.sections.motivations.description")}</p>
                <div class="auth-profile-field" data-profile-field="motivations">
                  <textarea
                    data-profile-input="motivations"
                    maxlength="${x}"
                    placeholder="${o("auth.profile.sections.motivations.placeholder")}"
                  >${l(d.motivations)}</textarea>
                  <div class="auth-profile-counter" data-profile-counter="motivations"></div>
                </div>
              </div>
              <small class="auth-profile-error" data-profile-error="motivations"></small>
            </article>

            <article class="auth-profile-card ${e==="academicBackground"?"is-expanded":""} ${I?"is-complete":""}">
              <button type="button" class="auth-profile-card-header ${e==="academicBackground"?"is-active":""}" data-profile-trigger="academicBackground">
                <span class="auth-profile-card-icon">⌄</span>
                <span>${o("auth.profile.sections.academicBackground.title")}</span>
                <span class="auth-profile-card-status">${I?"✓":""}</span>
              </button>
              <div class="auth-profile-card-content ${e==="academicBackground"?"is-open":""}" data-profile-content="academicBackground">
                ${d.academicEntries.map(($,Y)=>`
                      <div class="auth-profile-entity-block">
                        <b class="auth-profile-entity-title">${o("auth.profile.sections.academicBackground.entryTitle")} ${Y+1}</b>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${o("auth.profile.sections.academicBackground.levelLabel")} <strong>*</strong></span>
                            <select data-academic-index="${Y}" data-academic-field="educationLevel">
                              <option value="">${o("auth.profile.common.selectPlaceholder")}</option>
                              <option value="${o("auth.profile.sections.academicBackground.levelOptions.higher")}" ${$.educationLevel===o("auth.profile.sections.academicBackground.levelOptions.higher")?"selected":""}>${o("auth.profile.sections.academicBackground.levelOptions.higher")}</option>
                              <option value="${o("auth.profile.sections.academicBackground.levelOptions.postgraduate")}" ${$.educationLevel===o("auth.profile.sections.academicBackground.levelOptions.postgraduate")?"selected":""}>${o("auth.profile.sections.academicBackground.levelOptions.postgraduate")}</option>
                              <option value="${o("auth.profile.sections.academicBackground.levelOptions.technical")}" ${$.educationLevel===o("auth.profile.sections.academicBackground.levelOptions.technical")?"selected":""}>${o("auth.profile.sections.academicBackground.levelOptions.technical")}</option>
                            </select>
                          </label>

                          <label class="auth-profile-input">
                            <span>${o("auth.profile.sections.academicBackground.statusLabel")} <strong>*</strong></span>
                            <select data-academic-index="${Y}" data-academic-field="status">
                              <option value="">${o("auth.profile.common.selectPlaceholder")}</option>
                              <option value="${o("auth.profile.sections.academicBackground.statusOptions.inProgress")}" ${$.status===o("auth.profile.sections.academicBackground.statusOptions.inProgress")?"selected":""}>${o("auth.profile.sections.academicBackground.statusOptions.inProgress")}</option>
                              <option value="${o("auth.profile.sections.academicBackground.statusOptions.completed")}" ${$.status===o("auth.profile.sections.academicBackground.statusOptions.completed")?"selected":""}>${o("auth.profile.sections.academicBackground.statusOptions.completed")}</option>
                            </select>
                          </label>
                        </div>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${o("auth.profile.sections.academicBackground.courseLabel")} <strong>*</strong></span>
                            <input data-academic-index="${Y}" data-academic-field="course" type="text" placeholder="${o("auth.profile.sections.academicBackground.coursePlaceholder")}" value="${k($.course)}">
                          </label>

                          <label class="auth-profile-input">
                            <span>${o("auth.profile.sections.academicBackground.institutionLabel")} <strong>*</strong></span>
                            <input data-academic-index="${Y}" data-academic-field="institution" type="text" placeholder="${o("auth.profile.sections.academicBackground.institutionPlaceholder")}" value="${k($.institution)}">
                          </label>
                        </div>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${o("auth.profile.sections.academicBackground.startLabel")} <strong>*</strong></span>
                            <div class="auth-profile-date-control">
                              <input id="academic-start-${Y}" class="auth-profile-date-input" data-month-picker="true" data-academic-index="${Y}" data-academic-field="startDate" type="text" placeholder="${o("auth.profile.common.monthYearPlaceholder")}" value="${k($.startDate)}">
                              <button type="button" class="auth-profile-date-btn" data-date-open-for="academic-start-${Y}" aria-label="${o("auth.profile.common.openCalendar")}"></button>
                            </div>
                          </label>

                          <label class="auth-profile-input">
                            <span>${o("auth.profile.sections.academicBackground.endLabel")} <strong>*</strong></span>
                            <div class="auth-profile-date-control">
                              <input id="academic-end-${Y}" class="auth-profile-date-input" data-month-picker="true" data-academic-index="${Y}" data-academic-field="endDate" type="text" placeholder="${o("auth.profile.common.monthYearPlaceholder")}" value="${k($.endDate)}">
                              <button type="button" class="auth-profile-date-btn" data-date-open-for="academic-end-${Y}" aria-label="${o("auth.profile.common.openCalendar")}"></button>
                            </div>
                          </label>
                        </div>

                        ${d.academicEntries.length>1?`<button type="button" class="auth-profile-link-danger" data-academic-remove-index="${Y}">${o("auth.profile.common.removeItem")}</button>`:""}
                      </div>
                    `).join("")}

                <button type="button" class="auth-profile-add-btn" data-academic-add>${o("auth.profile.sections.academicBackground.addAnother")}</button>
              </div>
              <small class="auth-profile-error" data-profile-error="academicBackground"></small>
            </article>

            <article class="auth-profile-card ${e==="professionalExperience"?"is-expanded":""} ${D?"is-complete":""}">
              <button type="button" class="auth-profile-card-header ${e==="professionalExperience"?"is-active":""}" data-profile-trigger="professionalExperience">
                <span class="auth-profile-card-icon">⌄</span>
                <span>${o("auth.profile.sections.professionalExperience.title")}</span>
                <span class="auth-profile-card-status">${D?"✓":""}</span>
              </button>
              <div class="auth-profile-card-content ${e==="professionalExperience"?"is-open":""}" data-profile-content="professionalExperience">
                ${d.professionalEntries.map(($,Y)=>`
                      <div class="auth-profile-entity-block">
                        <b class="auth-profile-entity-title">${o("auth.profile.sections.professionalExperience.entryTitle")} ${Y+1}</b>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${o("auth.profile.sections.professionalExperience.companyLabel")} <strong>*</strong></span>
                            <input data-professional-index="${Y}" data-professional-field="company" type="text" placeholder="${o("auth.profile.sections.professionalExperience.companyPlaceholder")}" value="${k($.company)}">
                          </label>

                          <label class="auth-profile-input">
                            <span>${o("auth.profile.sections.professionalExperience.roleLabel")} <strong>*</strong></span>
                            <input data-professional-index="${Y}" data-professional-field="role" type="text" placeholder="${o("auth.profile.sections.professionalExperience.rolePlaceholder")}" value="${k($.role)}">
                          </label>
                        </div>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${o("auth.profile.sections.professionalExperience.startLabel")} <strong>*</strong></span>
                            <div class="auth-profile-date-control">
                              <input id="professional-start-${Y}" class="auth-profile-date-input" data-month-picker="true" data-professional-index="${Y}" data-professional-field="startDate" type="text" placeholder="${o("auth.profile.common.monthYearPlaceholder")}" value="${k($.startDate)}">
                              <button type="button" class="auth-profile-date-btn" data-date-open-for="professional-start-${Y}" aria-label="${o("auth.profile.common.openCalendar")}"></button>
                            </div>
                          </label>

                          <div class="auth-profile-input">
                            <label>
                              <span>${o("auth.profile.sections.professionalExperience.endLabel")} ${$.isCurrentJob?"":"<strong>*</strong>"}</span>
                              <div class="auth-profile-date-control ${$.isCurrentJob?"is-disabled":""}">
                                <input id="professional-end-${Y}" class="auth-profile-date-input" data-month-picker="true" data-professional-index="${Y}" data-professional-field="endDate" type="text" placeholder="${o("auth.profile.common.monthYearPlaceholder")}" value="${k($.endDate)}" ${$.isCurrentJob?"disabled":""}>
                                <button type="button" class="auth-profile-date-btn" data-date-open-for="professional-end-${Y}" aria-label="${o("auth.profile.common.openCalendar")}" ${$.isCurrentJob?"disabled":""}></button>
                              </div>
                            </label>
                            <label class="auth-profile-checkbox">
                              <input data-professional-index="${Y}" data-professional-field="isCurrentJob" type="checkbox" ${$.isCurrentJob?"checked":""}>
                              <span>${o("auth.profile.sections.professionalExperience.currentJob")}</span>
                            </label>
                          </div>
                        </div>

                        <label class="auth-profile-input">
                          <span>${o("auth.profile.sections.professionalExperience.activitiesLabel")} <strong>*</strong></span>
                          <div class="auth-profile-field">
                            <textarea
                              data-professional-index="${Y}"
                              data-professional-field="activities"
                              maxlength="${x}"
                              placeholder="${o("auth.profile.sections.professionalExperience.activitiesPlaceholder")}"
                            >${l($.activities)}</textarea>
                            <div class="auth-profile-counter" data-profile-counter="professionalExperience-${Y}"></div>
                          </div>
                        </label>

                        ${d.professionalEntries.length>1?`<button type="button" class="auth-profile-link-danger" data-professional-remove-index="${Y}">${o("auth.profile.common.removeItem")}</button>`:""}
                      </div>
                    `).join("")}

                <button type="button" class="auth-profile-add-btn" data-professional-add>${o("auth.profile.sections.professionalExperience.addAnother")}</button>
              </div>
              <small class="auth-profile-error" data-profile-error="professionalExperience"></small>
            </article>

            <div class="auth-profile-actions">
              <button id="profile-back-btn" class="auth-profile-back" type="button">${o("auth.profile.backToRegister")}</button>
              <button id="profile-submit-btn" class="btn-primary auth-profile-submit" type="submit">${o("auth.profile.submit")}</button>
            </div>
          </form>
        </div>

        ${r?`
          <div class="auth-modal-overlay">
            <div class="auth-modal-card auth-modal-card-confirm">
              <div class="auth-modal-header">
                <h3>${o("auth.profile.confirmation.title")}</h3>
                <button id="profile-confirm-close" class="auth-modal-close" type="button" aria-label="${o("auth.profile.confirmation.close")}">✕</button>
              </div>
              <p class="auth-modal-message">${o("auth.profile.confirmation.message")}</p>
              <div class="auth-modal-actions">
                <button id="profile-confirm-cancel" class="auth-modal-cancel" type="button">${o("auth.profile.confirmation.cancel")}</button>
                <button id="profile-confirm-continue" class="btn-primary auth-modal-continue" type="button">${o("auth.profile.confirmation.continue")}</button>
              </div>
            </div>
          </div>
        `:""}

      </section>
    `,oe()};A(),vt(()=>A())}function qn(t,i){let e=!1,r=!!i.showPendingApprovalModal;const h=()=>{t.innerHTML=`
      <section class="login-start" aria-labelledby="login-title">
        <button id="login-back" class="register-back" type="button" aria-label="${o("auth.login.back")}">
          <span class="register-back-icon" aria-hidden="true">&#x2039;</span>
          <span>${o("auth.login.back")}</span>
        </button>

        <form id="login-form" class="register-form" novalidate>
          <h2 id="login-title" class="register-title">${o("auth.login.title")}</h2>

          <div class="register-fields">
            <label class="register-field" data-field="email">
              <span class="register-label">${o("auth.login.email")} <strong>*</strong></span>
              <input id="login-email" name="email" type="email" placeholder="${o("auth.login.emailPlaceholder")}" autocomplete="email" required>
              <small id="login-email-hint" class="register-field-hint" aria-live="polite"></small>
            </label>

            <label class="register-field" data-field="password">
              <span class="register-label">${o("auth.login.password")} <strong>*</strong></span>
              <div class="register-password-wrap">
                <input id="login-password" name="password" type="password" placeholder="${o("auth.login.passwordPlaceholder")}" autocomplete="current-password" required>
                <button class="register-eye" type="button" data-toggle-password="login-password" aria-label="${o("auth.login.showPassword")}">
                  <img class="register-eye-icon" src="/icons/visibility.png" alt="" aria-hidden="true">
                </button>
              </div>
              <small id="login-password-hint" class="register-field-hint" aria-live="polite"></small>
            </label>
          </div>

          <div class="login-forgot-password">${o("auth.login.forgotPassword")}</div>

          <div class="register-actions">
            <button id="login-submit" class="btn-primary register-submit" type="submit" disabled>${o("auth.login.submit")}</button>
            <p class="login-link register-login-link">
              ${o("auth.login.noAccount")} <a id="login-register-link" href="#">${o("auth.login.registerNow")}</a>
            </p>
          </div>
        </form>

        ${r?`
          <div class="auth-modal-overlay">
            <div class="auth-modal-card auth-modal-card-waiting">
              <div class="auth-modal-header">
                <h3>${o("auth.login.waiting.title")}</h3>
                <span class="auth-modal-icon" aria-hidden="true">🕒</span>
              </div>
              <div class="auth-modal-content-block">
                <p>${o("auth.login.waiting.description")}</p>
              </div>
              <div class="auth-modal-actions auth-modal-actions-end">
                <button id="login-waiting-close" class="auth-modal-close-btn" type="button">${o("auth.login.waiting.close")}</button>
              </div>
            </div>
          </div>
        `:""}
      </section>
    `,d()},d=()=>{const s=t.querySelector("#login-back"),l=t.querySelector("#login-form"),k=t.querySelector("#login-submit"),O=t.querySelector("#login-register-link"),m=t.querySelector("#login-email"),x=t.querySelector("#login-password"),P=t.querySelector('[data-field="email"]'),V=t.querySelector('[data-field="password"]'),z=t.querySelector("#login-email-hint"),M=t.querySelector("#login-password-hint"),G=t.querySelector("#login-waiting-close");let U=!1,ne=!1,T=null;const ee=p=>/.+@.+\..+/.test(p),te=(p,y,F)=>{p?.classList.toggle("is-invalid",F),y?.setAttribute("aria-invalid",F?"true":"false")},ae=(p,y)=>{p&&(p.textContent=y,p.classList.toggle("is-visible",!!y))},Z=(p,y)=>{const F=p.querySelector("img");F&&(F.src=y.type==="password"?"/icons/visibility.png":"/icons/visibility_off.png")},re=()=>{switch(T){case"INVALID_CREDENTIALS":return o("auth.login.errors.invalidCredentials");case"REJECTED":return o("auth.login.errors.accountRejected");default:return""}},w=()=>{const p=m?.value.trim()??"",y=x?.value??"",F=p.length>0&&ee(p),Q=y.length>0,se=re();te(P,m,U&&!F||T==="INVALID_CREDENTIALS"),te(V,x,ne&&!Q||T==="INVALID_CREDENTIALS"),T==="INVALID_CREDENTIALS"?(ae(z,o("auth.login.errors.invalidCredentials")),ae(M,"")):(ae(z,U&&!F?o(p?"auth.login.errors.invalidEmail":"auth.login.errors.requiredField"):""),ae(M,ne&&!Q?o("auth.login.errors.requiredField"):se)),k&&(k.disabled=!F||!Q||e)};s?.addEventListener("click",()=>i.onBack()),O?.addEventListener("click",p=>{p.preventDefault(),i.onOpenRegister()}),G?.addEventListener("click",()=>{r=!1,i.onPendingApprovalModalClose?.(),h()}),m?.addEventListener("input",()=>{T=null,!U&&m.value.length>0&&(U=!0),w()}),x?.addEventListener("input",()=>{T=null,!ne&&x.value.length>0&&(ne=!0),w()}),m?.addEventListener("blur",()=>{U=!0,w()}),x?.addEventListener("blur",()=>{ne=!0,w()}),t.querySelectorAll("[data-toggle-password]").forEach(p=>{p.addEventListener("click",()=>{const Q=p.dataset.togglePassword;if(!Q)return;const se=t.querySelector(`#${Q}`);if(!se)return;const R=se.type==="password";se.type=R?"text":"password",p.setAttribute("aria-label",o(R?"auth.login.hidePassword":"auth.login.showPassword")),Z(p,se)});const y=p.dataset.togglePassword;if(!y)return;const F=t.querySelector(`#${y}`);F&&Z(p,F)}),l?.addEventListener("submit",async p=>{if(p.preventDefault(),!(!m||!x||!k)&&(U=!0,ne=!0,w(),!k.disabled)){e=!0,w(),H(o("auth.login.feedback.submitting"),"loading");try{const y=await xt.login({email:m.value.trim(),password:x.value});if(y.user.status==="APPROVED"){H(o("auth.login.feedback.success"),"success"),i.onLoginSuccess(y.user.role);return}if(y.user.status==="PENDING_REVIEW"||y.user.status==="DRAFT_PROFILE"){r=!0,i.onPendingApprovalModalClose?.(),h();return}T="REJECTED",H(o("auth.login.errors.accountRejected"),"error")}catch(y){if(y instanceof yt)if(y.code==="INVALID_CREDENTIALS"||y.code==="UNAUTHORIZED")T="INVALID_CREDENTIALS";else if(y.code==="ACCOUNT_NOT_APPROVED"||y.code==="ACCOUNT_PENDING_APPROVAL"||y.code==="REGISTRATION_PENDING_REVIEW"){r=!0,i.onPendingApprovalModalClose?.(),h();return}else y.code==="REGISTRATION_REJECTED"?(T="REJECTED",H(o("auth.login.errors.accountRejected"),"error")):H(o("auth.login.errors.generic"),"error");else H(o("auth.login.errors.generic"),"error")}finally{e=!1,w()}}}),w()};h(),vt(()=>h())}const pt={home:"/home",adminHome:"/admin/home"};function _n(t){let i="auth",e=null,r=!1,h=!1;const d=k=>{const O=k==="ADMIN"?pt.adminHome:pt.home;window.location.assign(O)},s=()=>{i="auth",r=!0,l()},l=()=>{if(i==="profile"){t.innerHTML='<div id="auth-profile-step"></div>';const m=document.getElementById("auth-profile-step");if(!m)return;Rn(m,{registrationUserId:e,onBackToRegister:()=>{s()},onProfileSubmittedForReview:()=>{i="login",h=!0,l()}});return}if(i==="login"){t.innerHTML=`
        <div class="auth-page">
          <div class="auth-layout">
            <div id="auth-hero"></div>
            <div id="auth-login-card" class="auth-card"></div>
          </div>
        </div>
      `;const m=document.getElementById("auth-hero"),x=document.getElementById("auth-login-card");if(!m||!x)return;Jt(m),qn(x,{onBack:()=>{i="auth",l()},onOpenRegister:()=>s(),onLoginSuccess:P=>d(P),showPendingApprovalModal:h,onPendingApprovalModalClose:()=>{h=!1}});return}t.innerHTML=`
      <div class="auth-page">
        <div class="auth-layout">
          <div id="auth-hero"></div>
          <div id="auth-card"></div>
        </div>
      </div>
    `;const k=document.getElementById("auth-hero"),O=document.getElementById("auth-card");!k||!O||(Jt(k),Sn(O,{onOpenLogin:()=>{i="login",h=!1,l()},onRegistrationCompleted:m=>{e=m,i="profile",l()}}),r&&(document.getElementById("register-btn")?.click(),r=!1))};l()}function en(t){const i=()=>{const e=Dt();t.innerHTML=`
      <label class="language-switcher" for="language-select">
        <span class="language-switcher-label">${o("common.language")}</span>
        <select id="language-select" class="language-switcher-select" aria-label="${o("common.language")}">
          <option value="pt-BR" ${e==="pt-BR"?"selected":""}>${o("common.portuguese")}</option>
          <option value="en-US" ${e==="en-US"?"selected":""}>${o("common.english")}</option>
        </select>
      </label>
    `};vt(()=>i()),t.addEventListener("change",e=>{const r=e.target;if(r.id!=="language-select")return;const h=r.value;(h==="pt-BR"||h==="en-US")&&bn(h)}),i()}function tn(t){if(!t)return"";const i=new URLSearchParams;t.status&&i.set("status",t.status),t.category&&i.set("category",t.category),t.difficulty&&i.set("difficulty",t.difficulty),t.q&&i.set("q",t.q);const e=i.toString();return e?`?${e}`:""}const $e={getCourses:t=>fe.get(`/courses${tn(t)}`,{auth:!0}),getMyCourses:t=>fe.get(`/me/courses${tn(t)}`,{auth:!0}),getCourse:t=>fe.get(`/courses/${t}`,{auth:!0}),createCourse:t=>fe.post("/courses",t,{auth:!0}),updateCourse:(t,i)=>fe.put(`/courses/${t}`,i,{auth:!0}),activateCourse:t=>fe.post(`/courses/${t}/activate`,void 0,{auth:!0}),deactivateCourse:t=>fe.post(`/courses/${t}/deactivate`,void 0,{auth:!0}),deleteCourse:t=>fe.del(`/courses/${t}`,{auth:!0})},je={getSections:()=>fe.get("/sections",{auth:!0}),getSection:t=>fe.get(`/sections/${t}`,{auth:!0}),createSection:t=>fe.post("/sections",t,{auth:!0}),updateSection:(t,i)=>fe.put(`/sections/${t}`,i,{auth:!0}),deleteSection:t=>fe.del(`/sections/${t}`,{auth:!0})},xe={getActivitiesBySection:t=>fe.get(`/activities/section/${t}`,{auth:!0}),getActivity:t=>fe.get(`/activities/${t}`,{auth:!0}),createActivity:t=>fe.post("/activities",t,{auth:!0}),updateActivity:(t,i)=>fe.put(`/activities/${t}`,i,{auth:!0}),deleteActivity:t=>fe.del(`/activities/${t}`,{auth:!0})},_t={getTags:()=>fe.get("/tags",{auth:!0}),getTag:t=>fe.get(`/tags/${t}`,{auth:!0}),createTag:t=>fe.post("/tags",t,{auth:!0}),updateTag:(t,i)=>fe.put(`/tags/${t}`,i,{auth:!0}),deleteTag:t=>fe.del(`/tags/${t}`,{auth:!0})},Qe="educado.courses.homeView",He="educado.courses.draft",ft="educado.courses.formDraft",Yt="educado.courses.sectionsLocal";function nn(t,i){const e=sessionStorage.getItem(Qe);if(e==="create"){Tt(t,i);return}if(e==="sections"){const r=sessionStorage.getItem(He),h=r?JSON.parse(r):null;Ut(t,i,h);return}if(e==="review"){const r=sessionStorage.getItem(He),h=r?JSON.parse(r):null;un(t,i,h);return}kt(t,i)}function kt(t,i){const e=sn(),r=e?`${e.firstName} ${e.lastName}`.trim():"User Name";t.innerHTML=`
    <section class="creator-home-page">
      <div class="creator-main-card">
        <div class="creator-main-header">
          <h1>${o("courses.home.title")}</h1>
          <button id="creator-new-course" class="creator-new-course-btn" type="button">
            <span class="creator-new-course-icon">+</span>
            <span>${o("courses.home.newCourse")}</span>
          </button>
        </div>

        <div class="creator-controls-row">
          <div class="creator-view-toggle" aria-label="Alternar visualização">
            <button id="creator-grid-view" class="creator-view-btn is-active" type="button" aria-label="Visualização em grade">☷</button>
            <button id="creator-list-view" class="creator-view-btn" type="button" aria-label="Visualização em lista">☰</button>
          </div>

          <div class="creator-filters">
            <label class="creator-input-wrap" for="creator-course-search">
              <input id="creator-course-search" type="text" placeholder="${o("courses.home.search")}" autocomplete="off">
              <span aria-hidden="true">⌕</span>
            </label>

            <label class="creator-select-wrap" for="creator-course-sort">
              <select id="creator-course-sort">
                <option value="recent">${o("courses.home.sortOptions.newest")}</option>
                <option value="oldest">${o("courses.home.sortOptions.oldest")}</option>
                <option value="name">${o("courses.home.sortOptions.nameAsc")}</option>
              </select>
            </label>
          </div>
        </div>

        <div id="creator-courses-list" class="creator-courses-grid"></div>
      </div>

      <aside class="creator-sidebar">
        <div class="creator-sidebar-section creator-greeting">
          <h2>${o("courses.home.sidebar.greeting",{name:X(r)})}</h2>
        </div>

        <div class="creator-sidebar-section">
          <div class="creator-sidebar-title-row">
            <h3>${o("courses.home.sidebar.progress")}</h3>
            <select class="creator-period-select" aria-label="Período">
              <option>Esse mês</option>
            </select>
          </div>

          <div class="creator-stat-block">
            <span>${o("courses.home.sidebar.courses")}</span>
            <div><strong id="creator-total-courses">0</strong><small class="positive">▲ 5%</small></div>
          </div>

          <div class="creator-stat-block">
            <span>${o("courses.home.sidebar.students")}</span>
            <div><strong id="creator-total-students">0</strong><small class="negative">▼ 5%</small></div>
          </div>

          <div class="creator-stat-block">
            <span>${o("courses.home.sidebar.certificates")}</span>
            <div><strong id="creator-total-certificates">0</strong><small class="positive">▲ 5%</small></div>
          </div>

          <div class="creator-stat-block">
            <span>${o("courses.home.sidebar.rating")}</span>
            <div class="creator-rating-row"><span id="creator-rating-stars">★★★☆☆</span><strong id="creator-rating-value">3.7</strong></div>
          </div>
        </div>

        <div class="creator-sidebar-divider" aria-hidden="true"></div>

        <div class="creator-sidebar-section creator-activities">
          <h3>${o("courses.home.sidebar.activities")}</h3>
          <div class="creator-activity-item">Parabéns! Seu curso "Nome do curso" atingiu 100 inscritos</div>
          <div class="creator-activity-item">Um aluno do curso "Nome do curso" deixou uma dúvida</div>
        </div>
      </aside>
    </section>
  `;const h=document.getElementById("creator-new-course"),d=document.getElementById("creator-grid-view"),s=document.getElementById("creator-list-view"),l=document.getElementById("creator-course-search"),k=document.getElementById("creator-course-sort"),O=document.getElementById("creator-courses-list");if(!O||!d||!s||!l||!k)return;let m=[],x="",P="recent",V="grid";const z=w=>{const p=w.length,y=p*20,F=Math.floor(p*6.75),Q=w.length>0?w.reduce((he,q)=>he+(q.rating||3.7),0)/w.length:3.7,se=document.getElementById("creator-total-courses"),R=document.getElementById("creator-total-students"),W=document.getElementById("creator-total-certificates"),ge=document.getElementById("creator-rating-stars"),ce=document.getElementById("creator-rating-value");se&&(se.textContent=`${p}`),R&&(R.textContent=`${y}`),W&&(W.textContent=`${F}`),ge&&(ge.textContent=mn(Q)),ce&&(ce.textContent=Q.toFixed(1))},M=()=>{let w=[...m];switch(x&&(w=w.filter(p=>{const y=x.toLowerCase();return p.title.toLowerCase().includes(y)||p.category.toLowerCase().includes(y)||p.shortDescription.toLowerCase().includes(y)})),P){case"oldest":w.sort((p,y)=>(p.createdAt?new Date(p.createdAt).getTime():0)-(y.createdAt?new Date(y.createdAt).getTime():0));break;case"name":w.sort((p,y)=>p.title.localeCompare(y.title));break;default:w.sort((p,y)=>(y.createdAt?new Date(y.createdAt).getTime():0)-(p.createdAt?new Date(p.createdAt).getTime():0));break}return w},G=()=>{const w=M();if(z(m),O.classList.toggle("is-list",V==="list"),m.length===0){re();return}if(w.length===0){O.innerHTML=`<div class="creator-empty-state">${o("courses.home.noCourses")}</div>`;return}O.innerHTML=w.map(p=>{const y=p.rating||3.7,F=p.isActive!==!1;return`
          <article class="creator-course-card">
            <header class="creator-course-title-wrap">
              <span class="creator-course-icon" aria-hidden="true">▦</span>
              <h4>${X(p.title)}</h4>
              <span class="creator-course-status ${F?"is-active":"is-inactive"}">${o(F?"courses.home.statusActive":"courses.home.statusInactive")}</span>
            </header>

            <div class="creator-course-line" aria-hidden="true"></div>

            <div class="creator-course-meta">
              <span>✦ ${X(p.category||"Matemática")}</span>
              <span>◷ ${X(p.estimatedTime||"8 horas")}</span>
            </div>

            <div class="creator-course-rating">${Hn(y)}</div>

            <footer class="creator-course-actions">
              <button class="creator-edit-btn" type="button" data-course-action="edit" data-course-id="${X(p.id)}">${o("courses.home.edit")}</button>
              <button class="creator-view-btn-card" type="button" data-course-action="view" data-course-id="${X(p.id)}">${o("courses.home.view")}</button>
              <button class="creator-action-btn ${F?"warning":"success"}" type="button" data-course-action="toggle" data-course-id="${X(p.id)}" data-course-active="${F?"true":"false"}">
                ${o(F?"courses.home.deactivate":"courses.home.activate")}
              </button>
              <button class="creator-action-btn danger" type="button" data-course-action="delete" data-course-id="${X(p.id)}">${o("courses.home.delete")}</button>
            </footer>
          </article>
        `}).join(""),ae()},U=(w,p)=>({title:p,description:w.description,shortDescription:w.shortDescription,imageUrl:w.imageUrl,difficulty:w.difficulty,estimatedTime:w.estimatedTime,passingThreshold:w.passingThreshold,category:w.category,tags:w.tags,rating:w.rating??null}),ne=async w=>{try{const p=await $e.getCourse(w);H(`${o("courses.home.feedback.viewSuccess")} ${p.title}`,"success")}catch{H(o("courses.home.feedback.actionError"),"error")}},T=async w=>{try{const p=await $e.getCourse(w),y=window.prompt(o("courses.home.feedback.editPrompt"),p.title)?.trim();if(!y||y===p.title)return;await $e.updateCourse(w,U(p,y)),H(o("courses.home.feedback.updateSuccess"),"success"),await Z()}catch{H(o("courses.home.feedback.actionError"),"error")}},ee=async(w,p)=>{try{p?(await $e.deactivateCourse(w),H(o("courses.home.feedback.deactivateSuccess"),"success")):(await $e.activateCourse(w),H(o("courses.home.feedback.activateSuccess"),"success")),await Z()}catch{H(o("courses.home.feedback.actionError"),"error")}},te=async w=>{if(window.confirm(o("courses.home.confirmDelete")))try{await $e.deleteCourse(w),H(o("courses.home.feedback.deleteSuccess"),"success"),await Z()}catch{H(o("courses.home.feedback.actionError"),"error")}},ae=()=>{O.querySelectorAll("[data-course-action]").forEach(w=>{w.addEventListener("click",async()=>{const p=w.dataset.courseAction,y=w.dataset.courseId,F=w.dataset.courseActive==="true";if(!(!y||!p)){if(p==="view"){await ne(y);return}if(p==="edit"){await T(y);return}if(p==="toggle"){await ee(y,F);return}p==="delete"&&await te(y)}})})},Z=async()=>{O.innerHTML=`<div class="creator-empty-state">${o("courses.home.feedback.loading")}</div>`;try{m=i==="ADMIN"?await $e.getCourses({status:"all"}):await $e.getMyCourses({status:"all"}),G()}catch{m=[],O.innerHTML=`<div class="creator-empty-state">${o("courses.home.feedback.loadError")}</div>`,H(o("courses.home.feedback.loadError"),"error"),z(m)}};h?.addEventListener("click",()=>{sessionStorage.setItem(Qe,"create"),Tt(t,i)}),d.addEventListener("click",()=>{V="grid",d.classList.add("is-active"),s.classList.remove("is-active"),G()}),s.addEventListener("click",()=>{V="list",s.classList.add("is-active"),d.classList.remove("is-active"),G()}),l.addEventListener("input",w=>{x=w.target.value.trim(),G()}),k.addEventListener("change",w=>{P=w.target.value,G()});const re=()=>{const w=document.querySelector(".creator-main-card"),p=document.querySelector(".creator-sidebar");w&&(w.innerHTML=`
        <div class="creator-empty-container">
          <div class="creator-empty-content">
            <img src="/images/empty-courses.png" alt="" class="creator-empty-image">
            <h2>${o("courses.home.empty.title")}</h2>
            <p>${o("courses.home.empty.description")}</p>
            <button id="creator-new-course-empty" class="creator-new-course-btn" type="button">
              <span class="creator-new-course-icon">+</span>
              <span>${o("courses.home.empty.createButton")}</span>
            </button>
          </div>
        </div>
      `,document.getElementById("creator-new-course-empty")?.addEventListener("click",()=>{sessionStorage.setItem(Qe,"create"),Tt(t,i)})),p&&(p.innerHTML=`
        <div class="creator-sidebar-section creator-greeting">
          <h2>${o("courses.home.sidebar.greeting",{name:X(r)})}</h2>
        </div>

        <div class="creator-sidebar-divider" aria-hidden="true"></div>

        <div class="creator-sidebar-section">
          <h3>${o("courses.home.sidebar.progress")}</h3>
          <p class="creator-empty-message">${o("courses.home.sidebar.noData")}</p>
        </div>

        <div class="creator-sidebar-divider" aria-hidden="true"></div>

        <div class="creator-sidebar-section creator-activities">
          <h3>${o("courses.home.sidebar.activities")}</h3>
          <p class="creator-empty-message">${o("courses.home.sidebar.noActivities")}</p>
        </div>
      `)};Z()}function Tt(t,i){sessionStorage.setItem(Qe,"create");const e=(A,u)=>o(`courses.newCourse.${A}`,u);t.innerHTML=`
    <section class="new-course-page">
      <div class="new-course-layout">
        <aside class="new-course-sidebar">
          <div class="new-course-sidebar-header">
            <h2>${e("title")}</h2>
            <div class="new-course-divider"></div>
          </div>

          <div class="new-course-steps">
            <div class="new-course-step is-active">
              <span class="new-course-step-box"></span>
              <span>${e("generalInfo")}</span>
            </div>
            <div class="new-course-step">
              <span class="new-course-step-box"></span>
              <span>${e("sections")}</span>
            </div>
            <div class="new-course-step">
              <span class="new-course-step-box"></span>
              <span>${e("review")}</span>
            </div>
          </div>

          <div class="new-course-divider"></div>

          <button id="new-course-save-draft" class="new-course-outline-btn" type="button">${e("saveDraft")}</button>
        </aside>

        <div class="new-course-content">
          <div class="new-course-main">
            <h1>${e("generalInfo")}</h1>

            <form id="new-course-form" class="new-course-form">
              <label class="new-course-field">
                <span>${e("fields.name")} <em>*</em></span>
                <input id="new-course-title" type="text" placeholder="${e("fields.namePlaceholder")}" required minlength="3">
              </label>

              <div class="new-course-row">
                <label class="new-course-field">
                  <span>${e("fields.difficulty")} <em>*</em></span>
                  <select id="new-course-difficulty" required>
                    <option value="beginner">${e("difficultyOptions.beginner")}</option>
                    <option value="intermediate">${e("difficultyOptions.intermediate")}</option>
                    <option value="advanced">${e("difficultyOptions.advanced")}</option>
                  </select>
                </label>

                <label class="new-course-field">
                  <span>${e("fields.category")} <em>*</em></span>
                  <input id="new-course-category" type="text" placeholder="${e("fields.categoryPlaceholder")}" required>
                </label>
              </div>

              <label class="new-course-field">
                <span>${e("fields.description")} <em>*</em></span>
                <textarea id="new-course-description" placeholder="${e("fields.descriptionPlaceholder")}" rows="5" maxlength="400" required></textarea>
                <small id="new-course-description-count">0 / 400 caracteres</small>
              </label>

              <label class="new-course-field">
                <span>${e("fields.image")} <em>*</em></span>
                <div class="new-course-upload-box">
                  <p>${e("fields.imageDrop")}</p>
                  <p>${e("fields.or")}</p>
                  <button id="new-course-image-trigger" class="new-course-outline-btn" type="button">${e("fields.imageSend")}</button>
                  <input id="new-course-image" type="url" placeholder="${e("fields.imagePlaceholder")}" required>
                </div>
                <small>${e("fields.imageHint")}</small>
              </label>

              <label class="new-course-field">
                <span>${e("fields.tags")}</span>
                <div class="new-course-tags-input" id="new-course-tags-input">
                  <div id="new-course-tags-chips" class="new-course-tags-chips" hidden></div>
                  <input id="new-course-tags-query" type="text" placeholder="${e("fields.tagsPlaceholder")}">
                </div>
                <div id="new-course-tags-suggestions" class="new-course-tags-suggestions" hidden></div>
              </label>
            </form>
          </div>

          <div class="new-course-footer">
            <button id="new-course-back" class="new-course-link-btn" type="button">${e("ctas.back")}</button>
            <div class="new-course-footer-actions">
              <button id="new-course-cancel" class="new-course-cancel-btn" type="button">${e("ctas.cancel")}</button>
              <button id="new-course-next" class="new-course-primary-btn" type="button">${e("ctas.next")}</button>
            </div>
          </div>

          <div class="new-course-mobile-draft">
            <button id="new-course-save-draft-mobile" class="new-course-outline-btn" type="button">${e("saveDraft")}</button>
          </div>
        </div>
      </div>
    </section>
  `;const r=document.getElementById("new-course-description"),h=document.getElementById("new-course-description-count"),d=document.getElementById("new-course-image"),s=document.getElementById("new-course-image-trigger"),l=document.getElementById("new-course-back"),k=document.getElementById("new-course-cancel"),O=document.getElementById("new-course-save-draft"),m=document.getElementById("new-course-save-draft-mobile"),x=document.getElementById("new-course-next"),P=document.getElementById("new-course-tags-query"),V=document.getElementById("new-course-tags-chips"),z=document.getElementById("new-course-tags-suggestions"),M=document.getElementById("new-course-title"),G=document.getElementById("new-course-difficulty"),U=document.getElementById("new-course-category");let ne=[],T=[];const ee=sessionStorage.getItem(He),te=ee?JSON.parse(ee):null,ae=sessionStorage.getItem(ft),Z=ae?JSON.parse(ae):null;let re=!1;const w=()=>{sessionStorage.setItem(Qe,"list"),kt(t,i)},p=()=>{sessionStorage.removeItem(ft),sessionStorage.removeItem(Yt)},y=()=>{const A={title:M?.value??"",description:r?.value??"",difficulty:G?.value??"beginner",category:U?.value??"",imageUrl:d?.value??"",selectedTagIds:T.map(u=>u.id)};sessionStorage.setItem(ft,JSON.stringify(A))},F=()=>{re=!1;const A=document.getElementById("new-course-cancel-modal");A&&A.remove()},Q=async A=>{const I=(await je.getSections()).filter(D=>D.courseId===A);await Promise.all(I.map(async D=>{const $=await xe.getActivitiesBySection(D.id);await Promise.all($.map(Y=>xe.deleteActivity(Y.id)))})),await Promise.all(I.map(D=>je.deleteSection(D.id))),await $e.deleteCourse(A)},se=()=>{if(re)return;re=!0;const A=document.createElement("div");A.id="new-course-cancel-modal",A.innerHTML=`
      <div class="sections-lesson-modal-overlay" id="new-course-cancel-overlay" role="dialog" aria-modal="true" aria-labelledby="new-course-cancel-title">
        <div class="sections-lesson-modal-card sections-delete-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="new-course-cancel-title">${o("courses.sections.deleteModal.title")}</h2>
            <button type="button" id="new-course-cancel-close" class="sections-lesson-modal-close" aria-label="${o("courses.sections.modal.close")}">✕</button>
          </header>
          <div class="sections-lesson-modal-body">
            <p class="sections-delete-modal-message">${o("courses.sections.deleteModal.message")}</p>
          </div>
          <footer class="sections-lesson-modal-actions">
            <button type="button" id="new-course-cancel-no" class="new-course-cancel-btn">${o("courses.sections.deleteModal.cancel")}</button>
            <button type="button" id="new-course-cancel-yes" class="new-course-primary-btn">${o("courses.sections.deleteModal.confirm")}</button>
          </footer>
        </div>
      </div>
    `,document.body.appendChild(A);const u=document.getElementById("new-course-cancel-overlay"),I=document.getElementById("new-course-cancel-close"),D=document.getElementById("new-course-cancel-no"),$=document.getElementById("new-course-cancel-yes");u?.addEventListener("click",Y=>{Y.target===u&&F()}),I?.addEventListener("click",F),D?.addEventListener("click",F),$?.addEventListener("click",async()=>{try{const Y=sessionStorage.getItem(He),Ae=Y?JSON.parse(Y):null;Ae?.id&&await Q(Ae.id),sessionStorage.removeItem(He),p(),F(),w()}catch{H(o("courses.home.feedback.actionError"),"error")}})},R=(A,u)=>{if(!A)return;A.classList.add("is-invalid");const I=A.closest(".new-course-field");if(!I)return;let D=I.querySelector(".new-course-field-error");D||(D=document.createElement("small"),D.className="new-course-field-error",I.appendChild(D)),D.textContent=u},W=A=>{if(!A)return;A.classList.remove("is-invalid"),A.closest(".new-course-field")?.querySelector(".new-course-field-error")?.remove()},ge=A=>{let u=0;for(let D=0;D<A.length;D+=1)u=A.charCodeAt(D)+((u<<5)-u);const I=Math.abs(u)%360;return{background:`hsl(${I} 75% 94%)`,border:`hsl(${I} 45% 78%)`,text:`hsl(${I} 35% 34%)`}},ce=A=>T.some(u=>u.id===A),he=()=>{V&&(V.hidden=T.length===0,V.innerHTML=T.map(A=>{const u=ge(A.slug||A.name);return`
          <span class="new-course-tag-chip" style="background:${u.background};border-color:${u.border};color:${u.text};">
            ${X(A.name)}
            <button type="button" class="new-course-tag-remove" data-tag-id="${X(A.id)}" aria-label="Remover ${X(A.name)}">×</button>
          </span>
        `}).join(""),V.querySelectorAll(".new-course-tag-remove").forEach(A=>{A.addEventListener("click",()=>{const u=A.dataset.tagId;u&&(T=T.filter(I=>I.id!==u),he(),q(P?.value.trim()??""),y())})}))},q=A=>{if(!z)return;const u=$=>{z.hidden=!$,z.style.display=$?"flex":"none"},I=A.trim().toLowerCase();if(!I){u(!1),z.innerHTML="";return}const D=ne.filter($=>$.isActive).filter($=>!ce($.id)).filter($=>!I||$.name.toLowerCase().includes(I)||$.slug.toLowerCase().includes(I)).slice(0,8);if(D.length===0){u(!1),z.innerHTML="";return}z.innerHTML=D.map($=>`<button type="button" class="new-course-tag-suggestion" data-tag-id="${X($.id)}">${X($.name)}</button>`).join(""),u(!0),z.querySelectorAll(".new-course-tag-suggestion").forEach($=>{$.addEventListener("click",()=>{const Y=$.dataset.tagId;if(!Y)return;const Ae=ne.find(J=>J.id===Y);if(Ae){if(T.length>=20){H(e("errors.tagsLimit"),"error");return}T.push(Ae),he(),P&&(P.value=""),q(""),P?.focus()}})})},ve=async A=>{if(T.length>=20){H(e("errors.tagsLimit"),"error");return}const u=A.trim().toLowerCase();if(!u)return;const I=ne.find($=>$.name.trim().toLowerCase()===u);if(I){ce(I.id)||(T.push(I),he(),y());return}const D=await _t.createTag({name:A.trim(),description:null,isActive:!0});ne=[D,...ne],T.push(D),he(),y()},oe=async A=>{const u=M?.value.trim()??"",I=r?.value.trim()??"",D=G?.value??"beginner",$=U?.value.trim()??"",Y=d?.value.trim()??"",Ae=T.map(be=>be.id);W(M),W(r),W(U),W(d);let J=!0;if(u||(R(M,e("errors.titleRequired")),J=!1),u&&u.length<3&&(R(M,e("errors.titleMin")),J=!1),I||(R(r,e("errors.descriptionRequired")),J=!1),I&&I.length<20&&(R(r,e("errors.descriptionMin")),J=!1),$||(R(U,e("errors.categoryRequired")),J=!1),Y||(R(d,e("errors.imageRequired")),J=!1),!J){H(e("errors.requiredFields"),"error");return}try{const be={title:u,description:I,shortDescription:I.slice(0,120),imageUrl:Y,difficulty:D,estimatedTime:"8 horas",passingThreshold:70,category:$,tags:[],tagIds:Ae,rating:null},Ie=te?.id?await $e.updateCourse(te.id,be):await $e.createCourse(be);if(sessionStorage.setItem(He,JSON.stringify(Ie)),y(),A==="draft"){await $e.deactivateCourse(Ie.id),p(),H(o("courses.home.feedback.deactivateSuccess"),"success"),w();return}if(H(te?.id?o("courses.home.feedback.updateSuccess"):o("courses.home.feedback.createSuccess"),"success"),A==="next"){sessionStorage.setItem(Qe,"sections"),Ut(t,i,Ie);return}}catch{H(o("courses.home.feedback.createError"),"error")}};M&&(M.value=Z?.title??te?.title??""),r&&(r.value=Z?.description??te?.description??""),G&&(G.value=Z?.difficulty??te?.difficulty??"beginner"),U&&(U.value=Z?.category??te?.category??""),d&&(d.value=Z?.imageUrl??te?.imageUrl??""),r&&h&&(h.textContent=`${r.value.length} / 400 caracteres`),r?.addEventListener("input",()=>{!r||!h||(h.textContent=`${r.value.length} / 400 caracteres`,y())}),s?.addEventListener("click",()=>{const A=window.prompt(e("fields.imagePlaceholder"))?.trim();!A||!d||(d.value=A,W(d),y())}),M?.addEventListener("input",()=>{(M.value??"").trim().length>=3&&W(M),y()}),M?.addEventListener("blur",()=>{const A=(M.value??"").trim();if(!A){R(M,e("errors.titleRequired"));return}if(A.length<3){R(M,e("errors.titleMin"));return}W(M)}),U?.addEventListener("input",()=>{(U.value??"").trim().length>0&&W(U),y()}),U?.addEventListener("blur",()=>{if(!(U.value??"").trim()){R(U,e("errors.categoryRequired"));return}W(U)}),d?.addEventListener("input",()=>{(d.value??"").trim().length>0&&W(d),y()}),G?.addEventListener("change",y),d?.addEventListener("blur",()=>{if(!(d.value??"").trim()){R(d,e("errors.imageRequired"));return}W(d)}),r?.addEventListener("blur",()=>{const A=(r.value??"").trim();if(!A){R(r,e("errors.descriptionRequired"));return}if(A.length<20){R(r,e("errors.descriptionMin"));return}W(r)}),P?.addEventListener("focus",()=>{q(P.value.trim())}),P?.addEventListener("input",()=>{q(P.value.trim())}),P?.addEventListener("keydown",async A=>{if(A.key!=="Enter")return;A.preventDefault();const u=P.value.trim();if(u)try{await ve(u),P.value="",q(""),y()}catch{H(e("errors.tagCreate"),"error")}}),document.addEventListener("click",A=>{const u=A.target;!u.closest("#new-course-tags-input")&&!u.closest("#new-course-tags-suggestions")&&z&&(z.hidden=!0)}),(async()=>{try{ne=await _t.getTags();const A=Z?.selectedTagIds?.length?Z.selectedTagIds:te?.tags??[];A.length>0&&(T=ne.filter(u=>A.includes(u.id)),he()),q("")}catch{ne=[]}})(),l?.addEventListener("click",()=>{y(),w()}),k?.addEventListener("click",()=>{se()}),O?.addEventListener("click",async()=>{await oe("draft")}),m?.addEventListener("click",async()=>{await oe("draft")}),x?.addEventListener("click",async()=>{await oe("next")})}function Ut(t,i,e){sessionStorage.setItem(Qe,"sections");const r=(v,b)=>o(`courses.sections.${v}`,b),h=e?.title??r("defaultSectionTitle");t.innerHTML=`
    <section class="new-course-page">
      <div class="new-course-layout sections-layout">
        <aside class="new-course-sidebar">
          <div class="new-course-sidebar-header">
            <h2>${o("courses.newCourse.title")}</h2>
            <div class="new-course-divider"></div>
          </div>

          <div class="new-course-steps">
            <div class="new-course-step is-complete">
              <span class="new-course-step-check">✓</span>
              <span>${o("courses.newCourse.generalInfo")}</span>
            </div>
            <div class="new-course-step is-active">
              <span class="new-course-step-box"></span>
              <span>${o("courses.newCourse.sections")}</span>
            </div>
            <div class="new-course-step">
              <span class="new-course-step-box"></span>
              <span>${o("courses.newCourse.review")}</span>
            </div>
          </div>

          <div class="new-course-divider"></div>

          <button id="sections-save-draft" class="new-course-outline-btn" type="button">${o("courses.newCourse.saveDraft")}</button>
        </aside>

        <div class="new-course-content sections-content">
          <div class="new-course-main">
            <div class="sections-header-row">
              <h1>${r("title")}</h1>
              <div class="sections-workload"><span>${r("workload")}:</span><strong id="sections-workload-value">0 ${r("hours")}</strong></div>
            </div>

            <div class="sections-alert">
              <span class="sections-alert-icon">!</span>
              <div>
                <strong>${r("attentionTitle")}</strong>
                <p>${r("attentionMessage")}</p>
              </div>
            </div>

            <div id="sections-list" class="sections-list"></div>

            <button id="sections-add" class="sections-add-btn" type="button">+ ${r("newSection")}</button>
          </div>

          <div class="new-course-footer">
            <button id="sections-back" class="new-course-link-btn" type="button">${o("courses.newCourse.ctas.back")}</button>
            <div class="new-course-footer-actions">
              <button id="sections-cancel" class="new-course-cancel-btn" type="button">${o("courses.newCourse.ctas.cancel")}</button>
              <button id="sections-next" class="new-course-primary-btn" type="button">${r("nextReview")}</button>
            </div>
          </div>

          <div class="new-course-mobile-draft">
            <button id="sections-save-draft-mobile" class="new-course-outline-btn" type="button">${o("courses.newCourse.saveDraft")}</button>
          </div>
        </div>
      </div>
    </section>
  `;let d=[],s={isOpen:!1,sectionId:null,editingActivityId:null,sectionIndex:0,name:"",contentType:"",firstText:"",videoFileName:"",hasVideoQuestion:!0,videoQuestion:"",videoAlternatives:["",""],correctVideoAlternativeIndex:0,nameError:!1,contentTypeError:!1,firstTextError:!1,videoError:!1,videoQuestionError:!1,videoAlternativesError:!1,videoCorrectAlternativeError:!1},l={isOpen:!1,sectionId:null,editingActivityId:null,sectionIndex:0,title:"",contentType:"",question:"",alternatives:["",""],correctAlternativeIndex:0,includeImage:!1,imageFileName:"",titleError:!1,contentTypeError:!1,questionError:!1,alternativesError:!1,correctAlternativeError:!1,imageError:!1},k=null,O=null,m={isOpen:!1,sectionId:null},x={isOpen:!1},P={isOpen:!1,sectionIndex:0,activity:null};const V=e?.id??"",z=()=>`${Yt}:${V||"local"}`,M=document.getElementById("sections-list"),G=document.getElementById("sections-workload-value"),U=()=>{const v={courseId:V,sections:d.map(b=>({id:b.id,name:b.name,description:b.description}))};sessionStorage.setItem(z(),JSON.stringify(v))},ne=()=>{const v=sessionStorage.getItem(z());if(!v)return null;try{return JSON.parse(v)}catch{return null}},T=()=>{sessionStorage.removeItem(z())},ee=()=>{const v=ne();v?.sections?.length&&(d=d.map(b=>{const g=v.sections.find(C=>C.id===b.id);return g?{...b,name:g.name??b.name,description:g.description??b.description}:b}))},te=v=>{const b=v.filter(C=>C.type==="video_pause"||C.type==="text_reading").length,g=v.filter(C=>C.type==="multiple_choice"||C.type==="true_false").length;return{lessons:b,exercises:g}},ae=v=>v.map(b=>({id:b.id,sectionId:b.sectionId,title:b.title??r("defaultSectionTitle"),type:b.type,order:b.order})).sort((b,g)=>b.order-g.order),Z=(v,b)=>{const g=ae(b),C=te(g);return{id:v.id,courseId:v.courseId,name:v.title,description:"",order:v.order,lessons:C.lessons,exercises:C.exercises,activities:g}},re=async()=>{if(!V){d=[{id:crypto.randomUUID(),courseId:"",name:r("sectionName",{index:1}),description:"",order:0,lessons:0,exercises:0,activities:[]}],Le(),Oe();return}try{const b=(await je.getSections()).filter(C=>C.courseId===V).sort((C,j)=>C.order-j.order);if(d=await Promise.all(b.map(async C=>{const j=await xe.getActivitiesBySection(C.id);return Z(C,j)})),ee(),d.length===0){await w({silentError:!0});return}Le(),Oe()}catch{d=[{id:crypto.randomUUID(),courseId:V,name:r("sectionName",{index:1}),description:"",order:0,lessons:0,exercises:0,activities:[]}],Le(),Oe()}},w=async v=>{if(V)try{const b=await je.createSection({id:crypto.randomUUID(),courseId:V,title:r("sectionName",{index:d.length+1}),order:d.length});d.push({id:b.id,courseId:b.courseId,name:b.title,description:"",order:b.order,lessons:0,exercises:0,activities:[]}),d.sort((g,C)=>g.order-C.order),U(),Le(),Oe()}catch{v?.silentError||H(o("courses.home.feedback.actionError"),"error")}},p=async(v,b)=>{const g=b.trim();if(g)try{const C=await je.updateSection(v,{title:g}),j=d.find(pe=>pe.id===v);j&&(j.name=C.title),U(),Le()}catch{H(o("courses.home.feedback.actionError"),"error")}},y=async(v,b)=>{try{await xe.deleteActivity(b);const g=d.find(j=>j.id===v);if(!g)return;g.activities=g.activities.filter(j=>j.id!==b).map((j,pe)=>({...j,order:pe})),await Promise.all(g.activities.map(j=>xe.updateActivity(j.id,{order:j.order})));const C=te(g.activities);g.lessons=C.lessons,g.exercises=C.exercises,U(),Le(),Oe()}catch{H(o("courses.home.feedback.actionError"),"error")}},F=async v=>{const b=d.find(g=>g.id===v);if(b){if(!b.courseId){d=d.filter(g=>g.id!==v),d.length===0&&(d=[{id:crypto.randomUUID(),courseId:"",name:r("sectionName",{index:1}),description:"",order:0,lessons:0,exercises:0,activities:[]}]),Le(),Oe();return}try{const g=await xe.getActivitiesBySection(v);if(await Promise.all(g.map(C=>xe.deleteActivity(C.id))),await je.deleteSection(v),d=d.filter(C=>C.id!==v),await Promise.all(d.map((C,j)=>je.updateSection(C.id,{order:j}))),d=d.map((C,j)=>({...C,order:j})),d.length===0){await w({silentError:!0});return}U(),Le(),Oe()}catch{H(o("courses.home.feedback.actionError"),"error")}}},Q="sections-lesson-modal-portal",se=()=>{let v=document.getElementById(Q);return v||(v=document.createElement("div"),v.id=Q,document.body.appendChild(v)),v},R=v=>{if(v.key==="Escape"){if(s.isOpen){ge();return}if(l.isOpen){ce();return}if(P.isOpen){q();return}m.isOpen&&he()}},W=()=>{const v=document.getElementById(Q);v&&(v.innerHTML=""),document.body.classList.remove("sections-modal-open"),document.removeEventListener("keydown",R)},ge=()=>{s={...s,isOpen:!1,sectionId:null,editingActivityId:null},k=null,W()},ce=()=>{l={...l,isOpen:!1,sectionId:null,editingActivityId:null},O=null,W()},he=()=>{m={isOpen:!1,sectionId:null},W()},q=()=>{P={isOpen:!1,sectionIndex:0,activity:null},W()},ve=v=>{m={isOpen:!0,sectionId:v},Y()},oe=()=>{x={isOpen:!1},W()},A=async()=>{if(!V)return;const b=(await je.getSections()).filter(g=>g.courseId===V);await Promise.all(b.map(async g=>{const C=await xe.getActivitiesBySection(g.id);await Promise.all(C.map(j=>xe.deleteActivity(j.id)))})),await Promise.all(b.map(g=>je.deleteSection(g.id))),await $e.deleteCourse(V)},u=()=>{x={isOpen:!0},I()},I=()=>{const v=se();if(!x.isOpen){W();return}document.body.classList.add("sections-modal-open"),document.removeEventListener("keydown",R),document.addEventListener("keydown",R),v.innerHTML=`
      <div class="sections-lesson-modal-overlay" id="sections-cancel-course-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-cancel-course-modal-title">
        <div class="sections-lesson-modal-card sections-delete-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-cancel-course-modal-title">${r("cancelCourseModal.title")}</h2>
            <button type="button" id="sections-cancel-course-modal-close" class="sections-lesson-modal-close" aria-label="${r("modal.close")}">✕</button>
          </header>
          <div class="sections-lesson-modal-body">
            <p class="sections-delete-modal-message">${r("cancelCourseModal.message")}</p>
          </div>
          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-cancel-course-modal-back" class="new-course-cancel-btn">${r("cancelCourseModal.cancel")}</button>
            <button type="button" id="sections-cancel-course-modal-confirm" class="new-course-primary-btn">${r("cancelCourseModal.confirm")}</button>
          </footer>
        </div>
      </div>
    `;const b=document.getElementById("sections-cancel-course-modal-overlay"),g=document.getElementById("sections-cancel-course-modal-close"),C=document.getElementById("sections-cancel-course-modal-back"),j=document.getElementById("sections-cancel-course-modal-confirm");b?.addEventListener("click",pe=>{pe.target===b&&oe()}),g?.addEventListener("click",oe),C?.addEventListener("click",oe),j?.addEventListener("click",async()=>{try{await A(),sessionStorage.removeItem(He),sessionStorage.removeItem(ft),T(),oe(),et({clearDraft:!0})}catch{H(o("courses.home.feedback.actionError"),"error")}})},D=async()=>{await Promise.all(d.filter(v=>v.id&&v.courseId).map(v=>je.updateSection(v.id,{title:v.name.trim()||r("defaultSectionTitle")})))},$=async()=>{try{await D(),V&&await $e.deactivateCourse(V),T(),sessionStorage.removeItem(ft),H(o("courses.home.feedback.deactivateSuccess"),"success"),et({clearDraft:!0})}catch{U(),H(o("courses.home.feedback.actionError"),"error")}},Y=()=>{const v=se();if(!m.isOpen||!m.sectionId){W();return}document.body.classList.add("sections-modal-open"),document.removeEventListener("keydown",R),document.addEventListener("keydown",R),v.innerHTML=`
      <div class="sections-lesson-modal-overlay" id="sections-delete-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-delete-modal-title">
        <div class="sections-lesson-modal-card sections-delete-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-delete-modal-title">${r("deleteModal.title")}</h2>
            <button type="button" id="sections-delete-modal-close" class="sections-lesson-modal-close" aria-label="${r("modal.close")}">✕</button>
          </header>

          <div class="sections-lesson-modal-body">
            <p class="sections-delete-modal-message">${r("deleteModal.message")}</p>
          </div>

          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-delete-modal-cancel" class="new-course-cancel-btn">${r("deleteModal.cancel")}</button>
            <button type="button" id="sections-delete-modal-confirm" class="new-course-primary-btn">${r("deleteModal.confirm")}</button>
          </footer>
        </div>
      </div>
    `;const b=document.getElementById("sections-delete-modal-overlay"),g=document.getElementById("sections-delete-modal-close"),C=document.getElementById("sections-delete-modal-cancel"),j=document.getElementById("sections-delete-modal-confirm");b?.addEventListener("click",pe=>{pe.target===b&&he()}),g?.addEventListener("click",he),C?.addEventListener("click",he),j?.addEventListener("click",async()=>{const pe=m.sectionId;if(!pe){he();return}await F(pe),he()})},Ae=v=>{const b=d.findIndex(g=>g.id===v);b<0||(s={isOpen:!0,sectionId:v,editingActivityId:null,sectionIndex:b,name:"",contentType:"",firstText:"",videoFileName:"",hasVideoQuestion:!0,videoQuestion:"",videoAlternatives:["",""],correctVideoAlternativeIndex:0,nameError:!1,contentTypeError:!1,firstTextError:!1,videoError:!1,videoQuestionError:!1,videoAlternativesError:!1,videoCorrectAlternativeError:!1},k=null,de())},J=v=>{const b=d.findIndex(g=>g.id===v);b<0||(l={isOpen:!0,sectionId:v,editingActivityId:null,sectionIndex:b,title:"",contentType:"",question:"",alternatives:["",""],correctAlternativeIndex:0,includeImage:!1,imageFileName:"",titleError:!1,contentTypeError:!1,questionError:!1,alternativesError:!1,correctAlternativeError:!1,imageError:!1},O=null,ye())},be=async(v,b)=>{const g=d.findIndex(C=>C.id===v);if(!(g<0))try{const C=await xe.getActivity(b),j=C.question??"",pe=C.options??[],Fe=C.textPages??[],Be=typeof C.correctAnswer=="number"?C.correctAnswer:C.correctAnswer===!0?0:1;if(C.type==="video_pause"||C.type==="text_reading"){const De=C.type==="video_pause"&&j.trim().length>0,Ve=De?pe.length>=2?pe:["",""]:["",""];s={isOpen:!0,sectionId:v,editingActivityId:C.id,sectionIndex:g,name:C.title??"",contentType:C.type==="video_pause"?"video":"styledText",firstText:C.type==="text_reading"?Fe[0]??"":"",videoFileName:"",hasVideoQuestion:De,videoQuestion:C.type==="video_pause"?j:"",videoAlternatives:Ve,correctVideoAlternativeIndex:C.type==="video_pause"?Be:0,nameError:!1,contentTypeError:!1,firstTextError:!1,videoError:!1,videoQuestionError:!1,videoAlternativesError:!1,videoCorrectAlternativeError:!1},k=null,de();return}if(C.type==="multiple_choice"||C.type==="true_false"){const De=C.type==="true_false",Ve=Dt(),We=Ve==="en-US"?"True":"Verdadeiro",Ze=Ve==="en-US"?"False":"Falso";l={isOpen:!0,sectionId:v,editingActivityId:C.id,sectionIndex:g,title:C.title??"",contentType:De?"trueFalse":"multipleChoice",question:j,alternatives:De?[We,Ze]:pe.length>=2?pe:["",""],correctAlternativeIndex:Be,includeImage:!1,imageFileName:"",titleError:!1,contentTypeError:!1,questionError:!1,alternativesError:!1,correctAlternativeError:!1,imageError:!1},O=null,ye()}}catch{H(o("courses.home.feedback.actionError"),"error")}},Ie=async(v,b)=>{const g=d.findIndex(C=>C.id===v);if(!(g<0))try{const C=await xe.getActivity(b);P={isOpen:!0,sectionIndex:g,activity:C},Ne()}catch{H(o("courses.home.feedback.actionError"),"error")}},Ne=()=>{const v=se();if(!P.isOpen||!P.activity){W();return}document.body.classList.add("sections-modal-open"),document.removeEventListener("keydown",R),document.addEventListener("keydown",R);const b=P.activity,g=(ie,Re)=>o(`courses.sections.readModal.${ie}`,Re),C=b.question??"",j=b.options??[],Fe=(b.textPages??[]).join(`

`).trim(),Be=typeof b.correctAnswer=="number"?b.correctAnswer:b.correctAnswer===!0?0:1,De=b.type==="video_pause"?r("modal.contentTypes.video"):b.type==="text_reading"?r("modal.contentTypes.styledText"):b.type==="true_false"?o("courses.sections.exerciseModal.contentTypes.trueFalse"):o("courses.sections.exerciseModal.contentTypes.multipleChoice"),Ve=j.map((ie,Re)=>`
        <li class="sections-preview-option ${Be===Re?"is-correct":""}">
          <span>${X(ie)}</span>
          ${Be===Re?`<strong>${g("correct")}</strong>`:""}
        </li>
      `).join("");v.innerHTML=`
      <div class="sections-lesson-modal-overlay" id="sections-preview-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-preview-modal-title">
        <div class="sections-lesson-modal-card sections-preview-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-preview-modal-title">${g("title")}</h2>
            <button type="button" id="sections-preview-modal-close" class="sections-lesson-modal-close" aria-label="${r("modal.close")}">✕</button>
          </header>

          <div class="sections-lesson-modal-body">
            <div class="sections-preview-badge">${g("section",{index:P.sectionIndex+1})}</div>
            <div class="sections-preview-grid">
              <div class="sections-preview-row">
                <strong>${g("activityName")}</strong>
                <span>${X(b.title??"")}</span>
              </div>
              <div class="sections-preview-row">
                <strong>${g("activityType")}</strong>
                <span>${X(De)}</span>
              </div>
            </div>
            ${Fe?`<div class="sections-preview-block"><strong>${g("textBody")}</strong><div class="sections-preview-text-body">${X(Fe).replace(/\n/g,"<br>")}</div></div>`:""}
            ${C?`<div class="sections-preview-block"><strong>${g("question")}</strong><div class="sections-preview-text-body">${X(C)}</div></div>`:""}
            ${j.length>0?`<div class="sections-preview-block"><strong>${g("alternatives")}</strong><ul class="sections-preview-options">${Ve}</ul></div>`:""}
          </div>

          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-preview-modal-ok" class="new-course-primary-btn">${g("close")}</button>
          </footer>
        </div>
      </div>
    `;const We=document.getElementById("sections-preview-modal-overlay"),Ze=document.getElementById("sections-preview-modal-close"),it=document.getElementById("sections-preview-modal-ok");We?.addEventListener("click",ie=>{ie.target===We&&q()}),Ze?.addEventListener("click",q),it?.addEventListener("click",q)},ke=v=>new Promise(b=>{const g=URL.createObjectURL(v),C=document.createElement("video");C.preload="metadata",C.onloadedmetadata=()=>{const j=C.duration<=180;URL.revokeObjectURL(g),b(j)},C.onerror=()=>{URL.revokeObjectURL(g),b(!1)},C.src=g}),de=()=>{const v=se(),b=document.querySelector(".sections-lesson-modal-card")?.scrollTop??0;if(!s.isOpen||!s.sectionId){W();return}document.body.classList.add("sections-modal-open"),document.removeEventListener("keydown",R),document.addEventListener("keydown",R);const g=s.contentType==="styledText",C=s.contentType==="video",j=C&&s.hasVideoQuestion,pe=`${s.firstText.length}/270 ${r("modal.characters")}`,Fe=`${s.videoQuestion.length}/70 ${r("modal.characters")}`,Be=s.videoAlternatives.length<4,De=s.videoAlternatives.length>2;v.innerHTML=`
      <div class="sections-lesson-modal-overlay" id="sections-lesson-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-lesson-modal-title">
        <div class="sections-lesson-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-lesson-modal-title">${s.editingActivityId?r("modal.editTitle",{index:s.sectionIndex+1}):r("modal.title",{index:s.sectionIndex+1})}</h2>
            <button type="button" id="sections-lesson-modal-close" class="sections-lesson-modal-close" aria-label="${r("modal.close")}">✕</button>
          </header>

          <div class="sections-lesson-modal-body">
            <label class="new-course-field">
              <span>${r("modal.fields.name")} <em>*</em></span>
              <input type="text" id="lesson-name-input" maxlength="120" value="${X(s.name)}" placeholder="${r("modal.fields.namePlaceholder")}" class="${s.nameError?"is-invalid":""}">
            </label>

            <div class="sections-lesson-modal-content-type ${s.contentTypeError?"is-invalid":""}">
              <strong>${r("modal.fields.contentType")} <em>*</em></strong>
              <div class="sections-lesson-modal-radios">
                <label class="sections-lesson-modal-radio">
                  <input type="radio" name="lesson-content-type" value="video" ${s.contentType==="video"?"checked":""}>
                  <span>${r("modal.contentTypes.video")}</span>
                </label>
                <label class="sections-lesson-modal-radio">
                  <input type="radio" name="lesson-content-type" value="styledText" ${s.contentType==="styledText"?"checked":""}>
                  <span>${r("modal.contentTypes.styledText")}</span>
                </label>
              </div>
            </div>

            ${C?`
              <div class="sections-lesson-modal-video ${s.videoError?"is-invalid":""}">
                <strong>${r("modal.fields.videoUpload")} <em>*</em></strong>
                <input type="file" id="lesson-video-input" accept="video/*" hidden>
                <div class="sections-lesson-modal-video-box">
                  <button type="button" id="lesson-video-trigger" class="sections-lesson-modal-video-btn">${r("modal.fields.videoSelect")}</button>
                  ${s.videoFileName?`<div class="sections-lesson-modal-video-name">🎬 ${X(s.videoFileName)}</div>`:""}
                </div>
                <small>${r("modal.fields.videoHint")}</small>
              </div>
            `:""}

            ${C?`
              <div class="sections-lesson-modal-question-toggle-wrap">
                <label class="sections-modal-switch" for="lesson-video-has-question">
                  <input type="checkbox" id="lesson-video-has-question" ${s.hasVideoQuestion?"checked":""}>
                  <span class="sections-modal-switch-track"></span>
                  <span class="sections-modal-switch-label">${r("modal.fields.finalQuestion")}</span>
                </label>
              </div>
            `:""}

            ${j?`
              <div class="sections-lesson-modal-question ${s.videoQuestionError?"is-invalid":""}">
                <label class="new-course-field">
                  <span>${r("modal.fields.videoQuestion")} <em>*</em></span>
                  <textarea id="lesson-video-question" maxlength="70" placeholder="${r("modal.fields.videoQuestionPlaceholder")}" class="${s.videoQuestionError?"is-invalid":""}">${X(s.videoQuestion)}</textarea>
                  <small>${Fe}</small>
                </label>

                <div class="sections-lesson-modal-alternatives ${s.videoAlternativesError?"is-invalid":""}">
                  <strong>${r("modal.fields.alternatives")} <em>*</em></strong>
                  <div class="sections-lesson-modal-alternatives-list">
                    ${s.videoAlternatives.map((n,a)=>{const c=String.fromCharCode(65+a),f=s.correctVideoAlternativeIndex===a;return`
                          <div class="sections-lesson-modal-alternative-block">
                            <label class="sections-lesson-modal-alternative-card">
                              <span class="sections-lesson-modal-alternative-letter">${c}</span>
                              <input type="text" maxlength="50" data-alternative-index="${a}" placeholder="${r("modal.fields.alternativePlaceholder",{letter:c})}" value="${X(n)}">
                            </label>
                            <label class="sections-lesson-modal-correct-toggle">
                              <input type="checkbox" data-correct-alternative-index="${a}" ${f?"checked":""}>
                              <span>${r("modal.fields.correctAlternative")}</span>
                            </label>
                          </div>
                        `}).join("")}
                  </div>
                  <div class="sections-lesson-modal-alternatives-actions">
                    <button type="button" id="lesson-add-alternative" class="sections-lesson-modal-alt-btn" ${Be?"":"disabled"}>${r("modal.fields.addAlternative")}</button>
                    <button type="button" id="lesson-remove-alternative" class="sections-lesson-modal-alt-btn is-danger" ${De?"":"disabled"}>${r("modal.fields.removeAlternative")}</button>
                  </div>
                  <small>${r("modal.fields.alternativesHint")}</small>
                </div>

                ${s.videoCorrectAlternativeError?`<div class="sections-lesson-modal-correct-error">${r("modal.fields.correctAlternativeRequired")}</div>`:""}
              </div>
            `:""}

            ${g?`
              <div class="sections-lesson-modal-texts">
                <label class="new-course-field">
                  <span>${r("modal.fields.firstText")} <em>*</em></span>
                  <textarea id="lesson-first-text" maxlength="270" placeholder="${r("modal.fields.firstTextPlaceholder")}" class="${s.firstTextError?"is-invalid":""}">${X(s.firstText)}</textarea>
                  <small>${pe}</small>
                </label>
              </div>
            `:""}
          </div>

          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-lesson-modal-cancel" class="new-course-cancel-btn">${r("modal.cancel")}</button>
            <button type="button" id="sections-lesson-modal-submit" class="new-course-primary-btn">${s.editingActivityId?r("modal.editSubmit"):r("modal.submit")}</button>
          </footer>
        </div>
      </div>
    `;const Ve=document.getElementById("sections-lesson-modal-overlay"),We=document.getElementById("sections-lesson-modal-close"),Ze=document.getElementById("sections-lesson-modal-cancel"),it=document.getElementById("sections-lesson-modal-submit"),ie=document.getElementById("lesson-name-input"),Re=document.getElementById("lesson-video-input"),tt=document.getElementById("lesson-video-trigger"),lt=document.getElementById("lesson-video-has-question"),Xe=document.getElementById("lesson-video-question"),ot=document.getElementById("lesson-add-alternative"),qe=document.getElementById("lesson-remove-alternative"),rt=document.getElementById("lesson-first-text"),dt=document.querySelector(".sections-lesson-modal-card");dt&&(dt.scrollTop=b),Ve?.addEventListener("click",n=>{n.target===Ve&&ge()}),We?.addEventListener("click",ge),Ze?.addEventListener("click",ge),ie?.addEventListener("input",()=>{s.name=ie.value,s.nameError&&s.name.trim().length>0&&(s.nameError=!1,de())}),document.querySelectorAll('input[name="lesson-content-type"]').forEach(n=>{n.addEventListener("change",()=>{s.contentType=n.value,s.contentTypeError=!1,s.firstTextError=!1,s.videoError=!1,s.videoQuestionError=!1,s.videoCorrectAlternativeError=!1,s.contentType!=="video"&&(s.videoFileName="",k=null,s.hasVideoQuestion=!0,s.videoQuestion="",s.videoAlternatives=["",""],s.correctVideoAlternativeIndex=0),de()})}),lt?.addEventListener("change",()=>{s.hasVideoQuestion=lt.checked,s.videoQuestionError=!1,s.videoAlternativesError=!1,s.videoCorrectAlternativeError=!1,de()}),Xe?.addEventListener("input",()=>{s.videoQuestion=Xe.value,s.videoQuestionError&&s.videoQuestion.trim().length>0&&(s.videoQuestionError=!1,de())}),document.querySelectorAll("[data-alternative-index]").forEach(n=>{const a=Number(n.dataset.alternativeIndex);n.addEventListener("input",()=>{s.videoAlternatives[a]=n.value,s.videoAlternativesError&&s.videoAlternatives.every(f=>f.trim().length>0)&&(s.videoAlternativesError=!1,de())})}),document.querySelectorAll("[data-correct-alternative-index]").forEach(n=>{const a=Number(n.dataset.correctAlternativeIndex);n.addEventListener("change",()=>{n.checked?s.correctVideoAlternativeIndex=a:s.correctVideoAlternativeIndex===a&&(s.correctVideoAlternativeIndex=null),s.videoCorrectAlternativeError=!1,de()})}),ot?.addEventListener("click",()=>{s.videoAlternatives.length>=4||(s.videoAlternatives.push(""),de())}),qe?.addEventListener("click",()=>{s.videoAlternatives.length<=2||(s.videoAlternatives.pop(),s.correctVideoAlternativeIndex!==null&&s.correctVideoAlternativeIndex>=s.videoAlternatives.length&&(s.correctVideoAlternativeIndex=s.videoAlternatives.length-1),de())}),tt?.addEventListener("click",()=>{Re?.click()}),Re?.addEventListener("change",async()=>{const n=Re.files?.[0]??null;if(!n)return;if(!await ke(n)){s.videoError=!0,s.videoFileName="",k=null,H(r("modal.videoTooLong"),"error"),de();return}k=n,s.videoFileName=n.name,s.videoError=!1,de()}),rt?.addEventListener("input",()=>{s.firstText=rt.value,s.firstTextError&&s.firstText.trim().length>0&&(s.firstTextError=!1,de())}),it?.addEventListener("click",async()=>{const n=s.name.trim().length>0,a=s.contentType.length>0,c=s.editingActivityId!==null&&s.contentType==="video",f=s.contentType!=="video"||!!k||c,S=s.contentType==="video"&&s.hasVideoQuestion,E=!S||s.videoQuestion.trim().length>0,_=!S||s.videoAlternatives.every(Ce=>Ce.trim().length>0),L=!S||s.correctVideoAlternativeIndex!==null&&s.correctVideoAlternativeIndex>=0&&s.correctVideoAlternativeIndex<s.videoAlternatives.length,N=!(s.contentType==="styledText")||s.firstText.trim().length>0;if(s.nameError=!n,s.contentTypeError=!a,s.videoError=!f,s.videoQuestionError=!E,s.videoAlternativesError=!_,s.videoCorrectAlternativeError=!L,s.firstTextError=!N,!n||!a||!f||!E||!_||!L||!N){de();return}const B=d.find(Ce=>Ce.id===s.sectionId);if(!B){ge();return}const le=B.lessons+B.exercises;if(!s.editingActivityId&&le>=10){H(r("maxItemsError"),"error"),ge();return}try{const Ce=s.contentType==="video"?"video_pause":"text_reading",ue=s.editingActivityId?B.activities.find(Ee=>Ee.id===s.editingActivityId)?.order??B.activities.length:B.activities.length,ze=s.contentType==="styledText",Te=s.contentType==="video"&&s.hasVideoQuestion?s.videoAlternatives.map(Ee=>Ee.trim()):[],st=s.contentType==="video"&&s.hasVideoQuestion?s.correctVideoAlternativeIndex??0:0;if(s.editingActivityId){const Ee=await xe.updateActivity(s.editingActivityId,{title:s.name.trim(),type:Ce,order:ue,question:s.contentType==="video"&&s.hasVideoQuestion?s.videoQuestion.trim():"",textPages:ze?[s.firstText.trim()]:[],options:Te,correctAnswer:st}),we=B.activities.find(Ke=>Ke.id===Ee.id);we&&(we.title=Ee.title??s.name.trim(),we.type=Ee.type,we.order=Ee.order)}else{const Ee=await xe.createActivity({id:crypto.randomUUID(),sectionId:B.id,title:s.name.trim(),type:Ce,order:ue,question:s.contentType==="video"&&s.hasVideoQuestion?s.videoQuestion.trim():"",textPages:ze?[s.firstText.trim()]:[],options:Te,correctAnswer:st});B.activities.push({id:Ee.id,sectionId:Ee.sectionId,title:Ee.title??s.name.trim(),type:Ee.type,order:Ee.order})}B.activities.sort((Ee,we)=>Ee.order-we.order);const nt=te(B.activities);B.lessons=nt.lessons,B.exercises=nt.exercises,U(),Le(),Oe(),H(s.editingActivityId?r("modal.updateSuccess"):r("modal.success"),"success"),ge()}catch{H(o("courses.home.feedback.actionError"),"error")}})},ye=()=>{const v=se(),b=document.querySelector(".sections-lesson-modal-card")?.scrollTop??0;if(!l.isOpen||!l.sectionId){W();return}document.body.classList.add("sections-modal-open"),document.removeEventListener("keydown",R),document.addEventListener("keydown",R);const g=(E,_)=>o(`courses.sections.exerciseModal.${E}`,_),C=Dt(),j=g("fields.trueOption"),pe=g("fields.falseOption"),Fe=j.startsWith("courses.sections.exerciseModal.")?C==="en-US"?"True":"Verdadeiro":j,Be=pe.startsWith("courses.sections.exerciseModal.")?C==="en-US"?"False":"Falso":pe,De=l.contentType==="multipleChoice",Ve=l.contentType==="trueFalse",We=De||Ve,Ze=We&&l.includeImage,it=`${l.question.length}/70 ${r("modal.characters")}`,ie=l.alternatives.length<4,Re=l.alternatives.length>2;v.innerHTML=`
      <div class="sections-lesson-modal-overlay" id="sections-exercise-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-exercise-modal-title">
        <div class="sections-lesson-modal-card sections-exercise-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-exercise-modal-title">${l.editingActivityId?g("editTitle",{index:l.sectionIndex+1}):g("title",{index:l.sectionIndex+1})}</h2>
            <button type="button" id="sections-exercise-modal-close" class="sections-lesson-modal-close" aria-label="${g("close")}">✕</button>
          </header>

          <div class="sections-lesson-modal-body">
            <label class="new-course-field">
              <span>${g("fields.title")} <em>*</em></span>
              <input type="text" id="exercise-title-input" maxlength="120" value="${X(l.title)}" placeholder="${g("fields.titlePlaceholder")}" class="${l.titleError?"is-invalid":""}">
            </label>

            <div class="sections-exercise-types ${l.contentTypeError?"is-invalid":""}">
              <strong>${g("fields.contentType")} <em>*</em></strong>
              <div class="sections-exercise-types-list">
                <label class="sections-lesson-modal-radio">
                  <input type="radio" name="exercise-content-type" value="multipleChoice" ${l.contentType==="multipleChoice"?"checked":""}>
                  <span>${g("contentTypes.multipleChoice")}</span>
                </label>
                <label class="sections-lesson-modal-radio">
                  <input type="radio" name="exercise-content-type" value="trueFalse" ${l.contentType==="trueFalse"?"checked":""}>
                  <span>${g("contentTypes.trueFalse")}</span>
                </label>
              </div>
            </div>

            ${We?`
              <div class="sections-lesson-modal-question ${l.questionError?"is-invalid":""}">
                <label class="new-course-field">
                  <span>${g("fields.question")} <em>*</em></span>
                  <textarea id="exercise-question-input" maxlength="70" placeholder="${g("fields.questionPlaceholder")}" class="${l.questionError?"is-invalid":""}">${X(l.question)}</textarea>
                  <small>${it}</small>
                </label>

                <div class="sections-lesson-modal-alternatives ${l.alternativesError?"is-invalid":""}">
                  <strong>${g("fields.alternatives")} <em>*</em></strong>
                  <div class="sections-lesson-modal-alternatives-list">
                    ${De?l.alternatives.map((E,_)=>{const L=String.fromCharCode(65+_),K=l.correctAlternativeIndex===_;return`
                            <div class="sections-lesson-modal-alternative-block">
                              <label class="sections-lesson-modal-alternative-card">
                                <span class="sections-lesson-modal-alternative-letter">${L}</span>
                                <input type="text" maxlength="50" data-exercise-alternative-index="${_}" placeholder="${g("fields.alternativePlaceholder",{letter:L})}" value="${X(E)}">
                              </label>
                              <label class="sections-lesson-modal-correct-toggle">
                                <input type="checkbox" data-exercise-correct-alternative-index="${_}" ${K?"checked":""}>
                                <span>${g("fields.correctAlternative")}</span>
                              </label>
                            </div>
                          `}).join(""):`
                        <div class="sections-lesson-modal-alternative-block">
                          <div class="sections-lesson-modal-alternative-card">
                            <span class="sections-lesson-modal-alternative-letter">V</span>
                            <span class="sections-lesson-modal-alternative-static">${Fe}</span>
                          </div>
                          <label class="sections-lesson-modal-correct-toggle">
                            <input type="checkbox" data-exercise-correct-alternative-index="0" ${l.correctAlternativeIndex===0?"checked":""}>
                            <span>${g("fields.correctAlternative")}</span>
                          </label>
                        </div>
                        <div class="sections-lesson-modal-alternative-block">
                          <div class="sections-lesson-modal-alternative-card">
                            <span class="sections-lesson-modal-alternative-letter">F</span>
                            <span class="sections-lesson-modal-alternative-static">${Be}</span>
                          </div>
                          <label class="sections-lesson-modal-correct-toggle">
                            <input type="checkbox" data-exercise-correct-alternative-index="1" ${l.correctAlternativeIndex===1?"checked":""}>
                            <span>${g("fields.correctAlternative")}</span>
                          </label>
                        </div>
                      `}
                  </div>
                  ${De?`
                    <div class="sections-lesson-modal-alternatives-actions">
                      <button type="button" id="exercise-add-alternative" class="sections-lesson-modal-alt-btn" ${ie?"":"disabled"}>${g("fields.addAlternative")}</button>
                      <button type="button" id="exercise-remove-alternative" class="sections-lesson-modal-alt-btn is-danger" ${Re?"":"disabled"}>${g("fields.removeAlternative")}</button>
                    </div>
                  `:""}
                  <small>${g(De?"fields.alternativesHint":"fields.trueFalseHint")}</small>
                </div>

                ${l.correctAlternativeError?`<div class="sections-lesson-modal-correct-error">${g("fields.correctAlternativeRequired")}</div>`:""}

                <div class="sections-lesson-modal-question-toggle-wrap">
                  <label class="sections-modal-switch" for="exercise-include-image-toggle">
                    <input type="checkbox" id="exercise-include-image-toggle" ${l.includeImage?"checked":""}>
                    <span class="sections-modal-switch-track"></span>
                    <span class="sections-modal-switch-label">${g("fields.includeImage")}</span>
                  </label>
                </div>

                ${Ze?`
                  <div class="sections-lesson-modal-video ${l.imageError?"is-invalid":""}">
                    <strong>${g("fields.imageUpload")} <em>*</em></strong>
                    <input type="file" id="exercise-image-input" accept="image/*" hidden>
                    <div class="sections-lesson-modal-video-box">
                      <button type="button" id="exercise-image-trigger" class="sections-lesson-modal-video-btn">${g("fields.imageSelect")}</button>
                      ${l.imageFileName?`<div class="sections-lesson-modal-video-name">🖼️ ${X(l.imageFileName)}</div>`:""}
                    </div>
                    <small>${g("fields.imageHint")}</small>
                  </div>
                `:""}
              </div>
            `:""}
          </div>

          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-exercise-modal-cancel" class="new-course-cancel-btn">${g("cancel")}</button>
            <button type="button" id="sections-exercise-modal-submit" class="new-course-primary-btn">${l.editingActivityId?g("editSubmit"):g("submit")}</button>
          </footer>
        </div>
      </div>
    `;const tt=document.getElementById("sections-exercise-modal-overlay"),lt=document.getElementById("sections-exercise-modal-close"),Xe=document.getElementById("sections-exercise-modal-cancel"),ot=document.getElementById("sections-exercise-modal-submit"),qe=document.getElementById("exercise-title-input"),rt=document.getElementById("exercise-question-input"),dt=document.getElementById("exercise-add-alternative"),n=document.getElementById("exercise-remove-alternative"),a=document.getElementById("exercise-include-image-toggle"),c=document.getElementById("exercise-image-input"),f=document.getElementById("exercise-image-trigger"),S=document.querySelector(".sections-lesson-modal-card");S&&(S.scrollTop=b),tt?.addEventListener("click",E=>{E.target===tt&&ce()}),lt?.addEventListener("click",ce),Xe?.addEventListener("click",ce),qe?.addEventListener("input",()=>{l.title=qe.value,l.titleError&&l.title.trim().length>0&&(l.titleError=!1,ye())}),rt?.addEventListener("input",()=>{l.question=rt.value,l.questionError&&l.question.trim().length>0&&(l.questionError=!1,ye())}),document.querySelectorAll('input[name="exercise-content-type"]').forEach(E=>{E.addEventListener("change",()=>{l.contentType=E.value,l.contentTypeError=!1,l.questionError=!1,l.alternativesError=!1,l.correctAlternativeError=!1,l.imageError=!1,l.contentType==="multipleChoice"&&(l.alternatives=["",""],l.correctAlternativeIndex=0),l.contentType==="trueFalse"&&(l.alternatives=[Fe,Be],l.correctAlternativeIndex=0),l.contentType!=="multipleChoice"&&l.contentType!=="trueFalse"&&(l.question="",l.alternatives=["",""],l.correctAlternativeIndex=0,l.includeImage=!1,l.imageFileName="",O=null),ye()})}),a?.addEventListener("change",()=>{l.includeImage=a.checked,l.imageError=!1,l.includeImage||(l.imageFileName="",O=null),ye()}),f?.addEventListener("click",()=>{c?.click()}),c?.addEventListener("change",()=>{const E=c.files?.[0]??null;if(!E){l.imageFileName="",O=null,ye();return}O=E,l.imageFileName=E.name,l.imageError=!1,ye()}),document.querySelectorAll("[data-exercise-alternative-index]").forEach(E=>{const _=Number(E.dataset.exerciseAlternativeIndex);E.addEventListener("input",()=>{l.alternatives[_]=E.value,l.alternativesError&&l.alternatives.every(K=>K.trim().length>0)&&(l.alternativesError=!1,ye())})}),document.querySelectorAll("[data-exercise-correct-alternative-index]").forEach(E=>{const _=Number(E.dataset.exerciseCorrectAlternativeIndex);E.addEventListener("change",()=>{E.checked?l.correctAlternativeIndex=_:l.correctAlternativeIndex===_&&(l.correctAlternativeIndex=null),l.correctAlternativeError=!1,ye()})}),dt?.addEventListener("click",()=>{De&&(l.alternatives.length>=4||(l.alternatives.push(""),ye()))}),n?.addEventListener("click",()=>{De&&(l.alternatives.length<=2||(l.alternatives.pop(),l.correctAlternativeIndex!==null&&l.correctAlternativeIndex>=l.alternatives.length&&(l.correctAlternativeIndex=l.alternatives.length-1),ye()))}),ot?.addEventListener("click",async()=>{const E=l.title.trim().length>0,_=l.contentType.length>0,L=l.contentType==="multipleChoice"||l.contentType==="trueFalse",K=l.contentType==="multipleChoice",N=!L||l.question.trim().length>0,B=!K||l.alternatives.every(Te=>Te.trim().length>0),le=!L||!l.includeImage||!!O,Ce=!L||l.correctAlternativeIndex!==null&&l.correctAlternativeIndex>=0&&l.correctAlternativeIndex<(l.contentType==="trueFalse"?2:l.alternatives.length);if(l.titleError=!E,l.contentTypeError=!_,l.questionError=!N,l.alternativesError=!B,l.correctAlternativeError=!Ce,l.imageError=!le,!E||!_||!N||!B||!Ce||!le){ye();return}const ue=d.find(Te=>Te.id===l.sectionId);if(!ue){ce();return}const ze=ue.lessons+ue.exercises;if(!l.editingActivityId&&ze>=10){H(r("maxItemsError"),"error"),ce();return}try{const Te=l.contentType==="trueFalse",st=Te?[Fe,Be]:l.alternatives.map(we=>we.trim()),nt=l.editingActivityId?ue.activities.find(we=>we.id===l.editingActivityId)?.order??ue.activities.length:ue.activities.length;if(l.editingActivityId){const we=await xe.updateActivity(l.editingActivityId,{title:l.title.trim(),type:Te?"true_false":"multiple_choice",order:nt,question:l.question.trim(),options:st,correctAnswer:l.correctAlternativeIndex??0}),Ke=ue.activities.find(Mt=>Mt.id===we.id);Ke&&(Ke.title=we.title??l.title.trim(),Ke.type=we.type,Ke.order=we.order)}else{const we=await xe.createActivity({id:crypto.randomUUID(),sectionId:ue.id,title:l.title.trim(),type:Te?"true_false":"multiple_choice",order:ue.activities.length,question:l.question.trim(),options:st,correctAnswer:l.correctAlternativeIndex??0});ue.activities.push({id:we.id,sectionId:we.sectionId,title:we.title??l.title.trim(),type:we.type,order:we.order})}ue.activities.sort((we,Ke)=>we.order-Ke.order);const Ee=te(ue.activities);ue.lessons=Ee.lessons,ue.exercises=Ee.exercises,U(),Le(),Oe(),H(l.editingActivityId?g("updateSuccess"):g("success"),"success"),ce()}catch{H(o("courses.home.feedback.actionError"),"error")}})},Le=()=>{M&&(M.innerHTML=d.map((v,b)=>{const g=v.lessons+v.exercises,C=v.activities.sort((j,pe)=>j.order-pe.order).map(j=>{const pe=j.type==="video_pause"?"▶":j.type==="text_reading"?"≡":"✓",Fe=j.type==="video_pause"?"is-video":j.type==="text_reading"?"is-text":"is-exercise";return`
              <div class="section-activity-card" data-section-id="${v.id}" data-activity-id="${j.id}">
                <div class="section-activity-main">
                  <span class="section-activity-icon ${Fe}" aria-hidden="true">${pe}</span>
                  <span class="section-activity-name">${X(j.title)}</span>
                </div>
                <div class="section-activity-actions" aria-hidden="true">
                  <button type="button" class="section-activity-action" data-action="edit" data-section-id="${v.id}" data-activity-id="${j.id}">✎</button>
                  <button type="button" class="section-activity-action" data-action="view" data-section-id="${v.id}" data-activity-id="${j.id}" aria-label="Visualizar atividade"><img src="/icons/visibility.png" alt="" class="section-activity-action-icon"></button>
                  <button type="button" class="section-activity-action section-activity-delete" data-section-id="${v.id}" data-activity-id="${j.id}">✕</button>
                </div>
              </div>
            `}).join("");return`
          <article class="section-card" data-section-id="${v.id}">
            <header class="section-card-head">
              <div class="section-card-head-row">
                <div class="section-card-title">${r("sectionLabel",{index:b+1})}: ${X(v.name||h)}</div>
                <button type="button" class="section-delete-btn" data-section-id="${v.id}" aria-label="Remover seção">✕</button>
              </div>
            </header>
            <div class="section-card-body">
              <label class="new-course-field">
                <span>${r("fields.name")} <em>*</em></span>
                <input type="text" class="section-name-input" value="${X(v.name)}" placeholder="${r("fields.namePlaceholder")}">
              </label>
              <label class="new-course-field">
                <span>${r("fields.description")} <em>*</em></span>
                <input type="text" class="section-description-input" value="${X(v.description)}" placeholder="${r("fields.descriptionPlaceholder")}">
              </label>
              <div class="section-divider" aria-hidden="true"></div>
              <div class="section-activities-list">${C}</div>
              <div class="section-divider" aria-hidden="true"></div>
              <div class="section-actions">
                <button type="button" class="section-add-btn" data-action="lesson" data-section-id="${v.id}">+ ${r("addLesson")}</button>
                <span>${r("or")}</span>
                <button type="button" class="section-add-btn" data-action="exercise" data-section-id="${v.id}">+ ${r("addExercise")}</button>
              </div>
              <div class="section-items-count">${g} / 10 ${r("items")}</div>
            </div>
          </article>
        `}).join(""),M.querySelectorAll(".section-name-input").forEach((v,b)=>{v.addEventListener("input",()=>{d[b].name=v.value,U()}),v.addEventListener("blur",async()=>{const g=d[b];g&&await p(g.id,v.value)})}),M.querySelectorAll(".section-description-input").forEach((v,b)=>{v.addEventListener("input",()=>{d[b].description=v.value,U()})}),M.querySelectorAll(".section-add-btn").forEach(v=>{v.addEventListener("click",()=>{const b=v.dataset.sectionId,g=v.dataset.action;if(!b||!g)return;const C=d.find(pe=>pe.id===b);if(!C)return;if(C.lessons+C.exercises>=10){H(r("maxItemsError"),"error");return}if(g==="lesson"){Ae(b);return}if(g==="exercise"){J(b);return}})}),M.querySelectorAll(".section-activity-delete").forEach(v=>{v.addEventListener("click",async()=>{const b=v.dataset.sectionId,g=v.dataset.activityId;!b||!g||await y(b,g)})}),M.querySelectorAll('.section-activity-action[data-action="edit"]').forEach(v=>{v.addEventListener("click",async()=>{const b=v.dataset.sectionId,g=v.dataset.activityId;!b||!g||await be(b,g)})}),M.querySelectorAll('.section-activity-action[data-action="view"]').forEach(v=>{v.addEventListener("click",async()=>{const b=v.dataset.sectionId,g=v.dataset.activityId;!b||!g||await Ie(b,g)})}),M.querySelectorAll(".section-delete-btn").forEach(v=>{v.addEventListener("click",async()=>{const b=v.dataset.sectionId;b&&ve(b)})}))},Oe=()=>{if(!G)return;const b=(d.reduce((g,C)=>g+C.lessons+C.exercises,0)*.25).toFixed(1);G.textContent=`${b} ${r("hours")}`},et=v=>{ge(),ce(),q(),he(),oe(),sessionStorage.setItem(Qe,"list"),v?.clearDraft&&sessionStorage.removeItem(He),kt(t,i)},Ge=async()=>{ge(),ce(),q(),he(),oe();try{await D()}catch{U()}U(),sessionStorage.setItem(Qe,"create"),Tt(t,i)},at=async()=>{try{await D()}catch{U()}U(),sessionStorage.setItem(Qe,"review"),un(t,i,e)};document.getElementById("sections-add")?.addEventListener("click",()=>{w()}),document.getElementById("sections-save-draft")?.addEventListener("click",()=>{$()}),document.getElementById("sections-save-draft-mobile")?.addEventListener("click",()=>{$()}),document.getElementById("sections-back")?.addEventListener("click",()=>{Ge()}),document.getElementById("sections-cancel")?.addEventListener("click",()=>{u()}),document.getElementById("sections-next")?.addEventListener("click",()=>{at()}),re()}function un(t,i,e){sessionStorage.setItem(Qe,"review");const r=(T,ee)=>o(`courses.review.${T}`,ee),h=(T,ee)=>o(`courses.newCourse.${T}`,ee),d=e?.id??"",s=()=>`${Yt}:${d||"local"}`;t.innerHTML=`
    <section class="new-course-page">
      <div class="new-course-layout sections-layout">
        <aside class="new-course-sidebar">
          <div class="new-course-sidebar-header">
            <h2>${h("title")}</h2>
            <div class="new-course-divider"></div>
          </div>

          <div class="new-course-steps">
            <div class="new-course-step is-complete">
              <span class="new-course-step-check">✓</span>
              <span>${h("generalInfo")}</span>
            </div>
            <div class="new-course-step is-complete">
              <span class="new-course-step-check">✓</span>
              <span>${h("sections")}</span>
            </div>
            <div class="new-course-step is-active">
              <span class="new-course-step-box"></span>
              <span>${h("review")}</span>
            </div>
          </div>

          <div class="new-course-divider"></div>

          <button id="review-save-draft" class="new-course-outline-btn" type="button">${h("saveDraft")}</button>
        </aside>

        <div class="new-course-content review-content">
          <div class="new-course-main">
            <h1>${r("title")}</h1>

            <div class="sections-alert review-alert">
              <span class="sections-alert-icon">!</span>
              <div>
                <p>${r("alert")}</p>
              </div>
            </div>

            <div class="review-cards">
              <article class="review-card">
                <h2>${r("generalInfo.title")}</h2>
                <div class="review-phone-frame">
                  <div class="review-phone-notch" aria-hidden="true"></div>
                  <div id="review-general-info" class="review-card-body review-phone-screen"></div>
                </div>
              </article>

              <article class="review-card">
                <h2>${r("sections.title")}</h2>
                <div class="review-phone-frame">
                  <div class="review-phone-notch" aria-hidden="true"></div>
                  <div id="review-sections-list" class="review-card-body review-phone-screen review-sections-list"></div>
                </div>
              </article>
            </div>
          </div>

          <div class="new-course-footer">
            <button id="review-back" class="new-course-link-btn" type="button">${h("ctas.back")}</button>
            <div class="new-course-footer-actions">
              <button id="review-cancel" class="new-course-cancel-btn" type="button">${h("ctas.cancel")}</button>
              <button id="review-publish" class="new-course-primary-btn" type="button">${r("publish")}</button>
            </div>
          </div>

          <div class="new-course-mobile-draft">
            <button id="review-save-draft-mobile" class="new-course-outline-btn" type="button">${h("saveDraft")}</button>
          </div>
        </div>
      </div>
    </section>
  `;const l=document.getElementById("review-general-info"),k=document.getElementById("review-sections-list");let O=!1;const m=()=>{sessionStorage.removeItem(He),sessionStorage.removeItem(ft),sessionStorage.removeItem(s())},x=()=>{sessionStorage.setItem(Qe,"list"),kt(t,i)},P=()=>{sessionStorage.setItem(Qe,"sections");const T=sessionStorage.getItem(He),ee=T?JSON.parse(T):e;Ut(t,i,ee)},V=async T=>{const te=(await je.getSections()).filter(ae=>ae.courseId===T);await Promise.all(te.map(async ae=>{const Z=await xe.getActivitiesBySection(ae.id);await Promise.all(Z.map(re=>xe.deleteActivity(re.id)))})),await Promise.all(te.map(ae=>je.deleteSection(ae.id))),await $e.deleteCourse(T)},z=()=>{O=!1;const T=document.getElementById("review-cancel-modal");T&&T.remove()},M=()=>{if(O)return;O=!0;const T=document.createElement("div");T.id="review-cancel-modal",T.innerHTML=`
      <div class="sections-lesson-modal-overlay" id="review-cancel-overlay" role="dialog" aria-modal="true" aria-labelledby="review-cancel-title">
        <div class="sections-lesson-modal-card sections-delete-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="review-cancel-title">${o("courses.sections.cancelCourseModal.title")}</h2>
            <button type="button" id="review-cancel-close" class="sections-lesson-modal-close" aria-label="${o("courses.sections.modal.close")}">✕</button>
          </header>
          <div class="sections-lesson-modal-body">
            <p class="sections-delete-modal-message">${o("courses.sections.cancelCourseModal.message")}</p>
          </div>
          <footer class="sections-lesson-modal-actions">
            <button type="button" id="review-cancel-no" class="new-course-cancel-btn">${o("courses.sections.cancelCourseModal.cancel")}</button>
            <button type="button" id="review-cancel-yes" class="new-course-primary-btn">${o("courses.sections.cancelCourseModal.confirm")}</button>
          </footer>
        </div>
      </div>
    `,document.body.appendChild(T);const ee=document.getElementById("review-cancel-overlay"),te=document.getElementById("review-cancel-close"),ae=document.getElementById("review-cancel-no"),Z=document.getElementById("review-cancel-yes");ee?.addEventListener("click",re=>{re.target===ee&&z()}),te?.addEventListener("click",z),ae?.addEventListener("click",z),Z?.addEventListener("click",async()=>{try{const re=sessionStorage.getItem(He),w=re?JSON.parse(re):null;w?.id&&await V(w.id),m(),z(),x()}catch{H(o("courses.home.feedback.actionError"),"error")}})},G=async()=>{try{const T=sessionStorage.getItem(He),ee=T?JSON.parse(T):e;ee?.id&&await $e.deactivateCourse(ee.id),m(),H(o("courses.home.feedback.deactivateSuccess"),"success"),x()}catch{H(o("courses.home.feedback.actionError"),"error")}},U=async()=>{try{const T=sessionStorage.getItem(He),ee=T?JSON.parse(T):e;if(!ee?.id){H(o("courses.home.feedback.actionError"),"error");return}await $e.activateCourse(ee.id),m(),H(r("publishSuccess"),"success"),x()}catch{H(o("courses.home.feedback.actionError"),"error")}},ne=async()=>{if(!(!l||!k)){if(!d){l.innerHTML=`<div class="creator-empty-state">${r("missingDraft")}</div>`,k.innerHTML=`<div class="creator-empty-state">${r("missingDraft")}</div>`;return}try{const[T,ee,te]=await Promise.all([$e.getCourse(d),je.getSections(),_t.getTags()]);sessionStorage.setItem(He,JSON.stringify(T));const ae=sessionStorage.getItem(s()),Z=ae?JSON.parse(ae):null,re=ee.filter(R=>R.courseId===d).sort((R,W)=>R.order-W.order).map(R=>{const W=Z?.sections?.find(ge=>ge.id===R.id);return{id:R.id,title:W?.name?.trim()||R.title,description:W?.description?.trim()||""}}),w=await Promise.all(re.map(async R=>{const W=await xe.getActivitiesBySection(R.id),ge=W.filter(he=>he.type==="video_pause"||he.type==="text_reading").length,ce=W.filter(he=>he.type==="multiple_choice"||he.type==="true_false").length;return{...R,lessons:ge,exercises:ce}})),y=`${(w.reduce((R,W)=>R+W.lessons+W.exercises,0)*.25).toFixed(1)} ${o("courses.sections.hours")}`,F=(T.estimatedTime||"").trim()||y,Q=(T.tags||[]).map(R=>te.find(W=>W.id===R)?.name).filter(Boolean),se=T.difficulty==="beginner"?"beginner":T.difficulty==="intermediate"?"intermediate":"advanced";if(l.innerHTML=`
        <div class="review-info-list">
          <div class="review-info-item"><strong>${r("generalInfo.name")}</strong><span>${X(T.title)}</span></div>
          <div class="review-info-item"><strong>${r("generalInfo.category")}</strong><span>${X(T.category)}</span></div>
          <div class="review-info-item"><strong>${r("generalInfo.level")}</strong><span>${X(o(`courses.newCourse.difficultyOptions.${se}`))}</span></div>
          <div class="review-info-item"><strong>${r("generalInfo.time")}</strong><span>${X(F)}</span></div>
          <div class="review-info-item"><strong>${r("generalInfo.description")}</strong><p>${X(T.description)}</p></div>
          <div class="review-info-item"><strong>${r("generalInfo.tags")}</strong><span>${X(Q.join(", ")||r("generalInfo.noTags"))}</span></div>
        </div>
      `,T.imageUrl&&(l.innerHTML+=`
          <div class="review-image-wrap">
            <img src="${X(T.imageUrl)}" alt="${X(T.title)}" class="review-cover-image">
          </div>
        `),w.length===0){k.innerHTML=`<div class="review-empty">${r("sections.empty")}</div>`;return}k.innerHTML=w.map((R,W)=>`
          <div class="review-section-item">
            <div class="review-section-head">
              <strong>${r("sections.itemTitle",{index:W+1})}</strong>
              <span>${R.lessons} ${r("sections.lessons")} • ${R.exercises} ${r("sections.exercises")}</span>
            </div>
            <h3>${X(R.title)}</h3>
            ${R.description?`<p>${X(R.description)}</p>`:""}
          </div>
        `).join("")}catch{l.innerHTML=`<div class="review-empty">${r("loadError")}</div>`,k.innerHTML=`<div class="review-empty">${r("loadError")}</div>`,H(o("courses.home.feedback.actionError"),"error")}}};document.getElementById("review-back")?.addEventListener("click",P),document.getElementById("review-cancel")?.addEventListener("click",M),document.getElementById("review-publish")?.addEventListener("click",()=>{U()}),document.getElementById("review-save-draft")?.addEventListener("click",()=>{G()}),document.getElementById("review-save-draft-mobile")?.addEventListener("click",()=>{G()}),ne()}function mn(t){const i=Math.floor(t),e=t%1>=.5,r=5-i-(e?1:0);return"★".repeat(i)+(e?"☆":"")+"☆".repeat(r)}function Hn(t){return`<span>${mn(t)}</span><span>${t.toFixed(1)}</span>`}function X(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}let Bt=null,At=null;function Vn(){At&&document.removeEventListener("click",At);const t=document.querySelector(".header-user-button"),i=document.querySelector(".header-user-dropdown");if(!t||!i)return;const e=h=>{h.stopPropagation();const d=i.style.display!=="none";i.style.display=d?"none":"block",t.setAttribute("aria-expanded",d?"false":"true")},r=h=>{h.stopPropagation()};At=h=>{h.target.closest(".header-user-area")||(i.style.display="none",t.setAttribute("aria-expanded","false"))},t.removeEventListener("click",e),i.removeEventListener("click",r),t.addEventListener("click",e),i.addEventListener("click",r),document.addEventListener("click",At)}function an(){const t=window.location.pathname,i=t===pt.home,e=t===pt.adminHome,r=i||e,h=document.querySelector(".app-header"),d=document.getElementById("language-switcher");if(h&&(h.classList.toggle("public-header",!r),h.classList.toggle("private-header",r)),d)if(r){const l=sn(),k=l?`${l.firstName} ${l.lastName}`.trim():"User Name",O=l?.email??"user@email.com",m=l?`${l.firstName[0]??""}${l.lastName[0]??""}`.toUpperCase():"UN";d.innerHTML=`
        <div class="header-user-area">
          <img src="/icons/bell.png" alt="Notifications" class="header-bell-icon" width="24" height="24">
          <button class="header-user-button" type="button" aria-haspopup="menu" aria-expanded="false">
            <div class="header-user-info">
              <strong>${k}</strong>
              <small>${O}</small>
            </div>
            <div class="header-user-avatar">${m}</div>
          </button>
          <div class="header-user-dropdown" role="menu" style="display: none;">
            <div id="header-language-switcher" class="header-dropdown-content"></div>
            <div class="header-dropdown-divider" aria-hidden="true"></div>
            <button id="header-logout-btn" class="header-logout-btn" type="button">Sair</button>
          </div>
        </div>
      `;const x=document.getElementById("header-language-switcher");x&&en(x),document.getElementById("header-logout-btn")?.addEventListener("click",()=>{cn(),window.location.assign("/")}),setTimeout(()=>{Vn()},0)}else en(d);const s=document.getElementById("app-root");s&&(i?nn(s,"USER"):e?nn(s,"ADMIN"):_n(s))}document.addEventListener("DOMContentLoaded",()=>{an();const t=window.location.pathname;(t===pt.home||t===pt.adminHome)&&(Bt&&Bt(),Bt=vt(()=>{an()}))});
