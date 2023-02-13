<template>
  <div className="dashboard-container">
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
    const topRoles = ['ADMIN', 'SYSTEM', 'ACTUATOR']
    if (topRoles.some(role => this.roles.includes(role))) {
      this.currentRole = 'adminDashboard'
    }
  }
}
</script>
