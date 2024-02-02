;(function (w) {
  const bridge = null
  /**
   * @description jsbridge操作类
   */
  const HeyheyBridge = {
    /**
     * window.
     * @description 预置协议JS调用APP
     */
    Js2AppFunctionList: {
      // 新方法
      closePage: 'closePage', // 关闭h5页面
      openPage: 'openPage', // 打开指定的链接
      setTopBar: 'setTopBar', // 设置客户端顶部bar
      getUserInfo: 'getUserInfo', // 获取客户端的用户信息
      copyText: 'copyText', // 复制文本
      getCopyText: 'getCopyText' // 获取黏贴文本
    },

    /**
     * @description 预置协议APP调用JS事件池
     * "share:hhmessage" app 分享成功
     * "share:wxtimeline" 微信朋友圈分享成功
     * "share:wxmessage" 微信消息分享成功
     * "share:qq" qq分享成功
     * "share:qzone" qq空间分享成功
     * "pay:succ" 支付成功
     */
    App2JsEventList: {
      //eg:
      // "share:hhmessage": function(data){
      // }
    },

    /**
     * @description  获取jsbridge实例, 单例
     */
    getBridge(tesStr) {
      return new Promise(function (resolve, reject) {
        //resolve({test: '123'})
        if (bridge) {
          resolve(bridge)
        } else {
          function setupHeyhey(callback) {
            if (window.WebViewJavascriptBridge) {
              callback(WebViewJavascriptBridge)
            } else {
              //针对andorid, 延时 1000ms 返回bridge的实例
              setTimeout(() => {
                if (window.WebViewJavascriptBridge) {
                  callback(WebViewJavascriptBridge)
                }
              }, 1000)
            }

            if (window.WVJBCallbacks) {
              window.WVJBCallbacks.push(callback)
            }
            document.addEventListener(
              'WebViewJavascriptBridgeReady',
              function () {
                //callback(WebViewJavascriptBridge)
                WVJBCallbacks.forEach(function (cb) {
                  cb(WebViewJavascriptBridge)
                })
              },
              false
            )

            window.WVJBCallbacks = [callback]
            const WVJBIframe = document.createElement('iframe')
            WVJBIframe.style.display = 'none'
            WVJBIframe.src = 'https://__bridge_loaded__'
            document.documentElement.appendChild(WVJBIframe)
            setTimeout(function () {
              document.documentElement.removeChild(WVJBIframe)
            }, 0)
          }
          setupHeyhey(function (bridge) {
            bridge = bridge
            setTimeout(() => {
              resolve(bridge)
            }, 0)
          })
        }
      })
    },

    /**
     * @description 对app进行实际调用 timeLong之后jsbridge没有返回，则返回null告诉调用方超时
     * @param action
     * @param data
     * @param callback 调用app方法之后的回调处理
     */
    invokeApp(action, data, callback) {
      let end = false
      const timeLong = 3000
      const out = setTimeout(function () {
        if (!end) {
          console.log(
            `jsbrage timeout..., action: ${action}, data: ${JSON.stringify(
              data
            )}, timeLong: ${timeLong}`
          )
          end = true
          callback && callback(null)
        }
      }, timeLong)
      this.getBridge().then(function (bridge) {
        bridge.callHandler(
          'JSToHeyHeyBridge',
          { action: action, data: data },
          function (response) {
            console.log('call end action:', action, data)
            if (!end) {
              end = true
              clearTimeout(out)
              callback && callback(response)
            }
          }
        )
      })
    },

    /**
     * @description 根据协议遍历注册JS调用APP
     */
    registJsToAppFunctions() {
      const { Js2AppFunctionList } = this
      const self = this
      for (key in Js2AppFunctionList) {
        /**
         * @param {Object} data 调用app传参
         * @param {*} callback 调用app之后的处理逻辑
         */
        const action = Js2AppFunctionList[key]

        this[key] = function (data, callback) {
          self.invokeApp(action, data, callback)
        }
      }
    },

    /**
     * @description 根据协议监听APP调用JS
     */
    registAppToJsListeners() {
      const { App2JsEventList } = this
      this.getBridge('test listeners').then(function (bridge) {
        /**
         * @data app传参给js
         * @responseCallback js传参给app用于app逻辑处理
         */
        bridge.registerHandler(
          'HeyHeyToJSBridge',
          function (data, responseCallback) {
            if (typeof data === 'string') {
              data = JSON.parse(data)
            }
            // 接口定义问题
            const event = App2JsEventList[data.action || data.a]

            //未添加监听
            if (!event) {
              responseCallback({ result: 201 })
              return
            }
            //TODO promise 改造
            event(data.data)
            responseCallback({ result: 0 })
          }
        )
      })
    },

    /**
     * @description
     */
    addBridgeListener(action, callback) {
      this.App2JsEventList[action] = callback
    },

    /**
     * @description 初始化
     */
    init() {
      /**
       *
       */
      this.registAppToJsListeners()
      this.registJsToAppFunctions()
    }
  }

  HeyheyBridge.init()

  window.HeyheyBridge = HeyheyBridge

  window.isHeyHeyTalk = () => {
    if (window.navigator.userAgent.toLowerCase().match(/haiyaa/i) == 'haiyaa') {
      return true
    }
    return false
  }
})()
