import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {
    // State - 使用 ref 定义响应式状态
    const count = ref(0)

    // Getters - 使用 computed 定义计算属性
    const doubleCount = computed(() => count.value * 2)

    // Actions - 定义方法
    function increment() {
        count.value++
    }

    function decrement() {
        count.value--
    }

    function incrementByAmount(amount: number) {
        count.value += amount
    }

    // 返回所有状态、计算属性和方法
    return {
        count,
        doubleCount,
        increment,
        decrement,
        incrementByAmount,
    }
})
