<template>
  <el-input :value="tempValue" :maxlength="maxlength" ref="numberInput" @blur="handleInputBlur" @input="handleInputChange" :disabled="disabled" />
</template>
<script>
/**
 * 基于 ElementUI 数字输入框
 * 可限制最大最小输入值/小数点位数
 */
export default {
  name: 'number-input',
  data () {
    return {
      tempValue: 0
    }
  },
  props: {
    value: { type: [String, Number], default: 0 },
    max: { type: Number, default: Infinity },
    min: { type: Number, default: -Infinity },
    decimal: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    maxlength: { type: Number, default: Infinity }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.tempValue = val
        // this.$emit('input', Number(val))
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleInputBlur () {
      this.$refs.numberInput.setCurrentValue(Number(this.tempValue))
    },

    handleInputChange (newVal) {
      // 长度大于1且输入的最后一位为小数点
      if (newVal.length - 1 === newVal.indexOf('.') && newVal.length > 1) {
        return
      }

      if (newVal.length === 0) return

      // 第一位为负号时
      if (newVal.indexOf('-') === (newVal.length - 1) && newVal.indexOf('-') === 0) {
        return
      }

      let parsedNumVal = Number(newVal)

      if (isNaN(parsedNumVal)) {
        this.$refs.numberInput.setCurrentValue(this.tempValue)
      } else {
        newVal = newVal.trim()
        if (newVal.indexOf('.') > 0) {
          let intNumVal = newVal.substr(0, newVal.indexOf('.'))
          let decimalNumVal = `0.${newVal.substr(newVal.indexOf('.') + 1)}`

          // 判断小数位并对小数位进行赋值
          if (decimalNumVal.substr(2).length > this.decimal) {
            decimalNumVal = Number(decimalNumVal).toFixed(this.decimal) + ''
          }

          // 负数并且整数位数值为0
          if (intNumVal.indexOf('-') === 0 && Number(intNumVal) === 0) {
            newVal = `-${Number(intNumVal)}.${decimalNumVal.substr(2)}`
          } else {
            newVal = `${Number(intNumVal)}.${decimalNumVal.substr(2)}`
          }
        } else {
          // 负数且整数位绝对值大于0 or 正数
          if ((newVal.indexOf('-') === 0 && Math.abs(parsedNumVal) > 0) || newVal.indexOf('-') < 0) {
            newVal = parsedNumVal + ''
          } else {
            newVal = '-0'
          }
        }
        this.setTempValue(newVal)
      }
    },

    setTempValue (newNumVal) {
      newNumVal = newNumVal >= this.max ? this.max : newNumVal
      newNumVal = newNumVal <= this.min ? this.min : newNumVal
      // 连续多次输入值超过最大或最小值
      if (newNumVal === this.tempValue) {
        this.$refs.numberInput.setCurrentValue(this.tempValue)
        return
      }

      this.tempValue = newNumVal
      this.$emit('input', newNumVal)
    }
  }
}
</script>
