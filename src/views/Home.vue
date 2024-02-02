<template>
  <PageContainer class="main-page">
    <div class="main-wrap">
      <div class="haiyaa-point-count">20000</div>
      <div class="haiyaa-point-tip">Haiyaa point</div>
      <div class="task-wrap">
        <ul class="task-tab flex-v-center">
          <li
            v-for="(item, index) in list"
            :key="index"
            :class="{ active: item.value === current }"
            @click="handleSubChange(item)"
          >
            {{ item.text }}
          </li>
        </ul>
        <div class="flex-center-space-between task-item">
          <div class="flex-v-center">
            <div class="task-item-count flex-center">+500</div>
            <div>
              <p class="task-item-title">你的嘿嘿投资人</p>
              <p class="task-item-tip">每新增1位投资人获得1分 2/100</p>
            </div>
          </div>
          <div class="task-item-btn flex-center">Go</div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>
<script setup lang="ts">
import { ref, computed, type Ref, onActivated } from 'vue'
import { showDialog, showToast } from 'vant'
import PageContainer from '@/components/page/container.vue'
import useBaseStore from '@/store/index'
import Loading from '@/components/loading/index'

defineOptions({
  name: 'HomePage'
})

const baseStore = useBaseStore()
const list = ref([
  {
    text: 'Normal',
    value: 1
  },
  {
    text: 'Daily',
    value: 2
  }
])
const current = ref(1)

onActivated(() => {
  ;(window as any).HeyheyBridge.setTopBar({
    hideTitle: true
  })
})

async function handleInit() {
  Loading.show()
  const res = await baseStore.getUserInfo()
  if (!res || res.retCode) {
    showToast(res?.retTxt || 'Network Error')
  }
  Loading.hide()
}
handleInit()

function handleSubChange(item: any) {
  current.value = item.value
}
</script>
<style lang="less" scoped>
.main-page {
  background: url(../assets/images/bg.png) no-repeat,
    linear-gradient(#8b72f7, #f5f6fb);
  background-position: right 80px, 0 0;
  background-size: 200px 352px, 100% 100%;
}
.main-wrap {
  padding: 88px 32px 80px;
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
  min-height: 1020px;
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
.task-item {
  padding: 30px;
  border-bottom: 1px solid #acacac33;
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
  &-count {
    flex-shrink: 0;
    margin-right: 12px;
    width: 76px;
    height: 76px;
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
