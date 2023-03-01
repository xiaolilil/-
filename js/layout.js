import { requestFullScreen, exitFullscreen } from '../utils/window.js'
import {
  cloudSearchHttp,
  hotSearchDetailHttp,
  searchSuggestHttp,
  getSongDetailsHttp,
} from "../api/home.js";
import { addClass, removeClass } from '../utils/setClass.js'
import { setTime, formatDate } from '../utils/utils.js'
import { loading } from '../utils/loading.js'

let isClickSearch = false; // 是否是点击搜索
let isShowTheme = false // 是否显示 主题盒子
let currTheme = 'Green'

let currMenu = 0 // 当前菜单是第几项 默认为0

// 接受子页面传递来的数据
window.addEventListener('message', function (e) {
  const { data } = e
  console.log('=-=-=-=-data', data)
  // 判断传递来的数据是什么 做相应的操作
  switch (data) {
    case 'toHome':
      location.href = '../pages/home.html'
      break;
    case 'isEnlarge':
      // 全屏
      requestFullScreen()
      break;
    case 'isNarrow':
      // 退户全屏
      exitFullscreen()
      break;
    case 'back':
      history.back()
      break;
    case 'forward':
      history.forward()
      break;
    case 'toLogin':
      location.href = '../pages/login.html'
      break;
    case 'show-theme':
      // 显示 / 隐藏来回切换
      isShowTheme ? isShowTheme = false : isShowTheme = true
      fadeTheme(isShowTheme)
      break;
    case 'home':
      location.href = `../pages/home.html`
      break;
    case 'mv':
      location.href = `../pages/mv.html`
      break;
    case 'singer':
      // location.href = `../pages/singer.html`
      break;
    case 'songsList':
      // location.href = `../pages/songsList.html`
      break;
    case 'rank':
      // location.href = `../pages/rank.html`
      break;
    case 'newMusic':
      // location.href = `../pages/newMusic.html`
      break;
    case 'hot-search':
      // 显示热搜列表 发送网络请求 获取热搜
      $('.search-box').fadeIn()
      $('.search-content').css('height', '500px')
      $('.search-content').css('overflow-y', 'auto')
      getHotSearch()
      break;
    case 'search-fadeOut':
      // 隐藏热搜列表
      $('.search-box').fadeOut()
      break;
    case 'isFocus':
      // 处于点击聚焦的时候 重新给 是点击搜索 赋值为 false
      isClickSearch = false
      break;
    case 'loading-fadeIn':
      $('.l-wrapper').fadeIn()
      break;
    case 'loading-fadeOut':
      $('.l-wrapper').fadeOut()
      break;
    default:
      break;
  }

  // 如果传递的有值 keywords 存在 并且没有点击搜索
  if (data.keywords != '' && data.keywords != undefined && !isClickSearch) {
    $('.search-box').fadeIn()
    getKeywordsData(data.keywords)
    $('.search-content').css('height', 'auto')
  }

  // 点击搜索 搜索歌曲
  if (data.clickSearch != undefined) {

    $('.main-container').css('padding', '0')
    isClickSearch = true
    $('.search-box').fadeOut()
    // .then 异步执行的
    cloudSearchHttp(data.clickSearch).then(res => {
      let songs = null
      // 嵌套解构
      // const { data: { code, result: { songs } } } = res
      songs = res.data.result.songs

      if (res.data.code == 200) {
        // 默认渲染单曲的数据
        $('.main-container').html(renderSearchSongsContent(data.clickSearch, songs))
        const lis = $(".item-menu");
        if (currTheme == 'Dark') {
          addClass(lis[0], `click${currTheme}Item`)
        }
        // 渲染搜索页面后 判断表格是否存在 
        if ($('.page-search-content') && $('.songsTable')) {
          searchSongsTheme(currTheme, lis)
          let imgs = $('tr img')
          loading(imgs)
        }

        clickMenu(lis, data.clickSearch, songs)
      }
    }).catch(err => {
      console.log('err', err)
    })
  }

})

$('body').click(() => {
  $('.search-box').fadeOut()
})

let singers = null
let playLists = null
let albums = null
let mvs = null
const clickMenu = (menu, keywords, data) => {
  for (let i = 0; i < menu.length; i++) {
    menu[i].addEventListener('click', () => {
      if (currTheme == 'Dark') {
        removeClass('clickGreenItem')
      }
      switch (i) {
        case 0:
          $('.main-container').html(renderSearchSongsContent(keywords, data))
          const menus = $(".item-menu");
          searchSongsTheme(currTheme, menus)
          menuEvent(menus, keywords, data)
          addClass(menus[0], `click${currTheme}Item`)
          currMenu = 0
          let imgs = $('tr img')
          loading(imgs)
          break;
        case 1:
          cloudSearchHttp(keywords, 100).then(res => {
            if (res.data.code == 200) {
              singers = res.data.result.artists
              $('.main-container').html(renderSearchSingerContent(keywords, singers))
              const menus2 = $(".item-menu");
              searchSingersTheme(currTheme, menus2)
              menuEvent(menus2, keywords, data)
              addClass(menus2[1], `click${currTheme}Item`)
              currMenu = 1
              let imgs = $('.singers img')
              loading(imgs)
            }
          }).catch(err => {
            console.log('err', err)
          })
          break;
        case 2:
          cloudSearchHttp(keywords, 1000).then(res => {
            if (res.data.code == 200) {
              playLists = res.data.result.playlists
              $('.main-container').html(renderSearchPlaylistContent(keywords, playLists))
              const menus3 = $(".item-menu");
              searchPlaylistsTheme(currTheme, menus3)
              menuEvent(menus3, keywords, data)
              addClass(menus3[2], `click${currTheme}Item`)
              currMenu = 2
              let els = $('.item-top img')
              loading(els)
            }
          }).catch(err => {
            console.log('err', err)
          })
          break;
        case 3:
          cloudSearchHttp(keywords, 10).then(res => {
            if (res.data.code == 200) {
              albums = res.data.result.albums
              $('.main-container').html(renderSearchAlbumContent(keywords, albums))
              const menus4 = $(".item-menu");
              searchAlbumsTheme(currTheme, menus4)
              menuEvent(menus4, keywords, data)
              addClass(menus4[3], `click${currTheme}Item`)
              currMenu = 3
              let els = $('.item-album img')
              loading(els)
            }
          }).catch(err => {
            console.log('err', err)
          })
          break;
        case 4:
          cloudSearchHttp(keywords, 1004, '16').then(res => {
            if (res.data.code == 200) {
              console.log('res', res)
              mvs = res.data.result.mvs
              $('.main-container').html(renderSearchMvContent(keywords, mvs))
              const menus5 = $(".item-menu");
              searchMvsTheme(currTheme, menus5)
              menuEvent(menus5, keywords, data)
              addClass(menus5[4], `click${currTheme}Item`)
              currMenu = 4
              let els = $('.item-mv-top img')
              loading(els)
            }
          }).catch(err => {
            console.log('err', err)
          })
          break;
        default:
          break;
      }
    })


  }
}

const menuEvent = (els, keywords, data) => {
  changeClass(els);
  clickMenu(els, keywords, data)
}


/**
 * @description: 显示隐藏 
 * @param {*} flag 是否显示的标识
 */
const fadeTheme = (flag) => {
  if (flag) {
    $('.theme-box').fadeIn()
    isShowTheme = true
    const headerWin = document.getElementById('header').contentWindow
    const asideWin = document.getElementById('aside').contentWindow
    const footerWin = document.getElementById('footer').contentWindow
    const playlistWin = document.querySelector('#playList')?.contentWindow
    const privateWin = document.querySelector('#private')?.contentWindow
    const newMusicWin = document.querySelector('#newMusic')?.contentWindow

    // ? 可选链   
    // if (document.querySelector('#playList')) {
    //   const playlistWin = document.querySelector('#playList')?.contentWindow
    // } else {
    //   return
    // }
    const themeBtns = $('.theme-btn button')
    for (let i = 0; i < themeBtns.length; i++) {
      themeBtns[i].onclick = () => {
        const lis = $('.item-menu')

        isShowTheme = false
        $('.theme-box').fadeOut()
        if (i == 0) {
          // 点击的是清新绿
          currTheme = 'Green'
          // 父页面传递数据给子页面
          headerWin.postMessage('green', headerWin)
          asideWin.postMessage('green', headerWin)
          footerWin.postMessage('green', headerWin)
          playlistWin?.postMessage('green', playlistWin)
          privateWin?.postMessage('green', privateWin)
          newMusicWin?.postMessage('green', newMusicWin)

          // 改变主题按钮盒子背景色
          removeClass('dark-theme')
          addClass('.theme-box', 'green-theme')

          // 改变body的背景色
          removeClass('theme-dark-body')
          addClass('body', 'theme-green-body')

          // 点击绿色的时候 判断搜索区域是否存在，存在就把 黑色类名移除 添加绿色类名
          if ($('.page-search-content')) {
            removeClass(`clickDarkItem`)
            addClass(lis[currMenu], `click${currTheme}Item`)
          }


        } else if (i == 1) {
          // 点击的是炫酷黑
          currTheme = 'Dark'
          headerWin.postMessage('dark', headerWin)
          asideWin.postMessage('dark', headerWin)
          footerWin.postMessage('dark', headerWin)

          playlistWin?.postMessage('dark', playlistWin)
          privateWin?.postMessage('dark', privateWin)
          newMusicWin?.postMessage('dark', newMusicWin)

          // 改变主题按钮盒子背景色
          removeClass('green-theme')
          addClass('.theme-box', 'dark-theme')

          // 切换body 的背景色
          removeClass('theme-green-body')
          addClass('body', 'theme-dark-body')
          // 切换主题为黑色的时候 如果搜索单曲页面存在 给第一个菜单项 移除 和添加类名的操作
          if ($('.page-search-content') && $('.songsTable')) {
            removeClass('clickGreenItem')
            removeClass('clickGreenItem')
            addClass(lis[0], `click${currTheme}Item`)
          }
          // 判断搜索区域是否存在，存在就移除绿色类名，添加黑色类名
          if ($('.page-search-content')) {
            removeClass(`click${currTheme}Item`)
            addClass(lis[currMenu], `click${currTheme}Item`)
          }
        }
        if ($('.page-search-content') && $('.songsTable')) {
          searchSongsTheme(currTheme, lis)
        }
        if ($('.page-search-content') && $('.singers')) {
          searchSingersTheme(currTheme, lis)
        }
        if ($('.page-search-content') && $('.playlists')) {
          searchPlaylistsTheme(currTheme, lis)
        }
        if ($('.page-search-content') && $('.albums')) {
          searchAlbumsTheme(currTheme, lis)
        }
        if ($('.page-search-content') && $('.mvs')) {
          searchMvsTheme(currTheme, lis)
        }
      }
    }
  } else {
    $('.theme-box').fadeOut()
    isShowTheme = false
  }
}




/**
 * @description: 渲染搜索内容 默认渲染单曲的数据
 * @param {*} keywords 关键字
 * @param {*} data 数据
 * @return {*}
 */
const renderSearchSongsContent = (keywords, data) => {
  return `
    <div class="page-search-content">
      ${searchHeadContent(keywords, data)}
      <table class="songsTable">
        <thead>
          <tr>
            <th>#</th>
            <th>操作</th>
            <th>封面</th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((item, index) => {
    return `<tr>
              <td>${index < 9 ? '0' + (index + 1) : index + 1}</td>
              <td><i class="iconfont icon-aixin"></i></td>
              <td><img class="poster"  src="${item.al.picUrl}"></td>
              <td><p>${item.name}</p></td>
              <td>${item.ar[0].name}</td>
              <td><p>${item.al.name}</p></td>
              <td>${setTime(item.dt)}</td>
            </tr>`
  }).join('')}
        </tbody>
      </table>
    </div>
  `
}



/**
 * @description: 渲染搜索单曲页面
 * @param {*} keywords 关键词
 * @param {*} data  搜索结果数据
 * @param {*} idx  当前渲染的是哪个页面
 * @return {*}
 */
const searchHeadContent = (keywords, data, idx = 0, page = '单曲') => {
  return `
    <p class="click-search-title"><span>${keywords}</span>共找到<span>${data.length}</span>个 ${page}</p>
    <ul class="search-menu">
      <li class="${idx == 0 ? 'clickGreenItem' : ''} item-menu">单曲<li>
      <li class="${idx == 1 ? 'clickGreenItem' : ''} item-menu">歌手<li>
      <li class="${idx == 2 ? 'clickGreenItem' : ''} item-menu">歌单<li>
      <li class="${idx == 3 ? 'clickGreenItem' : ''} item-menu">专辑<li>
      <li class="${idx == 4 ? 'clickGreenItem' : ''} item-menu">MV<li>
    </ul>
    `
}


/**
 * @description: 渲染搜索歌手页面
 * @param {*} keywords  关键词
 * @param {*} data  搜索结果数据
 * @return {*}
 */
const renderSearchSingerContent = (keywords, data) => {
  return `
  <div class="page-search-content">
  ${searchHeadContent(keywords, data, 1, '歌手')}
  <ul class="singers">
    ${data.map(i => {
    return `
          <li data-id="${i.id}">
            <img  class="avatar" src="${i.picUrl}">
            <div class="singer-info">
              <p>${i.name}</p>
              <p>专辑数: <span>${i.albumSize}</span></p>
              <p>MV数: <span>${i.mvSize}</span></p>
            </div>
          </li>
      `
  }).join('')}
  </ul>
  </div>
  `
}

/**
 * @description: 渲染搜索歌单页面
 * @param {*} keywords
 * @param {*} data
 * @return {*}
 */
const renderSearchPlaylistContent = (keywords, data) => {
  return `
    <div class="page-search-content">
    ${searchHeadContent(keywords, data, 2, '歌单')}

    <div class="playlists">
      ${data.map(i => {
    return `
            <div data-id="${i.id}" class="item-playlist">
              <div class="item-top" loading="lazy" >
                <img src="${i.coverImgUrl}">
                <div><i class="iconfont icon-erji"></i> <span>${i.playCount}</span></div>
                <i class="iconfont icon-24gf-play"></i>
              </div>
              <p class="playlistName">${i.name}</p>
            </div>
          `
  }).join('')
    }
    </div>
  `
}


/**
 * @description: 渲染搜索专辑页面
 * @param {*} keywords
 * @param {*} data
 * @return {*}
 */
const renderSearchAlbumContent = (keywords, data) => {
  return `
    <div class="page-search-content">
    ${searchHeadContent(keywords, data, 3, '专辑')}

    ${data.map(i => {
    return `
          <ul class="albums">
            <li data-id="${i.id}" class="item-album">
              <img src="${i.picUrl}">
              <div class="album-info">
                <p class="album-name">${i.name}</p>
                <p class="album-time">发行时间: <span>${formatDate(new Date(i.publishTime), 'yy-MM-dd')}</span></p>
              </div >
            </li >
          </ul >
    `
  }).join('')}

    </div>
  `
}


/**
 * @description: 渲染搜索MV页面
 * @param {*} keywords
 * @param {*} data
 * @return {*}
 */
const renderSearchMvContent = (keywords, data) => {
  return `
    <div class="page-search-content">
    ${searchHeadContent(keywords, data, 4, 'MV')}

    <div class="mvs">
      ${data.map(i => {
    return `
          
            <div class="item-mv" data-id="${i.id}">
              <div class="item-mv-top" >
                <img src="${i.cover}">
                <p><i class="iconfont icon-vrbofangqi"></i> <span>${i.playCount}</span></p>
                <i class="iconfont icon-24gf-play"></i>
                </div>
              <p class="name">${i.name}</p>
            </div>
          
        `
  }).join('')}
    </div>
    </div>
  `
}


/**
 * @description: 获取热搜列表 并渲染页面
 * @return {*}
 */
const getHotSearch = () => {
  hotSearchDetailHttp().then(res => {
    if (res.data.code == 200) {
      const data = res.data.data
      $('.search-list').html(
        data.map((item, index) => {
          return `
            <li class="hot-li">
              <span class="num">${index + 1}</span>
              <div class="search-info">
                <p class="songs">
                  <span>${item.searchWord}</span>
                  <span>${item.score}</span>
                  ${index == 0 ? `<img src="https://p1.music.126.net/2zQ0d1ThZCX5Jtkvks9aOQ==/109951163968000522.png">` : ''}
                </p>
                <p class="introduce">${item.content != '' ? item.content : '暂无介绍'}</p>
              </div>
            </li>
          `
        })
      )
    }
  }).catch(err => {
    console.log('err', err)
  })
}

// 动态匹配icon
const icon = {
  "icon-songs": 'icon-yonghu',
  "icon-playlists": 'icon-songlist-01',
  "icon-artists": 'icon-yishujia',
  "icon-albums": 'icon-zhuanji'
}
// 动态匹配标题
const title = {
  'songs': '单曲',
  'artists': '歌手',
  'albums': '专辑',
  'playlists': '歌单'
}

/**
 * @description: 请求获取关键词数据
 * @param {*} keywords 关键词
 * @return {*}
 */
const getKeywordsData = (keywords) => {
  searchSuggestHttp(keywords).then(res => {
    if (res.data.code == 200) {
      const data = res.data.result
      if (data.order == undefined) {
        $('.search-content').css('overflow-y', 'inherit')
        $('.search-list').html(
          `<p class="title">搜索 <span>${keywords}</span> 相关的结果</p>
            <p>暂无相关数据</p>
          `
        )
      } else {
        $('.search-list').html(
          renderSearchList(keywords, data)
        )
      }
    }
  })
    .catch(err => {
      console.log('err', err)
    })
}


/**
 * @description: 渲染关键词数据的html
 * @param {*} keywords 关键词
 * @param {*} data 数据
 * @param join('') 解决 map 循环自动附带的 逗号 ,
 * @return {*}
 */
const renderSearchList = (keywords, data) => {
  return `
    <p class="title">搜索 <span>${keywords}</span> 相关的结果</p>
    ${data.order.map(i => {
    return `
        <div class="item-list search-${i}">
          <p class="${i}-title"><i class="iconfont ${icon[`icon-${i}`]}"></i>${title[`${i}`]}</p>
          <ul>
            ${i == 'songs' ? data.songs.map(v => {
      return `
                        <li data-id="${v.id}"><span>${v.name}</span><i></i><span>${v.artists[0].name}</span></li>
                         `
    }).join('') : ''}
    ${i == "artists" ? data.artists.map(v => {
      return `
                        <li data-id="${v.id}"> <img src="${v.img1v1Url}">${v.name}</li>
                         `
    }).join('') : ''}
    ${i == "albums" ? data.albums.map(v => {
      return `
                        <li data-id="${v.id}"><span>${v.name}</span><i></i><span>${v.artist.name}</li>
                         `
    }).join('') : ''}
    ${i == "playlists" ? data.playlists.map(v => {
      return `
                        <li data-id="${v.id}">${v.name}</li>
                         `
    }).join('') : ''} 
          </ul>
        </div>
      `
  }).join('')}
  `
}


/**
 * @description: 添加事件 改变类名
 * @param {*} lis 菜单列表元素数组
 * @return {*}
 */
const changeClass = (lis) => {

  for (let i = 0; i < lis.length; i++) {
    // 改变菜单列表文字的颜色
    if (currTheme == 'Dark') {
      addClass(lis[i], 'dark-menu-text')
    } else if (currTheme == 'Green') {
      removeClass('dark-menu-text')
    }


    lis[i].onmouseenter = () => {
      addClass(lis[i], `hover${currTheme}Item`);
    };
    lis[i].onmouseleave = () => {
      removeClass(`hover${currTheme}Item`);
    };

  }
};



/**
 * @description: 改变搜索单曲页面主题
 * @param {*} theme 主题色
 * @param {*} lis 菜单列表li 数组
 * @return {*}
 */
const searchSongsTheme = (theme = 'Green', lis) => {
  changeClass(lis);
  if (theme == 'Green') {
    removeClass('click-search-title-dark')
    removeClass('table-even')
    removeClass('table-odd')
    removeClass('th-dark-bg')
    removeClass('table-dark')
  } else if (theme == 'Dark') {
    addClass('.click-search-title', 'click-search-title-dark')
    addClass('.page-search-content table tbody tr:even', 'table-even')
    addClass('.page-search-content table tbody tr:odd', 'table-odd')
    addClass('.page-search-content table thead tr ', 'th-dark-bg')
    addClass('table', 'table-dark')
  }
}

/**
 * @description: 改变搜索歌手页面主题
 * @return {*}
 */
const searchSingersTheme = (theme = 'Green', lis) => {
  changeClass(lis)
  const ps = $('.singer-info > p')
  const itemSinger = $('.singers > li')
  if (theme == 'Green') {
    removeClass('click-search-title-dark')
    for (let i = 0; i < ps.length; i++) {
      removeClass('dark-singer-text')
    }
    for (let i = 0; i < itemSinger.length; i++) {
      removeClass('dark-singer-li')
    }
  } else if (theme == 'Dark') {
    addClass(".click-search-title", "click-search-title-dark");
    for (let i = 0; i < ps.length; i++) {
      addClass(ps[i], 'dark-singer-text')
    }
    for (let i = 0; i < itemSinger.length; i++) {
      addClass(itemSinger[i], 'dark-singer-li')
    }
  }
}

/**
 * @description: 改变搜索歌单页面主题
 * @return {*}
 */
const searchPlaylistsTheme = (theme = 'Green', lis) => {
  changeClass(lis)
  const names = $('.playlistName')
  if (theme == 'Green') {
    removeClass('click-search-title-dark')
    for (let i = 0; i < names.length; i++) {
      removeClass('playlist-dark-text')
    }
  } else if (theme == 'Dark') {
    addClass(".click-search-title", "click-search-title-dark");
    for (let i = 0; i < names.length; i++) {
      addClass(names[i], 'playlist-dark-text')
    }
  }
}

/**
 * @description: 改变搜索专辑页面主题
 * @return {*}
 */
const searchAlbumsTheme = (theme = 'Green', lis) => {
  changeClass(lis)
  const ps = $('.album-info > p')
  const itemAlbum = $('.albums > li')
  if (theme == 'Green') {
    removeClass('click-search-title-dark')
    for (let i = 0; i < ps.length; i++) {
      removeClass('dark-album-text')
    }
    for (let i = 0; i < itemAlbum.length; i++) {
      removeClass('dark-album-li')
    }
  } else if (theme == 'Dark') {
    addClass(".click-search-title", "click-search-title-dark");
    for (let i = 0; i < ps.length; i++) {
      addClass(ps[i], 'dark-album-text')
    }
    for (let i = 0; i < itemAlbum.length; i++) {
      addClass(itemAlbum[i], 'dark-album-li')
    }
  }
}

/**
 * @description: 改变搜索MV页面主题
 * @return {*}
 */
const searchMvsTheme = (theme = 'Green', lis) => {
  changeClass(lis)
  const itemMv = $('.mvs .name')
  if (theme == 'Green') {
    removeClass('click-search-title-dark')
    for (let i = 0; i < itemMv.length; i++) {
      removeClass('mvs-dark-text')
    }
  } else if (theme == 'Dark') {
    addClass(".click-search-title", "click-search-title-dark");
    for (let i = 0; i < itemMv.length; i++) {
      addClass(itemMv[i], 'mvs-dark-text')
    }
  }
}
