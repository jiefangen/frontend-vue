<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <template v-slot:header>
              <div class="clearfix">
                <span>{{ $t('profile.account') }}</span>
              </div>
            </template>
            <el-tabs v-model="activeTab">
              <el-tab-pane :label="String($t('profile.account'))" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane :label="String($t('profile.modifyPass'))" name="password">
                <password :user="user" />
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
import Account from './components/Account'
import Password from './components/Password'
import { getInfo } from '@/api/login'

export default {
  name: 'Profile',
  components: { UserCard, Account, Password },
  data() {
    return {
      user: {
        id: undefined,
        avatar: '',
        username: '',
        nickname: '',
        sex: '',
        userType: '',
        phone: '',
        email: '',
        roles: '',
        introduction: '',
        createTime: ''
      },
      activeTab: 'account'
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
        id: userInfo.id,
        userType: userInfo.userType,
        sex: userInfo.sex,
        phone: userInfo.phone,
        email: userInfo.email,
        createTime: userInfo.createTime
      }
    }
  }
}
</script>
