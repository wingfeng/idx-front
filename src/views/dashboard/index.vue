<template>
  <div class="dashboard-container">
    <h1> Welcome {{oidcUser.display_name}}</h1>
    <div class="dashboard-text"> {{ oidcUser }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters('oidcStore',[
      'oidcUser'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
