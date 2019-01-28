<template>
  <el-dialog :visible.sync="currentShowFlag" append-to-body fullscreen :close-on-click-modal="false" :close-on-press-escape="false" @open="handleDialogOpen" @closed="handleDialogClosed">
    <div slot="title" class="detail-dialog__header">{{$t('system_department.detailDialog')}}</div>
    <div>
      <simple-form ref="form" v-model="formModel" label-width="80px" :form-field="formField" :grid="{xs: 12, sm: 12, md: 8}" :view-flag="viewFlag"></simple-form>
    </div>
    <div slot="footer">
      <el-button @click="handleDialogClose">{{viewFlag ? $t('operation.close') : $t('operation.cancel')}}</el-button>
      <el-button type="primary" @click="handleDataSubmit" v-if="!viewFlag">{{$t('operation.submit')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
const BASEURL = {
  item: '/api/sys/office',
  office: '/api/sys/office/list'
}
export default {
  name: 'dept-management_detail',
  data () {
    return {
      formModel: { parent: {}, delFlag: 0 },

      companyList: [],
      companyLoadingFlag: false
    }
  },
  inject: ['handleDataSearch'],
  computed: {
    currentShowFlag: {
      get () { return this.showFlag },
      set (val) { this.$emit('update:showFlag', val) }
    },

    delFlag () { return this.$getDictList('del_flag') },

    formField () {
      return [
        {
          prop: 'parent',
          label: this.$t('system_department.companyName'),
          type: 'SearchableInput',
          component: {
            remoteMethod: this.getCompanyList,
            loading: this.companyLoadingFlag,
            optionList: this.companyList,
            valueKey: 'id'
          },
          event: {
            focus: () => {
              this.getCompanyList()
            }
          },
          rules: {
            type: 'object',
            trigger: 'change',
            message: this.$t('validate.notSelect'),
            required: true,
            fields: {
              id: { type: 'string', message: this.$t('validate.notSelect'), required: true }
            }
          }
        },
        {
          prop: 'code',
          label: this.$t('system_department.code'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'name',
          label: this.$t('system_department.name'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'delFlag',
          label: this.$t('system_department.status'),
          type: 'RadioGroup',
          component: { optionList: this.delFlag }
        },
        {
          prop: 'remarks',
          label: this.$t('system_department.remarks'),
          type: 'Input',
          component: { type: 'textarea' },
          col: { xs: 24, sm: 24, md: 24 }
        }
      ]
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

    getCompanyList (name) {
      this.companyLoadingFlag = true
      this.$axios.post(BASEURL.office, { type: 1, category: 'sys_office_category_2', pageSize: 20, name: name })
        .then(resp => {
          let respData = resp.data
          this.companyList = respData.list.map(item => { return { key: item.id, value: item, label: item.name } })
        })
        .finally(() => { this.companyLoadingFlag = false })
    },

    handleDataSubmit () {
      this.$refs.form.$refs.simpleForm.validate(status => {
        if (status) {
          let loadingFlag = this.$loading({ target: this.$el.querySelector('.el-dialog') })

          let submitModel = this.$_.cloneDeep(this.formModel)
          /** 手动设置为部门类型 */
          submitModel.type = 2
          submitModel.category = 'sys_dept_category_1'
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
      if (!this.detailData.id) { return }
      let loadingFlag = this.$loading({ target: this.$el.querySelector('.el-dialog') })

      this.$axios
        .get(`${BASEURL.item}/${this.detailData.id}`)
        .then(resp => {
          let respData = resp.data
          this.initialSelectOptionList(respData.parent)
          this.formModel = respData
        })
        .finally(() => {
          loadingFlag.close()
        })
    },

    initialSelectOptionList (company) {
      this.companyList = [{ key: company.id, value: company, label: company.name }]
    },

    handleDialogClosed () {
      this.$refs.form.resetFields()
      this.formModel = { parent: {}, delFlag: 0 }
    }
  }
}
</script>
