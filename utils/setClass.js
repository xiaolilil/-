/**
 * @description: 添加类名
 * @param {*} el 要添加类名的元素
 * @param {*} elClass 类名
 */
export function addClass(el, elClass) {
  $(el).addClass(elClass)
}

/**
 * @description: 移除类名
 * @param {*} elClass 类名
 */
export function removeClass(elClass) {
  $(`.${elClass}`).removeClass(`${elClass}`)
}