
import { GoogleGenAI } from "@google/genai";
import { MeasurementData } from "../types.ts";

// Helper robusto para obter a API Key em diferentes ambientes de deploy
const getApiKey = () => {
  // Tenta obter do process.env (padrão) ou de import.meta.env (Vite/Modern)
  const key = (typeof process !== 'undefined' && process.env?.API_KEY) || 
              (import.meta as any).env?.VITE_API_KEY || 
              (import.meta as any).env?.API_KEY || "";
  return key;
};

export async function getStylingAdvice(data: MeasurementData, occasion: string, preference: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "Nossa consultoria de elite está momentaneamente offline. Por favor, entre em contato via WhatsApp para um atendimento humano imediato.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é o Mestre Alfaiate Chefe da Fio de Linho em Salvador. 
    Analise estas medidas (cm): Peito ${data.chest}, Cintura ${data.waist}, Quadril ${data.hips}.
    O cliente busca uma roupa para: ${occasion} e prefere um estilo ${preference}.
    
    Responda em 3 partes curtas e luxuosas:
    1. Uma observação sobre a proporção do corpo.
    2. Uma recomendação técnica de corte (ex: Slim fit, Americano, Italiano).
    3. Uma sugestão de tecido ideal para o clima de Salvador (linho, lã fria, etc).
    Mantenha um tom extremamente refinado, digno de uma Maison de luxo.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sua silhueta possui proporções que permitem um corte excepcional. Para o clima de Salvador, sugerimos nossas tramas exclusivas de linho com seda. Vamos conversar sobre os detalhes?";
  }
}

export async function analyzeMeasurements(data: MeasurementData) {
  const apiKey = getApiKey();
  if (!apiKey) return "Medidas recebidas! Nossa equipe de alfaiataria fará a análise técnica final.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é um mestre alfaiate da Fio de Linho em Salvador. 
    Analise estas medidas (cm): Cintura: ${data.waist}, Peito: ${data.chest}, Quadril: ${data.hips}, 
    Altura: ${data.height}, Peso: ${data.weight}.
    Dê um feedback elegante e encorajador em 2 frases sobre a silhueta e como a roupa ficará impecável. 
    Use um tom de luxo e acolhedor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Suas medidas foram capturadas com precisão. Estamos prontos para iniciar sua obra de arte.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Medidas recebidas! Nossa equipe de alfaiataria fará a análise técnica final.";
  }
}
