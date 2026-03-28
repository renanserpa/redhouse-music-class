# PLANO: Simplificação e Consolidação (RedHouse V2 Lean)

Este plano descreve a estratégia para transformar o projeto RedHouse em uma aplicação SPA simplificada, eliminando redundâncias de rotas, removendo o módulo instável GMC-v3 e otimizando o build para máxima performance e leveza.

**Tipo de Projeto:** WEB (React + Vite + Tailwind 4)

## Critérios de Sucesso
- [ ] Rotas `/dev` e `/redhouse` eliminadas; App acessível apenas via `/`.
- [ ] Módulo `v3-gmc` completamente desativado e removido do fluxo de build.
- [ ] `index.html` -> `main.tsx` -> `App.tsx` (V2) sem intermediários complexos.
- [ ] `package.json` reduzido apenas ao essencial para o V2.
- [ ] Build e Deploy na Vercel funcionando no modo SPA simples.

## Tech Stack (Lean)
- **Frontend:** React 19 (v2)
- **Estilização:** Tailwind CSS 4
- **Animações:** Motion (v12)
- **Ícones:** Lucide React
- **Estado/Dados:** AppContext + Firebase (Auth/Firestore)
- **Build Tool:** Vite 6

## Estrutura de Arquivos (Simplificada)
```text
src/
├── components/     # Componentes modulares V2
├── contexts/       # Contexto global simplificado
├── lib/            # Utilitários (audio, haptics, etc.)
├── services/       # Integrações Firebase
├── App.tsx         # Ponto de entrada único (ex-AppV2)
├── main.tsx        # Inicialização do React
├── types.ts        # Tipagens compartilhadas
└── index.css       # Estilos globais (Tailwind 4)
```

## Cronograma de Tarefas

### Fase 1: Limpeza e Unificação de Rotas
| ID | Tarefa | Agente | Prioridade | Dependências |
|---|---|---|---|---|
| 1.1 | **Unificar App.tsx:** Transformar o conteúdo de `AppV2` no componente principal `App`, removendo o seletor de versões e os imports de `AppV1` e `GmcApp`. | `frontend-specialist` | P0 | - |
| 1.2 | **Simplificar Entry Point:** Modificar `main.tsx` para renderizar `<App />` diretamente, eliminando a dependência do `Router.tsx` se não houver mais de uma página institucional. | `frontend-specialist` | P0 | 1.1 |
| 1.3 | **Remover Router.tsx:** Deletar o arquivo `Router.tsx` e consolidar qualquer lógica de rota remanescente dentro do `App.tsx` (V2). | `frontend-specialist` | P1 | 1.2 |

### Fase 2: Desativação do GMC-v3 e Legados
| ID | Tarefa | Agente | Prioridade | Dependências |
|---|---|---|---|---|
| 2.1 | **Desconectar V3:** Remover as pastas `src/v3-gmc` e `src/v1-legacy` do fluxo de importação. | `devops-engineer` | P0 | 1.1 |
| 2.2 | **Remover Dependências Pesadas:** Analisar o `package.json` e remover pacotes como `@react-three/fiber`, `three`, `@coderline/alphatab` e outros que pertenciam apenas ao V3. | `devops-engineer` | P0 | 2.1 |
| 2.3 | **Limpar Código Morto:** Remover componentes como `InstitutionalHome` e `PresentationPage` se a decisão for focar 100% no App. | `frontend-specialist` | P1 | 1.3 |

### Fase 3: Otimização de Infraestrutura (Modo Lean)
| ID | Tarefa | Agente | Prioridade | Dependências |
|---|---|---|---|---|
| 3.1 | **Vite Config:** Simplificar `vite.config.ts` para o mínimo necessário para um SPA React + Tailwind 4. | `devops-engineer` | P1 | - |
| 3.2 | **Vercel Config:** Garantir que `vercel.json` tenha o rewrite padrão de SPA (`/(.*)` -> `/index.html`). | `devops-engineer` | P1 | - |
| 3.3 | **Revisão de Build:** Executar `npm run build` para validar que o bundle está leve e sem erros de referências circulares ou tipos ausentes. | `performance-optimizer` | P0 | Todas |

## Fase X: Verificação Final
- [ ] **Checklist de Build:** `npm run build` deve gerar um `dist/` limpo.
- [ ] **Checklist de Rotas:** Acessar `/` deve carregar o Dashboard do V2. `/dev` e `/redhouse` devem retornar 404 ou redirecionar para `/`.
- [ ] **Checklist de Dependências:** `node_modules` reduzido significativamente após `npm install`.
- [ ] **Validação de Tipos:** `npx tsc --noEmit` deve passar sem erros após as remoções.

## Próximos Passos
1. Iniciar a refatoração do `App.tsx` para extrair o `AppV2`.
2. Remover as pastas de legado para liberar espaço e evitar confusão no build.
3. Atualizar o `package.json` e reinstalar dependências.
