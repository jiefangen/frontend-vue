<template>
  <el-form ref="accountForm" :rules="rules" :model="user" label-position="right" label-width="80px">
    <el-form-item :label="String($t('profile.nickname'))" prop="nickname">
      <el-input v-model="user.nickname" />
    </el-form-item>
    <el-form-item :label="String($t('profile.phone'))" prop="phone">
      <el-input v-model="user.phone" />
    </el-form-item>
    <el-form-item :label="String($t('profile.email'))" prop="email">
      <el-input v-model="user.email" />
    </el-form-item>
    <el-form-item :label="String($t('system.sex'))">
      <el-radio-group v-model="user.sex">
        <el-radio label="0" value="0">{{ $t('system.man') }}</el-radio>
        <el-radio label="1" value="1">{{ $t('system.woman') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ $t('common.save') }}</el-button>
      <el-button @click="close">{{ $t('common.close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateAccount } from '@/api/system/user'

export default {
  name: 'Account',
  props: {
    user: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data() {
    return {
      rules: {
        phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: this.$t('profile.phoneRuleMsg'), trigger: 'blur' }],
        email: [{ type: 'email', message: this.$t('profile.emailRuleMsg'), trigger: ['blur', 'change'] }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['accountForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            id: this.user.id,
            nickname: this.user.nickname,
            phone: this.user.phone,
            email: this.user.email,
            sex: this.user.sex
          }
          updateAccount(tempData).then(() => {
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('profile.accountSaveSucceed'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    close() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
