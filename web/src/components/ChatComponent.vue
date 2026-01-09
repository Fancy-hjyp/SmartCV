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
      >
        <div class="message-avatar">
          <el-avatar :icon="message.role === 'user' ? User : ChatLineRound" :size="30" />
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <div v-html="message.content"></div>
          </div>
          <div class="message-time">{{ message.timestamp }}</div>
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
      />
      <div class="input-controls">
        <el-button 
          type="primary" 
          :icon="MagicStick" 
          @click="sendToAI"
          :disabled="!aiInput.trim()"
        >
          发送
        </el-button>
        <el-button 
          :icon="DocumentCopy" 
          @click="applyAIOptimization"
        >
          应用AI优化
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ChatLineRound,
  User,
  MagicStick,
  DocumentCopy
} from '@element-plus/icons-vue'

// 定义组件的props和emits
const props = defineProps<{
  resumeMarkdown: string
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

// 发送消息到AI
const sendToAI = () => {
  if (!aiInput.value.trim()) return
  
  // 添加用户消息到聊天
  const userMessage = {
    role: 'user',
    content: aiInput.value,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  chatMessages.value.push(userMessage)
  
  // 清空输入框
  aiInput.value = ''
  
  // 模拟AI回复
  setTimeout(() => {
    const aiResponse = {
      role: 'assistant',
      content: getAIResponse(userMessage.content),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    chatMessages.value.push(aiResponse)
  }, 1000)
}

// 根据用户输入生成AI回复
const getAIResponse = (userInput: string) => {
  // 简单的规则匹配，实际项目中应该调用AI API
  if (userInput.includes('技能') || userInput.includes('技术')) {
    return '我建议将技能按熟练程度分层展示，并量化您的技术成果。例如："熟练掌握Vue.js、React等前端框架，有3年以上实际项目经验，能够构建高性能、可维护的前端应用"。'
  } else if (userInput.includes('自我评价') || userInput.includes('评价')) {
    return '好的自我评价应该突出个人特色和价值。建议强调您的核心竞争力和过往成就，比如："具备丰富的前端开发经验，擅长解决复杂技术问题，曾主导多个大型项目前端架构设计，注重代码质量和团队协作"。'
  } else if (userInput.includes('项目') || userInput.includes('经验')) {
    return '项目经验部分应量化成果，突出贡献。建议包含具体数据，如："负责XX项目前端开发，通过性能优化使页面加载速度提升40%，用户体验显著改善"。'
  } else if (userInput.includes('优化') || userInput.includes('改')) {
    return '针对您的简历，我建议: 1.使用动词开头描述工作经历 2.量化工作成果 3.突出与目标职位相关的技能和经验 4.简化冗余信息，突出重点。'
  } else {
    return '我已经收到您的请求，正在分析您的简历内容。对于简历优化，我建议从以下几个方面入手：1.突出核心技能和经验；2.量化工作成果；3.优化语言表达，使用更专业的术语。'
  }
}

// 应用AI优化
const applyAIOptimization = () => {
  // 模拟AI优化
  let optimizedResume = props.resumeMarkdown
  
  // 这里可以集成真实的AI优化逻辑
  // 暂时使用模拟数据
  if (optimizedResume.includes('张三')) {
    optimizedResume = optimizedResume.replace(/张三/g, '求职者')
    optimizedResume = optimizedResume.replace(/zhangsan@example.com/g, 'contact@example.com')
  }
  
  // 添加AI响应到聊天
  chatMessages.value.push({
    role: 'assistant',
    content: '已为您应用AI优化建议，对简历中的基本信息进行了优化处理。',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  // 触发事件，将优化后的内容传递给父组件
  emits('apply-optimization', optimizedResume)
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
}

.message-bubble {
  padding: 14px 18px;
  border-radius: 18px;
  position: relative;
}

.message.assistant .message-bubble {
  background: #f0f4f8;
  border: 1px solid #e2e6eb;
  border-radius: 18px;
  color: #333;
}

.message.user .message-bubble {
  background: #409eff;
  color: white;
  border-radius: 18px;
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

.input-controls {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.input-controls .el-button {
  border-radius: 18px;
  font-weight: 500;
  height: 40px;
  padding: 0 20px;
}
</style>