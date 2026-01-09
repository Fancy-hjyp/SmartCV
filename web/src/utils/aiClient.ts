import { ChatOpenAI } from "@langchain/openai";

let aiModel: ChatOpenAI | null = null;

/**
 * 获取AI模型实例，如果尚未初始化则进行初始化
 * @returns ChatOpenAI 实例
 */
export const getAIModel = (): ChatOpenAI => {
  if (!aiModel) {
    aiModel = new ChatOpenAI({
      modelName: import.meta.env.VITE_MODEL_NAME,
      temperature: 0.3,
      apiKey: import.meta.env.VITE_API_KEY,
      configuration: {
        baseURL: import.meta.env.VITE_OPENAI_BASE_PATH
      }
    });
  }
  return aiModel;
};

/**
 * 重置AI模型实例（例如在API密钥更改时）
 */
export const resetAIModel = () => {
  aiModel = null;
};