import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import zhCN from './locale/zh-CN'
import en from './locale/en'

Vue.use(VueI18n)

let messages = {
  en: Object.assign(en, enLocale),
  zh: Object.assign(zhCN, zhLocale)
}

const i18n = new VueI18n({
  locale: 'zh',
  messages
})

export default i18n
