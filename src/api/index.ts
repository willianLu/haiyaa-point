import { post } from '@/utils/http'

// 获取用户信息
export function queryTaskList(data: any) {
  return post(
    '/json/',
    {
      cmd: 7991,
      data: JSON.stringify(data)
    },
    { isFormData: true }
  )
}
