export interface PageAliveAction {
  type: 'push' | 'replace' | 'go' | 'back' | 'forward'
  delta?: number
}

export type PageAliveRoute = {
  fullPath: string
  name: string
  position: number
  pageId: number
}
export interface StorageOptions {
  maxAge?: number | string
  timestamp?: number
}

export type StorageData = {
  value: any
} & StorageOptions
