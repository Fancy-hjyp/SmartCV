<template>
    <div class="app-container">
        <div class="main-content">
            <el-button type="primary" @click="getContent">获取内容</el-button>
            <el-button type="success" @click="updateUser">更新用户状态</el-button>
            <div>{{ content }}</div>
            <div>用户状态: {{ userStatus }}</div>
            <div>加载状态: {{ store.loading ? '加载中...' : '空闲' }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 导入API模块
import { exampleApi } from '../api'
import { useMainStore } from '../stores/main'

const store = useMainStore()
const content = ref('')

const userStatus = computed(() => (store.user ? `已登录: ${store.user.name}` : '未登录'))

const getContent = async () => {
    try {
        store.setLoading(true)
        // Generate random number
        const randomNumber = Math.floor(Math.random() * 100)
        const response = await exampleApi.getContent(randomNumber)
        content.value = response.data
    } catch (error) {
        ElMessage.error('获取内容失败')
    } finally {
        store.setLoading(false)
    }
}

const updateUser = () => {
    if (!store.user) {
        store.setUser({ id: 1, name: '测试用户' })
        ElMessage.success('用户已登录')
    } else {
        store.clearUser()
        ElMessage.info('用户已登出')
    }
}
</script>

<style scoped>
.app-container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 5px 0;
    background: #eef6ff;
}

.main-content {
    width: 90%;
    display: flex;
    flex-direction: column;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 20px;
}
</style>
