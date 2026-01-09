<template>
  <el-dialog
    v-model="dialogVisible"
    title="上传简历"
    width="500px"
    :before-close="handleClose"
  >
    <div class="upload-section">
      <el-upload
        drag
        :http-request="customUpload"
        :show-file-list="false"
        :before-upload="beforeResumeUpload"
        :limit="1"
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleConfirm" 
          :disabled="!resumeTextContent"
          :loading="isReadingPdf"
        >
          {{ isReadingPdf ? '正在读取...' : '确认' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage, ElDialog, ElUpload, ElButton } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages"

import { formatResumeContentPrompt } from '@/prompts/resumeImport';
import { requestAICompletion } from '@/utils/aiRequest';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm', content: string): void;
  (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const dialogVisible = ref(false);
const resumeTextContent = ref('');
const isReadingPdf = ref(false);

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue;
});

watch(dialogVisible, (newValue) => {
  if (!newValue) {
    emit('update:modelValue', false);
  }
});

// 自定义上传方法，读取PDF文本内容
const customUpload = async (options: any) => {
  const file = options.file as File;
  
  if (!file) return;

  // 验证文件类型
  if (!beforeResumeUpload(file)) {
    return;
  }

  // 如果是PDF文件，读取文本内容
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    await readPdfContent(file);
  } else {
    // 如果是文本文件，直接读取
    await readTextFile(file);
  }
};

// 读取PDF文件内容
const readPdfContent = async (file: File) => {
  isReadingPdf.value = true;
  
  try {
    // 动态导入pdfjs-dist，避免增加初始包体积
    const pdfjsLib = await import('pdfjs-dist');
    
    // 设置worker - 使用正确的workerSrc配置方式
    const workerUrl = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    
    const typedArray = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      text += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    
    resumeTextContent.value = await formatResumeContent(text);
    ElMessage.success('PDF简历上传并解析成功');
    
    // 上传成功后自动关闭弹窗
    emit('confirm', resumeTextContent.value);
    emit('update:modelValue', false);
    resumeTextContent.value = '';
  } catch (error) {
    console.error('PDF解析失败:', error);
    ElMessage.error('PDF解析失败，请尝试其他文件');
    resumeTextContent.value = '';
  } finally {
    isReadingPdf.value = false;
  }
};

// 使用大模型格式化简历文本内容
const formatResumeContent = async (content: string) => {
  const prompt = formatResumeContentPrompt({ resumeContent: content });
  const messages: BaseMessage[] = [
    new SystemMessage(prompt)
  ];

  try {
    const aiResponse = await requestAICompletion({ messages });
    return aiResponse;
  } catch (error) {
    console.error('简历内容格式化失败:', error);
    ElMessage.error('简历内容格式化失败，请手动排版');
    return content;
  }
};

// 读取文本文件内容
const readTextFile = async (file: File) => {
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      resumeTextContent.value = e.target?.result as string;
      ElMessage.success('简历上传成功');
    };
    reader.onerror = () => {
      console.error('文件读取失败');
      ElMessage.error('文件读取失败');
      resumeTextContent.value = '';
    };
    reader.readAsText(file);
  } catch (error) {
    console.error('文件读取失败:', error);
    ElMessage.error('文件读取失败');
    resumeTextContent.value = '';
  }
};

// 上传前验证
const beforeResumeUpload = (rawFile: File) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  // 检查文件类型
  const isValidType = allowedTypes.includes(rawFile.type) || 
                     rawFile.name.endsWith('.pdf') ||
                     rawFile.name.endsWith('.doc') ||
                     rawFile.name.endsWith('.docx') ||
                     rawFile.name.endsWith('.txt');
                     
  if (!isValidType) {
    ElMessage.error('简历只能上传PDF, DOC, DOCX, TXT格式!');
    return false;
  }
  
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('简历文件大小不能超过 10MB!');
    return false;
  }
  
  return true;
};

// 关闭对话框
const handleClose = () => {
  emit('cancel');
  emit('update:modelValue', false);
  resumeTextContent.value = '';
  isReadingPdf.value = false;
};

// 取消操作
const handleCancel = () => {
  handleClose();
};

// 确认操作
const handleConfirm = () => {
  if (!resumeTextContent.value) {
    ElMessage.warning('请先上传简历文件');
    return;
  }
  
  emit('confirm', resumeTextContent.value);
  emit('update:modelValue', false);
  resumeTextContent.value = '';
};

defineExpose({
  resumeTextContent
});
</script>

<style scoped>
.upload-section {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>