<template>
  <el-dialog :visible.sync="currentShowFlag" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @open="handleDialogOpen" @closed="handleDialogClosed">
    <div slot="title" class="detail-dialog__header">{{$t('system_dict.detailDialog')}}</div>
    <div>
      <simple-form ref="form" v-model="formModel" label-width="80px" :form-field="formField" :grid="{ span: 24 }" :view-flag="viewFlag"></simple-form>
    </div>
    <div slot="footer">
      <el-button @click="handleDialogClose">{{viewFlag ? $t('operation.close') : $t('operation.cancel')}}</el-button>
      <el-button type="primary" @click="handleDataSubmit" v-if="!viewFlag">{{$t('operation.submit')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
const BASEURL = {
  item: '/api/sys/dict'
}
export default {
  name: 'dictionary-management_detail',
  data () {
    return {
      formModel: {},

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

    dictList () {
      let result = []
      let sysDict = this.$store.state.app.sysDict

      for (const key in sysDict) {
        if (sysDict.hasOwnProperty(key)) {
          result.push({ key: key, label: key, value: key })
        }
      }
      return result
    },
    delFlag () { return this.$getDictList('del_flag') },

    formField () {
      return [
        {
          prop: 'label',
          label: this.$t('system_dict.label'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'value',
          label: this.$t('system_dict.value'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'type',
          label: this.$t('system_dict.type'),
          type: 'Select',
          component: { optionList: this.dictList, allowCreate: true, filterable: true }
        },
        {
          prop: 'description',
          label: this.$t('system_dict.description'),
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

    handleDataSubmit () {
      this.$refs.form.$refs.simpleForm.validate(status => {
        if (status) {
          let loadingFlag = this.$loading({ target: this.$el.querySelector('.el-dialog') })

          let submitModel = this.$_.cloneDeep(this.formModel)
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
          this.formModel = respData
        })
        .finally(() => {
          loadingFlag.close()
        })
    },

    handleDialogClosed () {
      this.$refs.form.resetFields()
      this.formModel = {}
    }
  }
}
</script>
