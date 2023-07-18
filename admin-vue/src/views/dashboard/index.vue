<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import generalDashboard from './general'

export default {
  name: 'Dashboard',
  components: { adminDashboard, generalDashboard },
  data() {
    return {
      currentRole: 'generalDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.includes('ADMIN')) {
      // this.currentRole = 'adminDashboard'
    }
  }
}
</script>
