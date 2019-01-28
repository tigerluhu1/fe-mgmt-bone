<template>
  <el-dialog :visible.sync="currentShowFlag" append-to-body fullscreen :close-on-click-modal="false" :close-on-press-escape="false" @open="handleDialogOpen" @closed="handleDialogClosed">
    <div slot="title" class="detail-dialog__header">{{$t('system_role.detailDialog')}}</div>
    <div>
      <simple-form ref="form" v-model="formModel" label-width="80px" :form-field="formField" :grid="{xs: 12, sm: 12, md: 8}" :view-flag="viewFlag"></simple-form>
      <div class="table__con">
        <el-tabs value="first">
          <el-tab-pane :label="$t('system_role.tabTitle')" name="first" :style="{height: containerHeight, overflow: 'auto'}">
            <el-tree ref="permissionTree" node-key="id" :data="menuTreeData" :props="{ children: 'children', label: 'title' }" show-checkbox></el-tree>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="handleDialogClose">{{viewFlag ? $t('operation.close') : $t('operation.cancel')}}</el-button>
      <el-button type="primary" @click="handleDataSubmit" v-if="!viewFlag">{{$t('operation.submit')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Axios from 'axios'
const BASEURL = {
  item: '/api/sys/role',
  // 菜单树形结构
  menu: '/api/sys/menu/tree'
}
export default {
  name: 'sys_role_detail',
  data () {
    return {
      formModel: { delFlag: 0 },
      menuTreeData: [],
      containerHeight: '0px',
      checkedKeys: []
    }
  },
  inject: ['handleDataSearch'],
  computed: {
    currentShowFlag: {
      get () { return this.showFlag },
      set (val) { this.$emit('update:showFlag', val) }
    },

    delFlag () { return this.$getDictList('del_flag') },
    dataScope () { return this.$getDictList('sys_data_scope') },

    formField () {
      return [
        {
          prop: 'name',
          label: this.$t('system_role.name'),
          type: 'Input',
          rules: { trigger: 'blur', message: this.$t('validate.notBlank'), required: true }
        },
        {
          prop: 'dataScope',
          label: this.$t('system_role.dataScope'),
          type: 'Select',
          component: { optionList: this.dataScope },
          rules: { trigger: 'change', message: this.$t('validate.notSelect'), required: true }
        },
        {
          prop: 'delFlag',
          label: this.$t('system_role.status'),
          type: 'RadioGroup',
          component: { optionList: this.delFlag }
        },
        {
          prop: 'remarks',
          label: this.$t('system_role.remarks'),
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

          let checkedKeys = this.$refs['permissionTree'].getCheckedKeys()
          let halfCheckedKeys = this.$refs['permissionTree'].getHalfCheckedKeys()
          let permissionArr = checkedKeys.concat(halfCheckedKeys, ['1'])
          submitModel.sysMenuEOIdList = permissionArr

          if (this.detailData.id) {
            this.$axios
              .put(BASEURL.item, submitModel)
              .then(resp => {
                // this.currentShowFlag = false
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
                // this.currentShowFlag = false
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
        let loadingFlag = this.$loading({ target: this.$el.querySelector('.el-dialog') })
        this.$axios
          .get(BASEURL.menu)
          .then(resp => {
            let respData = resp.data
            this.menuTreeData = respData.children
          })
          .finally(() => {
            loadingFlag.close()
          })

        return
      }

      let requestList = [this.$axios.get(BASEURL.menu), this.$axios.get(`${BASEURL.item}/${this.detailData.id}`)]
      let loadingFlag = this.$loading({ target: this.$el.querySelector('.el-dialog') })
      Axios
        .all(requestList)
        .then(Axios.spread((menuResp, resp) => {
          let respData = resp.data
          this.formModel = respData

          let menuRespData = menuResp.data
          this.menuTreeData = menuRespData.children

          this.checkedKeys.splice(0)
          this.menuTreeData.forEach(menuItem => {
            this.getCheckedKeys(menuItem)
          })

          this.$refs['permissionTree'].setCheckedKeys(this.checkedKeys)
        }))
        .finally(() => {
          loadingFlag.close()
        })
    },

    getCheckedKeys (menuItem) {
      if (this.formModel.sysMenuEOIdList.indexOf(menuItem.id) >= 0) {
        if (menuItem.children && menuItem.children.length > 0) {

        } else {
          this.checkedKeys.push(menuItem.id)
        }
      }

      if (menuItem.children && menuItem.children.length > 0) {
        menuItem.children.forEach((item) => {
          this.getCheckedKeys(item)
        })
      }
    },

    calTableHeight () {
      let mainHeight = this.$el.querySelector('.el-dialog__body').offsetHeight - 20
      let formHeight = this.$el.querySelector('.el-form').offsetHeight
      // dialog内容总高度 - 表单高度 - tabbar高度
      this.containerHeight = mainHeight - formHeight - 55 + 'px'
    },

    handleDialogClosed () {
      this.$refs.form.resetFields()
      this.menuTreeData.splice(0)
      this.$refs['permissionTree'].setCheckedKeys([])
      this.formModel = { delFlag: 0 }
    }
  }
}
</script>
