import { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * @description 自定义请求配置参数
 */
export type CustomAxiosRequestConfig<T = any> = AxiosRequestConfig<T> & {
  originDomain?: string
  skipCommonData?: boolean
  isFormData?: boolean
  backOriginResponse?: boolean
}

/**
 * @description 默认请求返回数据
 */
export interface CustomResponseData {
  [key: string | number]: any
}

export type RequestBackData<T, D, U> = U extends 'origin'
  ? AxiosResponse<CustomResponseData, D>
  : CustomResponseData
