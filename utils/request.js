// const baseURL = 'http://localhost:3000'
const baseURL = 'https://lianghj.top:3000'

export function request2(config) {
  const http = axios.create({
    baseURL,
    timeOut: 50000
  });

  // 
  http.interceptors.request.use(data => {
    const token = localStorage.getItem('Token')
    if (token) {
      data.headers.Authorization = token
    }
    return data;
  }, err => {
    return err
  });
  http.interceptors.response.use(
    response => {
      const res = response.data
      if (res.meta.status === 400) {
        alert('tokenguoqi ')
        location.href = '../pages/login.html'
      }
      return response;
    }, error => {
      console.log('error', error)
      throw error;
      return error;
    });
  return http(config);
}

export function request(config) {
  // 创建axios实例
  const http = axios.create({
    baseURL: baseURL, // api 的 base_url
    timeout: 10000 // 请求超时时间
  })

  // request拦截器
  http.interceptors.request.use(
    config => {
      const token = localStorage.getItem('Token')
      if (token) {
        config.headers.Authorization = token  // 让每个请求携带自定义token 请根据实际情况自行修改
      }
      return config
    },
    error => {
      // Do something with request error
      console.log(error) // for debug
      Promise.reject(error)
    }
  )

  // response 拦截器
  http.interceptors.response.use(
    response => {
      /**
       * code为非20000是抛错 可结合自己业务进行修改
       */
      const res = response.data
      // console.log('res', res)
      // console.log('res.meta.code', res.meta.code)
      if (response.status !== 200) {

        // Message({
        //   message: res.msg,
        //   type: 'error',
        //   duration: 5 * 1000
        // })

        // 302:非法的token;  301:Token 过期了; 305 菜单过期;
        if (res.code === 302 || res.code === 301 || res.code === 305) {

          // MessageBox.confirm(
          //   '你已被登出，可以取消继续留在该页面，或者重新登录',
          //   '确定登出',
          //   {
          //     confirmButtonText: '重新登录',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          //   }
          // ).then(() => {
          //   store.dispatch('FedLogOut').then(() => {
          //     location.reload() // 为了重新实例化vue-router对象 避免bug
          //   })
          // })
        }
        // return res
        return Promise.reject('error')
      } else {
        return response
      }
    },
    error => {
      console.log('err' + error) // for debug
      // Message({
      //   message: error.message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      return Promise.reject(error.response.data)
    }

  )
  return http(config);
}





