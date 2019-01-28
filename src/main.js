import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router/index'
import i18n from './i18n/index'
import axios from './axios/index'
import dictionary from './dictionary/index'
import authconfig from './permission/authconfig'
import permission from './permission/index'
import utils from './utils/index'

// ElementUI 组件库导入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入自定义组件库
import SalmonUI from '@/components/index'

// 导入样式文件
import 'normalize.css/normalize.css'
import '@/styles/index.less'

import _ from 'lodash'
import moment from 'moment'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
  size: 'mini'
  // zIndex: 3000
})
Vue.use(SalmonUI)

Vue.use(dictionary)

Vue.use(permission, store)

Vue.prototype.$permission = authconfig

// 设置全局 ajax 请求
Vue.prototype.$axios = axios

/** lodash/moment 全局设置 */
Vue.prototype.$_ = _
Vue.prototype.$moment = moment

Vue.prototype.$utils = utils

Vue.config.productionTip = false

// 添加关闭事件-移除accessToken，关闭打开页面的tab
// window.addEventListener('beforeunload', evt => {
//   console.log(localStorage.getItem('accessToken'))
// }, false)

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
