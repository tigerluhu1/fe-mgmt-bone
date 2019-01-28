<style lang="less" scoped>
  .page__wrapper {
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div class="page__wrapper">
    <simple-table :table-column="tableColumn" :table-data="tableData" :table-page-info="tablePageInfo" :table-data-count="tableDataTotalCount" @page-info-change="handlePageInfoChange">
      <template slot="searchSection">
        <simple-form v-model="searchModel" :form-field="searchFormField">
          <template slot="tableOperation">
            <el-button type="primary" @click="handleAddClick">{{$t('operation.create')}}</el-button>
          </template>
        </simple-form>
      </template>
      <template slot-scope="scope" slot="delFlag">
        {{$getDictLabel({type: 'del_flag', value: scope.row.delFlag})}}
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button circle icon="el-icon-search" :title="$t('operation.view')" @click="handleViewClick(scope.row)"></el-button>
        <el-button circle icon="el-icon-edit" :title="$t('operation.edit')" @click="handleEditClick(scope.row)"></el-button>
        <el-button @click="deleteRecord(scope.row)" circle icon="el-icon-delete" :title="$t('operation.delete')"></el-button>
      </template>
    </simple-table>
    <detail-dialog :show-flag.sync="isShowDetailDialog" :detail-data="rowData" :view-flag="isViewFlag"></detail-dialog>
  </div>
</template>
<script>
/** 混入分页信息及数据总数信息 */
import pageMixins from '@/components/base/simple-table/page-mixins'
import detailDialog from './detail'
const BASEURL = {
  list: '/api/sys/dict'
}
export default {
  name: 'setting-management',
  mixins: [pageMixins],
  components: { detailDialog },
  data () {
    return {
      searchModel: {},
      /** 表格数据 */
      tableData: [],
      rowData: {},
      /** 是否显示详情页 dialog */
      isShowDetailDialog: false,
      /** 是否为查看数据 */
      isViewFlag: false
    }
  },
  computed: {
    searchFormField () {
      return [
        { slotName: 'tableOperation', col: { span: 24, style: { textAlign: 'right' } }, labelWidth: '0' }
      ]
    },
    tableColumn () {
      return [
        { label: this.$t('system_parameter.description'), prop: 'description', width: 200 },
        { label: this.$t('system_parameter.label'), prop: 'label', minWidth: 150 },
        { label: this.$t('system_parameter.delFlag'), prop: 'delFlag', width: 80, slotName: 'delFlag' },
        { label: this.$t('field.operation'), slotName: 'operation', width: 100, fixed: 'right' }
      ]
    }
  },
  /**
   * 注入到子组件
   */
  provide () {
    return { handleDataSearch: this.handleDataSearch }
  },
  methods: {
    handleDataSearch () {
      // 部门类型数据
      let params = Object.assign({ type: 'sys_param' }, this.tablePageInfo, this.searchModel)

      let loadingFlag = this.$loading({ fullscreen: false, target: this.$el, text: this.$t('tip.systemLoading') })
      this.$axios
        .get(BASEURL.list, { params })
        .then(resp => {
          let respData = resp.data
          this.tableData = respData.list
          this.tablePageInfo = { pageNo: respData.pageNo, pageSize: respData.pageSize }
          this.tableDataTotalCount = respData.count
        })
        .finally(() => {
          loadingFlag.close()
        })
    },
    handleAddClick () {
      this.rowData = {}
      this.isViewFlag = false
      this.isShowDetailDialog = true
    },
    handleViewClick (row) {
      this.rowData = this.$_.cloneDeep(row)
      this.isViewFlag = true
      this.isShowDetailDialog = true
    },
    handleEditClick (row) {
      this.rowData = this.$_.cloneDeep(row)
      this.isViewFlag = false
      this.isShowDetailDialog = true
    },
    deleteRecord (row) {
      this.$msgbox({
        title: this.$t('tip.warning'),
        message: this.$t('tip.confirmDelete'),
        type: 'warning',
        showCancelButton: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$axios
              .delete(`${BASEURL.list}/${row.id}`)
              .then(resp => {
                this.$message({ type: 'success', message: this.$t('tip.deleteSuccess') })
                done()
              })
              .finally(() => {
                instance.confirmButtonLoading = false
              })
          } else done()
        }
      })
        .then(() => {
          this.handleDataSearch()
        })
    }
  },
  mounted () {
    this.handleDataSearch()
  }
}
</script>
