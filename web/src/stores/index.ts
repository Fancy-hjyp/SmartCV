import { createPinia } from 'pinia'
import { useMainStore } from './main'

// 创建 Pinia 实例
const pinia = createPinia()

// 导出创建 Pinia 实例的方法
export { pinia, useMainStore }

// 导出所有 store hooks
export * from './main'
