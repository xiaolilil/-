import { addClass } from './setClass.js'

/**
 * @description: 将 元素里面的文本分割转成若干个 span 
 * @param {*} el 元素
 * @return {*} html 结构 span 标签
 */
export function splitLabel(el) {
  return el.text().split('').map((item, index) => {
    return `
      <span  style="transition-delay:${index * 50}ms">${item}</span>
    `
  })
}


/**
 * @description: label span 的动画
 * @param {*} el 元素
 * @return {*}
 */
export function labelAnimation(el) {
  const className = el.className
  const spans = document.querySelectorAll(`.${className} + label span`)
  // 有值的时候添加类名
  if (el.value) {
    // 作用域 
    for (let k = 0; k < spans.length; k++) {
      addClass(spans[k], 'haveVal')
    }
  } else {
    // 输入框没有值
    for (let j = 0; j < spans.length; j++) {
      spans[j].classList.remove('haveVal')
    }
  }
}

