import { get, post } from '@/utils/http'

// 获取用户信息
export function queryUserInfo(data: any) {
  return post(
    '/json/',
    {
      cmd: 6015,
      data: JSON.stringify(data)
    },
    { isFormData: true }
  )
}

// 黑钻兑换
export function blackDiamondExchange(data: any) {
  return post(
    '/json/',
    {
      cmd: 3631,
      data: JSON.stringify(data)
    },
    { isFormData: true }
  )
}

// 绑定钱包
export function bindUSDT(data: any) {
  return post(
    '/json/',
    {
      cmd: 6018,
      data: JSON.stringify(data)
    },
    { isFormData: true }
  )
}

// 请求验证码
export function queryCode(data: any) {
  return post(
    '/json/',
    {
      cmd: 7923,
      data: JSON.stringify(data)
    },
    { isFormData: true }
  )
}

// 校验验证码
export function verifyCode(data: any) {
  return post(
    '/json/',
    {
      cmd: 7924,
      data: JSON.stringify(data)
    },
    { isFormData: true }
  )
}

// 提现申请
export function applyWithdrawal(data: any) {
  return post(
    '/json/',
    {
      cmd: 3641,
      data: JSON.stringify(data)
    },
    { isFormData: true }
  )
}

// 查询订单
export function queryOrderList(data: any) {
  return post(
    '/json/',
    {
      cmd: 7957,
      data: JSON.stringify(data)
    },
    { isFormData: true }
  )
}

// 取消订单
export function cancelOrder(data: any) {
  return post(
    '/json/',
    {
      cmd: 3644,
      data: JSON.stringify(data)
    },
    { isFormData: true }
  )
}
