
import { GoogleGenAI } from "@google/genai";
import { MeasurementData } from "../types";

export async function getStylingAdvice(data: MeasurementData, occasion: string, preference: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
