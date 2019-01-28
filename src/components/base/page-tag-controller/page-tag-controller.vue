<style lang="less" scoped>
  .pagetag__wrapper {
    position: absolute;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    background: #f0f0f0;
    padding-right: 40px;
    overflow: hidden;
    z-index: 80;

    .pagetag--opened {
      position: relative;
      white-space: nowrap;
      overflow: visible;
      .el-tag {
        cursor: pointer;
        margin-left: 5px;
        &:last-child {
          margin-right: 5px;
        }
      }
    }

    .pagetag__operation {
      position: absolute;
      height: 100%;
      right: 0;
      width: 40px;
      background: #fff;
      box-shadow: 0 0 5px 5px rgba(100, 100, 100, 0.1);
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
</style>

<template>
  <div class="pagetag__wrapper" ref="pagetagContainer">
    <div class="pagetag--opened" ref="pagetagBody" @DOMMouseScroll="handleScroll" @mousewheel="handleScroll" :style="{marginLeft: marginLeft + 'px'}">
      <el-tag closable size="medium" v-for="(openedPageItem, index) in openedPageList" :key="index" :type="openedPageItem.name === $route.name ? '' : 'info'" color="#FFF" @close="handlePageClose(openedPageItem, index)" @click.native="handlePageClick(openedPageItem)">{{ $t(openedPageItem.meta.title) }}</el-tag>
    </div>
    <div class="pagetag__operation">
      <el-dropdown size="small" trigger="click">
        <span class="el-dropdown-link">
          <i class="iconfont icon-close"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>关闭所有</el-dropdown-item>
          <el-dropdown-item>关闭其他</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: 'page-tag-controller',
  data () {
    return {
      marginLeft: 0
    }
  },
  props: {
    openedPageList: { type: Array, default: () => [] }
  },
  methods: {
    handlePageClose (openedPageItem, index) {
      // 关闭的标签为当前的路由，则跳转到前一标签的路由页面，如果无前一个标签则跳转到后一标签
      if (openedPageItem.name === this.$route.name) {
        if (index - 1 > -1) {
          this.$router.push({ name: this.openedPageList[index - 1].name })
        } else {
          if (this.openedPageList[index + 1]) {
            this.$router.push({ name: this.openedPageList[index + 1].name })
          } else {
            this.$router.push({ name: 'home' })
          }
        }
      }
      this.openedPageList.splice(index, 1)
    },

    handlePageClick (openedPageItem) {
      this.$router.push({ name: openedPageItem.name })
    },

    handleScroll (event) {
      let eventType = event.type
      let left = 0
      let scrollDelta = 0

      // 可视区长度
      let pagetagContainerWidth = this.$refs.pagetagContainer.offsetWidth - 40
      // 页面标签总长度
      let pagetagBodyWidth = this.$refs.pagetagBody.offsetWidth

      if (eventType === 'mousewheel') {
        scrollDelta = event.wheelDelta
      }

      if (scrollDelta > 0) {
        // 鼠标滚轮向下滑动，即右移
        left = Math.min(0, this.marginLeft + scrollDelta)
      } else {
        // 标签总长度超出显示区域长度
        if (pagetagBodyWidth - pagetagContainerWidth > 0) {
          if (pagetagContainerWidth - pagetagBodyWidth > this.marginLeft) {
            left = this.marginLeft
          } else {
            // 滚动至最右侧标签
            left = Math.max(this.marginLeft + scrollDelta, pagetagContainerWidth - pagetagBodyWidth)
          }
        } else {
          left = 0
        }
      }
      this.marginLeft = left
    }
  },
  filters: {
    i18n: function (title) {
      return this.$t(title)
    }
  }
}
</script>
