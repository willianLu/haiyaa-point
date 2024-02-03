import { defineStore } from 'pinia'
import { session } from '@/utils/storage'

/**
 * @description 用户相关的全局数据状态管理，包括：用户信息，登录信息等
 */
export default defineStore('base', {
  state: (): {
    token: string
    userId: string | number
  } => {
    return {
      token: session.getItem('token') || '',
      userId: session.getItem('userId') || ''
    }
  }
})
