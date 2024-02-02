<template>
  <!-- 底部弹出 -->
  <van-popup position="bottom" round teleport="body" @open="handleOpen">
    <div class="popup-content">
      <template v-if="type === 0">
        <img src="@/assets/images/withdrawal-01.png" />
        <div class="popup-tip">
          Black Diamond will deduct 8% of the withdrawal fee when withdrawing
          amount, and the payment cycle after applying for withdrawal is
          generally 7-15 days.
        </div>
      </template>
      <template v-else>
        <img src="@/assets/images/withdrawal-02.png" />
        <div class="popup-tip">
          It is recommended that you redeem black diamonds for diamonds, which
          will be credited to your account in real time and you can get
          additional diamond rewards.
        </div>
      </template>
      <div class="popup-bar"></div>
      <div v-if="type === 0" class="popup-btn" @click="handleNext">Next</div>
      <div v-else class="popup-btn-multiple">
        <div @click="emit('next')">Withdrawal</div>
        <div @click="emit('exchange')">Exchange Now</div>
      </div>
    </div>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, defineEmits } from 'vue'
const emit = defineEmits(['next', 'exchange'])
const type = ref(0)
function handleOpen() {
  type.value = 0
}
function handleNext() {
  type.value = 1
}
</script>
<style lang="less" scoped>
.popup-content {
  padding: 32px 32px 60px;
  img {
    display: block;
    width: 100%;
  }
}
.popup-tip {
  font-size: 28px;
  line-height: 50px;
}
.popup-bar {
  margin: 36px 0 40px;
  height: 1px;
  background-color: #eee;
}
.popup-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border-radius: 16px;
  background-color: #8b72f7;
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}
.popup-btn-multiple {
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 340px;
    height: 80px;
    border-radius: 16px;
    font-size: 32px;
    font-weight: bold;
  }
  div:last-child {
    background-color: #8b72f7;
    color: #fff;
  }
}
</style>
