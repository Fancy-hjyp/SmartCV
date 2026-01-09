<template>
  <el-dialog
    v-model="dialogVisible"
    title="上传照片"
    width="400px"
    :before-close="handleClose"
  >
    <div class="upload-section">
      <el-upload
        class="avatar-uploader"
        :http-request="customUpload"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="currentAvatar" :src="currentAvatar" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
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
import { ElMessage, ElDialog, UploadRequestOptions } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

interface Props {
  modelValue: boolean;
  avatar?: string;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm', avatar: string): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  avatar: ''
});

const emit = defineEmits<Emits>();

const dialogVisible = ref(false);
const currentAvatar = ref('');

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue;
});

watch(dialogVisible, (newValue) => {
  if (!newValue) {
    emit('update:modelValue', false);
  }
});

// 监听avatar变化
watch(() => props.avatar, (newAvatar) => {
  currentAvatar.value = newAvatar;
}, { immediate: true });

// 自定义上传方法，仅生成本地URL
const customUpload = (options: UploadRequestOptions) => {
  const file = options.file as File;
  if (file) {
    currentAvatar.value = URL.createObjectURL(file);
    ElMessage.success('头像上传成功');
  }
};

// 上传前验证
const beforeAvatarUpload = (rawFile: File) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!');
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB!');
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
  emit('confirm', currentAvatar.value);
  emit('update:modelValue', false);
};
</script>

<style scoped>
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>