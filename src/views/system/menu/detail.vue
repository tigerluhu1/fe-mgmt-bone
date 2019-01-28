<template>
  <el-dialog :visible.sync="currentShowFlag" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @open="handleDialogOpen" @closed="handleDialogClosed">
    <div slot="title" class="detail-dialog__header">{{$t('system_menu.detailDialog')}}</div>
    <div>
      <simple-form ref="form" v-model="formModel" :form-field="formField" label-width="90px" :grid="{span: 24}" :view-flag="viewFlag"></simple-form>
    </div>
    <div slot="footer">
      <el-button @click="handleDialogClose">{{viewFlag ? $t('operation.close') : $t('operation.cancel')}}</el-button>
      <el-button type="primary" @click="handleDataSubmit" v-if="!viewFlag">{{$t('operation.submit')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
const BASEURL = {
  item: '/api/sys/menu'
}
export default {
  name: 'menu-management_detail',
  data () {
    return {
      formModel: { parent: {}, isShow: 1 }
    }
  },
  inject: ['handleDataSearch'],
  computed: {
    currentShowFlag: {
      get () { return this.showFlag },
      set (val) { this.$emit('update:showFlag', val) }
    },

    menuType () { return this.$getDictList('menu_type') },

    formField () {
      return [
        {
          prop: 'parent.title',
          label: this.$t('system_menu.parentTitle'),
          type: 'Input',
          viewFlag: true
        },
        {
          prop: 'title',
          label: this.$t('system_menu.title'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'name',
          label: this.$t('system_menu.name'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'permission',
          label: this.$t('system_menu.permission'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: Number(this.formModel.isShow) === 0 }
        },
        {
          prop: 'icon',
          label: this.$t('system_menu.icon'),
          type: 'Input'
          // rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: Number(this.formModel.isShow) === 1 }
        },
        {
          prop: 'isShow',
          label: this.$t('system_menu.isShow'),
          type: 'RadioGroup',
          component: { optionList: this.menuType }
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

          if (this.detailData.id) {
            this.$axios
              .put(BASEURL.item, this.formModel)
              .then(resp => {
                this.currentShowFlag = false
                this.handleDataSearch()
              })
              .finally(() => {
                loadingFlag.close()
              })
          } else {
            this.$axios
              .post(BASEURL.item, this.formModel)
              .then(resp => {
                this.currentShowFlag = false
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
      if (!this.detailData.id) {
        Object.assign(this.formModel, this.detailData)
        return
      }
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
      this.formModel = { parent: {}, isShow: 1 }
      this.$refs.form.resetFields()
    }
  }
}
</script>
