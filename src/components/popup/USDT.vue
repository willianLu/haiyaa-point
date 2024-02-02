<template>
  <!-- 底部弹出 -->
  <van-popup
    position="bottom"
    round
    teleport="body"
    @click-overlay="handleClickOverlay"
    @open="handleOpen"
  >
    <div class="popup-content">
      <div class="flex-center-space-between popup-title">
        <div>{{ title }}</div>
        <SvgIcon
          v-if="type === 0 || isUpdate"
          name="question-circle-outline"
          @click="checkExplain"
        />
      </div>
      <div class="hy-sub-title">Address</div>
      <div v-if="type === 0 || isUpdate" class="popup-field flex-v-center">
        <van-field
          v-model="text"
          placeholder="Fill in your USDT address"
          clearable
        />
        <div class="paste-btn flex-center" @click="handlePaste">Paste</div>
      </div>
      <div v-else class="flex-v-center hy-info">
        <img src="@/assets/images/icon-exchange.png" />
        <p>{{ userInfo.tronAddr }}</p>
      </div>
      <div class="hy-sub-title">Network</div>
      <div class="flex-v-center hy-info">
        <img src="@/assets/images/icon-trx.png" />
        <span>Tron (TRC20)</span>
      </div>
      <div class="hy-bar">
        <p v-if="type !== 0 && !isUpdate && isDisabed" class="flex-center">
          <SvgIcon name="warning" />
          <span>USDT address cannot be changed within 90 days</span>
        </p>
      </div>
      <div
        v-if="type === 0 || isUpdate"
        class="hy-btn flex-center"
        :class="{ disabled: !text }"
        @click="handleConfirm"
      >
        Confirm
      </div>
      <div
        v-else
        class="hy-btn flex-center"
        :class="{ disabled: isDisabed }"
        @click="handleUpdate"
      >
        Update address
      </div>
    </div>
    <Verification
      v-model:show="isShow"
      @success="handleVerifySuccess"
    ></Verification>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import SvgIcon from '../svg-icon.vue'
import Verification from './verification.vue'
import useBaseStore from '@/store/index'
import { bindUSDT } from '@/api/index'
import Loading from '@/components/loading/index'
import { getClipboardText } from '@/utils/util'

const props = defineProps({
  type: {
    // 绑定 0，管理 1
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['update:show'])
const router = useRouter()
const baseStore = useBaseStore()
const userInfo = computed(() => baseStore.userInfo)
const text = ref('')
const isShow = ref(false)
const isUpdate = ref(false)
const isDisabed = computed(() => {
  if (props.type !== 1) {
    return false
  }
  const long = Date.now() - new Date(userInfo.value.tronBind).getTime()
  return long / (24 * 60 * 60 * 1000) < 90
})
const title = computed(() => {
  return props.type === 0 || isUpdate.value
    ? 'Bind USDT address'
    : 'Manage USDT address'
})
function checkExplain() {
  window.location.href =
    'https://cdn.hy.qingotng.com/haiyaa/instructions/TRC20.html'
}
function handleClickOverlay() {
  if (props.type !== 0) emit('update:show', false)
  else {
    handleTip()
  }
}
function handleTip() {
  if (props.type === 1) return
  showConfirmDialog({
    message:
      'We do withdrawal through cryptocurrency, please bind the USDT address first',
    cancelButtonText: 'Exit',
    confirmButtonText: 'Continue'
  })
    .then(() => {
      //
    })
    .catch(() => {
      router.back()
    })
}
function handleOpen() {
  isUpdate.value = false
}
async function handleUpdate() {
  if (isDisabed.value) return
  isUpdate.value = true
}
async function handleConfirm() {
  if (!text.value) return
  if (!text.value.startsWith('T') || text.value.length < 33) {
    return showConfirmDialog({
      message: 'Please fill in the USDT address based on the TRC20 network',
      cancelButtonText: 'Help',
      confirmButtonText: 'Continue'
    })
      .then(() => {
        text.value = ''
      })
      .catch(() => {
        window.location.href = 'http://www.baidu.com'
      })
  }
  if (props.type === 0) {
    handleBindUSDT()
  } else {
    isShow.value = true
  }
}
async function handleBindUSDT() {
  Loading.show()
  const [res] = await bindUSDT({
    strId: text.value
  })
  Loading.hide()
  if (res && !res.retCode) {
    baseStore.userInfo.tronBind = res.tronBind
    baseStore.userInfo.tronAddr = res.tronAddr
    baseStore.updateUserInfo(baseStore.userInfo)
    emit('update:show', false)
    showToast('Binding successful')
  } else {
    showToast(res?.retTxt || 'Network Error')
  }
}
function handleVerifySuccess() {
  isShow.value = false
  handleBindUSDT()
  emit('update:show', false)
}
async function handlePaste() {
  const res = await getClipboardText()
  text.value = res || ''
}
</script>
<style lang="less" scoped>
.popup-content {
  padding: 60px 32px;
  background: url(@/assets/images/USDT-bg.png) no-repeat;
  background-size: 276px 272px;
  background-position: top right;
}
.popup-title {
  font-size: 32px;
  font-weight: 600;
  color: #8b72f7;
}
.hy-sub-title {
  margin: 30px 0 20px;
  font-size: 24px;
  color: #acacac;
}
.popup-field {
  padding-right: 20px;
  height: 90px;
  background-color: rgba(172, 172, 172, 0.2);
  border-radius: 16px;
  box-sizing: border-box;
  :deep(.van-field) {
    flex: 1;
    background-color: transparent;
    &::after {
      display: none;
    }
  }
}
.paste-btn {
  flex-shrink: 0;
  width: 90px;
  height: 40px;
  border-radius: 20px;
  background-color: #8b72f7;
  font-size: 24px;
  color: #fff;
}
.hy-info {
  font-size: 32px;
  img {
    margin-right: 10px;
    width: 32px;
    height: 32px;
  }
}
.hy-bar {
  position: relative;
  margin: 120px 0 32px;
  height: 1px;
  background-color: #eee;
  p {
    position: absolute;
    top: -44px;
    left: 0;
    width: 100%;
    font-size: 24px;
    color: #7d7b7c;
    svg {
      margin-right: 8px;
      color: #d80917;
    }
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
    opacity: 0.4;
  }
}
</style>
