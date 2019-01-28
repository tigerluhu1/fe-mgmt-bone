<style lang="less" scoped>
</style>
<template>
  <div class="searchable-input-wrapper">
    <el-dropdown style="width: 100%;" trigger="click" :visible="resultVisible">
      <el-input v-model="tempValue" placeholder="" v-click-outside="clickOutsideHandler" @focus="inputFoucusHandler" @compositionstart.native="inputCompStartHandler" @compositionupdate.native="inputCompStartHandler" @compositionend.native="inputCompStartHandler" @blur="inputBlurHandler" @input.native="inputChangeHandler" />
      <el-dropdown-menu style="max-height: 200px; overflow: auto;" slot="dropdown">
        <div v-if="resultVisible">
          <div v-if="loadingFlag">
            <div style="text-align: center; color: #bbbec4;">加载中...</div>
          </div>
          <div v-else>
            <template v-if="resultListData.length > 0">
              <el-dropdown-item v-for="listItem in resultListData" @click.native.stop="selectHandler(listItem)" :key="listItem.id">{{listItem.name}}</el-dropdown-item>
            </template>
            <template v-else>
              <div style="text-align: center; color: #bbbec4;">无匹配数据</div>
            </template>
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import ClickOutside from '../../util/click-outside'
export default {
  name: 'searchable-input',
  data () {
    return {
      resultVisible: false,
      inputOnCompositionFlag: false,
      loadingFlag: false,

      resultListData: []
    }
  },
  directives: { ClickOutside },
  props: {
    value: { type: Object, required: true, default: () => { return {} } },
    searchKey: { type: String, default: 'name' },
    url: { type: String, required: true },
    params: { type: Object }
  },

  computed: {
    tempValue: {
      get () { return this.value[this.searchKey] },
      set (val) {
        if (typeof (val) === 'string') {
          this.$emit('input', { [this.searchKey]: val })
        } else if (typeof (val) === 'object') {
          this.$emit('input', val)
          this.$emit('change', val)
        }
      }
    }
  },
  methods: {
    inputFoucusHandler () {
      this.resultVisible = true
      this.loadingFlag = true

      this.$axios
        .post(this.url, Object.assign({}, { [this.searchKey]: this.tempValue, pageSize: 20 }, this.params))
        .then(resp => {
          let respData = resp.data
          this.resultListData = respData.list
        })
        .finally(() => {
          this.loadingFlag = false
        })
    },

    clickOutsideHandler () {
      this.resultVisible = false
    },

    inputBlurHandler () {
    },

    inputChangeHandler (evt) {
      if (!this.inputOnCompositionFlag) {
        this.getDataByKey(evt.target.value)
      }
    },

    /** 输入法备选词事件处理 */
    inputCompStartHandler (evt) {
      if (evt.type === 'compositionend') {
        this.inputOnCompositionFlag = false
        this.inputChangeHandler(evt)
      } else {
        this.inputOnCompositionFlag = true
      }
    },

    /** 选中 */
    selectHandler (item) {
      this.tempValue = item
      this.resultVisible = false
    },

    getDataByKey: debounce(function (key) {
      this.resultVisible = true
      this.loadingFlag = true
      this.$axios
        .post(this.url, Object.assign({}, { [this.searchKey]: key, page: { pageSize: 20 } }, this.params))
        .then(resp => {
          this.resultListData = resp.list
        })
        .finally(() => {
          this.loadingFlag = false
        })
    }, 250)
  }
}
</script>
