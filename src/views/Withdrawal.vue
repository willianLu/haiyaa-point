<template>
  <PageContainer>
    <div class="main-wrap">
      <div class="main-content">
        <div
          v-if="userInfo.tronAddr"
          class="account-info flex-center"
          @click="handleCheckUSDT"
        >
          <img src="@/assets/images/icon-exchange.png" />
          <span>{{ userInfo.tronAddr }}</span>
          <SvgIcon name="arrow-right"></SvgIcon>
        </div>
        <div class="content-title">Black Diamond</div>
        <div class="diamond-count">
          <img src="@/assets/images/black-diamond.png" />
          <p>{{ userInfo.bCoinNum || 0 }}</p>
        </div>
        <div class="convert-info">
          <p>≈</p>
          <img src="@/assets/images/icon-exchange.png" />
          <p>{{ userInfo.bCoinNum || 0 }} USDT</p>
        </div>
        <div class="hai-point">
          <div class="content-title">
            <span>Haiyaa Point</span>
            <SvgIcon name="question-circle" @click="handleCheckTip"></SvgIcon>
          </div>
        </div>
        <div class="diamond-count">
          <img src="@/assets/images/icon-withdraw.png" />
          <p>{{ userInfo.drawPoint || 0 }}</p>
        </div>
      </div>
      <div class="hy-tip">Withdrawal Amount</div>
      <div class="hy-amount flex-center-space-between">
        <img src="@/assets/images/black-diamond.png" />
        <van-field
          v-model="amount"
          type="digit"
          class="hy-amount-field"
          placeholder="Minimum 50"
          clearable
        />
        <div class="hy-amount-btn flex-center" @click="handleFillAll">All</div>
      </div>
      <div class="hy-tip hy-tip-sub">
        {{ errorMsg }}
      </div>
      <div
        class="hy-btn flex-center"
        :class="{ disabled: errorMsg || !amount }"
        @click="handleWithdrawal"
      >
        Next
      </div>
    </div>
    <USDT v-model:show="isShowBind" :type="usdtType" />
    <Withdrawal v-model:show="isShowWithdrawal" :amount="amount" />
  </PageContainer>
</template>
<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { showDialog } from 'vant'
import useBaseStore from '@/store/index'
import SvgIcon from '@/components/svg-icon.vue'
import PageContainer from '@/components/page/container.vue'
import USDT from '@/components/popup/USDT.vue'
import Withdrawal from '@/components/popup/withdrawal.vue'

defineOptions({
  name: 'WithdrawalPage'
})
const baseStore = useBaseStore()
const userInfo = computed(() => baseStore.userInfo)
const amount: Ref<string | number> = ref('')
const isShowBind = ref(false)
const isShowWithdrawal = ref(false)
const usdtType = ref(0)
const errorMsg = computed(() => {
  if (!amount.value) return ''
  const count = Number(amount.value)
  if (count < 50) return 'The withdrawal amount cannot be less than 50USDT'
  if (count > userInfo.value.bCoinNum) return 'Insufficient balance'
  if (count > userInfo.value.drawPoint) return 'Withdraw points insufficient'
  return ''
})

function handleInit() {
  if (!userInfo.value.tronAddr) {
    isShowBind.value = true
  }
}

handleInit()

function handleCheckUSDT() {
  if (userInfo.value.tronAddr) {
    usdtType.value = 1
  }
  isShowBind.value = true
}

function handleCheckTip() {
  showDialog({
    message:
      'Haiyaa points can be used for Black Diamond withdrawal. For every withdrawal of 1 Black Diamond, 10 Haiyaa points need to be consumed.',
    confirmButtonText: 'Confirm'
  }).then(() => {
    // on close
  })
}
function handleFillAll() {
  amount.value = userInfo.value.drawPoint
}
function handleWithdrawal() {
  if (errorMsg.value || !amount.value) return
  isShowWithdrawal.value = true
}
</script>
<style lang="less" scoped>
.main-wrap {
  padding: 32px 24px;
}
.hy-item {
  font-size: 36px;
}
.main-content {
  position: relative;
  padding: 36px 24px;
  height: 406px;
  background-image: linear-gradient(196deg, #c36aee 0%, #669eff 100%);
  border-radius: 32px;
  color: #fff;
  box-sizing: border-box;
}
.account-info {
  position: absolute;
  top: 30px;
  right: 30px;
  padding: 0 8px;
  width: 200px;
  height: 50px;
  border: 1px solid #fff;
  border-radius: 25px;
  overflow: hidden;
  box-sizing: border-box;
  img {
    flex-shrink: 0;
    margin-right: 4px;
    width: 28px;
    height: 28px;
  }
  svg {
    flex-shrink: 0;
    font-size: 24px;
  }
  span {
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.content-title {
  font-size: 32px;
  font-weight: 600;
}
.diamond-count {
  margin: 26px 0 20px;
  display: flex;
  align-items: center;
  font-family: 'LemonMilkbold';
  font-size: 40px;
  font-weight: bold;
  img {
    margin-right: 10px;
    width: 48px;
    height: 48px;
  }
}
.convert-info {
  display: flex;
  align-items: center;
  font-family: 'LemonMilkbold';
  font-size: 32px;
  font-weight: bold;
  opacity: 0.6;
  img {
    margin: 0 12px;
    width: 32px;
    height: 32px;
  }
}
.hai-point {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  svg {
    margin-left: 10px;
    font-size: 26px;
  }
}
.hy-tip {
  margin: 26px 0 20px;
  font-size: 24px;
  color: #acacac;
  &-sub {
    margin: 16px 0 80px;
    min-height: 80px;
    color: #f43967;
  }
}
.hy-amount {
  padding: 0 24px;
  height: 96px;
  background: #f8f9fe;
  border-radius: 32px;
  img {
    width: 48px;
    height: 48px;
  }
  &-field {
    padding-left: 10px;
    background-color: transparent;
    :deep(&::after) {
      display: none;
    }
  }
  &-btn {
    width: 90px;
    height: 40px;
    border-radius: 20px;
    background-color: #8b72f7;
    font-size: 24px;
    color: #fff;
  }
}
.hy-btn {
  height: 80px;
  background-color: #8b72f7;
  border-radius: 16px;
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  &.disabled {
    opacity: 0.6;
  }
}
</style>
