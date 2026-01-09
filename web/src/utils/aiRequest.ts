import { BaseMessage } from "@langchain/core/messages";
import { getAIModel } from './aiClient';

interface AIRequestParams {
  messages: BaseMessage[];
}

/**
 * 向大模型发送消息列表，获取响应
 * @param params 包含消息列表的参数对象
 * @returns Promise<string> 返回大模型的响应内容
 */
export const requestAICompletion = async (params: AIRequestParams): Promise<string> => {
  const { messages } = params;

  try {
    // 获取AI模型实例
    const model = getAIModel();
    
    // 调用大模型
    console.log("请求大模型...");
    console.log("请求参数:", messages);
    const response = await model.invoke(messages);
    console.log("响应内容:", response.content);
    return response.content as string;
  } catch (error) {
    console.error("请求大模型失败:", error);
    throw new Error("AI服务暂时不可用，请稍后重试");
  }
};