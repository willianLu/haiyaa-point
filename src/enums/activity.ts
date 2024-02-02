/**
 * @description 道具类型
 */
export enum propTypeEnum {
  gift = 1, //礼物
  zhuangban = 2, //装扮
  daoju = 3 //道具
}

/**
 * @description propType === propTypeEnum.zhuangban 时subType
 */
export enum propSubTypeEnum {
  guajian = 1, //挂件
  zhuojia = 2, //座驾
  fangjianbeijin = 3 //房间背景
}

/**
 * @description 价格类型
 */
export enum priceTypeEnum {
  goldCoin = 1, //金币
  diamond = 2 //钻石
}
