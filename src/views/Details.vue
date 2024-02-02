<template>
  <PageContainer>
    <!-- <template #header>
      <PageNav title="Withdrawal details"></PageNav>
    </template> -->
    <div class="date-wrap">
      <div class="date-info" @click="isShowDate = true">
        <span>{{ currentDate[0] }}-{{ currentDate[1] }}</span>
        <SvgIcon name="arrow-right"></SvgIcon>
      </div>
      <div class="hy-total flex-v-center">
        Total for this month: {{ total }} Black Diamond
      </div>
    </div>
    <ul v-if="list.length" class="detail-wrap">
      <li
        v-for="(item, index) in list"
        :key="item.order"
        @click="handleCheckDetail(index)"
      >
        <div class="flex-center-space-between detail-title">
          <div>Withdrawal</div>
          <div>-{{ item.price }} USDT</div>
        </div>
        <div class="flex-center-space-between detail-status">
          <div>{{ item.timeText }}</div>
          <div>{{ item.statusText }}</div>
        </div>
      </li>
    </ul>
    <div v-else class="no-data">No Data</div>
    <van-popup
      v-model:show="isShowDate"
      position="bottom"
      round
      teleport="body"
    >
      <van-date-picker
        v-model="currentDate"
        title="选择年月"
        :columns-type="['year', 'month']"
        :max-date="maxDate"
        @confirm="handleDateConfirm"
        @cancel="isShowDate = false"
      />
    </van-popup>
    <DetailItem
      v-model:show="isShowItem"
      :info="list[checkIndex]"
      @cancel="handleCancel"
    ></DetailItem>
  </PageContainer>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import SvgIcon from '@/components/svg-icon.vue'
import PageContainer from '@/components/page/container.vue'
// import PageNav from '@/components/page/nav.vue'
import DetailItem from '@/components/popup/detailItem.vue'
import { queryOrderList } from '@/api/index'
import Loading from '@/components/loading/index'
import { formatDate, delay } from '@/utils/util'
import useBaseStore from '@/store/index'
import { multiply } from 'mathjs'

defineOptions({
  name: 'DetailsPage'
})
const baseStore = useBaseStore()
const currentDate: Ref<any[]> = ref([])
const isShowDate = ref(false)
const isShowItem = ref(false)
const total = ref(0)
const list: Ref<any[]> = ref([])
const checkIndex = ref(-1)
const maxDate = new Date()
function handleInit() {
  const date = new Date()
  let month: string | number = date.getMonth() + 1
  month = month < 10 ? `0${month}` : month
  const year = date.getFullYear()
  currentDate.value = [year, month]
  getOrderList()
}
handleInit()
async function getOrderList() {
  Loading.show()
  const [year, month] = currentDate.value
  const begTime = new Date(year, Number(month - 1), 1).getTime()
  const endTime = new Date(year, Number(month), 1).getTime()
  const [res] = await queryOrderList({
    userId: baseStore.userId,
    begTime: begTime / 1000,
    endTime: endTime / 1000
  })
  Loading.hide()
  const statusMap: any = {
    1: 'Reviewing',
    2: 'Reviewing',
    3: 'Cancaled',
    4: 'Failure',
    5: 'Failure',
    100: 'Successfully'
  }
  if (res && res.orders) {
    list.value = res.orders.map((item: any) => {
      total.value += item.price
      return {
        ...item,
        statusText: statusMap[item.status],
        timeText: formatDate(item.upTime * 1000, 'YYYY-MM-DD HH:mm:ss'),
        fee: multiply(item.price, 0.08)
      }
    })
  }
}
function handleCheckDetail(index: any) {
  checkIndex.value = index
  isShowItem.value = true
}
function handleDateConfirm(val: any) {
  isShowDate.value = false
  getOrderList()
}
function handleCancel() {
  list.value[checkIndex.value] = {
    ...list.value[checkIndex.value],
    status: 3,
    statusText: 'Cancaled'
  }
}
</script>
<style lang="less" scoped>
.date-wrap {
  margin: 30px;
  padding: 30px 24px;
  background-color: #f5f6fb;
  border-radius: 24px;
}
.date-info {
  display: inline-flex;
  align-items: center;
  padding-right: 36px;
  margin-bottom: 20px;
  font-size: 24px;
  color: #7d7b7c;
}
.hy-total {
  padding: 16px;
  line-height: 34px;
  background-color: #eee;
  border-radius: 16px;
  font-size: 24px;
  color: #7d7b7c;
}
.detail-wrap {
  li {
    padding: 36px 32px;
    border-bottom: 1px solid #eee;
  }
  .detail-title {
    margin-bottom: 18px;
    line-height: 36px;
    font-size: 32px;
    div:last-child {
      font-weight: 600;
    }
  }
}
.no-data {
  margin-top: 90px;
  text-align: center;
  font-size: 32px;
  color: #999;
}
</style>
