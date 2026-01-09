<template>
  <el-dialog
    v-model="dialogVisible"
    title="导入JD"
    width="600px"
    :before-close="handleClose"
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
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage, ElDialog } from 'element-plus';

interface Props {
  modelValue: boolean;
  jdContent?: string;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm', content: string): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  jdContent: ''
});

const emit = defineEmits<Emits>();

const dialogVisible = ref(false);
const jdContent = ref('');

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue;
  if (newValue) {
    jdContent.value = props.jdContent;
  }
});

watch(dialogVisible, (newValue) => {
  if (!newValue) {
    emit('update:modelValue', false);
  }
});

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
  emit('confirm', jdContent.value);
  emit('update:modelValue', false);
};
</script>

<style scoped>
.jd-input {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>