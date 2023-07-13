<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import { getInfo } from '@/api/login'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      user: {
        avatar: '',
        username: '',
        nickname: '',
        userType: '',
        phone: '',
        email: '',
        roles: '',
        introduction: '',
        createTime: ''
      },
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'nickname',
      'introduction',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    async getUser() {
      const res = await getInfo()
      const userInfo = res.data
      this.user = {
        avatar: this.avatar,
        username: this.name,
        nickname: this.nickname,
        introduction: this.introduction,
        roles: this.roles.join(' | '),
        userType: userInfo.userType,
        phone: userInfo.phone,
        email: userInfo.email,
        createTime: userInfo.createTime
      }
    }
  }
}
</script>
