import { defineStore } from 'pinia'
import { session } from '@/utils/storage'
import { queryUserInfo } from '@/api'

/**
 * @description 用户相关的全局数据状态管理，包括：用户信息，登录信息等
 */
export default defineStore('base', {
  state: (): {
    token: string
    userId: string | number
    userInfo: Record<string, any>
  } => {
    return {
      token: session.getItem('token') || '',
      userId: session.getItem('userId') || '',
      userInfo: session.getItem('userInfo') || {}
    }
  },
  actions: {
    async getUserInfo() {
      const [res] = await queryUserInfo({ userId: this.userId })
      if (res && !res.retCode) {
        this.userInfo = res
        session.setItem('userInfo', res)
      }
      return res
    },
    updateUserInfo(userInfo: Record<string, any>) {
      this.userInfo = userInfo
      session.setItem('userInfo', userInfo)
    }
  }
})
