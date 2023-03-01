/**
 * @description: 设置缓存
 * @param {*} key 变量
 * @param {*} val  需要缓存的值
 * @param {*} isLocal 是否是存在 localStorage 默认值为true
 */
export function setCache(key, val, isLocal = true) {
  if (isLocal) {
    localStorage.setItem(key, JSON.stringify(val))
  } else {
    sessionStorage.setItem(key, JSON.stringify(val))
  }
}

/**
 * @description: 获取缓存数据
 * @param {*} key 变量
 * @param {*} isLocal 是否是存在 localStorage 默认值为true
 * @return {*} data key 对应的 val 值
 */
export function getCache(key, isLocal = true) {
  let data = null;
  if (isLocal) {
    data = localStorage.getItem(key)
  } else {
    data = sessionStorage.getItem(key)
  }

  return JSON.parse(data)
}

/**
 * @description: 移除缓存数据
 * @param {*} key 变量
 * @param {*} isLocal 是否是存在 localStorage 默认值为true
 */
export function removeCache(key, isLocal = true) {
  if (isLocal) {
    localStorage.removeItem(key)
  } else {
    sessionStorage.removeItem(key)
  }
}