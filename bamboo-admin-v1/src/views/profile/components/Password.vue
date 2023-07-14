<template>
  <el-form ref="passwordForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
    <el-form-item :label="String($t('system.oldPwd'))" prop="oldPassword">
      <el-input v-model="temp.oldPassword" type="password" />
    </el-form-item>
    <el-form-item :label="String($t('system.newPwd'))" prop="newPassword">
      <el-input v-model="temp.newPassword" type="password" />
    </el-form-item>
    <el-form-item :label="String($t('profile.confirmPwd'))" prop="confirmPassword">
      <el-input v-model="temp.confirmPassword" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ $t('common.save') }}</el-button>
      <el-button @click="close">{{ $t('common.close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updatePass } from '@/api/system/user'

export default {
  name: 'Password',
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
    const equalToPassword = (rule, value, callback) => {
      if (this.temp.newPassword !== value) {
        callback(new Error(String(this.$t('profile.equalToPassMsg'))))
      } else {
        callback()
      }
    }
    return {
      temp: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      rules: {
        oldPassword: [{ required: true, trigger: 'blur' }],
        newPassword: [{ required: true, trigger: 'blur' }, { min: 6, max: 20, message: String(this.$t('profile.passLimitMsg')), trigger: 'blur' }],
        confirmPassword: [{ required: true, trigger: 'blur' }, { required: true, validator: equalToPassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const updatePassParam = {
            id: this.user.id,
            oldPassword: tempData.oldPassword,
            newPassword: tempData.newPassword
          }
          updatePass(updatePassParam).then(() => {
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('profile.passwordSaveSucceed'),
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
