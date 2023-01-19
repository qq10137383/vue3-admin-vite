import { ApiResult } from '@/api/types'

/**
 * 返回成功
 * @param data 
 * @param message 
 * @returns 
 */
export function resultSuccess<T = any>(data: T, message = ''): ApiResult<T> {
    return {
        code: 20000,
        message,
        data
    }
}

/**
 * 返回失败
 * @param code 
 * @param message 
 * @param data 
 * @returns 
 */
export function resultError(code = -1, message = 'Request failed', data = null): ApiResult<any> {
    return {
        code,
        message,
        data
    }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function deepClone(source: any): any {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments deepClone')
    }
    const targetObj: any = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}
