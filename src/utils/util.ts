/**
 * @description 基础数据类型
 */
enum DataType {
  NUMBER = 'number',
  STRING = 'string',
  ARRAY = 'array',
  OBJECT = 'object',
  UNDEFINED = 'undefined',
  NULL = 'null',
  FUNCTION = 'function',
  PROMISE = 'promise',
  ERROR = 'error'
}

/**
 * @description 判断数据
 * @param {unknown} data 任意值
 */
export function isDef(data: unknown): boolean {
  return data !== undefined && data !== null
}

/**
 * @description 判断数据类型是否是传入的类型
 * @param {unknown} data 传入数据
 * @param {dataType} type 对比的数据类型
 * @returns {boolean} true | false
 */
function judgeDataType<T>(data: unknown, type: string): data is T {
  return (
    Object.prototype.toString.call(data).toLocaleLowerCase() ===
    `[object ${type}]`
  )
}

/**
 * @description 判断数据类型是否是对象
 * @param {unknown} data 传入的数据
 * @returns {boolean} true | false
 */
export function isObject<T = Record<any, unknown>>(data: unknown): data is T {
  return judgeDataType<Record<any, unknown>>(data, DataType.OBJECT)
}

/**
 * @description 判断数据类型是否是函数
 * @param {unknown} data 传入的数据
 * @returns {boolean} true | false
 */
export function isFunction<T = any>(
  data: unknown
): data is (...args: any[]) => T {
  return judgeDataType(data, DataType.FUNCTION)
}

/**
 * @description 判断数据类型是否是promise函数
 * @param {unknown} data 传入的数据
 * @returns {boolean} true | false
 */
export function isPromise<T>(data: unknown): data is Promise<T> {
  return judgeDataType<Promise<T>>(data, DataType.PROMISE)
}

/**
 * @description 判断数据类型是否是Error类型
 * @param {unknown} data 传入的数据
 * @returns {boolean} true | false
 */
export function isError(data: unknown): data is Error {
  return judgeDataType<Error>(data, DataType.ERROR)
}

/**
 * @description 判断数据类型是否是数字
 * @param {unknown} data 传入的数据
 * @returns {boolean} true | false
 */
export function isNumber(data: unknown): data is number {
  return (
    judgeDataType<number>(data, DataType.NUMBER) && !window.isNaN(<number>data)
  )
}

/**
 * @description 判断数据类型是否是字符串
 * @param {unknown} data 传入的数据
 * @returns {boolean} true | false
 */
export function isString(data: unknown): data is string {
  return judgeDataType<string>(data, DataType.STRING)
}

/**
 * @description 是否是空对象
 * @param {unknown} data
 * @returns {boolean}
 */
export function isEmptyObject(data: unknown): data is object {
  return isObject(data) && JSON.stringify(data) === '{}'
}
/**
 * @description 延迟函数
 * @param {undefuned | number} duration
 * @param {unknown} data
 * @returns {promise<T | undefined>}
 */
export function delay<T>(duration?: number, data?: T): Promise<T | undefined> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data)
    }, duration || 1000)
  })
}
/**
 * @description 将json转化为query字符串
 * @param {object} data json数据
 * @returns {string} query字符串
 */
export function stringifyQuery(data: Record<string | number | symbol, any>) {
  if (!isObject(data)) return ''
  return Object.keys(data)
    .map(key => {
      return `${key}=${data[key]}`
    })
    .join('&')
}

/**
 * @description px 转换为 vw单位
 * @param {string | number} count 需要转换的数量
 * @param {number} viewportWidth 参考设计稿宽度
 * @returns {string} 转换后的vw数值
 */
export function pxToRem(count: string | number, viewportWidth?: number) {
  viewportWidth = isNumber(viewportWidth) ? viewportWidth : 75
  if (isString(count) && count.endsWith('px')) {
    count = count.slice(0, count.length - 2)
  }
  if (/^\d+$/.test(`${count}`)) {
    return (Number(count) / viewportWidth).toFixed(6) + 'rem'
  }
  return count
}

/**
 * @description 获取倒计时
 * @param { number } timeStamp 时间戳
 * @param { boolean } isMillisecond 是否毫秒时间戳，默认是毫秒
 * @param { boolean } isAddZero 不足十位是否补领
 */
export function getCountdownText(
  timeStamp: number,
  isMillisecond = true,
  isAddZero = false
) {
  // 毫秒时间戳转化为秒时间戳
  if (isMillisecond) timeStamp = Math.floor(timeStamp / 1000)
  const days = Math.floor(timeStamp / (60 * 60 * 24))
  const hour = Math.floor((timeStamp % (60 * 60 * 24)) / (60 * 60))
  const min = Math.floor((timeStamp % (60 * 60)) / 60)
  const scn = Math.floor(timeStamp % 60)
  const addZeroFn = (count: number) => {
    return isAddZero ? (count < 10 ? `0${count}` : count) : count
  }
  let sm = ''
  if (days > 0) sm += `${addZeroFn(days)}天`
  if (days > 0 || hour > 0) sm += `${addZeroFn(hour)}小時`
  if (days > 0 || min > 0) sm += `${addZeroFn(min)}分`
  if (days > 0 || scn > 0) sm += `${addZeroFn(scn)}秒`
  return sm
}

// 获取秒级时间戳
export function getTimestampBySecond(str: string) {
  const date = new Date(str)
  const timestamp = date.getTime()
  return Math.round(timestamp / 1000)
}

// 加载图片
export function loadImage(url: string) {
  return new Promise(resolve => {
    let img: any = new Image()
    img.onload = () => {
      img = null
      resolve(true)
    }
    img.onerror = () => {
      img = null
      resolve(false)
    }
    img.src = url
  })
}

/**
 * @description 时间格式化
 * @param { date | string | number | undefined } date 时间戳，时间对象，时间字符串，（undefied | 0 | NaN | '' - 代表当前时间）
 * @param { string } format 格式化形式参考 http://momentjs.cn/docs/ 年份、月份、日期的令牌 eg. YYYY-MM-DD HH:mm:ss
 * @param { boolean | undefined} addZero  true - 数字不足10时补0，如：2020-6-8 —— 2020-06-08
 */
export const formatDate = (
  date?: Date | string | number,
  format = 'YYYY-MM-DD',
  addZero?: boolean,
  addTimeZero?: boolean
) => {
  let result = ''
  let tempDate: Date

  if (typeof date === 'object') {
    tempDate = date
  } else {
    tempDate = !date ? new Date() : new Date(date)
  }

  if (/(Y+)/.test(format)) {
    result = format.replace(RegExp.$1, `${tempDate.getFullYear()}`)
  } else {
    result = format
  }

  const month = tempDate.getMonth() + 1
  const day = tempDate.getDate()
  const hours = tempDate.getHours()
  const minutes = tempDate.getMinutes()
  const seconds = tempDate.getSeconds()
  const prefix = addZero ? '0' : ''
  const timePreFix = addTimeZero ? '0' : ''
  const tokens: Record<string, string> = {
    'M+': `${month < 10 ? `${prefix}${month}` : month}`,
    'D+': `${day < 10 ? `${prefix}${day}` : day}`,
    'H+': `${hours < 10 ? `${prefix || timePreFix}${hours}` : hours}`,
    'm+': `${minutes < 10 ? `${prefix || timePreFix}${minutes}` : minutes}`,
    's+': `${seconds < 10 ? `${prefix || timePreFix}${seconds}` : seconds}`
  }

  Object.keys(tokens).forEach(key => {
    if (new RegExp(`(${key})`).test(format)) {
      result = result.replace(RegExp.$1, tokens[key])
    }
  })

  return result
}

/**
 * @description url取值
 * @param {*} key
 * @param {*} href
 */
export function getQueryString(key: string, href = '') {
  let search = href || window.location.search
  const {
    location: { hash }
  } = window
  if (!search && hash) {
    search = hash.substring(1)
  }
  const reg = new RegExp(`(^|\\?|&)${key}=([^&]*)(&|$)`)
  const res = search.match(reg)
  return res ? res[2] : ''
}

export async function getClipboardText() {
  return new Promise<string>(resolve => {
    ;(window as any).HeyheyBridge.getCopyText({}, (res: any) => {
      resolve(res?.data?.content || '')
    })
  })
}
