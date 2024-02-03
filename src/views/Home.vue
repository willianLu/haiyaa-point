<template>
  <div class="main-wrap">
    <div class="haiyaa-point-count">{{ total }}</div>
    <div class="haiyaa-point-tip">Haiyaa point</div>
    <div class="task-wrap">
      <ul class="task-tab flex-v-center">
        <li
          v-for="(item, index) in list"
          :key="index"
          :class="{ active: item === current }"
          @click="handleSubChange(item)"
        >
          {{ item }}
        </li>
      </ul>
      <div class="task-content">
        <div
          v-for="(item, index) in taskMap[current]"
          :key="current + '-' + index"
          class="flex-center-space-between task-item"
        >
          <div class="flex-v-center">
            <div class="task-item-count flex-center">+{{ item.point }}</div>
            <div>
              <p class="task-item-title">{{ item.taskName }}</p>
              <p class="task-item-tip">
                {{ item.curValue }} / {{ item.taskValue }}
              </p>
            </div>
          </div>
          <div
            v-if="item.curValue >= item.taskValue"
            class="task-item-finished flex-center"
          >
            Finished
          </div>
          <!-- <div class="task-item-btn flex-center">Go</div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref, onActivated } from 'vue'
import { showToast } from 'vant'
import Loading from '@/components/loading/index'
import { queryTaskList } from '@/api/index'
import useBaseStore from '@/store/index'

defineOptions({
  name: 'HomePage'
})
const baseStore = useBaseStore()
const total = ref(0)
const list = ref(['Daily', 'Weekly'])
const taskMap: Ref<any> = ref({
  Daily: [],
  Weekly: []
})
const current = ref('Daily')

onActivated(() => {
  ;(window as any).HeyheyBridge.setTopBar({
    layout: 1
  })
})

async function handleInit() {
  Loading.show()
  const [res] = await queryTaskList({
    userId: baseStore.userId
  })
  if (!res || res.retCode) {
    showToast(res?.retTxt || 'Network Error')
  } else {
    taskMap.value.Daily = res.DayTask
    taskMap.value.Weekly = res.WeekTask
    total.value = res.DrawPoint || 0
  }
  Loading.hide()
}
handleInit()

function handleSubChange(item: any) {
  current.value = item
}
</script>
<style lang="less" scoped>
.main-wrap {
  padding: 140px 32px 80px;
  height: 100%;
  box-sizing: border-box;
}
.haiyaa-point-count {
  text-align: center;
  font-size: 80px;
  font-weight: bold;
  font-family: 'LemonMilkbold';
  color: #fff;
}
.haiyaa-point-tip {
  margin-top: 20px;
  text-align: center;
  font-size: 36px;
  color: #fff;
}
.task-wrap {
  margin-top: 80px;
  height: calc(100% - 220px);
  border-radius: 32px;
  background-color: #f9f5ff;
  overflow: hidden;
}
.task-tab {
  padding: 12px 24px 0;
  background-color: #fff;
  li {
    position: relative;
    padding: 40px 16px;
    font-size: 32px;
    font-weight: 600;
    color: #8b72f7;
    opacity: 0.6;
  }
  .active {
    opacity: 1;
    &::before {
      content: '';
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #8b72f7;
    }
  }
}
.task-content {
  height: calc(100% - 124px);
  overflow-y: auto;
}
.task-item {
  padding: 30px;
  border-top: 1px solid #acacac33;
  overflow: hidden;
  &-btn {
    flex-shrink: 0;
    margin-left: 6px;
    width: 96px;
    height: 48px;
    background-color: #e3dbfd;
    border-radius: 16px;
    font-size: 28px;
    font-weight: bold;
    color: #8b72f7;
  }
  &-finished {
    flex-shrink: 0;
    margin-left: 6px;
    padding: 0 8px;
    height: 48px;
    border-radius: 16px;
    border: 1px solid #8b72f7;
    font-size: 24px;
    color: #8b72f7;
    opacity: 0.5;
  }
  &-count {
    flex-shrink: 0;
    word-break: break-all;
    margin-right: 12px;
    padding: 6px;
    width: 70px;
    height: 70px;
    border: 4px solid #8b72f7;
    border-radius: 50%;
    font-size: 24px;
    color: #8b72f7;
  }
  &-title {
    font-size: 28px;
    font-weight: bold;
  }
  &-tip {
    margin-top: 12px;
    font-size: 20px;
    color: #7d7b7c;
  }
}
</style>
