<template>
  <div class="ai-optimizer-container">
    <div class="ai-header">
      <h4>AI 简历优化助手</h4>
    </div>
    
    <!-- 聊天消息区域 -->
    <div class="chat-messages">
      <div 
        v-for="(message, index) in chatMessages" 
        :key="index" 
        :class="['message', message.role]"
        @mouseenter="showCopyBtn = index"
        @mouseleave="showCopyBtn = -1"
      >
        <div class="message-avatar">
          <el-avatar :icon="message.role === 'user' ? User : ChatLineRound" :size="30" />
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <div v-if="message.role === 'assistant'" v-html="renderMarkdown(message.content)"></div>
            <div v-else>{{ message.content }}</div>
            <el-button 
              v-show="showCopyBtn === index" 
              class="copy-btn" 
              type="info" 
              size="small" 
              :icon="CopyDocument"
              @click="copyMessage(message.content)"
            />
          </div>
          <div class="message-time">{{ message.timestamp }}</div>
        </div>
      </div>
      
      <!-- 显示加载状态 -->
      <div v-if="isLoading" class="message assistant">
        <div class="message-avatar">
          <el-avatar :icon="ChatLineRound" :size="30" />
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="chat-input-area">
      <el-input
        v-model="aiInput"
        :rows="3"
        type="textarea"
        placeholder="向AI助手描述您想优化的内容，例如：'帮我优化技能部分'、'让我的自我评价更吸引人'"
        maxlength="500"
        show-word-limit
        :disabled="isLoading"
        @keyup.enter.exact="handleEnter"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ChatLineRound,
  User,
  CopyDocument
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { requestAICompletion } from '@/utils/aiRequest'
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages"
import { formatResumeOptimizationPrompt } from '@/prompts/resumeOptimization'
import MarkdownIt from 'markdown-it';

// 创建 MarkdownIt 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// 定义组件的props和emits
const props = defineProps<{
  resumeMarkdown: string
  jobDescription?: string
}>()

const emits = defineEmits<{
  'apply-optimization': [optimizedContent: string]
}>()

// 响应式数据
const aiInput = ref('')
const chatMessages = ref([
  {
    role: 'assistant',
    content: '你好！我是您的简历优化助手，可以帮助您改进简历内容。您可以上传简历或直接编辑，然后告诉我需要优化的部分。',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
])
const showCopyBtn = ref(-1)
const isLoading = ref(false)

// 渲染markdown内容
const renderMarkdown = (content: string) => {
  return md.render(content);
}

// 构建系统提示词
const buildSystemPrompt = (resumeContent: string, jobDescription?: string, userInput: string = '') => {
  return formatResumeOptimizationPrompt({
    resumeContent,
    jobDescription,
    userInput
  });
}

// 处理回车发送消息
const handleEnter = (event: KeyboardEvent) => {
  if (event.shiftKey) {
    // 如果按下Shift键，则不触发发送，允许换行
    return
  }
  event.preventDefault() // 阻止默认的换行行为
  sendToAI()
}

// 发送消息到AI
const sendToAI = async () => {
  if (!aiInput.value.trim() || isLoading.value) return
  
  // 添加用户消息到聊天
  const userMessage = {
    role: 'user',
    content: aiInput.value,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  chatMessages.value.push(userMessage)
  
  // 清空输入框
  aiInput.value = ''
  
  // 设置加载状态
  isLoading.value = true
  
  try {
    // 构建消息列表
    const messages: BaseMessage[] = [
      new SystemMessage(buildSystemPrompt(props.resumeMarkdown, props.jobDescription, userMessage.content))
    ];
    
    // 添加历史对话记录
    chatMessages.value.slice(1).forEach(msg => {
      if (msg.role === 'user') {
        messages.push(new HumanMessage(msg.content));
      } else if (msg.role === 'assistant') {
        messages.push(new AIMessage(msg.content));
      }
    });

    console.log('消息列表:', messages)
    
    // 调用大模型API
    const aiResponse = await requestAICompletion({
      messages
    })
    
    // 添加AI回复到聊天
    const aiMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    console.log('AI回复:', aiMessage.content)
    
    chatMessages.value.push(aiMessage)
  } catch (error) {
    console.error('发送到AI失败:', error)
    const errorMessage = {
      role: 'assistant',
      content: '很抱歉，AI助手暂时无法响应，请稍后重试。',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    chatMessages.value.push(errorMessage)
  } finally {
    // 结束加载状态
    isLoading.value = false
  }
}

// 复制消息内容
const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.ai-optimizer-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
}

.ai-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f8fafc;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
  position: relative;
  font-size: 12px;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  display: flex;
  align-items: flex-start;
  margin-top: 5px;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.message-bubble {
  padding: 6px 6px;
  border-radius: 4px;
  position: relative;
}

.message-bubble p {
  margin: 0;
}

.message-bubble .copy-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  transform: scale(0.8);
}

.message.assistant .message-bubble {
  background: #f0f4f8;
  border: 1px solid #e2e6eb;
  border-radius: 8px;
  color: #333;
}

.message.user .message-bubble {
  background: #409eff;
  color: white;
  border-radius: 8px;
}

.message-time {
  font-size: 12px;
  color: #909399;
  text-align: right;
  padding-right: 5px;
}

.chat-input-area {
  padding-top: 16px;
  border-top: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-input-area .el-textarea {
  --el-input-border-color: #dcdfe6;
  border-radius: 18px;
}

.chat-input-area .el-textarea :deep(.el-textarea__inner) {
  border-radius: 18px;
  padding: 14px;
}

.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9ca3af;
  margin: 0 2px;
  animation: bounce 1.3s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>