import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIChallenge {
  title: string;
  description: string;
  pattern: string[]; // e.g., ["C4", "E4", "G4"] or ["kick", "snare"]
  difficulty: "iniciante" | "intermediario" | "avancado";
  type: "rhythm" | "melody";
  pedagogicalGoal: string;
}

export async function generateChallenge(
  level: string, 
  type: "rhythm" | "melody", 
  instrument: string
): Promise<AIChallenge> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um desafio musical de ${type} para um aluno de nível ${level} que toca ${instrument}. 
      O desafio deve ser pedagógico e divertido.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            pattern: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Uma lista de notas (ex: C4, D4) ou elementos rítmicos (ex: kick, snare, rest)"
            },
            difficulty: { 
              type: Type.STRING, 
              enum: ["iniciante", "intermediario", "avancado"] 
            },
            type: { 
              type: Type.STRING, 
              enum: ["rhythm", "melody"] 
            },
            pedagogicalGoal: { type: Type.STRING }
          },
          required: ["title", "description", "pattern", "difficulty", "type", "pedagogicalGoal"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as AIChallenge;
  } catch (error) {
    console.error("Error generating AI challenge:", error);
    // Fallback challenge
    return {
      title: "Desafio de Emergência",
      description: "Ocorreu um erro ao gerar o desafio, mas aqui está um para você praticar!",
      pattern: type === "rhythm" ? ["kick", "rest", "snare", "rest"] : ["C4", "E4", "G4", "C5"],
      difficulty: "iniciante",
      type: type,
      pedagogicalGoal: "Manter o engajamento mesmo com erros técnicos."
    };
  }
}

export async function getTutorAdvice(message: string, context: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O aluno está com dificuldades: ${message}. Contexto: ${context}. 
      Dê um conselho curto, encorajador e pedagógico em português para ajudá-lo a superar esse desafio.`,
      config: {
        systemInstruction: "Você é um mestre de música encorajador da RedHouse Music Class. Seja breve e use gírias de músico como 'groove', 'feeling', 'pocket'."
      }
    });
    return response.text;
  } catch (error) {
    return "Não desista! O segredo é a repetição. Vamos tentar mais uma vez com calma?";
  }
}
