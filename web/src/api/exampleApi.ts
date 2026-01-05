import apiClient from './apiClient'

export interface ExampleData {
    id: number
    title: string
    description: string
}

export interface ApiResponse<T> {
    data: T
    message?: string
    status?: number
}

export const getExampleData = async (): Promise<ExampleData[]> => {
    const response = await apiClient.get('/examples')
    return response.data
}

export const getExampleById = async (id: number): Promise<ExampleData> => {
    const response = await apiClient.get(`/examples/${id}`)
    return response.data
}

export const createExample = async (data: Omit<ExampleData, 'id'>): Promise<ExampleData> => {
    const response = await apiClient.post('/examples', data)
    return response.data
}

// 添加 getContent 方法
export const getContent = async (randomNumber: number): Promise<ApiResponse<string>> => {
    // 模拟 API 响应格式
    const response = {
        data: `这是来自 API 的内容，随机数: ${randomNumber}`,
        message: 'success',
        status: 200,
    }
    return response
}

// 导出 API 对象，以便在组件中使用
export const exampleApi = {
    getContent,
}
