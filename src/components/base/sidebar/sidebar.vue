<style lang="less" scoped>
  .sidebar__menu {
    height: 100%;

    .menu__home {
      vertical-align: middle;
      margin-right: 5px;
      text-align: center;
      font-size: 18px;
    }

    &:not(.el-menu--collapse) {
      width: 200px;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>

<template>
  <el-menu ref="menu" class="sidebar__menu" @open="handleOpen" @close="handleClose" :collapse="isCollapse" @select="handleMenuSelect" unique-opened>
    <!-- <div style="width: 100%; height: 40px; text-align: center;">
      <img src="../../../assets/small-logo.png" v-if="isCollapse" height="100%" alt="">
      <img src="../../../assets/large-logo.jpg" v-else height="100%" alt="">
    </div> -->
    <el-menu-item key="home" index="home">
      <i class="iconfont icon-dashboard menu__home"></i>
      <span slot="title" style="font-size: 14px;">{{$t('home')}}</span>
    </el-menu-item>
    <el-submenu v-for="firstLevel in menuList" :key="firstLevel.id" :index="firstLevel.name" :default-active="activeMenuName">
      <template slot="title">
        <i :class="`iconfont ${firstLevel.icon}`"></i>
        <span slot="title" style="font-size: 14px;">{{firstLevel.title}}</span>
      </template>

      <template v-for="secondLevel in firstLevel.children">
        <!-- <el-submenu v-if="secondLevel.children && secondLevel.children.length > 0" :key="secondLevel.id" :index="secondLevel.name">
          <span slot="title">{{secondLevel.title}}</span>
          <template v-for="lastLevel in secondLevel.children">
            <el-menu-item v-if="lastLevel.isShow === 1" :key="lastLevel.id" :index="lastLevel.name">
              <span slot="title">{{lastLevel.title}}</span>
            </el-menu-item>
          </template>
        </el-submenu> -->
        <el-menu-item :key="secondLevel.id" :index="secondLevel.name">
          <span slot="title">{{secondLevel.title}}</span>
        </el-menu-item>
      </template>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  name: 'sidebar',
  data () {
    return {
      activeMenuName: 'home'
    }
  },
  props: {
    isCollapse: { type: Boolean, default: false }
  },

  computed: {
    menuList () {
      let currentMenu = this.$store.state.app.sysMenu.children

      let homeRoute = currentMenu.find(item => item.name === 'home')
      if (homeRoute) {
        // this.$store.commit('setShowDashboardFlag', true)
        currentMenu.shift()
      }
      // } else this.$store.commit('setShowDashboardFlag', false)

      return currentMenu
    }
  },
  methods: {
    handleOpen () { },
    handleClose () { },

    handleMenuSelect (routeName) {
      this.$router.push({ name: routeName })
    }
  }
}
</script>
