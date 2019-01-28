<style lang="less" scoped>
  .page__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row;
    .menu__tree {
      height: 100%;
      width: 250px;
      display: flex;
      flex-direction: column;
      border: 1px solid #ebeef5;
      border-radius: 2px;
      &--title {
        padding: 0 10px;
        height: 32px;
        background: #ebeef5;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        text-align: right;

        .addroot--icon {
          cursor: pointer;
        }
      }
      &--content {
        overflow: auto;

        .treenode--current {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          padding-right: 10px;

          .icon--margin {
            margin-left: 10px;
          }
        }
      }
    }
    .menu__operation {
      height: 100%;
      width: calc(100% - 250px);
    }
  }
</style>

<template>
  <div class="page__wrapper">
    <div class="menu__tree">
      <div class="menu__tree--title">
        <!-- <i class="el-icon-plus addroot--icon" title="add"></i> -->
      </div>
      <div class="menu__tree--content">
        <el-tree :data="treeData" ref="menuTree" node-key="id" :props="treeProps" @node-click="handleNodeClick" highlight-current :expand-on-click-node="false" :default-expanded-keys="['root_id']">
          <span slot-scope="{node, data}" class="treenode--current">
            <span>{{node.label}}</span>
            <span>
              <i class="iconfont icon-tree_add_child" style="font-size: 12px" v-if="data.isShow === 1" :title="$t('operation.addChild')" @click="handleAddChildClick(data)"></i>
              <i class="el-icon-edit icon--margin" :title="$t('operation.edit')" @click="handleEditClick(data)" v-if="data.parentId !== '0'"></i>
              <i class="el-icon-delete icon--margin" :title="$t('operation.delete')" @click="handleNodeDelete(data)" v-if="data.parentId !== '0'"></i>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="menu__operation">
      <simple-form v-model="formModel" :form-field="formField" :grid="{ xs: 12, sm: 8, md: 8 }" view-flag>
        <template slot="tableOperation">
          <el-button @click="handleDataSearch">{{$t('operation.search')}}</el-button>
          <el-button type="primary" @click="handleAddClick">{{$t('operation.create')}}</el-button>
        </template>
      </simple-form>
    </div>
    <detail-dialog :show-flag.sync="isShowDetailDialog" :detail-data="rowData" :view-flag="isViewFlag"></detail-dialog>
  </div>
</template>
<script>
import detailDialog from './detail'
const BASEURL = {
  tree: '/api/sys/menu/tree',
  list: '/api/sys/menu/list',
  item: '/api/sys/menu'
}
// http://47.100.77.28/api/sys/menu/permissionConfig 导出文件
export default {
  name: 'menu-management',
  components: { detailDialog },
  data () {
    return {
      formModel: {},
      rowData: {},
      /** 表格数据 */
      tableData: [],
      treeData: [],

      treeProps: {
        label: 'title',
        isLeaf: (data, node) => {
          return data.type === 'button'
        }
      },

      /** 是否显示详情页 dialog */
      isShowDetailDialog: false,
      /** 是否为查看数据 */
      isViewFlag: false
    }
  },
  computed: {
    formField () {
      return [
        { prop: 'title', label: this.$t('system_menu.title'), type: 'Input', component: { clearable: true } },
        { prop: 'name', label: this.$t('system_menu.name'), type: 'Input', component: { clearable: true } },
        { prop: 'permission', label: this.$t('system_menu.permission'), type: 'Input', component: { clearable: true } },
        { prop: 'sort', label: this.$t('system_menu.sort'), type: 'Input', component: { clearable: true } }
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
      let loadingFlag = this.$loading({ fullscreen: false, target: this.$el, text: this.$t('tip.systemLoading') })
      this.$axios
        .get(BASEURL.tree)
        .then(resp => {
          let respData = resp.data
          this.treeData = [respData]
        })
        .finally(() => {
          loadingFlag.close()
        })
    },

    handleNodeClick (data, node) {
      this.formModel = data
    },

    handleAddChildClick (nodeData) {
      this.rowData = { parent: this.$_.cloneDeep(nodeData) }
      this.isViewFlag = false
      this.isShowDetailDialog = true
    },
    handleAddClick () {
      this.rowData = {}
      this.isViewFlag = false
      this.isShowDetailDialog = true
    },
    handleEditClick (row) {
      this.rowData = this.$_.cloneDeep(row)
      this.isViewFlag = false
      this.isShowDetailDialog = true
    },
    handleNodeDelete (nodeData) {
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
              .delete(`${BASEURL.item}/${nodeData.id}`)
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
