<template>
  <van-nav-bar
    :title="title"
    :left-arrow="!isCoseBack"
    :border="false"
    @click-left="onClickLeft"
  >
    <template v-if="$slots.title" #title>
      <slot name="title"></slot>
    </template>
    <template v-if="$slots.right" #right>
      <slot name="right"></slot>
    </template>
  </van-nav-bar>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { isDef } from '@/utils/util'
const props = defineProps<{
  title?: string
  closeBack?: boolean
}>()
const router = useRouter()
const isCoseBack = computed(() => {
  if (props.closeBack) return true
  const { state } = window.history
  return !(state && isDef(state.back))
})
function onClickLeft() {
  router.back()
}
</script>
<style lang="less" scoped>
.van-nav-bar {
  --van-nav-bar-background: transparent;
  --van-nav-bar-icon-color: #333;
}
</style>
