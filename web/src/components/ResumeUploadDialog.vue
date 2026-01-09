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
        action="/api/upload"
        :on-success="handleResumeUpload"
        :before-upload="beforeResumeUpload"
        :limit="1"
        :auto-upload="true"
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
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage, ElDialog, ElUpload } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const dialogVisible = ref(false);

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue;
});

watch(dialogVisible, (newValue) => {
  if (!newValue) {
    emit('update:modelValue', false);
  }
});

// 上传成功回调
const handleResumeUpload = (response: any, file: any) => {
  ElMessage.success('简历上传成功');
};

// 上传前验证
const beforeResumeUpload = (rawFile: File) => {
  const allowedTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('简历只能上传PDF, DOC, DOCX格式!');
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
};

// 取消操作
const handleCancel = () => {
  handleClose();
};

// 确认操作
const handleConfirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};
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