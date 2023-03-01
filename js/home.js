import {
  getSwiperHttp,
  getPersonalizedHttp,
  getPrivateDataHttp,
  getNewMusicDataHttp
} from '../api/home.js'


window.onload = () => {
  getSwiperData()
  getPersonalized()
  getPrivateData()
  getNewSongData()
}


/**
 * @description: 获取轮播图数据
 * @return {*}
 */
const getSwiperData = () => {
  const swiperWin = document.querySelector('#swiper').contentWindow
  getSwiperHttp().then(res => {
    if (res.data.code == 200) {
      swiperWin.renderSwiper(res.data.banners)
    }
  }).catch(err => {
    console.log('err', err)
  })
}

/**
 * @description: 获取推荐歌单的数据
 * @return {*}
 */
const getPersonalized = () => {
  const playlistWin = document.querySelector('#playList').contentWindow
  getPersonalizedHttp().then(res => {
    if (res.data.code == 200) {
      const playlist = res.data.result.splice(0, 10)
      playlistWin.renderPlayList(playlist)

      setTimeout(() => {
        playlistWin.renderThen()
      }, 500);
    }
  }).catch(err => {
    console.log('err', err)
  })
}

/**
 * @description: 获取独家放送数据
 * @return {*}
 */
const getPrivateData = () => {
  const privateWin = document.querySelector('#private').contentWindow
  getPrivateDataHttp().then(res => {
    if (res.data.code == 200) {
      privateWin.renderPrivate(res.data.result)
    }
  }).catch(err => {
    console.log('err', err)
  })
}

/**
 * @description: 获取最新音乐
 * @return {*}
 */
const getNewSongData = () => {
  const newMusicWin = document.querySelector('#newMusic').contentWindow
  getNewMusicDataHttp().then(res => {
    if (res.data.code == 200) {
      newMusicWin.renderNewMusic(res.data.result)
    }
  }).catch(err => {
    console.log('err', err)
  })
}