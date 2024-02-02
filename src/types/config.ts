export interface ConfigType {
  baseUrl?: string
  // 设计稿宽度
  viewportWidth: number
  isDev: boolean
  isProd: boolean
}

export type CommonParams = Record<string, any> | (() => Record<string, any>)

export type DomainParams = Record<string, CommonParams>
