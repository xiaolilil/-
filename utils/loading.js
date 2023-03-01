import { postMsg } from './utils.js'

/**
 * @description: 加载动画
 * @param {*} els  元素数组
 * @return {*}
 */
export function loading(els) {
  let promiseAll = []
  for (let i = 0; i < els.length; i++) {
    promiseAll[i] = new Promise((resolve, reject) => {
      $('.l-wrapper').fadeIn()
      els[i].onload = function () {
        //第i张加载完成
        resolve(els[i])
      }
    })
  }
  Promise.all(promiseAll).then((els) => {
    //全部加载完成
    $('.l-wrapper').fadeOut()
  })
}


export function ParentLoading(els) {
  let promiseAll = []
  for (let i = 0; i < els.length; i++) {
    promiseAll[i] = new Promise((resolve, reject) => {
      postMsg('loading-fadeIn', '*')
      els[i].onload = function () {
        //第i张加载完成
        resolve(els[i])
      }
    })
  }
  Promise.all(promiseAll).then((els) => {
    //全部加载完成
    postMsg('loading-fadeOut', '*')
  })
}