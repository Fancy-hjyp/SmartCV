<template>
    <div class="app-wrapper">
        <!-- Header -->
        <header class="app-header">
            <div class="nav-container">
                <h1 class="app-title">
                    <router-link to="/" class="title-link">Template-VUE</router-link>
                </h1>
                <nav class="main-nav">
                    <ul class="nav-list">
                        <li class="nav-item" :class="{ active: route.path === '/' }">
                            <router-link to="/">首页</router-link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>

        <!-- RouterView -->
        <RouterView />

        <!-- BottomBar -->
        <BottomBar />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import BottomBar from './components/BottomBar.vue'

const route = useRoute()
</script>

<style scoped>
/* 根容器样式 - 确保占满整个屏幕 */
.app-wrapper {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* 路由视图的样式 */
:deep(.router-view) {
    flex: 1;
}

/* 头部样式 */
.app-header {
    background: #ffffff;
    border-bottom: 1px solid #d0e3ff;
    padding: 16px 0px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-container {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.app-title {
    font-size: 24px;
    font-weight: 600;
    color: #1e40af;
    margin: 0;
    letter-spacing: 0.5px;
    font-family: 'Arial', 'Helvetica', sans-serif;
}

/* 导航栏样式 */
.main-nav {
    display: flex;
    align-items: center;
}

.nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 24px;
}

.title-link {
    color: inherit;
    text-decoration: none;
    display: block;
}

.nav-item a {
    color: inherit;
    text-decoration: none;
    display: block;
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.nav-item a:hover {
    color: #1e40af;
    background-color: rgba(255, 255, 255, 0.1);
    font-weight: 600;
}

.nav-item.active a {
    color: #1e40af;
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
    position: relative;
}

.nav-item.active a::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 12px;
    right: 12px;
    height: 2px;
    background-color: #1e40af;
    border-radius: 1px;
}
</style>

<style>
/* 全局样式调整 */
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', 'Helvetica', sans-serif;
    background-color: #ffffff;
    color: #333333;
    overflow-x: hidden;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f0f0f0;
}

::-webkit-scrollbar-thumb {
    background: #cccccc;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #999999;
}
</style>
