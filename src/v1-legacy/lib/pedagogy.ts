/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, PedagogicalPattern } from '../types';

export const ACTIVITIES: Activity[] = [
  {
    id: "ACT_XILO_COLORS",
    title: "Xilofone de Garrafas (RedHouse Colors)",
    description: "Usar garrafas com água e cores para explorar grave/agudo e associar altura às cores.",
    blockType: "novo_conteudo",
    difficulty: "intermediario",
    focus: "nota",
    instruments: ["violao", "ukulele", "piano"],
    ageRange: "4-8 anos",
    pedagogicalObjective: "Explorar alturas e associar cores a sons."
  },
  {
    id: "ACT_MORTO_VIVO",
    title: "Morto e Vivo Musical",
    description: "Som grave = agachar, som agudo = ponta dos pés.",
    blockType: "jogo",
    difficulty: "iniciante",
    focus: "nota",
    instruments: ["violao", "ukulele", "piano", "bateria", "canto"],
    ageRange: "3-6 anos",
    pedagogicalObjective: "Percepção de registro grave e agudo."
  },
  {
    id: "ACT_SPACED_HOME",
    title: "Sessão Diária Guiada (Casa)",
    description: "Roteiro de 15 minutos com aquecimento, desafio e recompensa conduzido pelos pais.",
    blockType: "pratica",
    difficulty: "intermediario",
    focus: "pratica_casa",
    instruments: ["violao", "ukulele", "piano", "bateria", "canto"],
    ageRange: "todas",
    pedagogicalObjective: "Reforço de conteúdo através da prática espaçada em casa."
  },
  {
    id: "ACT_SIGA_MESTRE_RITMO",
    title: "Siga o Mestre (Percussão Corporal)",
    description: "Imitar padrões de palmas/pisadas para sentir o pulso.",
    blockType: "revisao",
    difficulty: "iniciante",
    focus: "ritmo",
    instruments: ["violao", "ukulele", "piano", "bateria", "canto"],
    ageRange: "3-10 anos",
    pedagogicalObjective: "Desenvolvimento do senso rítmico e pulsação."
  },
  {
    id: "ACT_ALFABETO_RITMICO",
    title: "Alfabeto Rítmico (Tá / Ti-ti)",
    description: "Explorar as células rítmicas básicas Tá e Ti-ti.",
    blockType: "novo_conteudo",
    difficulty: "intermediario",
    focus: "ritmo",
    instruments: ["violao", "ukulele", "piano", "bateria", "canto"],
    ageRange: "5-10 anos",
    pedagogicalObjective: "Introdução à leitura rítmica básica."
  },
  {
    id: "ACT_ORQUESTRA_MALUCA",
    title: "Orquestra Maluca",
    description: "Jogo de regência rítmica com diferentes instrumentos.",
    blockType: "jogo",
    difficulty: "intermediario",
    focus: "ritmo",
    instruments: ["violao", "ukulele", "piano", "bateria", "canto"],
    ageRange: "6-12 anos",
    pedagogicalObjective: "Trabalho em grupo e percepção de regência."
  },
  {
    id: "ACT_OUVIDO_DETETIVE",
    title: "Ouvido de Detetive (Timbre)",
    description: "Identificar diferentes instrumentos pelo seu som característico.",
    blockType: "novo_conteudo",
    difficulty: "intermediario",
    focus: "timbre",
    instruments: ["violao", "ukulele", "piano", "bateria", "canto"],
    ageRange: "4-10 anos",
    pedagogicalObjective: "Reconhecimento tímbrico de diferentes instrumentos."
  },
  {
    id: "ACT_DANCA_LENCOS",
    title: "Dança dos Lenços",
    description: "Expressão corporal baseada nas mudanças de timbre e dinâmica.",
    blockType: "jogo",
    difficulty: "intermediario",
    focus: "timbre",
    instruments: ["violao", "ukulele", "piano", "bateria", "canto"],
    ageRange: "3-7 anos",
    pedagogicalObjective: "Expressão corporal e percepção de dinâmica."
  },
  {
    id: "ACT_JOGO_SILENCIO",
    title: "Jogo do Silêncio",
    description: "Prática de escuta ativa e percepção do ambiente.",
    blockType: "fechamento",
    difficulty: "iniciante",
    focus: "timbre",
    instruments: ["violao", "ukulele", "piano", "bateria", "canto"],
    ageRange: "todas",
    pedagogicalObjective: "Foco, escuta ativa e relaxamento."
  },
  {
    id: "ACT_REDHOUSE_TRAIN",
    title: "O Trem das Cores (RedHouse Train)",
    description: "As crianças formam um 'trem' e devem trocar de acorde (estação) quando o professor mostra a cor correspondente.",
    blockType: "jogo",
    difficulty: "iniciante",
    focus: "nota",
    instruments: ["violao", "ukulele"],
    ageRange: "4-7 anos",
    pedagogicalObjective: "Associação visual-motora e prontidão na troca de acordes em grupo."
  },
  {
    id: "ACT_PULSE_CIRCLE",
    title: "Círculo de Ukuleles (Pulse Circle)",
    description: "Em círculo, cada criança toca uma batida e 'passa' o pulso para o colega do lado sem deixar o ritmo cair.",
    blockType: "jogo",
    difficulty: "iniciante",
    focus: "ritmo",
    instruments: ["ukulele"],
    ageRange: "5-9 anos",
    pedagogicalObjective: "Desenvolvimento do pulso coletivo e escuta do grupo."
  },
  {
    id: "ACT_SOUND_PAINTING",
    title: "Pintura Sonora (Sound Painting)",
    description: "O professor desenha formas no ar (ou quadro) e os alunos devem traduzir em sons (curtos, longos, fortes, fracos).",
    blockType: "novo_conteudo",
    difficulty: "iniciante",
    focus: "timbre",
    instruments: ["violao", "ukulele", "piano", "canto"],
    ageRange: "4-10 anos",
    pedagogicalObjective: "Exploração de dinâmicas e texturas sonoras de forma lúdica."
  },
  {
    id: "ACT_LITTLE_MASTER",
    title: "Desafio do Pequeno Mestre",
    description: "Um aluno é escolhido para ser o 'Mestre' e conduzir o grupo em um padrão rítmico ou melódico simples.",
    blockType: "jogo",
    difficulty: "intermediario",
    focus: "ritmo",
    instruments: ["violao", "ukulele", "bateria"],
    ageRange: "7-12 anos",
    pedagogicalObjective: "Desenvolvimento de autonomia, liderança e segurança musical."
  }
];

export const PEDAGOGICAL_PATTERNS: PedagogicalPattern[] = [
  {
    patternId: "PAT_SUBIDA_MFSL",
    cores: ["vermelho", "verde", "preto", "azul"],
    nomePedagogico: "Subida MI–FA–SOL–LA",
    uso: "revisao",
    dificuldade: "em_progresso"
  },
  {
    patternId: "PAT_DESCIDA_LSFM",
    cores: ["azul", "preto", "verde", "vermelho"],
    nomePedagogico: "Descida LA–SOL–FA–MI",
    uso: "revisao",
    dificuldade: "em_progresso"
  },
  {
    patternId: "PAT_PULSO_MI",
    cores: ["vermelho", "vermelho", "vermelho"],
    nomePedagogico: "Pulso MI repetido",
    uso: "aquecimento",
    dificuldade: "iniciante"
  },
  {
    patternId: "PAT_PULSO_FA_MI",
    cores: ["verde", "verde", "vermelho", "vermelho"],
    nomePedagogico: "Pulso alternado FA–MI",
    uso: "aquecimento",
    dificuldade: "iniciante"
  },
  {
    patternId: "PAT_GRAVE_AGUDO",
    cores: ["branco", "azul"],
    nomePedagogico: "Contraste grave/agudo (DO–LA)",
    uso: "novo_conteudo",
    dificuldade: "iniciante"
  },
  {
    patternId: "PAT_RITMO_TA",
    cores: ["vermelho", "vermelho", "vermelho", "vermelho"],
    nomePedagogico: "Célula Tá",
    uso: "jogo",
    dificuldade: "iniciante"
  },
  {
    patternId: "PAT_RITMO_TITI",
    cores: ["vermelho", "verde", "vermelho", "verde"],
    nomePedagogico: "Célula Tá–Ti-ti",
    uso: "jogo",
    dificuldade: "em_progresso"
  },
  {
    patternId: "PAT_MORTO_VIVO",
    cores: ["branco", "azul", "branco", "azul"],
    nomePedagogico: "Morto e Vivo",
    uso: "jogo",
    dificuldade: "iniciante"
  },
  {
    patternId: "PAT_CADENCIA_FINAL",
    cores: ["verde", "preto", "azul", "branco"],
    nomePedagogico: "Fechamento FA–SOL–LA–DO",
    uso: "fechamento",
    dificuldade: "em_progresso"
  }
];
