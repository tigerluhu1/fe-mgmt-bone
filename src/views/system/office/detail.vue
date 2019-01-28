<style lang="less" scoped>
  .table__con {
    position: relative;
    .table--add {
      position: absolute;
      right: 0;
      top: 2px;
      z-index: 999;
    }
  }
</style>

<template>
  <el-dialog :visible.sync="currentShowFlag" append-to-body fullscreen :close-on-click-modal="false" :close-on-press-escape="false" @open="handleDialogOpen" @closed="handleDialogClosed">
    <div slot="title" class="detail-dialog__header">{{$t('system_office.detailDialog')}}</div>
    <div>
      <simple-form ref="form" v-model="formModel" :form-field="formField" :grid="{xs: 12, sm: 12, md: 8}" :view-flag="viewFlag"></simple-form>
      <div class="table__con">
        <el-button v-if="!viewFlag" type="primary" class="table--add" @click="handleAddClick">{{$t('operation.create')}}</el-button>
        <el-tabs value="first">
          <el-tab-pane :label="$t('system_office.account.tabTitle')" name="first" :style="{height: tableConHeight}">
            <simple-table :table-column="tableColumn" :table-data="tableData" :pageable="false">
              <template slot-scope="scope" slot="defaultFlag">
                {{$getDictLabel({type: 'yes_no', value: scope.row.defaultFlag})}}
              </template>
              <template slot-scope="scope" slot="abroadFlag">
                {{$getDictLabel({type: 'yes_no', value: scope.row.abroadFlag})}}
              </template>
              <template slot-scope="scope" slot="vatFlag">
                {{$getDictLabel({type: 'yes_no', value: scope.row.vatFlag})}}
              </template>
              <template slot="operation" slot-scope="scope">
                <el-button circle @click="handleSetDefault(scope.row)" icon="el-icon-star-off" :title="$t('operation.setDefaultAccount')"></el-button>
                <el-button circle @click="handleDeleteClick(scope.row)" icon="el-icon-delete" :title="$t('operation.delete')"></el-button>
              </template>
            </simple-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="handleDialogClose">{{viewFlag ? $t('operation.close') : $t('operation.cancel')}}</el-button>
      <el-button type="primary" @click="handleDataSubmit" v-if="!viewFlag">{{$t('operation.submit')}}</el-button>
    </div>
    <account-dialog :show-flag.sync="isShowAccountDetailDialog" :detail-data="accountRowData" :view-flag="false"></account-dialog>
  </el-dialog>
</template>
<script>
import accountDialog from './accountDetail'

const BASEURL = {
  // get: '/api/system/office/get',
  // save: '/api/system/office/save',
  // update: '/api/system/office/update'

  item: '/api/sys/office'
}
export default {
  name: 'main_office_detail',
  data () {
    return {
      formModel: { delFlag: 0, category: [] },
      tableData: [],
      tableConHeight: '0px',

      isShowAccountDetailDialog: false,
      accountRowData: {}
    }
  },
  components: { accountDialog },
  inject: ['handleDataSearch'],
  provide () {
    return { addNewAccount: this.addNewAccount }
  },
  computed: {
    currentShowFlag: {
      get () { return this.showFlag },
      set (val) { this.$emit('update:showFlag', val) }
    },

    delFlag () { return this.$getDictList('del_flag') },
    category () { return this.$getDictList('sys_office_category') },

    formField () {
      return [
        {
          prop: 'code',
          label: this.$t('system_office.code'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'name',
          label: this.$t('system_office.name'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'delFlag',
          label: this.$t('system_office.delFlag'),
          type: 'RadioGroup',
          component: { optionList: this.delFlag },
          rules: { trigger: 'change', message: this.$t('validate.notSelect'), required: true }
        },
        {
          prop: 'phone',
          label: this.$t('system_office.phone'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'address',
          label: this.$t('system_office.address'),
          col: { xs: 12, sm: 12, md: 16 },
          type: 'Input'
        },
        {
          prop: 'category',
          label: this.$t('system_office.category'),
          type: 'Select',
          col: { xs: 12, sm: 12, md: 16 },
          component: {
            optionList: this.category,
            multiple: true,
            valueKey: 'id'
          },
          rules: {
            type: 'array',
            trigger: 'change',
            message: this.$t('validate.notSelect'),
            required: true
          }
        },
        {
          prop: 'accountPeriod',
          label: this.$t('system_office.accountPeriod'),
          type: 'NumberInput',
          component: { max: 300, min: 0, decimal: 0 }
        },
        {
          prop: 'remarks',
          label: this.$t('field.remarks'),
          type: 'Input',
          component: { type: 'textarea' },
          col: { xs: 24, sm: 24, md: 24 }
        }
      ]
    },

    tableColumn () {
      let baseTableColumn = [
        { prop: 'defaultFlag', label: this.$t('system_office.account.defaultFlag'), width: 80, slotName: 'defaultFlag' },
        { prop: 'bank', label: this.$t('system_office.account.bank'), width: 150 },
        { prop: 'bankAccount', label: this.$t('system_office.account.bankAccount'), width: 150 },
        { prop: 'bankAddress', label: this.$t('system_office.account.bankAddress'), width: 250 },
        { prop: 'taxCode', label: this.$t('system_office.account.taxCode'), width: 150 },
        { prop: 'swiftCode', label: this.$t('system_office.account.swiftCode'), width: 100 },
        { prop: 'iban', label: this.$t('system_office.account.iban'), width: 80 },
        { prop: 'invoiceName', label: this.$t('system_office.account.invoiceName'), width: 150 },
        { prop: 'address', label: this.$t('system_office.account.address'), width: 250 },
        { prop: 'phone', label: this.$t('system_office.account.phone'), width: 120 },
        { prop: 'abroadFlag', label: this.$t('system_office.account.abroadFlag'), width: 120, slotName: 'abroadFlag' },
        { prop: 'vatFlag', label: this.$t('system_office.account.vatFlag'), width: 120, slotName: 'vatFlag' }
      ]
      if (this.viewFlag) return baseTableColumn
      else {
        return baseTableColumn.concat([{ label: this.$t('field.operation'), slotName: 'operation', width: 80, fixed: 'right' }])
      }
    }
  },
  props: {
    showFlag: { type: Boolean, default: false },
    viewFlag: { type: Boolean },
    detailData: { type: Object }
  },
  methods: {
    handleDialogClose () {
      this.currentShowFlag = false
    },

    handleDataSubmit () {
      this.$refs.form.$refs.simpleForm.validate(status => {
        if (status) {
          let loadingFlag = this.$loading({ target: this.$el.querySelector('.el-dialog') })

          let submitModel = this.$_.cloneDeep(this.formModel)
          submitModel.category = submitModel.category.join()
          submitModel.type = 1
          submitModel.accountList = this.tableData

          if (this.detailData.id) {
            this.$axios
              .put(BASEURL.item, submitModel)
              .then(resp => {
                this.currentShowFlag = false
                this.$message({ type: 'success', message: this.$t('tip.saveSuccess') })
                this.handleDataSearch()
              })
              .finally(() => {
                loadingFlag.close()
              })
          } else {
            this.$axios
              .post(BASEURL.item, submitModel)
              .then(resp => {
                this.currentShowFlag = false
                this.$message({ type: 'success', message: this.$t('tip.saveSuccess') })
                this.handleDataSearch()
              })
              .finally(() => {
                loadingFlag.close()
              })
          }
        }
      })
    },

    handleDialogOpen () {
      this.$nextTick(() => {
        this.calTableHeight()
      })
      if (!this.detailData.id) {
        return
      }
      let loadingFlag = this.$loading({ target: this.$el.querySelector('.el-dialog') })

      this.$axios
        .get(`${BASEURL.item}/${this.detailData.id}`)
        .then(resp => {
          let respData = resp.data
          respData.category = respData.category.split(',')
          this.tableData = respData.accountList
          this.formModel = respData
        })
        .finally(() => {
          loadingFlag.close()
        })
    },

    // 计算table高度
    calTableHeight () {
      let mainHeight = this.$el.querySelector('.el-dialog__body').offsetHeight - 20
      let formHeight = this.$el.querySelector('.el-form').offsetHeight
      // dialog内容总高度 - 表单高度 - tabbar高度
      this.tableConHeight = mainHeight - formHeight - 55 + 'px'
    },

    // 表格操作-新增记录
    handleAddClick () {
      this.accountRowData = {}
      this.isShowAccountDetailDialog = true
    },

    // 表格操作-设置默认账户
    handleSetDefault (row) {
      this.tableData.forEach(item => {
        item.defaultFlag = '0'
      })
      this.tableData.splice(this.tableData.indexOf(row), 1, Object.assign(row, { defaultFlag: '1' }))
    },

    // 表格操作-删除记录
    handleDeleteClick (row) {
      this.tableData.splice(this.tableData.indexOf(row), 1)
    },

    // 新增一条账户记录
    addNewAccount (accountModel) {
      this.tableData.push(accountModel)
    },

    handleDialogClosed () {
      this.$refs.form.resetFields()
      this.tableData.splice(0)
      this.formModel = { delFlag: 0, category: [] }
    }
  }
}
</script>
