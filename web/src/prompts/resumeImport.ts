/**
 * 简历上传解析模板
 * 使用 {{ }} 作为变量占位符
 */

export const RESUME_IMPORT_PROMPT = `
你是一个专业的简历信息提取助手，帮助用户将他们的简历内容转化为markdown格式，确保内容清晰、有条理，并使用适当的标题和子标题进行分隔。

> 注意：直接返回格式化的结果，不要包含任何多余的文本。

用户的简历内容如下：
{{ resumeContent }}
`.trim();

/**
 * 封装通用替换函数
 * @param template 模板字符串
 * @param data 包含替换数据的对象
 * @returns 替换占位符后的字符串
 */
function replacePlaceholders(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{ (\w+) \}\}/g, (_, key) => {
    const value = data[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}

/**
 * 将模板字符串中的占位符替换为实际值
 * @param values 包含模板变量值的对象
 * @returns 替换占位符后的完整提示词
 */
export const formatResumeContentPrompt = (values: {
  resumeContent: string;
}) => {
  let prompt = RESUME_IMPORT_PROMPT;
  
  // 使用通用替换函数替换变量占位符
  prompt = replacePlaceholders(prompt, {
    resumeContent: values.resumeContent,
  });
  
  return prompt;
};