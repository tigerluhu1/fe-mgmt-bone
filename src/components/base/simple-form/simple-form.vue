<style lang="less" scoped>
  .row--flexwrap {
    flex-wrap: wrap;
  }
  .form-item__content {
    border-bottom: 1px solid #dcdfe6;
    // line-height + border-width = 28px + 1px
    height: 29px;
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<template>
  <el-form ref="simpleForm" :model="value" :label-width="labelWidth">
    <el-row :gutter="6" type="flex" class="row--flexwrap">
      <template v-for="(formItem, index) in formField">
        <el-col :key="index" v-bind="formItem.col ? formItem.col : grid" v-if="!formItem.hidden">
          <el-form-item v-bind="formItem">
            <div v-if="formItem.slotName">
              <slot :name="formItem.slotName" v-bind="{form: value}" />
            </div>
            <template v-else-if="viewFlag || formItem.viewFlag">
              <div class="form-item__content" :title="getContentText(getValueByPath(value, formItem.prop), formItem)">{{getContentText(getValueByPath(value, formItem.prop), formItem)}}</div>
            </template>
            <template v-else>
              <el-input v-if="'Input' === formItem.type" style="width: 100%;" v-bind="formItem.component" v-model="value[formItem.prop]" v-on="formItem.event" />
              <el-select v-else-if="'Select' === formItem.type" style="width: 100%;" v-bind="formItem.component" v-model="value[formItem.prop]" placeholder v-on="formItem.event">
                <el-option v-for="item in formItem.component.optionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <!-- NumberInput -->
              <number-input v-else-if="'NumberInput' === formItem.type" v-bind="formItem.component" v-model="value[formItem.prop]"></number-input>
              <el-radio-group v-else-if="'RadioGroup' === formItem.type" v-model="value[formItem.prop]">
                <el-radio-button v-for="item in formItem.component.optionList" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-radio-button>
              </el-radio-group>
              <el-checkbox-group v-else-if="'CheckboxGroup' === formItem.type" v-model="value[formItem.prop]">
                <el-checkbox-button v-for="item in formItem.component.optionList" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-checkbox-button>
              </el-checkbox-group>
              <!-- SearchableInput -->
              <el-select v-else-if="'SearchableInput' === formItem.type" style="width: 100%;" prefix="el-icon-search" filterable remote v-bind="formItem.component" v-model="value[formItem.prop]" placeholder v-on="formItem.event">
                <i slot="prefix" class="el-icon-search"></i>
                <el-option v-for="item in formItem.component.optionList" :key="item.key" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <!-- Datepicker -->
              <el-date-picker v-else-if="'Datepicker' === formItem.type" style="width: 100%;" align="center" :editable="false" v-model="value[formItem.prop]" v-bind="formItem.component" v-on="formItem.event">
              </el-date-picker>
              <div v-else>无此类型控件，请您确认后进行修改！</div>
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: 'simple-form',
  data () {
    return {}
  },
  props: {
    value: { type: Object, required: true },
    /**
         * formField 组成结构
         * prop (String) --> 绑定的属性
         * label (String) --> 表单每项控件的 label
         * type (String) --> 组件的类型
         * component (Object) --> 组件的相应属性
         * slotName (String) --> 插槽的名称
         * col (Object) --> 表单中该组件的 grid 布局占位及 style 样式的定义
         */
    formField: { type: Array, required: true },

    // 表单是否为查看模式
    viewFlag: { type: Boolean, default: false },
    // 栅格布局
    grid: { type: Object, default: () => { return { xs: 12, sm: 8, md: 6 } } },
    // 标签长度
    labelWidth: { type: String, default: '80px' }
  },
  methods: {
    /** 表单重置 */
    resetFields () {
      this.$refs.simpleForm.resetFields()
    },

    // FIXME: 多级对象，目前对于多级对象的属性只有查看功能，不能编辑
    getValueByPath (obj, prop) {
      prop = prop || ''
      const paths = prop.split('.')
      let current = obj
      let result = null
      for (let i = 0, j = paths.length; i < j; i++) {
        const path = paths[i]
        if (!current) break

        if (i === j - 1) {
          result = current[path]
          break
        }
        current = current[path]
      }
      return result
    },

    /** 显示的文本值 */
    getContentText (value, formItemConfig) {
      let result = value
      let componentType = formItemConfig.type
      switch (componentType) {
        case 'RadioGroup':
        case 'Select':
          if (formItemConfig.component.multiple) {
            let resultArr = formItemConfig.component.optionList.filter(item => {
              return value.indexOf(item.value) >= 0
            })
            return resultArr.map(item => item.label).join()
          }

          let currentOption = formItemConfig.component.optionList.filter(item => {
            // eslint-disable-next-line
            return item.value == value
          })
          if (currentOption.length >= 1) {
            result = currentOption[0].label
          }
          break
        case 'SearchableInput':
          // viewProp 设置显示页面中，以对象形式显示还是显示该字段就是 string 类型
          if (typeof (formItemConfig.viewProp) === 'boolean' && formItemConfig.viewProp) return value
          result = value ? value.name : ''
          break
        default:
          break
      }

      return result
    }
  }
}
</script>
