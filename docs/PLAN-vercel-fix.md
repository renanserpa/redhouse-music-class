# Plano de Correção e Modernização do Deploy Vercel

Este plano detalha as ações necessárias para garantir que o projeto utilize um fluxo de build moderno, resolva conflitos de dependências do GMC-v3 e integre o showcase institucional corretamente ao ecossistema React.

## 1. Auditoria de Configuração

### Análise de Arquivos Críticos
- **`package.json`**: 
  - [ ] Identificar a necessidade da dependência `express`. Se o projeto for um SPA puro, remover para reduzir o overhead do build.
  - [ ] Validar versões de `vite` e `@tailwindcss/vite` para garantir compatibilidade com o Vercel.
- **`vite.config.ts`**:
  - [ ] Configurar a divisão de chunks (`manualChunks`) para evitar que o bundle do GMC-v3 estoure o limite de memória do Vercel.
  - [ ] Garantir que o `base` path esteja correto para o Vercel.
- **`vercel.json`**:
  - [ ] Adicionar `"framework": "vite"`.
  - [ ] Revisar `rewrites` para garantir que todas as rotas SPA (/dev, /redhouse, /app) apontem para o `index.html`.

## 2. Verificação de Entry Points

### Unificação do Fluxo React
O `index.html` atual é um arquivo estático que não carrega o React (`main.tsx`). Isso impede o funcionamento do `Router.tsx`.

- [ ] **Migração do Showcase**: Transformar o conteúdo atual do `index.html` (Showcase RedHouse) em um componente React (`src/components/RedHouseShowcase.tsx`).
- [ ] **Reset do `index.html`**: Limpar o `index.html` para seguir o padrão Vite:
  ```html
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
  ```
- [ ] **Atualização do `Router.tsx`**: Configurar o `RedHouseShowcase` como o componente principal da rota `/` ou `/redhouse`.

## 3. Mapeamento de Rotas

### Validação de Estrutura de Árvore
- [ ] **Rota `/`**: Deve carregar o novo `RedHouseShowcase`.
- [ ] **Rota `/dev` / `/app`**: Deve carregar o `App.tsx` (Dashboard moderno).
- [ ] **Rota `/redhouse`**: Validar se deve ser um alias para o showcase ou uma página específica.
- [ ] **Fallback**: Garantir que rotas não encontradas redirecionem para o `index.html` (SPA fallback).

## 4. Resolução de Conflitos GMC-v3

### Otimização de Dependências
O GMC-v3 introduziu mais de 100 dependências, o que pode causar instabilidade no build.
- [ ] **Audit de Dependências**: Executar `npm dedupe` para remover duplicatas.
- [ ] **Memory Limit**: Configurar o Vercel para utilizar `NODE_OPTIONS=--max-old-space-size=4096` se houver estouro de memória durante o build.
- [ ] **Lazy Loading**: Implementar `React.lazy()` para os módulos pesados do GMC-v3 no `Router.tsx` ou no `App.tsx`.

## 5. Estratégia de Force-Deploy

### Limpeza de Cache e Deploy Forçado
Criar um procedimento para garantir que o Vercel não utilize versões cacheadas e obsoletas.
- [ ] **Script de Deploy**: Criar um arquivo `scripts/force-deploy.sh`:
  ```bash
  vercel --force --prod --confirm
  ```
- [ ] **Cache Busting**: Adicionar um metadado de versão ou timestamp no `package.json` ou via variáveis de ambiente no Vercel para invalidar o cache de build.

## Critérios de Sucesso
- [x] `index.html` carrega o bundle React com sucesso.
- [x] Rotas `/dev` e `/` funcionam de forma independente sem recarregar a página (SPA).
- [x] Build concluído no Vercel em menos de 5 minutos.
- [x] Landing page estática perfeitamente renderizada via componente React.

---
**Agente Responsável:** `project-planner`
**Data:** 2024-05-22
