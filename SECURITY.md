# Security Policy

Educado is an educational platform for waste pickers in Brazil, maintained as a partnership between the University of Brasilia (UnB) and Aalborg University (Denmark). We take reports about the security of our users' data seriously, even though this is an academic, volunteer-maintained project.

## Supported versions

Only the code on the `main` branch, and the deployment currently running at https://educado.tominho.com, receive security fixes. There are no long-lived release branches and no backports to older tags.

| Version | Supported |
| --- | --- |
| `main` (latest) | Yes |
| Anything older | No |

## Reporting a vulnerability

**Do not open a public GitHub issue for a security problem.**

Report it privately to **190091681@aluno.unb.br**. If your report contains sensitive details, say so in the subject line and we will arrange an encrypted channel before you send them.

Please include as much of the following as you can:

- A description of the vulnerability and the impact you believe it has.
- Step by step reproduction instructions, including the affected URL or route.
- The browser and version you used, plus any relevant console or network output.
- A proof of concept, if you have one.
- Whether the issue is already public anywhere else.

## Response timeline

These are the targets we hold ourselves to. This is a university project, so response times can stretch during exam periods and academic holidays.

| Stage | Target |
| --- | --- |
| Acknowledgement of your report | within 5 business days |
| Initial assessment and severity triage | within 10 business days |
| Fix or documented mitigation for high and critical severity | within 30 days of triage |
| Fix for low and medium severity | in a following release cycle |

We will keep you informed as the assessment progresses, and we will tell you when a fix is deployed.

## Scope

In scope:

- This repository, `educado-web`, the vanilla TypeScript frontend.
- The deployed frontend at https://educado.tominho.com.
- Client side issues such as cross-site scripting, insecure handling of the authentication token in `localStorage`, unsafe HTML interpolation, dependency vulnerabilities reachable from the shipped bundle, and leakage of sensitive data into the bundle or the browser console.

Out of scope for this repository:

- The backend API. Report those against `educado-api`, since the code and the deployment at https://api-educado.tominho.com belong to that project.
- The mobile application, `educado-app`.
- Third party infrastructure we do not control, including the hosting provider, the DNS registrar and Google Fonts.
- Findings that require a compromised device, a compromised browser extension, or physical access to a logged in machine.
- Reports produced by an automated scanner without a demonstrated impact.
- Missing security headers or best practice recommendations with no demonstrated exploit path. These are welcome as regular issues instead.

Note that `VITE_API_URL` is a build time environment URL, not a secret. The frontend ships no API keys or credentials: authentication uses a JWT issued by the API at login.

## Disclosure

We ask that you give us a reasonable window to ship a fix before disclosing publicly. We are happy to credit you in the release notes for the fix, unless you prefer to stay anonymous.

## Safe harbour

We will not pursue or support legal action against anyone who reports a vulnerability in good faith, keeps the finding confidential until it is fixed, avoids privacy violations and service degradation, and does not access, modify or delete data belonging to other users. If in doubt about whether a test is acceptable, ask us first at the address above.
