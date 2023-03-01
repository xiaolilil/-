import { request } from '../utils/request.js'

const APIS = {
  SENT_CAPTCHA: '/captcha/sent',
  VERIFY_CAPTCHA: '/captcha/verify',
  PHONE_LOGIN: '/login/cellphone',
  CREATE_QR_KEY: '/login/qr/key',
  CREATE_QR: '/login/qr/create',
  CHECK_QR: '/login/qr/check',
  REGISTER: '/register/cellphone',
  CHECK_PHONE: '/cellphone/existence/check'
}

/**
 * @description: 发送验证码
 * @param {*} phone 手机号
 * @return {*}
 */
export function sentCaptchaHttp(phone) {
  return request({
    url: `${APIS.SENT_CAPTCHA}?phone=${phone}`,
  })
}

/**
 * @description: 验证验证码
 * @param {*} phone 手机号
 * @param {*} captcha 验证码
 * @return {*}
 */
export function verifyCaptchaHttp(phone, captcha) {
  return request({
    url: `${APIS.VERIFY_CAPTCHA}?phone=${phone}&captcha=${captcha}`,
  })
}

/**
 * @description: 验证码登录
 * @param {*} phone 手机号
 * @param {*} captcha 验证码
 * @return {*}
 */
export function captchaLoginHttp(phone, captcha) {
  return request({
    url: `${APIS.PHONE_LOGIN}?phone=${phone}&captcha=${captcha}`,
  })
}

/**
 * @description: 密码登录
 * @param {*} phone 手机号码
 * @param {*} md5_password md5加密后的密码
 * @return {*}
 */
export function passwordLoginHttp(phone, md5_password) {
  return request({
    url: `${APIS.PHONE_LOGIN}?phone=${phone}&md5_password=${md5_password}`,
  })
}


/**
 * @description: 生成 二维码 key 
 * @return {*}
 */
export function createQrKeyHttp() {
  return request({
    url: `${APIS.CREATE_QR_KEY}`,
  })
}

/**
 * @description: 生成二维码
 * @param {*} key 由第一个接口生成
 * @param {*} qrimg 传入后会额外返回二维码图片 base64 编码, 也是传 key 的值
 * @return {*}
 */
export function createQrHttp(key, qrimg = true) {
  return request({
    url: `${APIS.CREATE_QR}?key=${key}&qrimg=${qrimg ? key : ''}`,
  })
}

/**
 * @description: 检测二维码扫码状态
 * @param {*} key 由第一个接口生成
 * @return {*}
 */
export function checkQrHttp(key) {
  return request({
    url: `${APIS.CHECK_QR}?key=${key}`,
  })
}


/**
 * @description: 注册
 * @param {*} phone
 * @param {*} captcha
 * @param {*} password
 * @param {*} nickname
 * @return {*}
 */
export function registerHttp(phone, captcha, password, nickname) {
  return request({
    url: `${APIS.REGISTER}?`,
    params: {
      phone, // phone: phone
      captcha,
      password,
      nickname
    }
  })
}


/**
 * @description: 检测手机号码是否已注册
 * @param {*} phone 手机号
 * @return {*}
 */
export function checkPhoneHttp(phone) {
  return request({
    url: `${APIS.CHECK_PHONE}?phone=${phone}`
  })
}