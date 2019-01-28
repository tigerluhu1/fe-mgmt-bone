<template>
  <component :is="homeModule"></component>
</template>

<script>
import HomeAuth from './dashboard/Home.auth'
import HomeUnAuth from './dashboard/Home.unauth'

export default {
  name: 'home',
  data () {
    return {
      // homeModule: null
    }
  },
  computed: {
    homeModule () {
      if (this.$store.state.app.isShowDashboard) {
        return HomeAuth
      } else {
        return HomeUnAuth
      }
    }
  }
}
</script>
