<template>
  <div class="resume-optimization-container">
    <!-- 模板选择区域 -->
    <div class="template-selector">
      <div class="template-header">
        <div class="control-group">
          <!-- 简历模板选择 -->
          <div class="select-label">简历模板:</div>
          <el-select 
            v-model="selectedTemplate" 
            placeholder="选择简历模板"
            size="small"
            style="width: 100px; margin-right: 12px;"
            @change="handleTemplateChange"
          >
            <el-option
              v-for="template in templates"
              :key="template.id"
              :label="template.name"
              :value="template.id"
            />
          </el-select>
          
          <!-- 主题颜色选择 -->
          <div class="select-label">主题颜色:</div>
          <el-select 
            v-model="selectedThemeColor" 
            placeholder="主题颜色"
            size="small"
            style="width: 100px; margin-right: 12px;"
            :label-in-value="true"
            @change="handleThemeColorChange"
          >
            <el-option
              v-for="color in themeColors"
              :key="color.name"
              :label="color.name"
              :value="color.name"
            >
              <div class="dropdown-color-option">
                <div 
                  class="color-preview" 
                  :style="{ background: `linear-gradient(45deg, ${color.primary}, ${color.secondary})` }"
                ></div>
                <span>{{ color.name }}</span>
              </div>
            </el-option>
          </el-select>
          
          <!-- 字体大小选择 -->
          <div class="select-label">字体大小:</div>
          <el-select 
            v-model="fontSize" 
            placeholder="字体大小"
            size="small"
            style="width: 100px; margin-right: 12px;"
            @change="handleFontSizeChange"
          >
            <el-option
              v-for="size in fontSizeOptions"
              :key="size.value"
              :label="size.label"
              :value="size.value"
            />
          </el-select>
          
          <!-- 字体类型选择 -->
          <div class="select-label">字体类型:</div>
          <el-select 
            v-model="fontFamily" 
            placeholder="字体类型"
            size="small"
            style="width: 120px;"
            @change="handleFontFamilyChange"
          >
            <el-option
              v-for="font in fontFamilyOptions"
              :key="font.value"
              :label="font.label"
              :value="font.value"
            />
          </el-select>
          
          <!-- 行间距选择 -->
          <div class="select-label">行间距:</div>
          <el-select 
            v-model="lineHeight" 
            placeholder="行间距"
            size="small"
            style="width: 80px; margin-right: 12px;"
            @change="handleLineHeightChange"
          >
            <el-option
              v-for="height in lineHeightOptions"
              :key="height.value"
              :label="height.label"
              :value="height.value"
            />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 主要工作区域 -->
    <div class="work-area">
      <!-- 左侧：编辑区域 -->
      <div class="input-panel">
        <div class="panel-header">
          <h3>简历编辑</h3>
          <div class="panel-actions">
            <el-button 
              size="small" 
              @click="showAvatarDialog = true"
              :icon="Upload"
            >
              上传照片
            </el-button>
            <el-button 
              size="small" 
              @click="showResumeDialog = true"
              :icon="Document"
            >
              上传简历
            </el-button>
            <el-button 
              size="small" 
              @click="showJDInputDialog = true"
              :icon="FolderOpened"
            >
              导入JD
            </el-button>
          </div>
        </div>
        <div class="input-content">
          <div class="markdown-editor">
            <el-input
              v-model="resumeMarkdown"
              type="textarea"
              placeholder="在这里编辑您的简历内容..."
              resize="none"
              @input="handleInputChange"
              style="height: 100%;"
            />
          </div>
        </div>
      </div>

      <!-- 右侧：预览和优化区域 -->
      <div class="preview-panel">
        <!-- 预览选项卡 -->
        <el-tabs v-model="activePreviewTab" type="border-card" style="height: 100%;">
          <el-tab-pane label="AI 优化" name="aiOptimize" style="height: 100%;">
            <ChatComponent 
              :resume-markdown="resumeMarkdown" 
              @apply-optimization="handleAIApplyOptimization"
            />
          </el-tab-pane>
          
          <el-tab-pane label="预览" name="preview" style="height: 100%;">
            <ResumePreview 
              :resume-markdown="resumeMarkdown" 
              :selected-template="selectedTemplate" 
              :avatar="avatar"
              :selected-theme-color="selectedThemeColor"
              :theme-colors="themeColors"
              :font-size="fontSize"
              :font-family="fontFamily"
              :line-height="lineHeight"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
    <!-- 上传照片弹窗 -->
    <AvatarUploadDialog 
      v-model="showAvatarDialog"
      :avatar="avatar"
      @confirm="handleConfirmAvatar"
      @cancel="handleCloseAvatarDialog"
    />

    <!-- 上传简历弹窗 -->
    <ResumeUploadDialog 
      v-model="showResumeDialog"
      @confirm="handleConfirmResume"
      @cancel="handleCloseResumeDialog"
    />

    <!-- 导入JD弹窗 -->
    <JDInputDialog 
      v-model="showJDInputDialog"
      :jd-content="jdContent"
      @confirm="handleConfirmJDInput"
      @cancel="handleCloseJDInputDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Document, 
  FolderOpened, 
  Upload, 
} from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import '../styles/templates/index.css'

import ChatComponent from '@/components/ChatComponent.vue'
import ResumePreview from '@/components/ResumePreview.vue'
import AvatarUploadDialog from '@/components/AvatarUploadDialog.vue'
import ResumeUploadDialog from '@/components/ResumeUploadDialog.vue'
import JDInputDialog from '@/components/JDInputDialog.vue'

// 导入jsPDF相关库

// 初始化markdown解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang?: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})

// 响应式数据
const selectedTemplate = ref('tech')
const activePreviewTab = ref('preview')
const avatar = ref('')
const jdContent = ref('')
const resumeMarkdown = ref(`# 个人简历

## 基本信息
- 姓名：张三
- 电话：138-8888-8888
- 邮箱：zhangsan@example.com
- 地址：北京市朝阳区

## 教育背景
- **北京大学** | 计算机科学与技术 | 本科 | 2016-2020
- **清华大学** | 软件工程 | 硕士 | 2020-2023

## 工作经历
- **ABC科技有限公司** | 高级前端工程师 | 2023-至今
  - 负责公司产品前端架构设计与开发
  - 优化产品性能，提升用户体验
  - 参与团队技术分享与新人培养

## 项目经验
- **智能简历优化系统**
  - 负责前后端开发，使用Vue3和Node.js
  - 集成AI优化功能，提升简历通过率
  - 项目获得公司年度最佳产品奖

## 技能专长
- 熟练掌握JavaScript、TypeScript、Vue.js等前端技术
- 熟悉React、Node.js等技术栈
- 具备良好的UI/UX设计能力

## 自我评价
积极向上，具有良好的团队协作能力，热爱技术，持续学习新知识，致力于为公司创造更大价值。`)


// 主题配置
const templates = [
  { id: 'tech', name: '专业简洁' },
]

// 主题颜色配置
const themeColors = [
  { name: '商务蓝', primary: '#0052ff', secondary: '#1890ff' },
  { name: '活力橙', primary: '#fa8c16', secondary: '#d46b08' },
  { name: '优雅紫', primary: '#722ed1', secondary: '#531dab' },
  { name: '清新绿', primary: '#52c41a', secondary: '#389e0d' },
]

// 字体大小选项配置
const fontSizeOptions = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
]

// 字体类型选项配置
const fontFamilyOptions = [
  { label: '系统默认', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif' },
  { label: '宋体', value: '"SimSun", "STSong", serif' },
  { label: '微软雅黑', value: '"Microsoft YaHei", "PingFang SC", sans-serif' },
]

// 行间距选项配置
const lineHeightOptions = [
  { label: '1.0', value: '1.0' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2.0' },
]

// 响应式数据 - 添加主题状态
const selectedThemeColor = ref(themeColors[0].name)
const fontSize = ref('12px')
const fontFamily = ref('-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif')
const lineHeight = ref('1.5')

// 弹窗显示控制
const showAvatarDialog = ref(false)
const showResumeDialog = ref(false)
const showJDInputDialog = ref(false)
const handleTemplateChange = (templateId: string) => {
  console.log('切换到模板:', templateId)
}

const handleThemeColorChange = (value: string) => {
  console.log('切换到主题颜色:', value)
  const colorObj = themeColors.find(color => color.name === value);
  if (colorObj) {
    selectedThemeColor.value = colorObj.name;
  }
}

const handleFontSizeChange = (value: string) => {
  fontSize.value = value
  console.log('切换到字体大小:', value)
}

const handleFontFamilyChange = (value: string) => {
  fontFamily.value = value
  console.log('切换到字体类型:', value)
}

const handleLineHeightChange = (value: string) => {
  lineHeight.value = value
  console.log('切换到行间距:', value)
}

const handleInputChange = () => {
  // 实时转换处理
}

// 弹窗相关方法
const handleCloseAvatarDialog = () => {
  showAvatarDialog.value = false
}

const handleConfirmAvatar = (avatarUrl: string) => {
  avatar.value = avatarUrl
  showAvatarDialog.value = false
  ElMessage.success('照片上传成功')
}

const handleCloseResumeDialog = () => {
  showResumeDialog.value = false
}

const handleConfirmResume = () => {
  showResumeDialog.value = false
  ElMessage.success('简历上传成功')
}

const handleCloseJDInputDialog = () => {
  showJDInputDialog.value = false
}

const handleConfirmJDInput = (content: string) => {
  jdContent.value = content
  showJDInputDialog.value = false
  ElMessage.success('JD内容已保存')
}

// 监听主题变化
watch([selectedTemplate, selectedThemeColor, fontSize, fontFamily, lineHeight], async () => {
  nextTick(() => {
    const previewPages = document.querySelectorAll<HTMLElement>('.preview-page');
    if (previewPages.length === 0) return;
    
    previewPages.forEach(previewPage => {
      // 清除所有模板类
      previewPage.className = previewPage.className.replace(/template-\w+/g, '');
      previewPage.classList.add(`template-${selectedTemplate.value}`);
      
      // 应用样式
      Object.entries(getCurrentTemplateVariables()).forEach(([key, value]) => {
        previewPage.style.setProperty(`--${key}`, value);
      });
    });
  });
}, { deep: true });

// 获取当前模板的CSS变量
const getCurrentTemplateVariables = () => {
  // 获取主题颜色对象
  const themeColorObj = themeColors.find(color => color.name === selectedThemeColor.value) || themeColors[0];
  
  return {
    primaryColor: themeColorObj.primary,
    secondaryColor: themeColorObj.secondary,
    fontSize: fontSize.value,
    fontFamily: fontFamily.value,
    lineHeight: lineHeight.value
  };
};

// 添加处理AI优化应用的方法
const handleAIApplyOptimization = (optimizedContent: string) => {
  resumeMarkdown.value = optimizedContent;
  ElMessage.success('已应用AI优化建议');
}
</script>

<style scoped>
.resume-optimization-container {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* 模板选择区域 */
.template-selector {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #dbdbdc;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.control-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px;
}

.select-label {
  font-weight: 400;
  color: #3f83f8;
  white-space: nowrap;
  font-size: 13px;
}

.dropdown-color-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
}

/* 主工作区域 */
.work-area {
  display: flex;
  flex: 1;
  gap: 16px;
  padding: 0 16px 16px;
  overflow: hidden;
} 

.input-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgb(255, 255, 255);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #dbdbdc;
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.panel-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.input-content {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.markdown-editor {
  flex: 1;
  margin-top: 16px;
}

.markdown-editor :deep(.el-textarea__inner) {
  height: 100% !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.preview-panel {
  width: 60%;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #eee;
  width: 100%;
}

.button-group {
  display: flex;
  gap: 8px;
}

.preview-container {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.preview-page {
  width: 210mm; /* A4 宽度 */
  min-height: 297mm; /* A4 高度 */
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  box-sizing: border-box;
  overflow: hidden;
}

.placeholder {
  color: #909399;
  text-align: center;
  padding: 40px 0;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .work-area {
    flex-direction: column;
  }
  
  .preview-panel {
    width: 100%;
    min-width: auto;
  }
}
</style>