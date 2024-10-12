import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export const chatMenuWidth = '320px';

export const contentsWidth = '60%';

export const modelArr: any[] = [
  { model: 'gemini-1.5-flash-002', name: 'Gemini', type: 'gemini', maxToken: 40000 },
  { model: 'gpt-3.5-turbo', name: 'ChatGPT', type: 'gpt', maxToken: 10000 },
  { model: 'llama-3-8b-it-ko-chang-Q8:latest', name: 'Tom', type: 'ollama', maxToken: 40000 },
];

export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// 높을 수록 부드러운 Message 출력
export const msgSliceNum = 24;