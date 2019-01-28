<style lang="less" scoped>
  .el-dropdown {
    cursor: pointer;
  }
</style>
<template>
  <el-dropdown size="small" trigger="click" @command="handleChangeLang">
    <span class="el-dropdown-link">
      {{title}}<i class="el-icon-caret-bottom"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="localeItem in localeList" :key="localeItem.key" :command="localeItem.key">{{localeItem.value}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  name: 'language',
  data () {
    return {
      currentLang: 'zh',
      langList: { zh: '语言', en: 'Lang' },
      localeList: [{ key: 'zh', value: '中文简体' }, { key: 'en', value: 'English' }]
    }
  },
  computed: {
    title () {
      return this.langList[this.currentLang]
    }
  },
  methods: {
    handleChangeLang (name) {
      this.$i18n.locale = name
      this.currentLang = name
    }
  }
}
</script>
