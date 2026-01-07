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
            <div class="ai-optimize-panel">
              <div class="ai-header">
                <h4>AI 优化建议</h4>
                <el-switch v-model="isAIOptimized" active-text="开启优化" />
              </div>
              <div class="ai-content">
                <el-button type="primary" @click="applyAIOptimization">应用优化</el-button>
                <div class="ai-suggestions">
                  <el-card v-for="(suggestion, index) in aiSuggestions" :key="index" class="suggestion-card">
                    <div class="suggestion-content">
                      <h5>{{ suggestion.title }}</h5>
                      <p>{{ suggestion.description }}</p>
                    </div>
                  </el-card>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="预览" name="preview" style="height: 100%;">
            <div class="preview-container">
              <div class="preview-header">
                <h4>简历预览</h4>
                <div class="button-group">
                  <el-button 
                    size="small" 
                    type="primary"
                    @click="exportPDF"
                    :icon="Download"
                  >
                    导出PDF
                  </el-button>
                </div>
              </div>
              <div 
                v-for="(page, index) in pages" 
                :key="index" 
                class="preview-page" 
                :class="{ [`template-${selectedTemplate}`]: true }"
                v-html="page"
              ></div>
            </div>
          </el-tab-pane>
          
          <!-- 移除导出tab，功能已移到预览tab的工具栏中 -->
<!-- 
          <el-tab-pane label="导出" name="export">
            <div class="export-panel">
              <div class="export-header">
                <h4>导出简历</h4>
              </div>
              <div class="export-options">
                <el-button type="primary" @click="exportPDF" :icon="Download">导出PDF</el-button>
                <el-button @click="oneKeySmoothColor" :icon="MagicStick">一键润色</el-button>
                <el-button @click="copyToClipboard" :icon="DocumentCopy">复制内容</el-button>
              </div>
            </div>
          </el-tab-pane>
 -->
        </el-tabs>
      </div>
    </div>
    
    <!-- 上传照片弹窗 -->
    <el-dialog
      v-model="showAvatarDialog"
      title="上传照片"
      width="400px"
      :before-close="handleCloseAvatarDialog"
    >
      <div class="upload-section">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="avatar" :src="avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAvatarDialog = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmAvatar">确认</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 上传简历弹窗 -->
    <el-dialog
      v-model="showResumeDialog"
      title="上传简历"
      width="500px"
      :before-close="handleCloseResumeDialog"
    >
      <div class="upload-section">
        <el-upload
          drag
          action="/api/upload"
          :on-success="handleResumeUpload"
          :before-upload="beforeResumeUpload"
          :limit="1"
          :auto-upload="true"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showResumeDialog = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmResume">确认</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 导入JD弹窗 -->
    <el-dialog
      v-model="showJDInputDialog"
      title="导入JD"
      width="600px"
      :before-close="handleCloseJDInputDialog"
    >
      <div class="jd-input">
        <el-input
          v-model="jdContent"
          :rows="10"
          type="textarea"
          placeholder="请输入或粘贴职位描述(JD)内容"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showJDInputDialog = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmJDInput">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { 
  Document, 
  FolderOpened, 
  Upload, 
  Plus, 
  UploadFilled, 
  Download, 
  MagicStick, 
  DocumentCopy 
} from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import '../styles/templates/index.css'

// 导入jsPDF相关库
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

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
const isAIOptimized = ref(false)
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

const aiSuggestions = ref([
  { title: "技能部分优化", description: "建议将技能按照熟练程度分层展示，突出核心技能" },
  { title: "项目经验优化", description: "建议量化项目成果，添加具体数据指标" }
])

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
const previewContainerRef = ref(null)

// 弹窗显示控制
const showAvatarDialog = ref(false)
const showResumeDialog = ref(false)
const showJDInputDialog = ref(false)

// 方法
const preserveSpaces = (html: string): string => {
  return html.replace(/(>)([^<]+)(<)/g, (match, openTag: string, textContent: string, closeTag: string) => {
    // 在标签之间的文本内容中，将连续空格替换为 &nbsp;
    const processedText = textContent.replace(/ {2,}/g, (spaces: string) => '&nbsp;'.repeat(spaces.length))
    return openTag + processedText + closeTag
  })
}

// 计算属性
const renderedHtml = computed(() => {
  if (!resumeMarkdown.value.trim()) {
    return '<div class="placeholder">请输入简历内容...</div>'
  }
  let html = md.render(resumeMarkdown.value)
  // 使用 preserveSpaces 方法保留连续空格
  html = preserveSpaces(html)
  
  // 如果有头像，则在渲染的HTML中添加照片元素
  if (avatar.value) {
    // 在HTML内容的最前面添加照片元素
    html = `<img class="resume-photo" src="${avatar.value}" alt="头像" />${html}`
  }
  
  return html
})

// 新增：计算分页的内容
const pages = computed(() => {
  if (!resumeMarkdown.value.trim()) {
    return ['<div class="placeholder">请输入简历内容...</div>']
  }
  
  let htmlContent = md.render(resumeMarkdown.value)
  // 使用 preserveSpaces 方法保留连续空格
  htmlContent = preserveSpaces(htmlContent)
  
  // 如果有头像，则在渲染的HTML中添加照片元素
  if (avatar.value) {
    // 在HTML内容的最前面添加照片元素
    htmlContent = `<img class="resume-photo" src="${avatar.value}" alt="头像" />${htmlContent}`
  }
  
  // 简单的分页逻辑 - 将内容按页面高度分割
  return splitContentToPages(htmlContent)
})

const splitContentToPages = (htmlContent: string): string[] => {
  // A4 页面尺寸相关常量
  const PAGE_WIDTH = '210mm';
  const PAGE_HEIGHT_PX = 297 * 3.78; // 297mm 转换为像素 (以96 DPI计算)
  const PAGE_PADDING = 24;

  // 创建临时容器来测量内容
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.width = PAGE_WIDTH;
  tempContainer.style.padding = `${PAGE_PADDING}px`;
  tempContainer.style.boxSizing = 'border-box';
  tempContainer.className = `template-${selectedTemplate.value}`;

  // 从当前模板变量中获取其他CSS变量并应用
  Object.entries(getCurrentTemplateVariables()).forEach(([key, value]) => {
    tempContainer.style.setProperty(`--${key}`, value);
  });

  document.body.appendChild(tempContainer);

  // 将HTML内容放入临时容器
  tempContainer.innerHTML = htmlContent;

  // 如果内容高度小于一页，则返回单页
  if (tempContainer.offsetHeight <= PAGE_HEIGHT_PX) {
    document.body.removeChild(tempContainer);
    return [htmlContent];
  }

  // 初始化分页结果和当前页内容
  const pages: string[] = [];
  const nodes = Array.from(tempContainer.childNodes);
  
  // 创建测试容器
  const testContainer = document.createElement('div');
  testContainer.style.position = 'absolute';
  testContainer.style.left = '-9999px';
  testContainer.style.width = PAGE_WIDTH;
  testContainer.style.padding = `${PAGE_PADDING}px`;
  testContainer.style.boxSizing = 'border-box';
  testContainer.className = `template-${selectedTemplate.value}`;

  // 从当前模板变量中获取其他CSS变量并应用
  Object.entries(getCurrentTemplateVariables()).forEach(([key, value]) => {
    testContainer.style.setProperty(`--${key}`, value);
  });

  document.body.appendChild(testContainer);

  // 逐个处理节点，添加到当前页直到超长
  let currentPageNodes: Node[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i].cloneNode(true);
    currentPageNodes.push(node);

    // 更新测试容器内容
    testContainer.innerHTML = '';
    currentPageNodes.forEach(n => testContainer.appendChild(n.cloneNode(true)));

    // 如果当前页内容超出了页面高度，需要分页
    if (testContainer.offsetHeight > PAGE_HEIGHT_PX) {
      // 如果当前页有多个元素，将之前的元素保存为一页，当前元素放到下一页
      if (currentPageNodes.length > 1) {
        // 移除当前节点
        currentPageNodes.pop();
        
        // 保存当前页（除了当前节点）
        testContainer.innerHTML = '';
        currentPageNodes.forEach(n => testContainer.appendChild(n.cloneNode(true)));
        pages.push(testContainer.innerHTML);
        
        // 重置当前页，只包含当前节点
        currentPageNodes = [nodes[i].cloneNode(true)];
      } 
      // 如果当前页只有一个元素但超长，需要特殊处理（如拆分文本节点或递归处理元素）
      else {
        const node = currentPageNodes[0];
        // 检查是否为文本节点
        if (node.nodeType === Node.TEXT_NODE) {
          // 处理超长文本节点
          const result = handleOverflowingTextNode(node.textContent || '', testContainer, PAGE_HEIGHT_PX);
          if (result.pages.length > 0) {
            pages.push(...result.pages);
          }
          currentPageNodes = result.remainingNodes;
        } 
        // 检查是否为元素节点且有子节点
        else if ((node as Element).childNodes && (node as Element).childNodes.length > 0) {
          // 递归处理子节点
          const subPages = paginateNodeContent(node, PAGE_HEIGHT_PX);
          if (subPages.length > 0) {
            pages.push(...subPages);
          }
          currentPageNodes = [];
        } 
        // 其他情况直接添加为一页
        else {
          testContainer.innerHTML = '';
          testContainer.appendChild(node.cloneNode(true));
          pages.push(testContainer.innerHTML);
          currentPageNodes = [];
        }
      }
    }
  }

  // 添加最后一页（如果还有剩余内容）
  if (currentPageNodes.length > 0) {
    testContainer.innerHTML = '';
    currentPageNodes.forEach(n => testContainer.appendChild(n.cloneNode(true)));
    pages.push(testContainer.innerHTML);
  }

  // 清理临时元素
  document.body.removeChild(tempContainer);
  document.body.removeChild(testContainer);

  return pages;
}

// 处理超长文本节点的辅助函数
const handleOverflowingTextNode = (text: string, testContainer: HTMLElement, PAGE_HEIGHT_PX: number) => {
  const pages: string[] = [];
  let start = 0;
  
  // 尝试逐步添加字符直到超出页面高度
  for (let end = start + 1; end <= text.length; end++) {
    testContainer.innerHTML = '';
    testContainer.appendChild(document.createTextNode(text.slice(start, end)));
    
    if (testContainer.offsetHeight > PAGE_HEIGHT_PX) {
      // 如果当前片段太短，说明单个字符就超出了页面高度，这不应该发生
      if (end - 1 > start) {
        testContainer.innerHTML = '';
        testContainer.appendChild(document.createTextNode(text.slice(start, end - 1)));
        pages.push(testContainer.innerHTML);
        start = end - 1;
        end = start; // 重新从start位置开始
      }
    }
  }
  
  // 添加剩余文本
  if (start < text.length) {
    testContainer.innerHTML = '';
    testContainer.appendChild(document.createTextNode(text.slice(start)));
    pages.push(testContainer.innerHTML);
  }
  
  return {
    pages,
    remainingNodes: []
  };
}

// 递归处理节点内容的辅助函数
const paginateNodeContent = (node: Node, PAGE_HEIGHT_PX: number): string[] => {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [node.textContent || ''];
  }
  
  const element = node as Element;
  const pages: string[] = [];
  
  // 创建测试容器来测量子元素
  const testContainer = document.createElement('div');
  testContainer.style.position = 'absolute';
  testContainer.style.left = '-9999px';
  testContainer.style.width = '210mm';
  testContainer.style.padding = '24px';
  testContainer.style.boxSizing = 'border-box';
  testContainer.className = `template-${selectedTemplate.value}`;
  
  // 从当前模板变量中获取其他CSS变量并应用
  Object.entries(getCurrentTemplateVariables()).forEach(([key, value]) => {
    testContainer.style.setProperty(`--${key}`, value);
  });
  
  document.body.appendChild(testContainer);
  
  const childNodes = Array.from(element.childNodes);
  let currentPageNodes: Node[] = [];
  
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i].cloneNode(true);
    currentPageNodes.push(child);
    
    // 创建临时容器来测试高度
    const tempElement = element.cloneNode(false) as Element;
    currentPageNodes.forEach(n => tempElement.appendChild(n.cloneNode(true)));
    testContainer.innerHTML = '';
    testContainer.appendChild(tempElement);
    
    if (testContainer.offsetHeight > PAGE_HEIGHT_PX) {
      if (currentPageNodes.length > 1) {
        // 移除当前节点，保存之前的节点
        currentPageNodes.pop();
        
        // 添加到当前元素并保存为一页
        const pageElement = element.cloneNode(false) as Element;
        currentPageNodes.forEach(n => pageElement.appendChild(n.cloneNode(true)));
        pages.push(pageElement.innerHTML);
        
        // 重置当前页，只包含当前节点
        currentPageNodes = [childNodes[i].cloneNode(true)];
      } else {
        // 单个子节点超页，需要递归处理
        const childElement = childNodes[i] as Element;
        if (childElement.nodeType === Node.ELEMENT_NODE && childElement.childNodes.length > 0) {
          // 递归处理子节点
          const subPages = paginateNodeContent(childElement, PAGE_HEIGHT_PX);
          subPages.forEach(page => {
            const tag = childElement.nodeName.toLowerCase();
            pages.push(`<${tag}>${page}</${tag}>`);
          });
        } else {
          // 直接添加文本内容
          const tag = childElement.nodeName.toLowerCase();
          const content = childElement.textContent || '';
          pages.push(`<${tag}>${content}</${tag}>`);
        }
        currentPageNodes = [];
      }
    }
  }
  
  // 添加最后一页
  if (currentPageNodes.length > 0) {
    const pageElement = element.cloneNode(false) as Element;
    currentPageNodes.forEach(n => pageElement.appendChild(n.cloneNode(true)));
    pages.push(pageElement.innerHTML);
  }
  
  document.body.removeChild(testContainer);
  return pages;
}

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

const handleAvatarSuccess = (
  response: string,
  rawFile: File
) => {
  avatar.value = URL.createObjectURL(rawFile)
  // 照片更新后，触发页面重新渲染
  console.log('头像上传成功，URL:', avatar.value)
}

const beforeAvatarUpload = (rawFile: File) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleResumeUpload = (response: any, file: any) => {
  ElMessage.success('简历上传成功')
}

const beforeResumeUpload = (rawFile: File) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('简历只能上传PDF, DOC, DOCX格式!')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('简历文件大小不能超过 10MB!')
    return false
  }
  return true
}

const applyAIOptimization = () => {
  ElMessage.success('已应用AI优化建议')
  // 模拟AI优化
  resumeMarkdown.value = resumeMarkdown.value.replace(/张三/g, '李四')
}

const exportPDF = async () => {
  ElMessage.info('正在准备导出PDF...')
  
  try {
    // 获取预览页面元素
    const previewPages = document.querySelectorAll<HTMLElement>('.preview-page');
    
    if (!previewPages || previewPages.length === 0) {
      ElMessage.error('没有找到可导出的内容');
      return;
    }
    
    // 创建PDF实例，A4尺寸
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [595.28, 841.89] // A4纸张尺寸，以points为单位
    });
    
    // 对每一页进行处理
    for (let i = 0; i < previewPages.length; i++) {
      const page = previewPages[i];
      
      // 使用html2canvas将页面元素转换为canvas
      const canvas = await html2canvas(page, {
        scale: 2, // 提高清晰度
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 595.28; // A4宽度 (pt)
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // 保持宽高比
      
      // 如果不是第一页，添加新的PDF页面
      if (i > 0) {
        pdf.addPage();
      }
      
      // 将图片添加到PDF中
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }
    
    // 保存PDF文件
    const fileName = `简历_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
    pdf.save(fileName);
    
    ElMessage.success('PDF导出成功');
  } catch (error) {
    console.error('导出PDF时发生错误:', error);
    ElMessage.error('PDF导出失败，请重试');
  }
}

const oneKeySmoothColor = () => {
  // 模拟一键润色功能
  ElMessage.success('已应用一键润色')
  console.log('一键润色逻辑')
}

const copyToClipboard = () => {
  // 模拟复制内容功能
  const textArea = document.createElement('textarea')
  textArea.value = resumeMarkdown.value
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
  ElMessage.success('已复制到剪贴板')
}

// 弹窗相关方法
const handleCloseAvatarDialog = () => {
  showAvatarDialog.value = false
}

const handleConfirmAvatar = () => {
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

const handleConfirmJDInput = () => {
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

.ai-optimize-panel {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ai-header h4 {
  margin: 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.ai-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-card {
  margin-bottom: 8px;
}

.suggestion-content h5 {
  margin: 0 0 8px 0;
  color: #303133;
}

.suggestion-content p {
  margin: 0;
  color: #606266;
  line-height: 1.5;
}

.export-panel {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.export-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.export-header h4 {
  margin: 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.upload-section {
  padding: 20px 0;
  text-align: center;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.jd-input {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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