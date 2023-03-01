/**
* @description: 倒计时
* @param {*} elClass 元素类名
* @param {*} time 从多少时间开始倒计时
*/
export function timeDown(elClass, time) {
  let timer = setInterval(() => {
    time--
    $(`.${elClass}`).text(`倒计时${time}秒`)
    // 禁止按钮进行其他的事件操作
    $(`.${elClass}`).attr('disabled', true)
    $(`.${elClass}`).addClass('not-allow')
    // 时间归0 清除定时器 重新添加可操作性属性
    if (time == 0) {
      clearInterval(timer)
      $(`.${elClass}`).text(`获取验证码`)
      $(`.${elClass}`).attr('disabled', false)
      $(`.${elClass}`).removeClass('noallow')
    }
  }, 1000)
}
