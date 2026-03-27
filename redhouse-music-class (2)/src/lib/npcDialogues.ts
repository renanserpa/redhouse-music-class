export const npcDialogues = {
  lessonStart: {
    guitar: [
      "Bem-vindo ao Vale das Cordas, pequeno Rockstar! Prepare os dedos e vamos fazer música!",
      "Afinou seu ouvido de detetive hoje? Vamos encontrar novas notas mágicas escondidas na floresta!",
      "Coluna reta e coração no ritmo. Vamos nessa!",
      "O Grande Relógio está batendo! Consegue sentir a música no seu corpo?",
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
      "Um acorde perfeito! Ressoou tão forte quanto o passo de um Elefante!",
      "Uau, você tocou esse 'Tá, Ti-Ti' brilhantemente! No tempo exato!",
      "Nota Dó afinadíssima! Você tocou no alvo da cor vermelha.",
      "Isso! A melodia soou doce e leve como o canto de um passarinho.",
      "Isso sim é música! Você está voando! 🚀"
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
      "Opa, o som saiu um pouco abafado. Tente apertar o dedo bem perto do ferrinho dourado!",
      "Quaaase lá! Vamos devagar, como na Matrix?",
      "Não se preocupe! Todo grande Rockstar erra nos ensaios. Respire fundo e tente mais uma vez.",
      "Eita, passou rápido demais? Vamos diminuir a velocidade para entender cada nota.",
      "Quase! Toda corda desafina às vezes. Vamos tentar de novo? 🎯"
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
    "Incrível! Você escalou toda a Montanha do Ritmo sem perder a pulsação.",
    "A Floresta dos Acordes agora floresce graças à sua música. Excelente trabalho!",
    "Você está pronto para o grande palco. Suas mãos e seus ouvidos já trabalham juntos!",
    "Mais um Mundo completo! Suas moedas GMC e seus XP mostram o quanto você cresceu!"
  ],
  unlock: [
    "Bling! Você acaba de desbloquear um novo Acorde na sua Biblioteca. Vá explorá-lo no ChordLab!",
    "Sinta o poder! Você ganhou o título de 'Mestre do Dedilhado'.",
    "Uau! Subiu de nível! Agora você é oficialmente um 'Aspirante a Rockstar'!",
    "Nova Música Liberada: Queen - We Will Rock You! Hora de fazer barulho!",
    "Recompensa coletada! Você provou ter uma Simples Solução para todos os mistérios das cordas!"
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
