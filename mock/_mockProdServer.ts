import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// 获取mock目录下所有mock服务
const modules = import.meta.globEager("./**/*.ts")
const mockModules = Object.keys(modules).reduce((values, key) => {
    if (!key.includes('/_')) {
        values.push(...modules[key].default)
    }
    return values
}, [] as any[])

/**
 * 产品模式，mock输出
 */
export function setupProdMockServer() {
    createProdMockServer(mockModules)
}