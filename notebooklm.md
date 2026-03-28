Para materializar o ecossistema GCM Maestro perfeitamente alinhado com as suas fontes (Blueprint Técnico, Manual Pedagógico, Cérebro Integrado), você deverá criar a seguinte estrutura no seu ambiente de desenvolvimento (IDE):
/ (Raiz do Projeto)
 ├── ARCHITECTURE.md                  # Mapa do sistema e definições dos 24 Agentes
 ├── CODEBASE.md                      # Dependências de arquivos e regras de Tech Stack
 ├── task-01-core-brain.md            # [MANDATÓRIO] Planejamento da Fase 1
 │
 ├── .agent/                          # Pasta do Antigravity Kit
 │    └── agents/
 │         ├── audio-dsp-engineer.md
 │         ├── pedagogy-music-expert.md
 │         ├── behavioral-designer.md
 │         └── inclusive-ux-designer.md
 │
 ├── supabase/                        # Backend e Banco de Dados
 │    └── migrations/
 │         └── 20260327_gcm_core_schema.sql  # Schema V3.0 (Profiles, Tenants, Exercises)
 │
 └── src/                             # Aplicação Frontend (React 18 + Vite)
      ├── core/
      │    ├── pedagogy/              # Lógicas do Cérebro Integrado
      │    │    └── BrainRules.ts     # Regras de Suzuki, Dalcroze e Flow
      │    └── audio/
      │         ├── AudioEngine.ts    # Web Audio API (Master Clock)
      │         └── PitchDetector.ts  # Detecção de notas via microfone
      │
      ├── components/
      │    ├── lesson-console/        # Modo TV para o Professor
      │    ├── inclusive-ux/          # Pranchas PECS (Arrastar e Soltar)
      │    └── games/
      │         └── RhythmCircle.tsx  # O Groove Circle (Dalcroze)
      │
      └── types/
           └── index.ts               # Tipagens do TypeScript (Tenant, Profile, etc.)
--------------------------------------------------------------------------------
📄 Artefatos Gerados (Lote 1: Planejamento e Arquitetura)
Aqui estão os 3 primeiros arquivos mestre que você deve exportar para o seu projeto. Copie o conteúdo abaixo e salve nos respectivos caminhos.
1. Pasta: / (Raiz) | Arquivo: task-01-core-brain.md
(Este é o arquivo obrigatório exigido pelo rules.md para iniciarmos o código
)
# TASK: 01 - CORE BRAIN & PEDAGOGY FOUNDATION

## 1. Objetivo
Implementar a fundação da "Metodologia Serpa-Híbrida" (O Cérebro Integrado), garantindo que as regras de negócio pedagógicas governem o comportamento da interface do usuário.

## 2. Agentes Alocados
- `@[product-owner]`: Validação das regras de Suzuki, Dalcroze e Flow.
- `@[pedagogy-music-expert]`: Tradução de conceitos (Audiation, Manossolfa).
- `@[backend-specialist]`: Instanciação do banco de dados (Supabase).

## 3. Regras de Negócio a Codificar (BrainRules.ts)
- **Regra 1 (Suzuki/Gordon):** "Ouvir antes de Ler". O componente `TablatureRenderer` (AlphaTab) deve ficar bloqueado (estado `locked`) até que o módulo `AudioEngine` confirme que o áudio de referência foi tocado.
- **Regra 2 (Dalcroze):** "O corpo é o metrônomo". Se o `PitchDetector` registrar 3 falhas rítmicas, pausar a tablatura e renderizar o componente `RhythmCircle` (palmas/corpo).
- **Regra 4 (A Zona de Fluxo):** "Detector de Frustração". Se houver erros repetidos + aumento de *Velocity*, o sistema reduz o BPM global em 20% automaticamente.

## 4. Passos de Execução
- [ ] 1. Executar migration SQL do Supabase (Schema V3.0).
- [ ] 2. Criar a classe `BrainRules.ts` no frontend para gerenciar os estados da aula.
- [ ] 3. Construir o componente `PECSBoard.tsx` para Inclusão (Comunicação Visual).
2. Pasta: / (Raiz) | Arquivo: CODEBASE.md
(Arquivo mestre de dependências e Tech Stack do GCM Maestro
)
# GCM MAESTRO - CODEBASE & DEPENDENCIES

## 1. Tech Stack Oficial
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS.
- **Backend:** Supabase (PostgreSQL, Auth, RLS para White Label).
- **Audio Engine:** Web Audio API nativa com `AnalyserNode`.
- **Renderização Musical:** AlphaTab para tablaturas e SVG dinâmico para o Fretboard.

## 2. Árvore de Dependências Críticas
> 🔴 ATENÇÃO AGENTES: A alteração de um arquivo afeta o ecossistema.
- `src/core/audio/AudioEngine.ts` -> Controla o *Master Clock*. Qualquer mudança aqui afeta a sincronia do `TablatureRenderer` e do `RhythmCircle`.
- `src/core/pedagogy/BrainRules.ts` -> O "Cérebro". Depende diretamente das respostas do banco de dados em `supabase/migrations/`.
- `supabase/migrations/` -> O uso de *Row Level Security* (RLS) baseado em `school_id` (Tenant) é obrigatório para separar os dados das escolas B2B (ex: Red House vs. Default).

## 3. Diretrizes de Performance e Segurança
- Latência de áudio deve ser < 100ms. Utilizar *WebSockets* (Supabase Realtime) para a comunicação entre o Tablet do Professor e o Modo TV.
3. Pasta: /.agent/agents/ | Arquivo: pedagogy-music-expert.md
(Exemplo de criação do prompt de instrução de um dos novos agentes especialistas)
# AGENT: Pedagogy Music Expert
# FOCUS: Metodologia Serpa-Híbrida, Suzuki, Dalcroze, Kodály, Gordon.

## INSTRUÇÕES DE COMPORTAMENTO
Você é o especialista pedagógico do GCM Maestro. Sua função é garantir que o código gerado pelos engenheiros respeite rigorosamente os pilares da educação musical clássica:
1. **Audiation (Gordon):** A música deve ser pensada e ouvida internamente antes de ser tocada ou lida graficamente.
2. **Movimento (Dalcroze):** Se o aluno não consegue executar o ritmo, você deve instruir o `frontend-specialist` a renderizar atividades de percussão corporal.
3. **Manossolfa e Cores (Kodály/Boomwhackers):** Garantir que o sistema "Maestro Colors" aplique as cores corretas (Dó=Vermelho, Ré=Laranja, etc.) aos componentes SVG da interface.
4. Você deve validar se o vocabulário infantil ("Caminhada da Aranha", "Ouvido de Detetive") está sendo usado nos diálogos do NPC Lucca.
--------------------------------------------------------------------------------
🚀 Próxima Etapa do Pipeline
Os artefatos de fundação estão prontos. Para darmos continuidade à Fase 1, as próximas tarefas que o @[project-planner] e o @[backend-specialist] devem gerar são:
O script SQL completo de banco de dados para a pasta supabase/migrations/20260327_gcm_core_schema.sql (que inclui a hierarquia Multi-Tenant e a biblioteca de exercícios baseada na sua apostila
).
A classe TypeScript do cérebro pedagógico (BrainRules.ts), que vai aplicar a redução de 20% do BPM (Zona de Fluxo) em caso de erro
.
Deseja que eu gere e exporte os códigos SQL e TypeScript agora no Lote 2?