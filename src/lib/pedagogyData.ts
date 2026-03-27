import { Activity, Chord } from '../types';

export const CHORD_LIBRARY: Chord[] = [
  // Violão (Guitar) - Kids Friendly
  {
    id: 'v-c',
    name: 'C (Dó Maior)',
    instrument: 'violao',
    difficulty: 'facil',
    fingering: 'x-3-2-0-1-0',
    colorCode: '#FF0000', // Red
    typicalUse: 'Canções infantis, base fundamental.'
  },
  {
    id: 'v-g',
    name: 'G (Sol Maior)',
    instrument: 'violao',
    difficulty: 'facil',
    fingering: '3-2-0-0-0-3',
    colorCode: '#0000FF', // Blue
    typicalUse: 'Acompanhamento rítmico alegre.'
  },
  {
    id: 'v-am',
    name: 'Am (Lá Menor)',
    instrument: 'violao',
    difficulty: 'facil',
    fingering: 'x-0-2-2-1-0',
    colorCode: '#FFFF00', // Yellow
    typicalUse: 'Músicas mais calmas ou tristes.'
  },
  
  // Ukulele - Kids Friendly
  {
    id: 'u-c',
    name: 'C (Dó Maior)',
    instrument: 'ukulele',
    difficulty: 'facil',
    fingering: '0-0-0-3',
    colorCode: '#FF0000', // Red
    typicalUse: 'O acorde mais fácil para começar no ukulele.'
  },
  {
    id: 'u-f',
    name: 'F (Fá Maior)',
    instrument: 'ukulele',
    difficulty: 'facil',
    fingering: '2-0-1-0',
    colorCode: '#00FF00', // Green
    typicalUse: 'Muito usado em músicas de 2 acordes.'
  },
  {
    id: 'u-g',
    name: 'G (Sol Maior)',
    instrument: 'ukulele',
    difficulty: 'medio',
    fingering: '0-2-3-2',
    colorCode: '#0000FF', // Blue
    typicalUse: 'Acorde fundamental para canções alegres.'
  },
  {
    id: 'u-g7',
    name: 'G7 (Sol com Sétima)',
    instrument: 'ukulele',
    difficulty: 'medio',
    fingering: '0-2-1-2',
    colorCode: '#FFA500', // Orange
    typicalUse: 'Preparação clássica para voltar ao C.'
  }
];

export const PEDAGOGICAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-redhouse-1',
    title: 'O Trem das Cores (RedHouse Train)',
    description: 'As crianças formam um "trem" e devem trocar de acorde (estação) quando o professor mostra a cor correspondente.',
    blockType: 'jogo',
    difficulty: 'iniciante',
    focus: 'coordenação',
    instruments: ['violao', 'ukulele'],
    ageRange: '4-7 anos',
    pedagogicalObjective: 'Associação visual-motora e prontidão na troca de acordes em grupo.'
  },
  {
    id: 'act-redhouse-2',
    title: 'Círculo de Ukuleles (Pulse Circle)',
    description: 'Em círculo, cada criança toca uma batida e "passa" o pulso para o colega do lado sem deixar o ritmo cair.',
    blockType: 'jogo',
    difficulty: 'iniciante',
    focus: 'ritmo',
    instruments: ['ukulele'],
    ageRange: '5-9 anos',
    pedagogicalObjective: 'Desenvolvimento do pulso coletivo e escuta do grupo.'
  },
  {
    id: 'act-redhouse-3',
    title: 'Pintura Sonora (Sound Painting)',
    description: 'O professor desenha formas no ar (ou quadro) e os alunos devem traduzir em sons (curtos, longos, fortes, fracos).',
    blockType: 'novo_conteudo',
    difficulty: 'iniciante',
    focus: 'expressão',
    instruments: ['violao', 'ukulele', 'piano', 'canto'],
    ageRange: '4-10 anos',
    pedagogicalObjective: 'Exploração de dinâmicas e texturas sonoras de forma lúdica.'
  },
  {
    id: 'act-redhouse-4',
    title: 'Desafio do Pequeno Mestre',
    description: 'Um aluno é escolhido para ser o "Mestre" e conduzir o grupo em um padrão rítmico ou melódico simples.',
    blockType: 'jogo',
    difficulty: 'intermediario',
    focus: 'liderança',
    instruments: ['violao', 'ukulele', 'bateria'],
    ageRange: '7-12 anos',
    pedagogicalObjective: 'Desenvolvimento de autonomia, liderança e segurança musical.'
  },
  {
    id: 'act-1',
    title: 'Troca Relâmpago',
    description: 'Trocar entre dois acordes (ex: C e G) o mais rápido possível seguindo um pulso.',
    blockType: 'jogo',
    difficulty: 'iniciante',
    focus: 'coordenação',
    instruments: ['violao', 'ukulele'],
    ageRange: '6-10 anos',
    pedagogicalObjective: 'Desenvolver agilidade na mão esquerda e precisão rítmica.'
  },
  {
    id: 'act-2',
    title: 'Eco Rítmico (Call & Response)',
    description: 'O professor toca um ritmo simples e os alunos repetem exatamente igual.',
    blockType: 'aquecimento',
    difficulty: 'iniciante',
    focus: 'ritmo',
    instruments: ['violao', 'ukulele', 'bateria', 'piano'],
    ageRange: '4-12 anos',
    pedagogicalObjective: 'Melhorar a escuta ativa e a percepção de pulso e subdivisão.'
  },
  {
    id: 'act-3',
    title: 'A Aranha Colorida',
    description: 'Exercício de dedilhado usando as cores das cordas (API de Cores).',
    blockType: 'pratica',
    difficulty: 'iniciante',
    focus: 'coordenação',
    instruments: ['violao', 'ukulele'],
    ageRange: '5-8 anos',
    pedagogicalObjective: 'Independência dos dedos e memorização das cordas por cores.'
  },
  {
    id: 'act-4',
    title: 'Mestre da Batida',
    description: 'Seguir diferentes padrões rítmicos desenhados com ícones ou cores.',
    blockType: 'jogo',
    difficulty: 'iniciante',
    focus: 'ritmo',
    instruments: ['violao', 'ukulele', 'bateria'],
    ageRange: '6-10 anos',
    pedagogicalObjective: 'Internalização de padrões rítmicos básicos.'
  }
];
