<style lang="less" scoped>
  .mainView {
    width: 100%;
    height: 100%;
    .sidebar {
      position: fixed;
      height: 100%;
      overflow: auto;
      transition: width 0.3s;
      border-right: solid 1px #e6e6e6;
      z-index: 120;
    }
    .toolbar {
      position: fixed;
      padding-left: 200px;
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
      transition: padding 0.3s;
      z-index: 100;
      .icon-expand {
        padding: 10px;
        cursor: pointer;
        transition: all 0.3s;
        &.expanded {
          transform: rotateZ(90deg);
          transition: all 0.3s;
        }
      }
      .tools {
        position: absolute;
        right: 200px;
        width: 200px;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .system__title {
        padding-left: 20px;
        font-size: 14px;
      }
      .user__wrapper {
        position: absolute;
        height: 100%;
        width: 200px;
        // background: red;
        padding: 10px;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .viewFramework {
      position: absolute;
      top: 40px;
      right: 0;
      bottom: 0;
      transition: left 0.3s;
      .singlePageView {
        position: relative;
        background: #fff;
        width: 100%;
        height: 100%;
        z-index: 60;
        padding-top: 0;
        &.viewPadding {
          padding-top: 40px;
        }
        .pageContainer {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 10px;
        }
      }
    }
  }
</style>

<template>
  <div class="mainView">
    <div :style="{paddingLeft: isCollapse?'64px':'200px'}" class="toolbar">
      <i :class="{expanded: !isCollapse}" @click="handleSidebarCollapse" class="iconfont icon-expand"></i>

      <div>
        <span class="system__title">管理系统</span>
      </div>

      <!-- <div class="tools"> -->
      <!-- <language></language> -->
      <!-- </div> -->
      <div class="user__wrapper">
        <div class="user__avator"></div>
        <el-dropdown trigger="click" size="medium" @command="handleCommand">
          <span class="el-dropdown-link" style="cursor: pointer; color: #2d8cf0;">
            {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">{{$t('operation.logout')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="sidebar">
      <sidebar :is-collapse="isCollapse" />
    </div>
    <div :style="{left: isCollapse?'64px':'200px'}" class="viewFramework">
      <page-tag-controller v-if="hasPageTagController && $route.name !== 'home'" :opened-page-list="openedPageList"></page-tag-controller>
      <div :class="{viewPadding: hasPageTagController && $route.name !== 'home'}" class="singlePageView">
        <div class="pageContainer">
          <keep-alive :include="cachedPageNameList">
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'main-view',
  data () {
    return {
      isCollapse: true,
      // 隐藏页面标签栏
      hasPageTagController: true
    }
  },
  methods: {
    handleSidebarCollapse () {
      this.isCollapse = !this.isCollapse
    },

    handleCommand (command) {
      this.$store.commit('systemLogout')
      if (command === 'logout') { this.$router.replace({ name: 'login' }) }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.app.userInfo
    },
    openedPageList () {
      return this.$store.state.app.openedPageList
    },
    cachedPageNameList () {
      // 如果隐藏页面标签栏，则不需要缓存历史打开的目录
      if (!this.hasPageTagController) return []
      return ['home'].concat(this.$store.state.app.openedPageList.map(item => {
        return item.name
      }))
    }
  }
}
</script>
