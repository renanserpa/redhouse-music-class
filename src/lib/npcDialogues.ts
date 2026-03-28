export const npcDialogues = {
  lessonStart: {
    guitar: [
      "Bem-vindo ao Vale das Cordas, pequeno Rockstar! Prepare os dedos e vamos fazer música!",
      "Afinou seu ouvido de detetive hoje? Vamos encontrar novas notas mágicas escondidas na floresta!",
      "Ukulele ou Violão na mão, coluna reta e coração no ritmo. Vamos nessa!",
      "O Grande Relógio está batendo! Consegues sentir a música no seu corpo?",
      "Prepare sua Mão-Aranha! Nossa jornada pela Montanha do Ritmo vai começar."
    ],
    ukulele: [
      "4 cordas, infinitas possibilidades! Bora tocar? 🪕",
      "O ukulele sorri pra quem pratica. E hoje você vai fazer ele sorrir muito!",
      "Sol, Dó, Mi, Lá... são suas 4 amigas de hoje!",
      "Música pequena, alegria grande! Vamos começar?",
      "Ukulele é felicidade portátil. E você está prestes a criar a sua!"
    ]
  },
  correct: {
    guitar: [
      "Um acorde perfeito! Ressoou tão forte quanto o passo de um Elefante! 🐘",
      "Uau, você tocou esse 'Tá, Ti-Ti' brilhantemente! No tempo exato! ⏱️",
      "Nota Dó afinadíssima! Você tocou no alvo da cor vermelha. 🎯",
      "Pestana nota 10! Seu dedo indicador é forte como uma ponte de aço.",
      "Isso! A melodia soou doce e leve como o canto de um passarinho. 🐦",
      "Isso sim é música! Você está voando! 🚀",
      "Acorde perfeito de P-I-M-A! Suas mãos trabalham em harmonia!",
      "Esse ritmo tá no ponto! Tá-Ti-Ti-Tá, sem errar! 🥁"
    ],
    ukulele: [
      "Que som lindo! O ukulele está feliz com você! 🌟",
      "Perfeito! 4 cordas, 4 estrelas!",
      "Mestre Corda dança de alegria! Continue!",
      "Você acertou! Mais moedas para o seu cofre!",
      "Incrível! Seu ukulele sorriu de verdade!"
    ]
  },
  wrong: {
    guitar: [
      "Opa, o som saiu um pouco abafado. Tente apertar o dedo bem perto do ferrinho dourado (traste)!",
      "Quaaase lá! Sua mão esquerda foi rápida, mas a direita tocou a corda vizinha. Vamos devagar, como na Matrix?",
      "Não se preocupe! Todo grande Rockstar erra nos ensaios. Respire fundo e tente mais uma vez.",
      "Eita, o Mestre Relógio passou rápido demais? Vamos diminuir a velocidade para entender cada nota.",
      "Opa, essa corda soou grossa (grave), precisamos da fina (aguda). Lembre-se, conte de baixo para cima!",
      "Quase! Toda corda desafina às vezes. Vamos tentar de novo? 🎯",
      "Dica: aperte logo antes do ferrinho, não em cima dele. Isso elimina os chiados!",
      "Sem drama! Até os Rockstars famosos erraram muito antes de acertar. Vai de novo!"
    ],
    ukulele: [
      "Quase lá! O ukulele é pequeno mas precisa de carinho. Tenta de novo! 🪕",
      "Não tem problema errar. O importante é continuar tocando!",
      "Suas 4 cordas estão esperando você acertar. Vai lá!",
      "Respira, sorri e tenta outra vez. Você consegue!",
      "O ukulele é paciente. E você também pode ser!"
    ]
  },
  worldComplete: [
    "LENDÁRIO! Você conquistou mais um mundo! 🏆",
    "Parabéns! Você desvendou o segredo do Labirinto das Cordas. O Reino das Notas aguarda!",
    "Incrível! Você escalou toda a Montanha do Ritmo sem perder a pulsação.",
    "A Floresta dos Acordes agora floresce graças à sua música. Excelente trabalho!",
    "Você está pronto para o grande palco. Suas mãos e seus ouvidos já trabalham juntos como num passe de mágica!",
    "Mais um Mundo completo! Suas moedas GMC e seus XP mostram o quanto você cresceu como músico."
  ],
  unlock: [
    "Bling! Você acaba de desbloquear um novo Acorde na sua Biblioteca. Vá explorá-lo no ChordLab!",
    "Sinta o poder! Você ganhou o título de 'Mestre do Dedilhado'. Uma nova skin o aguarda!",
    "Uau! Subiu de nível! Agora você é oficialmente um 'Aspirante a Rockstar'!",
    "Nova Música Liberada: Queen - We Will Rock You! Hora de estampar as palmas das mãos e os pés!",
    "Recompensa coletada! Você provou ter uma Simples Solução para todos os mistérios das cordas!",
    "XP adquirido! A cada nota tocada, seus dedos ganham mais força e memória.",
    "Desbloqueado: Modo Metrônomo Ninja. Será que você acompanha a velocidade agora?",
    "Suas 10 moedas GMC caíram na conta. Guarde-as para personalizar seu avatar Lucca!",
    "Medalha de 'Ouvido de Detetive' alcançada! Você conseguiu diferenciar todos os sons hoje.",
    "O baú se abriu! Você tem uma nova palheta de fogo esperando por você. Mande ver no rock!"
  ]
};

export function getRandomDialogue(
  category: keyof typeof npcDialogues,
  instrument: 'guitar' | 'ukulele' = 'guitar'
): string {
  const pool = npcDialogues[category];
  const arr = Array.isArray(pool) ? pool : (pool as any)[instrument] ?? pool['guitar'];
  return arr[Math.floor(Math.random() * arr.length)];
}
