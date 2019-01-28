<template>
  <el-dialog :visible.sync="currentShowFlag" append-to-body fullscreen :close-on-click-modal="false" :close-on-press-escape="false" @open="handleDialogOpen" @closed="handleDialogClosed">
    <div slot="title" class="detail-dialog__header">{{$t('system_office.account.detailDialog')}}</div>
    <div>
      <simple-form ref="form" v-model="formModel" label-width="120px" :form-field="formField" :grid="{xs: 12, sm: 12, md: 8}" :view-flag="viewFlag"></simple-form>
    </div>
    <div slot="footer">
      <el-button @click="handleDialogClose">{{viewFlag ? $t('operation.close') : $t('operation.cancel')}}</el-button>
      <el-button type="primary" @click="handleDataSubmit" v-if="!viewFlag">{{$t('operation.submit')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      formModel: { abroadFlag: '0', vatFlag: '0', defaultFlag: '0' }
    }
  },
  inject: ['addNewAccount'],
  computed: {
    currentShowFlag: {
      get () { return this.showFlag },
      set (val) { this.$emit('update:showFlag', val) }
    },

    abroadFlag () { return this.$getDictList('yes_no') },
    vatFlag () { return this.$getDictList('yes_no') },

    formField () {
      return [
        // { prop: 'defaultFlag', type: 'Input', label: this.$t('system_office.account.defaultFlag') },
        {
          prop: 'bank',
          type: 'Input',
          label: this.$t('system_office.account.bank'),
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'bankAccount',
          type: 'Input',
          label: this.$t('system_office.account.bankAccount'),
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        { prop: 'bankAddress', type: 'Input', label: this.$t('system_office.account.bankAddress') },
        {
          prop: 'taxCode',
          type: 'Input',
          label: this.$t('system_office.account.taxCode'),
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        { prop: 'swiftCode', type: 'Input', label: this.$t('system_office.account.swiftCode') },
        { prop: 'iban', type: 'Input', label: this.$t('system_office.account.iban') },
        {
          prop: 'invoiceName',
          type: 'Input',
          label: this.$t('system_office.account.invoiceName'),
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'address',
          type: 'Input',
          label: this.$t('system_office.account.address'),
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'phone',
          type: 'Input',
          label: this.$t('system_office.account.phone'),
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },

        {
          prop: 'abroadFlag',
          label: this.$t('system_office.account.abroadFlag'),
          type: 'RadioGroup',
          component: { optionList: this.abroadFlag }
        },
        {
          prop: 'vatFlag',
          label: this.$t('system_office.account.vatFlag'),
          type: 'RadioGroup',
          component: { optionList: this.vatFlag }
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
          this.addNewAccount(this.$_.cloneDeep(this.formModel))
          this.currentShowFlag = false
        }
      })
    },

    handleDialogOpen () {
      this.formModel = { abroadFlag: '0', vatFlag: '0', defaultFlag: '0' }
    },

    handleDialogClosed () {
      this.$refs.form.resetFields()
      this.formModel = { abroadFlag: '0', vatFlag: '0', defaultFlag: '0' }
    }
  }
}
</script>
