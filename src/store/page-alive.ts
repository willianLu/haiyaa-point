import { defineStore } from 'pinia'
import { PageAliveAction, PageAliveRoute } from '@/types'
import { session } from '@/utils/storage'

interface PageAliveObject {
  current?: PageAliveRoute
  routes?: Array<PageAliveRoute | undefined>
}
/**
 * @description keep-alive缓存数据存储
 * 缓存条件：路由设置name，且name需与路由制定组件name保持一致，不设置name则表示无需缓存
 * 缓存效果：前进刷新，后退缓存
 * 特殊情况：
 * 1. 重复路由，刷新处理
 * 2. 以id等区分的路由页面（如：详情页），需使用路由守卫 beforeRouteUpdate 做重复路由的内容刷新
 * 3. 前进方向路由已被缓存时（push,replace,forward,go等），需要先移除缓存，使页面刷新，进入页面之后利用全局mixin将本次页面加入缓存之中
 */
export default defineStore('pageAlive', {
  state: (): {
    // 标记当前路由信息，用于浏览器前进后退判断参考物
    current?: PageAliveRoute
    // 所有路由的name集合，
    routes: Array<PageAliveRoute | undefined>
    // keep-alive缓存页面组件names
    names: string[]
    // 标记路由变化的动作
    action?: PageAliveAction
  } => {
    return {
      routes: [],
      names: []
    }
  },
  actions: {
    getPageAlive(): PageAliveObject {
      if (this.current) {
        return {
          current: this.current,
          routes: this.routes
        }
      }
      const data = session.getItem('page-alive')
      return data || {}
    },
    setPageAlive(
      current: PageAliveRoute,
      names: string[],
      routes: Array<PageAliveRoute | undefined>
    ) {
      this.current = current
      this.routes = routes
      session.setItem('page-alive', {
        current,
        routes
      })
      this.names = names
      console.log({ ...current }, '===========当前路由名称')
      console.log(JSON.parse(JSON.stringify(routes)), '===========所有路由名称')
      console.log([...names], '===========缓存的名称')
      this.setAction()
    },
    setAction(action?: PageAliveAction) {
      this.action = action
    }
  }
})
