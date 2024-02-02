<template>
  <div
    class="scroll-ad-container"
    :style="{
      height: singleHeight * (count > list.length ? list.length : count) + 'px'
    }"
  >
    <ul
      ref="box"
      :class="{
        'scroll-ad-transition': !continuous,
        'scroll-ad-box': continuous
      }"
      :style="positionStyle"
      @transitionend="handleTransitionEnd"
    >
      <li v-for="(item, index) in showList" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { watch, nextTick, ref, computed, onUnmounted, onActivated } from 'vue'
import { useWindowSize } from '@vant/use'

const props = withDefaults(
  defineProps<{
    list: string[] // 广告列表数据
    count?: number // 显示广告个数
    continuous?: boolean // 是否是连续的
    speed?: number // 连续动画的滚动速度
  }>(),
  {
    list: () => [],
    count: 1,
    continuous: false,
    speed: 1
  }
)
// 显示广告列表
const showList = ref<string[]>([])
// 当前广告下标
const currentIndex = ref(0)
// 动画盒子ref
const box = ref<HTMLUListElement | null>(null)
// 单个广告高度
const singleHeight = ref(0)
// 执行动画的timeout对象ID
let timer: ReturnType<typeof setTimeout> | null = null
const rect = useWindowSize()
// 首次初始激活页面
let isInitActivated = false
// 监听广告列表数据
watch(
  () => props.list,
  () => {
    if (props.list.length) {
      // 处理广告数据，复制一份，方便动画实现
      showList.value = props.list.concat(
        props.list.slice(0, props.continuous ? props.list.length : props.count)
      )
      nextTick(() => {
        if (box.value) {
          // 获取单个广告高度
          getSingleHeight()
          // 非持续的动画，执行transition动画
          // transition动画为单个广告动画，单个执行完成时，停顿1s再执行第二个广告动画
          currentIndex.value = 0
          if (timer) clearTimeout(timer)
          if (!props.continuous) {
            handleExecTransition()
          }
        }
      })
    } else {
      showList.value = []
    }
  },
  {
    immediate: true
  }
)
// 监听页面大小变化
watch(rect.width, () => {
  getSingleHeight()
})
// 动画盒子style样式
const positionStyle = computed(() => {
  if (props.continuous) {
    return `animation-duration: ${showList.value.length * (1 / props.speed)}s;`
  }
  const position = currentIndex.value * singleHeight.value
  const duration = currentIndex.value > 0 ? 1 : 0
  return `transform: translateY(-${position}px);transition-duration: ${duration}s;`
})
// 获取单个广告高度
function getSingleHeight() {
  if (box.value) {
    singleHeight.value = (box.value.children[0] as HTMLLIElement).offsetHeight
  }
}
// 处理执行transition动画
async function handleExecTransition() {
  if (!showList.value.length) {
    currentIndex.value = 0
    return
  }
  timer = setTimeout(() => {
    timer = null
    currentIndex.value += 1
  }, 1000)
}

// 执行transition动画结束
async function handleTransitionEnd() {
  if (timer) clearTimeout(timer)
  if (currentIndex.value === props.list.length) {
    currentIndex.value = 0
  }
  handleExecTransition()
}
onActivated(() => {
  // 若已经初始化过激活生命周期，则执行动画结束处理
  if (isInitActivated) {
    // 页面失活状态下，无法监听动画结束
    // 页面激活时，处理动画结束
    handleTransitionEnd()
  } else {
    isInitActivated = true
  }
})
onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>
<style lang="less" scoped>
.scroll-ad-container {
  width: 100%;
  line-height: 1.5;
  font-size: 24px;
  color: #666;
  overflow: hidden;
  li {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.scroll-ad-box {
  animation: ad 1s infinite linear 1s;
  transform: translateY(0);
}
@keyframes ad {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}
.scroll-ad-transition {
  transition: transform 1s;
}
</style>
