<!--
REVIEW:
列中包含fixed列的话，slot会渲染两次
-->
<style lang="less" scoped>
  .table__pagination {
    padding-top: 10px;
    text-align: right;
  }
</style>

<template>
  <div class="table__wrapper">
    <div class="table__search">
      <slot name="searchSection" />
    </div>
    <el-table ref="table" :border="border" :show-header="showHeader" :data="tableData" :height="tableHeight" :row-class-name="rowClassName" row-key="id" style="width: 100%">
      <el-table-column v-if="hasSelection" type="selection" align="center" :reserve-selection="reserveSelection" width="50">
      </el-table-column>
      <template v-for="(columnItem, columnIndex) in tableColumn">
        <el-table-column :key="columnIndex" v-bind="columnItem" v-if="columnItem.slotName">
          <template slot-scope="scope">
            <slot :name="columnItem.slotName" v-bind="{row: scope.row, $index: scope.$index, option: columnItem}"></slot>
          </template>
        </el-table-column>
        <el-table-column :key="columnIndex" v-bind="columnItem" v-else></el-table-column>
      </template>
    </el-table>

    <el-pagination v-if="pageable" class="table__pagination" @size-change="handlePageSizeChange" @current-change="handlePageCurrentChange" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 25, 50, 100]" :total="tableDataCount"></el-pagination>
  </div>
</template>
<script>
import { addResizeListener, removeResizeListener } from '../../util/resize-event'
export default {
  name: 'simple-table',
  data () {
    return {
      tableHeight: 0
    }
  },
  props: {
    tableData: { type: Array, required: true },
    tableColumn: { type: Array, required: true },
    /** 分页信息 */
    tablePageInfo: { type: Object },
    /** 数据总数 */
    tableDataCount: { type: Number, default: 0 },
    border: { type: Boolean, default: true },
    /** 是否显示分页器 */
    pageable: { type: Boolean, default: true },
    rowClassName: { type: Function, default: () => { } },

    // 是否可勾选
    hasSelection: { type: Boolean, default: false },
    // 是否记录已勾选的记录
    reserveSelection: { type: Boolean, default: false },

    showHeader: { type: Boolean, default: true }
  },
  methods: {
    handleElementResize () {
      /**
             * parentElementHeight --> 父级节点高度
             * searchHeight --> 查询高度
             * paginationHeight --> 分页节点高度
             */
      let parentElementHeight = this.$el.parentElement.offsetHeight
      let searchHeight = this.$el.querySelector('.table__search').offsetHeight
      let paginationHeight = this.pageable ? this.$el.querySelector('.table__pagination').offsetHeight : 0

      this.$nextTick(() => {
        this.tableHeight = parentElementHeight - paginationHeight - searchHeight
      })
    },

    /**
         * REVIEW:
         * 更改 pageSize 时，可能会触发 pageNo 跟着变化
         * 比如共15条数据，从每页显示10条第2页的时候，更改为每页显示25条时，页码会变更为1
         * 此时会触发两次 page-info-change
         */
    /** pageSize 改变 */
    handlePageSizeChange (pageSize) {
      this.$emit('page-info-change', Object.assign(this.tablePageInfo, { pageSize }))
    },
    /** pageNo 改变 */
    handlePageCurrentChange (pageNo) {
      this.$emit('page-info-change', Object.assign(this.tablePageInfo, { pageNo }))
    },

    /** 获取已选的记录 */
    getSelections () {
      return this.$refs.table.selection
    },

    /** 清除已选记录 */
    clearSelection () {
      this.$refs.table.clearSelection()
    }

  },
  mounted () {
    // 进行监听视窗大小，来使 table 高度自适应
    addResizeListener(this.$el.parentElement, this.handleElementResize)
  },
  destroyed () {
    // 移除监听事件
    removeResizeListener(this.$el.parentElement, this.handleElementResize)
  }
}
</script>
