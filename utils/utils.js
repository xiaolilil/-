/**
 * @description: 防抖
 * @param {*} func  用户传入需要防抖的函数
 * @param {*} delay  等待时间
 * @return {*}
 */
export function debounce(func, wait = 50) {
  // 缓存一个定时器id
  let timer = 0
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}



/**
 * @description: 发送数据给父页面
 * @param {*} data 数据
 * @param {*} url  父页面路径
 * @return {*}
 */
export function postMsg(data, url = "*") {
  window.parent.postMessage(data, url);
};




/**
 * @description: 时间处理
 * @param {*} time 毫秒 
 * @return {*}
 */
export function shiftTimeStamp(time) {
  // time /= 1000; 如果传进来的是 毫秒 形式，则在这里除1000将其转为 秒 形式
  function f_m_dispose(min, sec) { // 分秒处理函数
    if (min < 10 && sec < 10) {
      return "0" + min + ":" + "0" + sec; // 如果分和秒都小于10，则前面都加入0
    } else if (min < 10 && sec >= 10) {
      return "0" + min + ":" + sec; // 如果分小于10，秒大于10，则给分前面加0
    } else if (min >= 10 && sec < 10) {
      return min + ":" + "0" + sec; // 如果分大于10，秒小于10，则给秒前面加0
    } else {
      return min + ":" + sec; // 如果分秒都大于10，则直接return 
    }
  }
  let hour = Number.parseInt(time / 3600); // 获取总的小时
  let min = Number.parseInt((time - hour * 3600) / 60); // 获取总分钟
  let sec = time - (hour * 3600) - (min * 60); // 减去总 分 后剩余的分秒数
  if (!hour) { // 小时为0时
    return f_m_dispose(min, sec);
  } else { // 小时大于0的处理
    if (!min) { // 分为0时
      // 如果秒也小于10，则返回 例1:00:07
      return sec < 10 ? hour + ":" + "00" + ":0" + sec : hour + ":" + "00" + ":" + sec;
    } else { // 有分钟时的处理
      return hour + ":" + f_m_dispose(min, sec); // 返回总小时加上处理好的分秒数
    }
  }
}

function setDb(num) {
  //补零操作
  if (num < 10) {
    return '0' + num;
  } else {
    return '' + num;
  }
}
export function setTime(num) {
  //num是秒数    98876秒  有多少天： xx天xx时xx分xx秒
  var sec = setDb(num % 60); //06 秒
  var min = setDb(Math.floor(num / 60) % 60); //Math.floor(num / 60) % 60     分
  var hour = setDb(Math.floor(num / 60 / 60) % 24); //时
  var day = setDb(Math.floor(num / 60 / 60 / 24)); //天数
  // var mon = setDb()

  return min + ':' + sec
}


/**时间格式化函数 
 * @param date          @new Date()一个Date对象
 * @param fmt           时间格式化时间，'yy-MM-dd'
*/
export function formatDate(date, fmt = "yy-MM-dd  ss:mm") {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};
