import { RouteLocationRaw } from 'vue-router'
import router from './router'
import usePageAliveStore from '@/store/page-alive'
import { PageAliveAction } from '@/types'

function setPageAction(data: PageAliveAction) {
  const pageAliveStore = usePageAliveStore()
  pageAliveStore.setAction(data)
}
// 重写push方法
const routerPush = router.push
router.push = (to: RouteLocationRaw) => {
  setPageAction({
    type: 'push'
  })
  return routerPush(to)
}

// 重写replace方法
const routerReplace = router.replace
router.replace = (to: RouteLocationRaw) => {
  setPageAction({
    type: 'replace'
  })
  return routerReplace(to)
}

// 重写back方法
const routerBack = router.back
router.back = () => {
  setPageAction({
    type: 'back'
  })
  return routerBack()
}

// 重写forword方法
const routerForword = router.forward
router.forward = () => {
  setPageAction({
    type: 'forward'
  })
  return routerForword()
}

// 重写go方法
const routerGo = router.go
router.go = (delta: number) => {
  setPageAction({
    type: 'go',
    delta
  })
  return routerGo(delta)
}
