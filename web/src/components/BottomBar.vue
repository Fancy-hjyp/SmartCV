<template>
    <div class="bottom-bar">
        <div class="bottom-content">
            <div class="copyright">© 2025 版权所有</div>
            <div class="links">
                <a href="#" class="link-item">帮助中心</a>
                <a href="#" class="link-item">意见反馈</a>
                <a href="#" class="link-item">隐私政策</a>
            </div>
        </div>
    </div>
</template>

<script setup>
// 底部栏组件
</script>

<style scoped>
.bottom-bar {
    background-color: #ffffff;
    border-top: 1px solid #e0e0e0;
    padding: 10px 0;
    width: 100%;
}

.bottom-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    gap: 12px;
}

.copyright {
    color: #606266;
    font-size: 14px;
    text-align: center;
}

.links {
    display: flex;
    gap: 24px;
}

.link-item {
    color: #409eff;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s ease;
}

.link-item:hover {
    color: #66b1ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .bottom-bar {
        padding: 16px 0;
    }

    .links {
        gap: 16px;
    }

    .copyright,
    .link-item {
        font-size: 12px;
    }
}
</style>
