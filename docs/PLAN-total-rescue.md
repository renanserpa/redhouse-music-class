# PLANO DE RESGATE TOTAL (Total Rescue Plan)

Este plano visa resolver inconsistências de versão, conflitos de dependências e comportamentos "fantasmas" na UI que estão impedindo o deploy correto no Vercel.

**Tipo de Projeto:** WEB (React/Vite/Firebase)
**Prioridade:** Crítica
**Estado Atual:** Inconsistência entre pacotes `motion` vs `framer-motion` e persistência de configurações antigas no `localStorage`.

## 1. Auditoria de Git & Remotos
**Objetivo:** Garantir que o Vercel esteja consumindo o repositório correto.
- [ ] Verificar remotos atuais: `git remote -v`
- [ ] Sugerir ao usuário conferir no painel do Vercel se o repositório vinculado é `renanserpa/redhouse-music-class`.
- [ ] Padronizar `origin` como fonte primária de verdade.

## 2. Deep Cleaning de Dependências
**Objetivo:** Eliminar conflitos entre `motion` e `framer-motion`.
- [ ] Identificado: `package-lock.json` ainda contém referências a `framer-motion` v12.
- [ ] Ação:
    - Remover `node_modules` e `package-lock.json`.
    - Garantir que apenas `motion` (v12+) esteja no `package.json`.
    - Executar `npm install` limpo.
- [ ] Verificar se todos os imports no código utilizam `motion/react` ou `motion` conforme a nova API.

## 3. Revisão de UX/UI (Lógica Condicional)
**Objetivo:** Resetar configurações persistentes que podem estar forçando visualizações antigas.
- [ ] Identificado: `AppContext.tsx` carrega `navConfig` e `featureToggles` do `localStorage`.
- [ ] Ação: Implementar uma lógica de "Version Check" no `App.tsx`. Se a versão do app mudar, disparar `resetNavConfig()` para limpar o cache do navegador do usuário.
- [ ] Auditar `App.tsx` para remover qualquer `isSuperAdmin` ou logicamente baseada em flags que não existam mais no Firestore.

## 4. Verificação de Backend/Firebase
**Objetivo:** Evitar que fallbacks silenciosos ocultem erros de conexão.
- [ ] Identificado: `dataService.ts` usa mocks silenciosos em caso de erro.
- [ ] Ação: Melhorar o log de erro no `dataService.ts` para indicar claramente se a falha é de Permissão (Firestore Rules) ou Configuração (Firebase Config).
- [ ] Validar se as `firestore.rules` permitem o acesso aos novos campos de `users` e `classrooms`.

## 5. Reset de Cache de Build (Vercel)
**Objetivo:** Forçar o Vercel a reconstruir tudo do zero.
- [ ] Ação: Modificar o script de build no `package.json`:
    ```json
    "build": "rm -rf .vite && vite build"
    ```
- [ ] Sugerir a inclusão de uma variável de ambiente `CACHE_BUST` no Vercel para forçar a invalidação do cache se necessário.

---

## Detalhamento das Tarefas

### Tarefa 1: Auditoria & Purge de Dependências
- **Agente:** `devops-engineer`
- **Ações:** 
  1. `rm -rf node_modules package-lock.json`
  2. `npm install`
  3. `npm list motion` e `npm list framer-motion` para garantir unicidade.
- **Verificação:** `npm run build` deve passar sem avisos de pacotes duplicados.

### Tarefa 2: Implementação de Force Reset de UI
- **Agente:** `frontend-specialist`
- **Ações:**
  1. Alterar `App.tsx` para incluir um `useEffect` de inicialização que verifica a versão do app.
  2. Adicionar botão de "Reset de Emergência" nas configurações para limpar `localStorage`.
- **Verificação:** Ao abrir o app após a mudança, o `localStorage` deve ser re-sincronizado com o `DEFAULT_NAV_CONFIG`.

### Tarefa 3: Diagnóstico de Backend
- **Agente:** `backend-specialist`
- **Ações:**
  1. Adicionar `toast` ou `alert` visível para erros de Firestore em ambiente de desenvolvimento.
  2. Testar conexão com `listClassrooms` e garantir que não está caindo no Mock por erro de autenticação.
- **Verificação:** Dados reais do Firestore aparecendo no `Dashboard`.

---

## ✅ PHASE X: Verificação Final
- [ ] Build completo local: `npm run build`
- [ ] Verificação de redundância de pacotes: `grep "framer-motion" package-lock.json` (deve retornar vazio após limpeza)
- [ ] Teste de roteamento com URL params (QR Code) funcional.

**Data de Criação:** 2023-10-27
**Responsável:** Gemini CLI (via project-planner)
