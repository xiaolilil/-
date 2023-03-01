
/**
 * @description: 校验手机号
 * @param {*} phone 手机号码
 * @return {*} true 正确的手机号格式  false 格式不正确
 */
export function checkPhone(phone) {
  // 正则校验
  if (!(/^1[3-9]\d{9}$/.test(phone))) {
    return false;
  } else {
    return true
  }
}


/**
 * @description: 校验邮箱
 * @param {*} email 邮箱
 * @return {*}
 */
export function checkEmail(email) {
  var reg = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$");
  //校验
  if (email == null) {
    return {
      flag: false,
      text: '邮箱地址不能为空'
    };
  }
  if (!reg.test(email)) {
    return {
      flag: false,
      text: '请输入有效的邮箱地址'
    };
  }
  return true;
}