# Plano de Evolução de Agentes e Automação (GCM Maestro)

Este plano detalha a integração de novos especialistas, a adoção de ciclos de auto-melhoria baseados em `autoresearch` e a estruturação de processos de refatoração autônoma.

## 1. Integração de Novos Agentes Especialistas
Os 4 novos agentes identificados no "Antigravity Kit" serão integrados à nossa estrutura oficial em `.agent/agents/`.

### Agentes a serem incorporados:
- **`audio-dsp-engineer.md`**: Especialista em Web Audio API, detecção de pitch e baixa latência.
- **`behavioral-designer.md`**: Focado em Gamificação (Octalysis) e Teoria do Fluxo para manter o engajamento do aluno.
- **`pedagogy-music-expert.md`**: Guardião da metodologia Serpa-Híbrida (Suzuki, Dalcroze, Kodály).
- **`inclusive-ux-designer.md`**: Especialista em neurodiversidade (TEA, TDAH) e acessibilidade (PECS).

### Ações:
- [ ] Copiar os arquivos de `temp_v1/.agent/agents/` para `.agent/agents/`.
- [ ] Adaptar os prompts para referenciar o contexto específico do projeto "RedHouse Music Class" e o NPC Lucca.
- [ ] Validar a presença desses agentes no `ARCHITECTURE.md`.

## 2. Ciclo de Auto-Melhoria (Workflow Autoresearch)
Integração dos mecanismos de pesquisa autônoma na rotina de desenvolvimento para garantir qualidade contínua.

### Mecanismos a integrar:
- **`/autoresearch:predict`**: Utilizado na fase de **Research** para antecipar impactos de mudanças complexas.
- **`/autoresearch:debug`**: Acionado automaticamente em caso de falhas intermitentes ou bugs complexos relatados.
- **`/autoresearch:fix`**: Loop autônomo para resolver erros de lint, tipos e build antes de cada entrega.
- **`/autoresearch:security`**: Auditoria de segurança mensal focada em LGPD e proteção de dados de menores.
- **`/autoresearch:learn`**: Manutenção automática da documentação (`docs/`) baseada nas mudanças reais do código.

### Ajuste no Workflow:
- Toda nova funcionalidade deve passar por um ciclo `/autoresearch:predict` antes da implementação.
- Todo PR deve ser validado por `/autoresearch:ship` para garantir conformidade técnica.

## 3. Refino do ARCHITECTURE.md
Criação e atualização do mapa de arquitetura para refletir a nova organização de especialistas e competências.

### Estrutura do Mapa:
- **Core Agents**: Orchestrator, Project Planner, Explorer.
- **Technical Specialists**: Audio DSP, Frontend, Backend, Database, Security.
- **Pedagogical Specialists**: Pedagogy Expert, Behavioral Designer, Inclusive UX.
- **Maintenance Specialists**: Code Archaeologist, Performance Optimizer, Debugger.

## 4. Bootstrapping de Auto-Código (Refatoração Semanal)
Estabelecimento de um processo recorrente de melhoria de código sem intervenção manual direta.

### O Processo:
1. **Coleta de Dados**: O `performance-optimizer` executa `/autoresearch:predict --chain learn` toda segunda-feira para identificar gargalos de performance e áreas de "code smell".
2. **Análise Arqueológica**: O `code-archaeologist` analisa o histórico do Git e os logs de `autoresearch` para identificar dívidas técnicas acumuladas.
3. **Sugestão de Refatoração**:
   - Os agentes geram um arquivo `docs/REFACTOR-SUGGESTIONS.md` semanalmente.
   - O `performance-optimizer` foca em otimizações de bundle e latência de áudio.
   - O `code-archaeologist` foca em simplificação de componentes e adesão ao SOLID.
4. **Execução Controlada**: O usuário aprova as sugestões e o `generalist` executa os loops de `/autoresearch:fix` para implementar as melhorias com segurança.

---
**Status:** Planejamento Inicial
**Data:** 2025-05-22
**Responsável:** Project Planner
