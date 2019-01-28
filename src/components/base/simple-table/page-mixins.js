let pageMixins = {
  data () {
    return {
      tablePageInfo: {
        pageNo: 1,
        pageSize: 10
      },
      tableDataTotalCount: 0
    }
  },
  methods: {
    handlePageInfoChange (pageInfo) {
      this.handleDataSearch(pageInfo)
    }
  }
}
export default pageMixins
