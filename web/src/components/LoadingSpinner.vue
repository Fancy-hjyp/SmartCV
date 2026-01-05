<template>
    <div v-if="loading" class="loading-container" :class="{ 'full-screen': fullScreen }">
        <div class="spinner">
            <div class="spinner-dot" />
            <div class="spinner-dot" />
            <div class="spinner-dot" />
        </div>
        <p v-if="text" class="loading-text">
            {{ text }}
        </p>
    </div>
</template>

<script setup>
// 加载组件
defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    text: {
        type: String,
        default: '加载中...',
    },
    fullScreen: {
        type: Boolean,
        default: false,
    },
})
</script>

<style scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.loading-container.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 9999;
}

.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
}

.spinner-dot {
    width: 8px;
    height: 8px;
    margin: 0 4px;
    background-color: #409eff;
    border-radius: 50%;
    animation: dot-bounce 1.4s infinite ease-in-out both;
}

.spinner-dot:nth-child(1) {
    animation-delay: -0.32s;
}

.spinner-dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes dot-bounce {
    0%,
    80%,
    100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}

.loading-text {
    margin-top: 16px;
    color: #606266;
    font-size: 14px;
}
</style>
