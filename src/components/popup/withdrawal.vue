<template>
  <!-- 底部弹出 -->
  <van-popup
    position="bottom"
    round
    teleport="body"
    @open="handleOpen"
    @click-overlay="handleClose"
  >
    <div class="popup-content">
      <template v-if="type === 0">
        <div class="hy-sub-title">You will receive</div>
        <div class="hy-title">{{ receiveAmount }} USDT</div>
        <div class="hy-bar"></div>
        <div class="hy-info">
          <div class="flex-space-between hy-item">
            <div>Address</div>
            <div>TRgsdbjuKbS8xuXyDz LVv57GBZiu1UsieU</div>
          </div>
          <div class="flex-space-between hy-item">
            <div>Network</div>
            <div>Tron (TRC20)</div>
          </div>
          <div class="flex-space-between hy-item">
            <div>Withdrawal Amount</div>
            <div>{{ amount }} USDT</div>
          </div>
          <div class="flex-space-between hy-item">
            <div>Withdrawal Fee (8%)</div>
            <div>{{ fee }} USDT</div>
          </div>
        </div>
        <div class="hy-bar"></div>
        <div class="hy-btn flex-center" @click="handleNext">Next</div>
      </template>
      <template v-else>
        <SvgIcon class="right-icon" name="checkbox-checked-fill" />
        <div class="success-title">
          Withdrawal application has been submitted
        </div>
        <div class="success-sub-title">
          We will review and issue payment as soon as possible
        </div>
        <div class="hy-bar"></div>
        <div class="hy-btn flex-center" @click="handleClose">OK</div>
      </template>
    </div>
    <Verification
      v-model:show="isShowVerify"
      @success="handleVerifySuccess"
    ></Verification>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, type Ref, defineProps, defineEmits } from 'vue'
import SvgIcon from '../svg-icon.vue'
import Loading from '../loading'
import { applyWithdrawal } from '@/api'
import { multiply } from 'mathjs'
import useBaseStore from '@/store/index'
import Verification from './verification.vue'
import { showToast } from 'vant'

const props = defineProps({
  amount: {
    type: [String, Number],
    default: 0
  }
})
const emit = defineEmits(['update:show'])
const baseStore = useBaseStore()
const type = ref(0)
const receiveAmount: Ref<string | number> = ref('')
const fee: Ref<string | number> = ref('')
const isShowVerify = ref(false)
function handleOpen() {
  type.value = 0
  fee.value = multiply(Number(props.amount), 0.08)
  receiveAmount.value = multiply(Number(props.amount), 0.92)
}
async function handleNext() {
  isShowVerify.value = true
}
async function handleVerifySuccess() {
  isShowVerify.value = false
  Loading.show()
  const [res] = await applyWithdrawal({
    bcoin: Number(props.amount)
  })
  Loading.hide()
  if (res && !res.retCode) {
    type.value = 1
    baseStore.getUserInfo()
  } else {
    showToast(res?.retTxt || 'Network Error')
  }
}
function handleClose() {
  emit('update:show', false)
}
</script>
<style lang="less" scoped>
.popup-content {
  padding: 32px 32px 60px;
}
.hy-sub-title {
  margin: 20px 0;
  font-size: 32px;
  text-align: center;
}
.hy-title {
  margin-bottom: 32px;
  text-align: center;
  font-family: 'LemonMilkbold';
  font-size: 48px;
  font-weight: 700;
  color: #8b72f7;
}
.hy-bar {
  height: 1px;
  background-color: #eee;
}
.hy-info {
  margin: 30px 0 90px;
}
.hy-item {
  line-height: 40px;
  font-size: 28px;
  color: #7d7b7c;
  & + & {
    margin-top: 20px;
  }
  div {
    flex: 1;
  }
  div:last-child {
    text-align: right;
    color: #000;
  }
}
.hy-btn {
  margin-top: 30px;
  height: 80px;
  background-color: #8b72f7;
  border-radius: 16px;
  font-size: 32px;
  font-weight: 600;
  color: #fff;
}
.right-icon {
  margin: 30px auto;
  display: block;
  font-size: 200px;
  color: #42d09b;
}
.success-title {
  text-align: center;
  font-size: 32px;
}
.success-sub-title {
  margin: 28px 0 200px;
  text-align: center;
  font-size: 24px;
  color: #7d7b7c;
}
</style>
