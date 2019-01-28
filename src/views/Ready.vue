<template>
  <keep-alive>
    <component :is="currentView"></component>
  </keep-alive>
</template>
<script>
import MainView from '@/views/MainView'
import { mapMutations } from 'vuex'

const BASEURL = {
  initData: '/api/initData'
}
export default {
  name: 'ready',
  data () {
    return {
      currentView: null
    }
  },
  created () {
    this.initializeSystem()
  },
  methods: {
    ...mapMutations(['initializeMenu', 'initializeDictionary', 'setUserInfo']),
    /**
         * 初始化系统数据
         * 1. 字典
         * 2. 菜单(权限)
         * 3. 登录用户信息
         */
    initializeSystem () {
      let loadingFlag = this.$loading({ fullscreen: true, text: this.$t('tip.systemLoading') })
      this.$axios
        .get(BASEURL.initData)
        .then(resp => {
          let respData = resp.data
          this.initializeMenu(respData.userMenu)
          this.initializeDictionary(respData.sysDict)
          this.setUserInfo(respData.userInfo)
          this.currentView = MainView
        })
        .finally(() => {
          loadingFlag.close()
        })
    }
  }
}
</script>
