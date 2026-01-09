<template>
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
      ref="previewPageRefs"
      class="preview-page" 
      :class="{ [`template-${selectedTemplate}`]: true }"
      v-html="page"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, nextTick, ref, watch } from 'vue'
import { Download } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { ElMessage } from 'element-plus'

interface Props {
  resumeMarkdown: string;
  selectedTemplate: string;
  avatar?: string;
  selectedThemeColor: string;
  themeColors: Array<{name: string, primary: string, secondary: string}>;
  fontSize: string;
  fontFamily: string;
  lineHeight: string;
}

const props = withDefaults(defineProps<Props>(), {
  avatar: ''
});

defineEmits(['export-pdf']);

// 预览页面引用
const previewPageRefs = ref<HTMLElement[]>([]);

// 获取当前模板的CSS变量
const getCurrentTemplateVariables = () => {
  // 获取主题颜色对象
  const themeColorObj = props.themeColors.find(color => color.name === props.selectedThemeColor) || props.themeColors[0];
  
  return {
    primaryColor: themeColorObj.primary,
    secondaryColor: themeColorObj.secondary,
    fontSize: props.fontSize,
    fontFamily: props.fontFamily,
    lineHeight: props.lineHeight
  };
};

// 保留空格的辅助函数
const preserveSpaces = (html: string): string => {
  return html.replace(/(>)([^<]+)(<)/g, (match, openTag: string, textContent: string, closeTag: string) => {
    // 在标签之间的文本内容中，将连续空格替换为 &nbsp;
    const processedText = textContent.replace(/ {2,}/g, (spaces: string) => '&nbsp;'.repeat(spaces.length))
    return openTag + processedText + closeTag
  })
}

// 计算分页的内容
const pages = computed(() => {
  if (!props.resumeMarkdown || !props.resumeMarkdown.trim()) {
    return ['<div class="placeholder">请输入简历内容...</div>']
  }
  
  // 使用 markdown-it 渲染
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str: string, lang?: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
                 hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                 '</code></pre>';
        } catch (__) {}
      }
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });
  
  let htmlContent = md.render(props.resumeMarkdown)
  // 使用 preserveSpaces 方法保留连续空格
  htmlContent = preserveSpaces(htmlContent)
  
  // 如果有头像，则在渲染的HTML中添加照片元素
  if (props.avatar) {
    // 在HTML内容的最前面添加照片元素
    htmlContent = `<img class="resume-photo" src="${props.avatar}" alt="头像" />${htmlContent}`
  }
  
  // 简单的分页逻辑 - 将内容分割成页面
  return splitContentToPages(htmlContent)
})

// 分页函数（简化版本）
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
  tempContainer.className = `template-${props.selectedTemplate}`;

  // 应用当前模板变量
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
  testContainer.className = `template-${props.selectedTemplate}`;

  // 应用当前模板变量
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
      // 如果当前页只有一个元素但超长，需要特殊处理
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
  testContainer.className = `template-${props.selectedTemplate}`;
  
  // 应用当前模板变量
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

// 监听主题变化，更新预览页面的样式
watch(
  [() => props.selectedTemplate, () => props.selectedThemeColor, () => props.fontSize, () => props.fontFamily, () => props.lineHeight],
  async () => {
    await nextTick();
    
    if (!previewPageRefs.value || previewPageRefs.value.length === 0) return;
    
    previewPageRefs.value.forEach(previewPage => {
      // 清除所有模板类
      previewPage.className = previewPage.className.replace(/template-\w+/g, '');
      previewPage.classList.add(`template-${props.selectedTemplate}`);
      
      // 应用样式
      Object.entries(getCurrentTemplateVariables()).forEach(([key, value]) => {
        previewPage.style.setProperty(`--${key}`, value);
      });
    });
  },
  { deep: true }
);

// 导出PDF功能
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
</script>

<style scoped>
.preview-container {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #eee;
  width: 100%;
}

.preview-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 8px;
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
</style>