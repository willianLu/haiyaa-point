<template>
  <!-- 底部弹出 -->
  <van-popup
    position="bottom"
    round
    teleport="body"
    @click-overlay="handleClose"
  >
    <div class="popup-content">
      <SvgIcon
        v-if="info.status === 100"
        class="hy-svg-icon success"
        name="checkbox-checked-fill"
      />
      <img
        v-else-if="info.status === 4 || info.status === 5"
        class="hy-icon"
        src="@/assets/images/failure.png"
      />
      <img
        v-else-if="info.status === 3"
        class="hy-icon cancel"
        src="@/assets/images/failure.png"
      />
      <img v-else class="hy-icon" src="@/assets/images/reviewing.png" />
      <div class="success-title">{{ title }}</div>
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
          <div>{{ info.price }} USDT</div>
        </div>
        <div class="flex-space-between hy-item">
          <div>Withdrawal Fee (8%)</div>
          <div>{{ info.fee }} USDT</div>
        </div>
      </div>
      <div class="hy-bar"></div>
      <div
        v-if="info.status === 1 || info.status === 2"
        class="hy-btn flex-center cancel-btn"
        @click="handleCancel"
      >
        Cancel withdrawal
      </div>
      <div v-else class="hy-btn flex-center" @click="handleClose">OK</div>
    </div>
  </van-popup>
</template>
<script setup lang="ts">
import { defineEmits, defineProps, computed } from 'vue'
import SvgIcon from '../svg-icon.vue'
import { cancelOrder } from '@/api/index'
import Loading from '../loading'
import { showToast } from 'vant'

const emit = defineEmits(['update:show', 'cancel'])
const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})
const title = computed(() => {
  switch (props.info.status) {
    case 3:
      return 'Withdrawal canceled'
    case 4:
    case 5:
      return 'Withdrawal failed'
    case 100:
      return 'Withdrawal successfully'
    default:
      // 1 | 2
      return 'Withdrawal is under review'
  }
})
function handleClose() {
  emit('update:show', false)
}
async function handleCancel() {
  Loading.show()
  const [res] = await cancelOrder({
    orderId: props.info.orderId,
    reason: ''
  })
  Loading.hide()
  if (res && !res.retCode) {
    emit('cancel')
    handleClose()
  } else {
    showToast(res?.retTxt || 'Network Error')
  }
}
</script>
<style lang="less" scoped>
.popup-content {
  padding: 32px 32px 60px;
}
.hy-bar {
  height: 1px;
  background-color: #eee;
}
.hy-info {
  margin: 68px 0 90px;
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
  &.cancel-btn {
    background-color: #f43967;
  }
}
.hy-svg-icon {
  margin: 30px auto;
  display: block;
  font-size: 200px;
  &.success {
    color: #42d09b;
  }
}
.hy-icon {
  margin: 30px auto;
  display: block;
  width: 200px;
  &.cancel {
    filter: grayscale(1);
  }
}
.success-title {
  text-align: center;
  font-size: 32px;
}
</style>
