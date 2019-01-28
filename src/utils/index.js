import serverUrl from '../config/url'
let utils = {}

utils.fileSaveAs = (url, params) => {
  let paramsStr = ''
  for (let key in params) {
    if (typeof params[key] === 'object') {
      // 对象类型，需要判断是否有id，并拼接成对应的参数格式
      if (params[key].id) {
        paramsStr = paramsStr + `&${key}.id=${params[key].id}`
      }
    } else {
      paramsStr = paramsStr + `&${key}=${params[key]}`
    }
  }

  if (paramsStr.length > 0) {
    paramsStr = `?${paramsStr.substring(1)}`
  }

  let a = document.createElement('a')
  a.href = `${serverUrl}${url}${paramsStr}`
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export default utils
