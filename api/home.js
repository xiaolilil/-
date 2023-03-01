import { request } from '../utils/request.js'

const APIS = {
  CLOUDSEARCH: '/cloudsearch',
  HOT_SEARCH: '/search/hot/detail',
  SEARCH_SUGGEST: '/search/suggest',
  SONG_DETAIL: '/song/detail',
  SWIPER: '/banner',
  PERSONALIZED: '/personalized',
  PRIVATE: '/personalized/privatecontent',
  NEWSONG: '/personalized/newsong'
}

/**
 * @description: 具体搜索
 * @param {*} keywords 关键词
 * @param {*} type 搜索类型
 * 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单,
 * 1002: 用户, 1004: MV, 1006: 歌词, 
 * 1009: 电台, 1014: 视频, 1018:综合, 2000:声音
 * @return {*}
 */
export function cloudSearchHttp(keywords, type = 1, limit = 15) {
  return request({
    url: `${APIS.CLOUDSEARCH}?keywords=${keywords}&type=${type}&limit=${limit}`
  })
}

/**
 * @description: 热搜列表
 * @return {*}
 */
export function hotSearchDetailHttp() {
  return request({
    url: `${APIS.HOT_SEARCH}`
  })
}


/**
 * @description: 搜索建议
 * @param {*} keywords 关键词
 * @param {*} type 如果传 'mobile' 则返回移动端数据
 * @return {*}
 */
export function searchSuggestHttp(keywords, type = '') {
  return request({
    url: `${APIS.SEARCH_SUGGEST}?keywords=${keywords}&type=${type}`
  })
}


/**
 * @description: 获取歌曲详细数据
 * @param {*} id  歌曲的id
 * @return {*}
 */
export function getSongDetailsHttp(id) {
  return request({
    url: `${APIS.SONG_DETAIL}?ids=${id}`
  })
}

/**
 * @description: 获取轮播图数据
 * @return {*}
 */
export function getSwiperHttp() {
  return request({
    url: `${APIS.SWIPER}`
  })
}

/**
 * @description: 获取推荐歌单数据
 * @return {*}
 */
export function getPersonalizedHttp() {
  return request({
    url: `${APIS.PERSONALIZED}`
  })
}

/**
 * @description: 获取独家放送
 * @return {*}
 */
export function getPrivateDataHttp() {
  return request({
    url: `${APIS.PRIVATE}`
  })
}


/**
 * @description: 获取最新音乐
 * @return {*}
 */
export function getNewMusicDataHttp() {
  return request({
    url: `${APIS.NEWSONG}`
  })
}