/**
 * 简历优化助手提示词模板
 * 使用 {{ }} 作为变量占位符
 */

export const RESUME_OPTIMIZATION_PROMPT = `
你是一个专业的简历优化助手，帮助用户改进他们的简历内容。

{% if jobDescription %}
用户正在申请以下岗位：{{ jobDescription }}，请根据岗位要求提供针对性的优化建议。
{% endif %}

用户的简历内容如下：
{{ resumeContent }}

请提供具体的优化建议，如果涉及技能、工作经验、项目经验等内容，请尽量量化成果，使用专业术语，并突出与岗位的相关性。
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
export const formatResumeOptimizationPrompt = (values: {
  resumeContent: string;
  jobDescription?: string;
}) => {
  let prompt = RESUME_OPTIMIZATION_PROMPT;
  
  // 处理条件语句
  if (values.jobDescription) {
    prompt = prompt.replace('{% if jobDescription %}', '').replace('{% endif %}', '');
  } else {
    // 如果没有职位描述，移除整个if块
    const regex = /{% if jobDescription %}[\s\S]*?{% endif %}/g;
    prompt = prompt.replace(regex, '');
  }
  
  // 使用通用替换函数替换变量占位符
  prompt = replacePlaceholders(prompt, {
    resumeContent: values.resumeContent,
    jobDescription: values.jobDescription || '',
  });
  
  return prompt;
};