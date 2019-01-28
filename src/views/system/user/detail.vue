<template>
  <el-dialog :visible.sync="currentShowFlag" append-to-body fullscreen :close-on-click-modal="false" :close-on-press-escape="false" @open="handleDialogOpen" @closed="handleDialogClosed">
    <div slot="title" class="detail-dialog__header">{{$t('system_user.detailDialog')}}</div>
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
  update: '/api/user/manager/update',
  get: '/api/user/manager/get',
  save: '/api/user/manager/save',

  office: '/api/sys/office/list',
  role: '/api/sys/role'
}
export default {
  name: 'user-management_detail',
  data () {
    return {
      formModel: { company: {}, dept: {}, roleIdList: [], status: 0 },

      companyList: [],
      companyLoadingFlag: false,

      deptList: [],
      deptLoadingFlag: false,

      roleList: []
    }
  },
  inject: ['handleDataSearch'],
  computed: {
    currentShowFlag: {
      get () { return this.showFlag },
      set (val) { this.$emit('update:showFlag', val) }
    },

    status () { return this.$getDictList('del_flag') },

    formField () {
      return [
        {
          prop: 'company',
          label: this.$t('system_user.companyName'),
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
          prop: 'dept',
          label: this.$t('system_user.deptName'),
          type: 'SearchableInput',
          component: {
            clearable: true,
            remoteMethod: this.getDeptList,
            loading: this.deptLoadingFlag,
            optionList: this.deptList,
            valueKey: 'id'
          },
          event: {
            focus: () => {
              this.getDeptList()
            },
            clear: () => {
              delete this.formModel.dept
            }
          }
        },
        {
          prop: 'account',
          label: this.$t('system_user.account'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'password',
          label: this.$t('system_user.password'),
          type: 'Input',
          component: { placeholder: this.$t('tip.defaultPassword') },
          hidden: this.viewFlag
        },
        {
          prop: 'name',
          label: this.$t('system_user.name'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'roleIdList',
          label: this.$t('system_user.roleIdList'),
          type: 'Select',
          component: {
            optionList: this.roleList,
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
          prop: 'mobile',
          label: this.$t('system_user.mobile'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'email',
          label: this.$t('system_user.email'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'status',
          label: this.$t('system_user.status'),
          type: 'RadioGroup',
          component: { optionList: this.status },
          rules: { trigger: 'change', message: this.$t('validate.notSelect'), required: true }
        },
        {
          prop: 'remark',
          label: this.$t('system_user.remark'),
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

    getDeptList (name) {
      this.deptLoadingFlag = true
      this.$axios.post(BASEURL.office, { type: 2, category: 'sys_dept_category_1', pageSize: 20, name: name })
        .then(resp => {
          let respData = resp.data
          this.deptList = respData.list.map(item => { return { key: item.id, value: item, label: item.name } })
        })
        .finally(() => { this.deptLoadingFlag = false })
    },

    getRoleList () {
      this.$axios.get(BASEURL.role)
        .then(resp => {
          let respData = resp.data
          this.roleList = respData.list.map(item => { return { value: item.id, label: item.name } })
        })
    },

    handleDataSubmit () {
      this.$refs.form.$refs.simpleForm.validate(status => {
        if (status) {
          let loadingFlag = this.$loading({ target: this.$el.querySelector('.el-dialog') })

          let submitModel = this.$_.cloneDeep(this.formModel)
          if (!this.detailData.userId && !submitModel.password) submitModel.password = '123456'

          this.$axios
            .post(this.detailData.userId ? BASEURL.update : BASEURL.save, submitModel)
            .then(resp => {
              this.currentShowFlag = false
              this.$message({ type: 'success', message: this.$t('tip.saveSuccess') })
              this.handleDataSearch()
            })
            .finally(() => {
              loadingFlag.close()
            })
        }
      })
    },

    handleDialogOpen () {
      if (!this.detailData.userId) {
        this.getRoleList()
        return
      }
      let loadingFlag = this.$loading({ target: this.$el.querySelector('.el-dialog') })

      this.$axios
        .post(BASEURL.get, { userId: this.detailData.userId })
        .then(resp => {
          let respData = resp.data
          this.initialSelectOptionList(respData.company, respData.dept)
          delete respData.password
          this.formModel = respData
        })
        .finally(() => {
          loadingFlag.close()
        })
    },

    initialSelectOptionList (company, dept) {
      this.companyList = [{ key: company.id, value: company, label: company.name }]
      this.deptList = dept ? [{ key: dept.id, value: dept, label: dept.name }] : []
      this.getRoleList()
    },

    handleDialogClosed () {
      this.$refs.form.resetFields()
      this.formModel = { company: {}, dept: {}, roleIdList: [], status: 0 }
    }
  }
}
</script>
