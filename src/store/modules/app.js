// const BASEURL = {
//   dictionary: '/api/system/dict/list'
// }

function getPermisson (rootMenu, sysPermission) {
  if (rootMenu.children && rootMenu.children.length > 0) {
    rootMenu.children.forEach(item => {
      if (item.isShow === 0) {
        sysPermission.push(item)
      }
      getPermisson(item, sysPermission)
    })
  }
}

let app = {
  state: {
    appToken: '',
    sysMenu: [],
    sysPermission: [],
    sysDict: [],
    userInfo: {},
    // 用于存储已经打开的页面
    openedPageList: [],

    // 用户是否有显示首页的权限
    isShowDashboard: false
  },
  mutations: {
    // 请求凭证 token
    updateAccessToken (state, accessToken) {
      state.appToken = accessToken
      localStorage.setItem('appToken', accessToken)
    },
    /** 菜单数据初始化 */
    initializeMenu (state, sysMenu) {
      state.sysMenu = sysMenu

      let homeRoute = sysMenu.children.find(item => item.name === 'home')
      if (homeRoute) {
        state.isShowDashboard = true
      } else state.isShowDashboard = false

      let sysPermission = []
      getPermisson(sysMenu, sysPermission)
      console.log(sysPermission)

      state.sysPermission = sysPermission
    },
    /** 字典数据初始化 */
    initializeDictionary (state, sysDict) {
      state.sysDict = sysDict
    },
    /** 设置用户信息 */
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },

    setShowDashboardFlag (state, flag) {
      state.isShowDashboard = flag
    },

    addPageTag (state, tagInfo) {
      let tagExisted = state.openedPageList.find(pageInfo => {
        return pageInfo.name === tagInfo.name
      })
      if (!tagExisted) state.openedPageList.push(tagInfo)
    },

    systemLogout (state) {
      state.openedPageList.splice(0)
    }
  },
  actions: {
    // updateDictionary ({
    //   commit
    // }, vue) {
    //   vue.$axios
    //     .post(BASEURL.dictionary, {})
    //     .then(resp => {
    //       let respData = resp.data
    //       commit('initializeDictionary', respData.list)
    //     })
    // }

    openNewPage ({
      commit
    }, to) {
      /** TODO:Permission 可以根据权限进行控制 */
      if (to.name !== 'home' && to.name !== 'login' && to.name) {
        commit('addPageTag', to)
      }
    }
  },
  getters: {

  }
}

export default app
