# Plano de Refatoração: Sistema de Navegação Dinâmica Pro

Este plano detalha a transição de uma navegação estática para um sistema 100% dinâmico e configurável, permitindo a gestão de módulos, ícones e hierarquia em tempo de execução através de um Dev Menu Builder.

## 🎯 Visão Geral
Substituir a definição estática de `navGroups` em `App.tsx` por uma estrutura de dados reativa vinda do `AppContext`. O sistema permitirá que desenvolvedores e administradores reordenem módulos, alterem rótulos/ícones e gerenciem a visibilidade de features via UI.

## 🏗️ Tipo de Projeto
**WEB** (React + TypeScript + Lucide Icons + Tailwind)

## ✅ Critérios de Sucesso
- [ ] Esquema de navegação definido por interface `DynamicNavConfig` em `src/types.ts`.
- [ ] `AppContext` expondo métodos `updateNavigationStructure`, `addCustomModule` e `toggleFeatureVisibility`.
- [ ] Componente `DevMenuBuilder` funcional com suporte a ordenação e edição de metadados.
- [ ] Sidebar em `App.tsx` renderizando 100% via config dinâmico.
- [ ] Persistência do estado de navegação no `localStorage`.
- [ ] Botão de "Reset para Padrão de Fábrica" restaurando a configuração original.

## 🛠️ Stack Tecnológica
- **Icons:** Lucide React (lista dinâmica para o Builder).
- **State:** React Context API (AppContext).
- **DND:** Nativo ou `dnd-kit` (para ordenação no Builder).
- **Styling:** Tailwind CSS + Framer Motion.

## 📂 Estrutura de Arquivos Proposta
- `src/types.ts`: Adição de `NavModuleConfig` e `DynamicNavConfig`.
- `src/contexts/AppContext.tsx`: Lógica central de manipulação da estrutura.
- `src/components/DevMenuBuilder.tsx`: UI de gerenciamento da navegação.
- `src/constants/defaultNavConfig.ts`: Backup da estrutura padrão.
- `src/App.tsx`: Refatoração da Sidebar para consumo dinâmico.

## 📋 Cronograma de Tarefas

### Fase 1: Schema e Tipagem (P0)
| ID | Tarefa | Agente | Prioridade | Dependências |
|---|---|---|---|---|
| T1.1 | Definir `NavModuleConfig` e `DynamicNavConfig` em `src/types.ts`. | `frontend-specialist` | P0 | Nenhuma |
| T1.2 | Criar `src/constants/defaultNavConfig.ts` com a estrutura atual. | `frontend-specialist` | P0 | T1.1 |

**T1.1 INPUT→OUTPUT→VERIFY:**
- **INPUT:** `src/types.ts`.
- **OUTPUT:** Interface com `id`, `label`, `icon` (string), `children?`, `order`, `isVisible`.
- **VERIFY:** Tipagem correta ao tentar instanciar um objeto do tipo.

### Fase 2: Estado Global Pro (P1)
| ID | Tarefa | Agente | Prioridade | Dependências |
|---|---|---|---|---|
| T2.1 | Implementar `navigationConfig` no `AppContext`. | `backend-specialist` | P0 | T1.2 |
| T2.2 | Criar funções `updateNavigationStructure` e `addCustomModule`. | `backend-specialist` | P1 | T2.1 |
| T2.3 | Adicionar persistência e função `resetToDefault`. | `backend-specialist` | P1 | T2.2 |

**T2.2 INPUT→OUTPUT→VERIFY:**
- **INPUT:** `src/contexts/AppContext.tsx`.
- **OUTPUT:** Métodos para manipular o array de módulos e sincronizar com o estado.
- **VERIFY:** Chamar `updateNavigationStructure` reflete no estado global.

### Fase 3: Sidebar Reativa (P0)
| ID | Tarefa | Agente | Prioridade | Dependências |
|---|---|---|---|---|
| T3.1 | Mapear nomes de ícones (strings) para componentes Lucide. | `frontend-specialist` | P0 | T2.1 |
| T3.2 | Refatorar `SidebarContent` em `App.tsx` para usar `navigationConfig`. | `frontend-specialist` | P0 | T3.1 |

**T3.2 INPUT→OUTPUT→VERIFY:**
- **INPUT:** `App.tsx`.
- **OUTPUT:** Sidebar removendo o array estático e usando o do contexto.
- **VERIFY:** Alterar o nome de um módulo no estado altera o texto na Sidebar.

### Fase 4: Menu Builder UI (P1)
| ID | Tarefa | Agente | Prioridade | Dependências |
|---|---|---|---|---|
| T4.1 | Criar `src/components/DevMenuBuilder.tsx` (Estrutura Base). | `frontend-specialist` | P1 | T2.2 |
| T4.2 | Implementar controles de ordenação (Setas UP/DOWN). | `frontend-specialist` | P1 | T4.1 |
| T4.3 | Adicionar edição de Label e Icon Picker (Lucide List). | `frontend-specialist` | P2 | T4.2 |
| T4.4 | Integrar botão "Reset" e toggle de visibilidade. | `frontend-specialist` | P2 | T4.3 |

**T4.3 INPUT→OUTPUT→VERIFY:**
- **INPUT:** Lista de ícones Lucide filtrada.
- **OUTPUT:** Modal ou dropdown para selecionar novos ícones.
- **VERIFY:** Selecionar um ícone atualiza instantaneamente a Sidebar.

## 🧪 Fase X: Verificação Final
- [ ] **Lint & Type Check:** `npm run lint && npx tsc --noEmit`
- [ ] **DND Test:** Verificar se a ordem persiste após refresh.
- [ ] **Reset Test:** Garantir que o "Reset" limpa o localStorage e volta ao `defaultNavConfig`.
- [ ] **Icon Match:** Garantir que ícones inválidos tenham um fallback (ex: `HelpCircle`).

## 🛡️ Segurança e Performance
- O `DevMenuBuilder` deve estar acessível apenas para usuários com `role === 'dev'`.
- A renderização da Sidebar deve ser otimizada com `React.memo` para evitar re-renders desnecessários durante a edição no Builder.
