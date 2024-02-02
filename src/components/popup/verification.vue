<template>
  <!-- 底部弹出 -->
  <van-popup position="bottom" round teleport="body" @open="handleOpen">
    <div class="popup-content">
      <div class="popup-title">
        <div>{{ title }}</div>
      </div>
      <template v-if="type === 0">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="checkbox-item flex-v-center"
          :class="{
            active: current === index
          }"
          @click="current = index"
        >
          <SvgIcon
            :name="
              current === index ? 'checkbox-checked-fill' : 'checkbox-unchecked'
            "
          />
          <span>{{ item.label }}</span>
        </div>
      </template>
      <template v-else>
        <div class="flex-center-space-between get-code">
          <div></div>
          <div class="get-code-btn flex-center" @click="handleGetCode">
            {{ countDown > 0 ? countDown : 'Get code' }}
          </div>
        </div>
        <van-field
          v-model="code"
          class="popup-field"
          placeholder="Fill in the verification code received"
        />
      </template>
      <div class="hy-bar"></div>
      <div v-if="type === 0" class="hy-btn flex-center" @click="handleNext">
        Next
      </div>
      <div
        v-else
        class="hy-btn flex-center"
        :class="{ disabled: !code }"
        @click="handleConfirm"
      >
        Confirm
      </div>
    </div>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, type Ref, defineEmits, computed } from 'vue'
import { showToast } from 'vant'
import SvgIcon from '../svg-icon.vue'
import useCountDown from '@/hooks/useCountDown'
import { session } from '@/utils/storage'
import { queryCode, verifyCode } from '@/api/index'
import Loading from '@/components/loading/index'

const { countDown, countDownStart, resetCountDown } = useCountDown()
const type = ref(0)
const keys = ['ViaMail', 'ViaSMS']
const emit = defineEmits(['success'])
const list: Ref<any> = computed(() => {
  // const temp = []
  // if (userInfo.value.welthNum) {
  //   temp.push({
  //     label: `Via Mail: ` + userInfo.value.welthNum,
  //     value: 0
  //   })
  // }
  // if (userInfo.value.charmNum) {
  //   temp.push({
  //     label: `Via SMS: ` + userInfo.value.charmNum,
  //     value: 1
  //   })
  // }
  return []
})
const current = ref(0)
const code = ref('')
const title = computed(() => {
  return type.value === 0 ? 'Select verification' : 'Security verification'
})
function handleOpen() {
  type.value = 1
}
async function handleGetCode() {
  if (countDown.value > 0) return
  Loading.show()
  const [res] = await queryCode({
    vcType: 1
  })
  Loading.hide()
  if (res && !res.retCode) {
    session.setItem(keys[current.value], Date.now())
    countDownStart()
  } else {
    showToast(res?.retTxt || 'Network Error')
  }
}
function handleNext() {
  type.value = 1
  const timestamp = session.getItem(keys[current.value])
  let count = 60
  if (typeof timestamp === 'number') {
    count = Number(((Date.now() - timestamp) / 1000).toFixed())
  }
  resetCountDown(count)
}
async function handleConfirm() {
  if (!code.value) return
  Loading.show()
  const [res] = await verifyCode({
    vcType: 1,
    vcCode: code.value
  })
  Loading.hide()
  if (res && !res.retCode) {
    emit('success')
  } else {
    showToast(res?.retTxt || 'Network Error')
  }
}
</script>
<style lang="less" scoped>
.popup-content {
  padding: 54px 32px 100px;
}
.popup-title {
  font-size: 32px;
  font-weight: 600;
}
.checkbox-item {
  margin-top: 30px;
  font-size: 28px;
  &.active {
    svg {
      color: #8b72f7;
    }
  }
  svg {
    margin-right: 10px;
  }
}
.get-code {
  margin-top: 30px;
  font-size: 28px;
  &-btn {
    width: 150px;
    height: 40px;
    border-radius: 20px;
    background-color: #8b72f7;
    font-size: 24px;
    color: #fff;
  }
}
.popup-field {
  margin: 30px 0;
  padding: 10px 24px;
  background: rgba(172, 172, 172, 0.2);
  border-radius: 16px;
}
.hy-bar {
  margin: 50px 0 32px;
  height: 1px;
  background-color: #eee;
}
.hy-btn {
  height: 80px;
  background-color: #8b72f7;
  border-radius: 16px;
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  &.disabled {
    opacity: 0.4;
  }
}
</style>
