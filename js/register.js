import { checkPhone } from '../utils/validate.js'
import { splitLabel, labelAnimation } from '../utils/splitLabelToSpan.js'
import { INIT_TIPS } from '../utils/tips.js'
import { sentCaptchaHttp, verifyCaptchaHttp, registerHttp, checkPhoneHttp } from '../api/user.js'
import { timeDown } from '../utils/timeDown.js'

// 输入框有值的时候 label span 不掉下来
const ipts = $('.form-item input')

window.onload = () => {
  for (let i = 0; i < ipts.length; i++) {
    labelAnimation(ipts[i])
  }
}

// 输入框 label 动画
$('.phone-label').html(splitLabel($('.phone-label')))
$('.captcha-label').html(splitLabel($('.captcha-label')))
$('.pwd-label').html(splitLabel($('.pwd-label')))
$('.nick-label').html(splitLabel($('.nick-label')))

// 输入框失去焦点 判断是否添加类名
for (let i = 0; i < ipts.length; i++) {
  ipts[i].onblur = () => {
    labelAnimation(ipts[i])
  }
}

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

// 获取验证码
$('.get-captcha').click(() => {
  const phone = $('.phone-ipt').val()
  const checkRes = checkPhone(phone)
  if (phone == '') {
    layer.msg(INIT_TIPS.VOID_PHONE, { icon: 5 })
    $('.phone-ipt').focus()
    return false
  }
  if (!checkRes) {
    layer.msg(INIT_TIPS.VOID_PHONE_FORMAT, { icon: 2 })
    $('.phone-ipt').val('')
    $('.phone-ipt').focus()
    return false
  }
  // 倒计时
  timeDown('get-captcha', 30)
  // 发送验证码
  sentCaptchaHttp(phone).then(res => {
    console.log('res', res)
  }).catch(err => {
    layer.msg(err.message, { icon: 2 })
  })

  // 阻止表单的默认事件
  return false
})

// 点击注册
$('.register').click(() => {
  const phone = $('.phone-ipt').val()
  const checkRes = checkPhone(phone)
  const captcha = $('.captcha-ipt').val()
  const password = $('.pwd-ipt').val()
  const nickname = $('.nick-ipt').val()

  if (checkRes && captcha != '' && password != '' && nickname != '') {
    checkPhoneHttp(phone).then(res => {
      // exist == 1 已被注册
      if (res.data.exist == 1) {
        layer.msg(INIT_TIPS.EXIST_PHONE, { icon: 2 })
        $('.phone-ipt').val('')
        $('.captcha-ipt').val('')
        $('.pwd-ipt').val('')
        $('.nick-ipt').val('')
        $('.phone-ipt').focus()
      } else {
        // 该手机号码没有被注册
        verifyCaptchaHttp(phone, captcha).then(res => {
          registerHttp(phone, captcha, password, nickname).then(res => {
            // 注册成功 去登录页面 清空输入框
            if (res.data.code == 200) {
              location.href = '../pages/login.html'
              $('.phone-ipt').val('')
              $('.captcha-ipt').val('')
              $('.pwd-ipt').val('')
              $('.nick-ipt').val('')
            }
          }).catch(err => {
            // 注册失败弹窗提示
            layer.msg(err.message, { icon: 5 })
            $('.nick-ipt').val('')
            $('.nick-ipt').focus()
          })
        }).catch(err => {
          // 验证验证码不通过
          layer.msg(err.message, { icon: 2 })
          $('.captcha-ipt').val('')
          $('.captcha-ipt').focus()
        })
      }
    }).catch(err => {
      console.log('err', err)
    })

  } else {
    // 没有填完必填项
    layer.msg(INIT_TIPS.VOID_REGISTER_FORM, { icon: 2 })
  }


  return false
})