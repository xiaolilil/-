import { addClass, removeClass } from "../utils/setClass.js"
import { setCache, removeCache, getCache } from "../utils/cache.js"
import {
  sentCaptchaHttp,
  verifyCaptchaHttp,
  captchaLoginHttp,
  passwordLoginHttp,
  createQrKeyHttp,
  createQrHttp,
  checkQrHttp
} from '../api/user.js'
import { checkPhone } from '../utils/validate.js'
import { INIT_TIPS } from '../utils/tips.js'
import { splitLabel, labelAnimation } from '../utils/splitLabelToSpan.js'
import { timeDown } from "../utils/timeDown.js"


// 输入框有值的时候 label span 不掉下来
const ipts = $('.form-item input')

window.onload = () => {
  // 页面首次加载判断本地有没有手机号 和 密码 有的话 赋值给输入框
  if (getCache('wyy-phone') && getCache('wyy-pwd')) {
    $('#rememberPwd').attr('checked', true)
    $('.phone-ipt').val(getCache('wyy-phone'))
    $('.pwd-ipt').val(getCache('wyy-pwd'))
  }

  for (let i = 0; i < ipts.length; i++) {
    labelAnimation(ipts[i])
  }
}

// 切换页面
const spans = $('.title span')
for (let i = 0; i < spans.length; i++) {
  spans[i].onclick = () => {
    removeClass('activeTitle')
    addClass(spans[i], 'activeTitle')
    switch (spans[i].innerText) {
      case '手机号登录':
        $('.form-phone').css('left', '0')
        $('.form-qr').css('left', '100%')
        break;
      case '扫码登录':
        $('.form-phone').css('left', '-100%')
        $('.form-qr').css('left', '0')
        break;
      default:
        break;
    }
  }
}
// 点击右下角的二维码切换页面
$('.qr').click(() => {
  $('.form-phone').css('left', '-100%')
  $('.form-qr').css('left', '0')
  removeClass('activeTitle')
  addClass(spans[1], 'activeTitle')
})

// 是否是密码登录
let isPwdLogin = false
// 切换输入框
$('.form-other > span').click(() => {
  switch ($('.form-other > span').text()) {
    case '密码登录':
      isPwdLogin = true
      $('.form-other > span').text('验证码登录')
      $('.item-pwd').css('display', 'block')
      $('.item-captcha').css('display', 'none')
      $('.form-phone .form-other .remember').css('visibility', 'visible')
      break;
    case '验证码登录':
      isPwdLogin = false
      $('.form-other > span').text('密码登录')
      $('.item-pwd').css('display', 'none')
      $('.item-captcha').css('display', 'flex')
      $('.form-phone .form-other .remember').css('visibility', 'hidden')
      break;
    default:
      break;
  }
})

// 下拉选择框 
layui.use(['dropdown', 'layer'], function () {
  var dropdown = layui.dropdown
    , layer = layui.layer

  //初演示
  dropdown.render({
    elem: '.demo1'
    , data: [{
      title: '中国 +86'
      , id: 100
    }, {
      title: '台湾地区 +886'
      , id: 101
    }, {
      title: '香港地区 +852'
      , id: 102
    }, {
      title: '澳门地区 +853'
      , id: 103
    }]
    , click: function (obj) {
      $('.qh').text(obj.title.split(' ')[1])
    }
  });

})


// 输入框 label 动画
$('.phone-label').html(splitLabel($('.phone-label')))
$('.qr-label').html(splitLabel($('.qr-label')))
$('.pwd-label').html(splitLabel($('.pwd-label')))


// 输入框失去焦点 判断是否添加类名
for (let i = 0; i < ipts.length; i++) {
  ipts[i].onblur = () => {
    labelAnimation(ipts[i])
  }
}


/* 

获取验证码
1. 判断有没有输入手机号码 没有输入弹窗提示用户输入手机号
2. 校验手机号码格式正不正确 
    弹窗提示  情况输入框 输入框聚焦

3. 输入正确格式的号码  发送网络请求 获取验证码
  倒计时30s 
4. 判断返回的code 是否等于 200 
  不等于 弹窗提示用户  

5. 
*/
$('.get-qr').click((e) => {
  e.preventDefault()
  const phone = $('.phone-ipt').val()
  if (phone == '') {
    layer.msg(INIT_TIPS.VOID_PHONE, { icon: 5 })
  }
  // 校验手机号码
  const validRes = checkPhone(phone)
  if (!validRes) {
    layer.msg(INIT_TIPS.VOID_PHONE_FORMAT, { icon: 2 })
    $('.phone-ipt').val('')
    $('.phone-ipt').focus()
    return
  }
  timeDown('get-qr', 30)
  sentCaptchaHttp(phone).then(res => {
    if (res.data.code != 200) {
      layer.msg(res.data.message, { icon: 2 })
      $('.phone-ipt').focus()
    }
  })

})




// 点击登录
$('.login').click(() => {
  // 如果是密码登录 阻止往下执行代码
  if (isPwdLogin) return false
  const phone = $('.phone-ipt').val()
  const captcha = $('.qr-ipt').val()
  // 判断有没有输入内容就点击登录按钮
  if (phone == '' && captcha == '') {
    layer.msg(INIT_TIPS.VOID_PHONE_AND_CAPTCHA, { icon: 5 })
    $('.phone-ipt').focus()
  } else if (phone == '' || captcha == '') {
    layer.msg(INIT_TIPS.VOID_PHONE_OR_CAPTCHA, { icon: 5 })
  } else {
    // 验证验证码
    verifyCaptchaHttp(phone, captcha).then(res => {
      // 发送验证码登录请求
      captchaLoginHttp(phone, captcha).then(res => {
        if (res.data.code == 200) {
          const { token, cookie, profile } = res.data
          // 把数据缓存到本地 token cookie  
          setCache('wyy-token', token)
          setCache('wyy-cookie', cookie)
          setCache('wyy-profile', profile)
          // 清空输入框
          $('.phone-ipt').val('')
          $('.qr-ipt').val('')
          // 跳转到首页
          location.href = '../pages/home.html'
        }
      }).catch(err => {
        console.log('err', err)
      })
    }).catch(err => {
      // 验证码不通过
      layer.msg(err.message, { icon: 2 })
      $('.qr-ipt').val('')
      $('.qr-ipt').focus()
    })
  }

  // 阻止表单的默认事件
  return false
})

/**
 * @description: 是否记住密码
 * @return {*} 记住 true  否 false
 */
const isRememberPwd = () => {
  // 获取复选框属性 checked 代表已选中 点击选中才会有这个属性 
  return $('#rememberPwd').prop('checked')
}

const loginBtn = document.querySelector('.login')

// 密码登录
loginBtn.addEventListener('click', () => {
  const phone = $('.phone-ipt').val()
  const password = $('.pwd-ipt').val()
  // 判断有没有输入手机号和密码 都没输入
  if (phone == '' && password == '') {
    layer.msg(INIT_TIPS.VOID_PHONE_AND_PWD, { icon: 5 })
    $('.phone-ipt').focus()
  } else if (phone == '' || password == '') {
    // 只输入了其中一个
    layer.msg(INIT_TIPS.VOID_PHONE_OR_PWD, { icon: 5 })
  } else {
    // 都输的有值 ，先校验手机的格式
    const checkPhoneRes = checkPhone(phone)
    if (!checkPhoneRes) {
      layer.msg(INIT_TIPS.VOID_PHONE_FORMAT, { icon: 2 })
      $('.phone-ipt').val('')
      $('.phone-ipt').focus()
    }
    // 如果是记住密码 缓存到本地去
    if (isRememberPwd()) {
      setCache('wyy-phone', phone)
      setCache('wyy-pwd', password)
    } else {
      // 不记住  移除缓存在本地的手机号 密码
      removeCache('wyy-phone', phone)
      removeCache('wyy-pwd', password)
    }

    // MD5 加密输入的密码
    const md5_password = MD5(password)

    passwordLoginHttp(phone, md5_password).then(res => {
      // 登录失败
      if (res.data.code != 200) {
        layer.msg(res.data.message, { icon: 2 })
        $('.phone-ipt').focus()
      } else if (res.data.code == 200) {
        // 登录成功 缓存数据到本地
        const { token, cookie, profile } = res.data
        setCache('wyy-token', token)
        setCache('wyy-cookie', cookie)
        setCache('wyy-profile', profile)

        // 跳转到首页
        location.href = '../pages/home.html'
      }
      // 清空输入框
      $('.phone-ipt').val('')
      $('.pwd-ipt').val('')
    }).catch(err => {
      console.log('err', err)
    })
  }
})


/* 
*
*   =========          二维码登录            =================
*
*/

let key = null
$(spans[1]).click(() => {
  createQrFn()
})

const createQrFn = () => {
  // 生成 二维码 key 
  createQrKeyHttp().then(res => {
    key = res.data.data.unikey

    // 生成二维码base64 图片
    createQrHttp(key).then(res => {
      if (res.data.code == 200) {
        // 把 base64数据 画到 canvas 里面去
        let qrimg = res.data.data.qrimg
        let img = new Image()
        img.src = qrimg
        let myCanvas = document.querySelector('#myCanvas')
        let ctx = myCanvas.getContext('2d')
        img.onload = () => {
          // 把base64图片地址画到 canvas里面去
          ctx.drawImage(img, 4, 0, 300, 150)
          // 调用检测是否扫描二维码函数
          timingCheck()
        }
      }
    }).catch(err => {
      console.log('err', err)
    })
  }).catch(err => {
    console.log('err', err)
  })
}


// 检测结果 code 码
let checkRes = null
/**
 * @description: 检测是否扫描二维码
 * @return {*}
 */
const isScanQr = (timer) => {
  checkQrHttp(key).then(res => {
    checkRes = res.data.code
    // 扫码成功
    if (res.data.code == 803) {
      setCache('wyy-cookie', res.data.cookie)
      clearInterval(timer)
    } else if (res.data.code == 800) {
      // 过期了
      $('.qr-text').text(res.data.message)
    } else if (res.data.code == 801) {
      // 等待扫码
      $('.qr-text').text(res.data.message)
    } else if (res.data.code == 802) {
      // 待确认
      $('.qr-text').text(res.data.message)
    }
  }).catch(err => {
    console.log('err', err)
  })
}


let num = 0
/**
 * @description: 定时调用检测方法 检测是否扫描
 * @return {*}
 */
const timingCheck = () => {
  let timer = setInterval(() => {
    num += 5
    // 如果超过1分钟都没有扫描 则清除定时器 提示用户
    if (num == 60) {
      // canvas tips 盒子显示
      $('.canvas-tips').fadeIn()
      // 清除定时器
      clearInterval(timer)
    }
    isScanQr(timer)
  }, 5000);
}


// 点击刷新 重新开启定时检测
$('.refresh-qr').click(() => {
  // 如果是 二维码过去 重新生成
  if (checkRes == 800) {
    // 重新生成二维码
    createQrFn()
  } else {
    // 不是过期 不用重新生成
    timingCheck()
  }
  // canvas 提示盒子消失
  $('.canvas-tips').fadeOut()
  // 清空提示 span里面 的文字
  $('.qr-text').text('')
})

