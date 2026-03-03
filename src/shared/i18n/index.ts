export type Language = 'pt-BR' | 'en-US'

type TranslationTree = {
  [key: string]: string | TranslationTree
}

const LANGUAGE_STORAGE_KEY = 'educado.language'

const translations: Record<Language, TranslationTree> = {
  'pt-BR': {
    common: {
      language: 'Idioma',
      portuguese: 'Português',
      english: 'English',
    },
    auth: {
      hero: {
        onboardingLabel: 'Slides de onboarding',
        slideAria: 'Slide {{index}}',
        slide1: {
          title: 'Junte-se a nós para transformar vidas a partir do seu conhecimento',
          description:
            'Oferecemos acesso a conteúdo personalizado para pessoas que precisam, melhorando condições de vida e oportunidades de emprego',
        },
        slide2: {
          title: 'Para criadores de conteúdo',
          description:
            'Divulgue seu trabalho e alcance um público ainda maior. Mostre suas ideias para quem quer aprender e se inspirar.',
        },
        slide3: {
          title: 'Cadastre-se agora e ajude a fazer a diferença!',
          description:
            'Faça parte de uma comunidade que facilita o acesso a conteúdos relevantes e incentiva o compartilhamento de conhecimento de forma simples e prática.',
        },
      },
      landing: {
        title: 'Boas vindas ao EDUCADO!',
        description:
          'Cadastre-se agora e ajude a promover seu trabalho e atingir um público mais amplo por meio da criação de conteúdo.',
        register: 'Cadastrar',
        alreadyHaveAccount: 'Já possui uma conta?',
        login: 'Entrar',
      },
      register: {
        back: 'Voltar',
        title: 'Crie uma conta gratuita',
        firstName: 'Nome',
        firstNamePlaceholder: 'Nome',
        lastName: 'Sobrenome',
        lastNamePlaceholder: 'Sobrenome',
        email: 'Email',
        emailPlaceholder: 'seuemail@gmail.com',
        password: 'Senha',
        passwordPlaceholder: '*******',
        confirmPassword: 'Confirmar senha',
        confirmPasswordPlaceholder: '*******',
        passwordHintLine1: 'MÍNIMO DE 8 CARACTERES',
        passwordHintLine2: 'PELO MENOS UMA LETRA',
        submit: 'Cadastrar',
        alreadyHaveAccount: 'Já possui uma conta?',
        loginNow: 'Entre agora',
        showPassword: 'Mostrar senha',
        hidePassword: 'Ocultar senha',
        showConfirmPassword: 'Mostrar confirmação de senha',
        hideConfirmPassword: 'Ocultar confirmação de senha',
        errors: {
          invalidEmail: 'EMAIL INVÁLIDO',
          passwordMismatch: 'SENHAS NÃO COINCIDEM',
          emailAlreadyExists: 'EMAIL JÁ CADASTRADO',
          passwordPolicy: 'SENHA FORA DA POLÍTICA',
          requiredField: 'CAMPO OBRIGATÓRIO',
          generic: 'NÃO FOI POSSÍVEL CONCLUIR O CADASTRO',
          rateLimited: 'MUITAS TENTATIVAS. TENTE NOVAMENTE EM INSTANTES',
          authAfterRegisterFailed: 'NÃO FOI POSSÍVEL AUTENTICAR APÓS O CADASTRO. TENTE ENTRAR NOVAMENTE.',
          accountNotApproved: 'CONTA AINDA NÃO APROVADA PARA LOGIN. AGUARDE A ANÁLISE.',
        },
        feedback: {
          submitting: 'Enviando cadastro...',
          success: 'Conta criada! Complete seu perfil para análise.',
        },
      },
      login: {
        back: 'Voltar',
        title: 'Bem-vindo(a) de volta!',
        email: 'Email',
        emailPlaceholder: 'seuemail@gmail.com',
        password: 'Senha',
        passwordPlaceholder: '*******',
        forgotPassword: 'Esqueceu a senha?',
        submit: 'Entrar',
        noAccount: 'Ainda não tem conta?',
        registerNow: 'Cadastre-se agora',
        showPassword: 'Mostrar senha',
        hidePassword: 'Ocultar senha',
        waiting: {
          title: 'Aguarde aprovação',
          description:
            'Seu cadastro está em análise e você receberá um retorno em até x dias. Fique de olho no seu e-mail, avisaremos assim que tudo estiver pronto!',
          close: 'Fechar',
        },
        errors: {
          invalidCredentials: 'EMAIL OU SENHA INVÁLIDOS',
          accountPending: 'SUA CONTA ESTÁ EM ANÁLISE. AGUARDE APROVAÇÃO.',
          accountRejected: 'SEU CADASTRO FOI REPROVADO. CONTATE O SUPORTE.',
          requiredField: 'CAMPO OBRIGATÓRIO',
          invalidEmail: 'EMAIL INVÁLIDO',
          generic: 'NÃO FOI POSSÍVEL FAZER LOGIN. TENTE NOVAMENTE.',
        },
        feedback: {
          submitting: 'Entrando...',
          success: 'Login realizado com sucesso!',
        },
      },
      profile: {
        title: 'Que bom que você quer fazer parte do Educado!',
        description:
          'Precisamos de algumas informações para aprovar seu acesso de criador de conteúdo. Retornaremos com uma resposta via e-mail.',
        characters: 'caracteres',
        backToRegister: 'Voltar para o cadastro',
        submit: 'Enviar para análise',
        sections: {
          motivations: {
            title: 'Motivações',
            description: 'Queremos saber mais sobre você! Nos conte suas motivações para fazer parte do Educado.',
            placeholder: 'Escreva aqui por que você quer fazer parte do projeto',
          },
          academicBackground: {
            title: 'Formação Acadêmica',
            entryTitle: 'Experiência acadêmica',
            description: 'Conte brevemente sua formação acadêmica e principais aprendizados.',
            placeholder: 'Descreva sua formação acadêmica',
            levelLabel: 'Formação',
            statusLabel: 'Status',
            courseLabel: 'Curso',
            institutionLabel: 'Instituição',
            startLabel: 'Início',
            endLabel: 'Fim',
            coursePlaceholder: 'Curso',
            institutionPlaceholder: 'Instituição',
            addAnother: 'Adicionar outra formação',
            levelOptions: {
              higher: 'Superior',
              postgraduate: 'Pós-graduação',
              technical: 'Técnico',
            },
            statusOptions: {
              inProgress: 'Em andamento',
              completed: 'Concluído',
            },
          },
          professionalExperience: {
            title: 'Experiências profissionais',
            entryTitle: 'Experiência profissional',
            description: 'Compartilhe suas experiências profissionais mais relevantes.',
            placeholder: 'Descreva suas experiências profissionais',
            companyLabel: 'Empresa',
            roleLabel: 'Cargo',
            startLabel: 'Início',
            endLabel: 'Fim',
            activitiesLabel: 'Descrição das atividades',
            companyPlaceholder: 'Empresa',
            rolePlaceholder: 'Cargo',
            activitiesPlaceholder: 'Escreva aqui as suas responsabilidades',
            currentJob: 'Meu emprego atual',
            addAnother: 'Adicionar outra experiência',
          },
        },
        common: {
          selectPlaceholder: 'Selecione',
          monthYearPlaceholder: 'Mês / Ano',
          removeItem: 'Remover',
          openCalendar: 'Abrir calendário',
        },
        errors: {
          minChars: '{{field}}: mínimo de {{min}} caracteres',
          completeSection: 'Preencha todos os campos de {{field}}',
          requiredField: '{{field}} é obrigatório',
          startNotFuture: '{{field}} não pode ser maior que o mês atual',
          endAfterStart: '{{field}} deve ser maior que o início',
          unauthorized: 'Sua sessão expirou. Faça login novamente para continuar.',
          invalidTransition: 'Não foi possível enviar nesta etapa. Atualize a página e tente novamente.',
          generic: 'Não foi possível enviar seu perfil agora.',
        },
        feedback: {
          submitting: 'Enviando perfil para análise...',
          successPendingReview: 'Perfil enviado! Seu cadastro está em análise.',
          success: 'Perfil atualizado com sucesso.',
        },
        confirmation: {
          title: 'Enviar para análise',
          message: 'Você tem certeza que deseja enviar o formulário de aplicação? Essa ação não pode ser desfeita.',
          cancel: 'Cancelar',
          continue: 'Continuar',
          close: 'Fechar',
        },
        waiting: {
          title: 'Aguarde aprovação',
          successTitle: 'Solicitação concluída com sucesso!',
          successDescription:
            'Seu cadastro está em análise e você receberá um retorno em até x dias. Fique de olho no seu e-mail, avisaremos assim que tudo estiver pronto!',
          close: 'Fechar',
        },
      },
    },
  },
  'en-US': {
    common: {
      language: 'Language',
      portuguese: 'Português',
      english: 'English',
    },
    auth: {
      hero: {
        onboardingLabel: 'Onboarding slides',
        slideAria: 'Slide {{index}}',
        slide1: {
          title: 'Join us to transform lives through your knowledge',
          description:
            'We offer personalized content access for people in need, improving living conditions and job opportunities.',
        },
        slide2: {
          title: 'For content creators',
          description:
            'Promote your work and reach an even wider audience. Share your ideas with people who want to learn and be inspired.',
        },
        slide3: {
          title: 'Sign up now and help make a difference!',
          description:
            'Be part of a community that makes relevant content more accessible and encourages simple, practical knowledge sharing.',
        },
      },
      landing: {
        title: 'Welcome to EDUCADO!',
        description:
          'Sign up now and help promote your work while reaching a wider audience through content creation.',
        register: 'Sign up',
        alreadyHaveAccount: 'Already have an account?',
        login: 'Log in',
      },
      register: {
        back: 'Back',
        title: 'Create your free account',
        firstName: 'First name',
        firstNamePlaceholder: 'First name',
        lastName: 'Last name',
        lastNamePlaceholder: 'Last name',
        email: 'Email',
        emailPlaceholder: 'youremail@gmail.com',
        password: 'Password',
        passwordPlaceholder: '*******',
        confirmPassword: 'Confirm password',
        confirmPasswordPlaceholder: '*******',
        passwordHintLine1: 'MINIMUM 8 CHARACTERS',
        passwordHintLine2: 'AT LEAST ONE LETTER',
        submit: 'Sign up',
        alreadyHaveAccount: 'Already have an account?',
        loginNow: 'Log in now',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        showConfirmPassword: 'Show confirm password',
        hideConfirmPassword: 'Hide confirm password',
        errors: {
          invalidEmail: 'INVALID EMAIL',
          passwordMismatch: 'PASSWORDS DO NOT MATCH',
          emailAlreadyExists: 'EMAIL ALREADY REGISTERED',
          passwordPolicy: 'PASSWORD DOES NOT MEET POLICY',
          requiredField: 'REQUIRED FIELD',
          generic: 'WE COULD NOT COMPLETE THE REGISTRATION',
          rateLimited: 'TOO MANY ATTEMPTS. TRY AGAIN SOON',
          authAfterRegisterFailed: 'COULD NOT AUTHENTICATE AFTER REGISTRATION. PLEASE LOG IN AGAIN.',
          accountNotApproved: 'ACCOUNT IS NOT APPROVED FOR LOGIN YET. PLEASE WAIT FOR REVIEW.',
        },
        feedback: {
          submitting: 'Submitting registration...',
          success: 'Account created! Complete your profile for review.',
        },
      },
      login: {
        back: 'Back',
        title: 'Welcome back!',
        email: 'Email',
        emailPlaceholder: 'youremail@gmail.com',
        password: 'Password',
        passwordPlaceholder: '*******',
        forgotPassword: 'Forgot your password?',
        submit: 'Log in',
        noAccount: "Don't have an account?",
        registerNow: 'Sign up now',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        waiting: {
          title: 'Waiting for approval',
          description:
            'Your registration is under review and you will receive a response within x days. Keep an eye on your email and we will notify you as soon as everything is ready!',
          close: 'Close',
        },
        errors: {
          invalidCredentials: 'INVALID EMAIL OR PASSWORD',
          accountPending: 'YOUR ACCOUNT IS UNDER REVIEW. PLEASE WAIT FOR APPROVAL.',
          accountRejected: 'YOUR REGISTRATION WAS REJECTED. CONTACT SUPPORT.',
          requiredField: 'REQUIRED FIELD',
          invalidEmail: 'INVALID EMAIL',
          generic: 'COULD NOT LOG IN. PLEASE TRY AGAIN.',
        },
        feedback: {
          submitting: 'Signing in...',
          success: 'Login successful!',
        },
      },
      profile: {
        title: 'Great to see you want to join Educado!',
        description:
          'We need a few details to approve your creator access. We will get back to you by email.',
        characters: 'characters',
        backToRegister: 'Back to registration',
        submit: 'Submit for review',
        sections: {
          motivations: {
            title: 'Motivations',
            description: 'We want to know more about you! Tell us your motivations to join Educado.',
            placeholder: 'Write here why you want to be part of the project',
          },
          academicBackground: {
            title: 'Academic Background',
            entryTitle: 'Academic experience',
            description: 'Briefly describe your academic background and key learnings.',
            placeholder: 'Describe your academic background',
            levelLabel: 'Education level',
            statusLabel: 'Status',
            courseLabel: 'Course',
            institutionLabel: 'Institution',
            startLabel: 'Start',
            endLabel: 'End',
            coursePlaceholder: 'Course',
            institutionPlaceholder: 'Institution',
            addAnother: 'Add another education',
            levelOptions: {
              higher: 'Higher education',
              postgraduate: 'Postgraduate',
              technical: 'Technical',
            },
            statusOptions: {
              inProgress: 'In progress',
              completed: 'Completed',
            },
          },
          professionalExperience: {
            title: 'Professional Experience',
            entryTitle: 'Professional experience',
            description: 'Share your most relevant professional experiences.',
            placeholder: 'Describe your professional experience',
            companyLabel: 'Company',
            roleLabel: 'Role',
            startLabel: 'Start',
            endLabel: 'End',
            activitiesLabel: 'Activities description',
            companyPlaceholder: 'Company',
            rolePlaceholder: 'Role',
            activitiesPlaceholder: 'Write your responsibilities here',
            currentJob: 'My current job',
            addAnother: 'Add another experience',
          },
        },
        common: {
          selectPlaceholder: 'Select',
          monthYearPlaceholder: 'Month / Year',
          removeItem: 'Remove',
          openCalendar: 'Open calendar',
        },
        errors: {
          minChars: '{{field}}: minimum {{min}} characters',
          completeSection: 'Fill all fields in {{field}}',
          requiredField: '{{field}} is required',
          startNotFuture: '{{field}} cannot be later than current month',
          endAfterStart: '{{field}} must be later than start date',
          unauthorized: 'Your session expired. Please log in again to continue.',
          invalidTransition: 'Could not submit at this stage. Refresh and try again.',
          generic: 'Could not submit your profile right now.',
        },
        feedback: {
          submitting: 'Submitting profile for review...',
          successPendingReview: 'Profile submitted! Your registration is under review.',
          success: 'Profile updated successfully.',
        },
        confirmation: {
          title: 'Submit for review',
          message: 'Are you sure you want to submit the application form? This action cannot be undone.',
          cancel: 'Cancel',
          continue: 'Continue',
          close: 'Close',
        },
        waiting: {
          title: 'Waiting for approval',
          successTitle: 'Request completed successfully!',
          successDescription:
            'Your registration is under review and you will receive a response within x days. Keep an eye on your email and we will notify you as soon as everything is ready!',
          close: 'Close',
        },
      },
    },
  },
}

let currentLanguage: Language = resolveInitialLanguage()
const listeners = new Set<(language: Language) => void>()

function resolveInitialLanguage(): Language {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (storedLanguage === 'pt-BR' || storedLanguage === 'en-US') return storedLanguage

  const browserLanguage = navigator.language.toLowerCase()
  return browserLanguage.startsWith('pt') ? 'pt-BR' : 'en-US'
}

function getByPath(tree: TranslationTree, path: string): string | undefined {
  const result = path.split('.').reduce<string | TranslationTree | undefined>((acc, part) => {
    if (!acc || typeof acc === 'string') return undefined
    return acc[part]
  }, tree)

  return typeof result === 'string' ? result : undefined
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template

  return Object.entries(params).reduce((message, [key, value]) => {
    return message.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
  }, template)
}

function syncDocumentLanguage() {
  document.documentElement.lang = currentLanguage
}

export function getLanguage(): Language {
  return currentLanguage
}

export function setLanguage(language: Language) {
  if (currentLanguage === language) return

  currentLanguage = language
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  syncDocumentLanguage()

  listeners.forEach((listener) => listener(language))
}

export function subscribeLanguage(listener: (language: Language) => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function t(path: string, params?: Record<string, string | number>): string {
  const directMessage = getByPath(translations[currentLanguage], path)
  if (directMessage) return interpolate(directMessage, params)

  const fallbackMessage = getByPath(translations['pt-BR'], path)
  if (fallbackMessage) return interpolate(fallbackMessage, params)

  return path
}

syncDocumentLanguage()
