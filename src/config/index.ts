import { ConfigType } from '@/types'

const isDev = import.meta.env.MODE === 'development'

// 测试环境和正式环境，请求链接不同
const baseUrl =
  import.meta.env.SERVER_ENV === 'test'
    ? 'https://testsg.haiyaapi.com'
    : 'https://sg.haiyaapi.com'

const Config: ConfigType = {
  isDev,
  isProd: !isDev,
  baseUrl: baseUrl,
  viewportWidth: 750
}

// 将配置数据冻结，不允许代码运行阶段修改，如需修改，不应放到配置数据上
export default Object.freeze(Config)
