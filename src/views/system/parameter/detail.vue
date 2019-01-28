<template>
  <el-dialog :visible.sync="currentShowFlag" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @open="handleDialogOpen" @closed="handleDialogClosed">
    <div slot="title" class="detail-dialog__header">{{$t('system_parameter.detailDialog')}}</div>
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
  name: 'setting-management_detail',
  data () {
    return {
      formModel: { delFlag: 0 }
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
          prop: 'description',
          label: this.$t('system_parameter.description'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'label',
          label: this.$t('system_parameter.label'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'delFlag',
          label: this.$t('system_parameter.delFlag'),
          type: 'RadioGroup',
          component: { optionList: this.delFlag }
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
          submitModel.type = 'sys_param'
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
      this.formModel = { delFlag: 0 }
    }
  }
}
</script>
