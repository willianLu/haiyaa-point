import { RouteLocationNormalized } from 'vue-router'
import usePageAliveStore from '@/store/page-alive'
import { PageAliveRoute } from '@/types'
let pageId = 0
// 处理页面缓存
export function handlePageAlive(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) {
  // 每次路由变化就增加
  pageId++
  const pageAliveStore = usePageAliveStore()
  const { action, names } = pageAliveStore
  let { current, routes = [] } = pageAliveStore.getPageAlive()
  // 相同路由之间跳转，且存在from.href（即来自真实的路由跳转），且不是通过router.go的形式跳转的
  if (
    to.fullPath === from.fullPath &&
    (from as any).href &&
    (!action || action.type !== 'go')
  ) {
    return
  }
  // 前一次访问的路由信息
  const preCurrent = current
  // 查找缓存中是否包含当前路由的name
  const index = to.name ? names.findIndex(item => item === to.name) : -1
  // 设置当前的路由信息
  current = {
    fullPath: to.fullPath,
    name: to.name as string,
    position: history.state.position,
    pageId
  }
  if (action) {
    // vue-route 路由方法跳转
    switch (action.type) {
      case 'push':
      case 'replace':
      case 'forward':
        if (action.type === 'push' || action.type === 'replace') {
          routes = routes.slice(0, current.position)
          routes.push(current)
        }
        // 若是替换的页面已缓存，则移除缓存
        if (action.type === 'replace') {
          removeHadName(from.name as string, names)
        }
        // 当前路由堆栈前若无相同的路由则不缓存
        if (to.name && index === -1 && !isHasSameByBefore(current, routes)) {
          names.push(to.name as string)
        } else if (index > -1) {
          names.splice(index, 1)
        }
        break
      case 'back':
        removeHadName(from.name as string, names)
        if (to.name && index === -1 && !isHasSameByBefore(current, routes)) {
          names.push(to.name as string)
        }
        break
      case 'go':
        // 向前走向
        if (action.delta && action.delta > 0 && index > -1) {
          names.splice(index, 1)
        } else if (action.delta && action.delta < 0) {
          // 向后走向
          for (
            let i = current.position + 1;
            i <= current.position - action.delta;
            i++
          ) {
            routes[i] && removeHadName((<PageAliveRoute>routes[i]).name, names)
          }
        }
        // 必须放在上述处理后面，防止回退多个路由且中间包含当前路由，造成缓存路由被删除
        if (to.name && index === -1 && !isHasSameByBefore(current, routes)) {
          names.push(to.name as string)
        }
        break
    }
  } else if ((from as any).href) {
    // 条件：浏览器前进后退按钮操作，或直接复制链接访问
    let isBack = preCurrent && current.position < preCurrent.position
    if (preCurrent && preCurrent.position === current.position) {
      if (preCurrent.fullPath === current.fullPath) {
        // 此为当前页面刷新
      } else {
        // 拷贝其他路由链接放到浏览器中访问，虽会改变history堆栈变化，但是history.state却是错误的，需要同步纠正
        current.position = history.state.position = history.length - 1
        history.state.back = preCurrent.fullPath
        history.state.forward = null
        isBack = false
        routes = routes.slice(0, current.position)
        routes.push(current)
      }
    }
    if (isBack) {
      removeHadName(from.name as string, names)
    } else if (index > -1) {
      names.splice(index, 1)
    }
    if (to.name && index === -1 && !isHasSameByBefore(current, routes)) {
      names.push(to.name as string)
    }
  } else {
    if (!preCurrent) {
      // 没有缓存路由，说明第一次访问站点
      for (let i = 0; i < history.length - 1; i++) {
        routes.push(undefined)
      }
      routes.push(current)
    } else if (
      preCurrent.fullPath === current.fullPath &&
      preCurrent.position === current.position
    ) {
      // 条件：上一次访问路由与当前路由一致
      // 场景：1.页面刷新 2.由其他站点前进到当前页面 3.由其他站点返回到当前页面
      if (history.length !== routes.length) {
        routes = routes.slice(0, preCurrent.position + 1)
        for (let i = preCurrent.position + 1; i < history.length; i++) {
          routes.push(undefined)
        }
      }
    } else if (history.length === current.position + 1) {
      // 条件：进入当前路由，且路由在history路由堆栈的顶部
      let endIndex = current.position
      // 前进方向
      if (preCurrent.position < current.position) {
        endIndex =
          preCurrent.position + 1 < current.position
            ? preCurrent.position + 1
            : preCurrent.position
      }
      routes = routes.slice(0, endIndex)
      for (let i = routes.length; i < current.position; i++) {
        routes.push(undefined)
      }
      routes.push(current)
    }
    if (to.name && index === -1 && !isHasSameByBefore(current, routes)) {
      names.push(to.name as string)
    }
  }
  // 没有路由的情况，属于特殊情况；例：浏览器强制退出，重新打开，存在路由堆栈，但是没有session缓存
  if (!routes[current.position]) {
    routes[current.position] = current
  }
  to.meta.pageId = (routes[current.position] as PageAliveRoute).pageId
  pageAliveStore.setPageAlive(current, names, routes)
}
// 当前路由前面的路由堆栈是否存在相同的路由
function isHasSameByBefore(
  current: PageAliveRoute,
  routes: Array<PageAliveRoute | undefined>
) {
  for (let i = current.position - 1; i >= 0; i--) {
    const route = routes[i]
    // 若route不存在，代表当前路由堆栈由其他站点跳转过来，前面的路由无需对比
    if (!route) {
      return false
    } else if (current.name === route.name) {
      return true
    }
  }
  return false
}
// 若name已存在，则移除
function removeHadName(name: string, names: string[]) {
  if (!name) return
  const index = names.findIndex(item => item === name)
  if (index > -1) {
    names.splice(index, 1)
  }
}
