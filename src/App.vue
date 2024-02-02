<template>
  <HomePage></HomePage>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import useBaseStore from '@/store/index'
import { useWindowSize } from '@vant/use'
import { getQueryString } from '@/utils/util'
import { session } from '@/utils/storage'
import HomePage from './views/Home.vue'
// 获取window的大小
const rect = useWindowSize()
// 根据屏幕宽度设置rem数值
function setRemUnit() {
  const width = rect.width.value > 750 ? 750 : rect.width.value
  const rem = width / 10
  document.documentElement.style.fontSize = rem + 'px'
}
setRemUnit()
watch([rect.width], () => {
  setRemUnit()
})
const baseStore = useBaseStore()
let token = getQueryString('k')
let userId = getQueryString('userId')
if (token && token.endsWith('/')) {
  token = token.replace('/', '')
}
if (userId && userId.endsWith('/')) {
  userId = userId.replace('/', '')
}
if (token) {
  session.setItem('token', token)
  baseStore.token = token
}
if (userId) {
  session.setItem('userId', Number(userId))
  baseStore.userId = Number(userId)
}
</script>
<style>
#app {
  max-width: 750px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  font-size: 0.24rem;
  overflow-y: auto;
}
</style>
