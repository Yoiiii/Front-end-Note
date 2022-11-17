
import { type } from 'os';
<template>
  <div class="signup-page mx-auto p-3 w-330" >
    <h2>注册</h2>
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="formData.email"
          placeholder="请输入邮箱地址"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label  class="form-label">昵称</label>
        <validate-input
          :rules="nameRules"
          v-model="formData.nickName"
          placeholder="请输入昵称"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label  class="form-label">密码</label>
        <validate-input
          :rules="passwordRules"
          v-model="formData.password"
          placeholder="请输入昵称密码"
          type="password"
        />
      </div>
      <div class="mb-3">
        <label  class="form-label">重复密码</label>
        <validate-input
          :rules="repeatPasswordRules"
          v-model="formData.repeatPassword"
          placeholder="请输入昵称密码"
          type="password"
        />
      </div>
      <RouterLink style="display: block;" to="/login" >已经有账户了？去登录</RouterLink>
      <template #submit>
        <span class="btn btn-primary signupbtn">注册新用户</span>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts" setup>
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import { useRouter } from 'vue-router'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '@/components/createMessage'
import axios from 'axios'
import { reactive } from 'vue'
const formData = reactive({
  email: '',
  nickName: '',
  password: '',
  repeatPassword: ''
})
const router = useRouter()
const emailRules: RulesProp = [
  { type: 'required', message: '电子邮箱地址不能为空' },
  { type: 'email', message: '请输入正确的电子邮箱地址' }
]
const nameRules: RulesProp = [
  { type: 'required', message: '昵称不能为空' }
]
const passwordRules: RulesProp = [
  { type: 'required', message: '密码不能为空' }
]
const repeatPasswordRules: RulesProp = [
  { type: 'required', message: '重复密码不能为空' },
  {
    type: 'custom',
    validator: () => {
      return formData.password === formData.repeatPassword
    },
    message: '密码不相同'
  }
]
const onFormSubmit = async (result: boolean) => {
  if (result) {
    const payload = {
      email: formData.email,
      password: formData.password,
      nickName: formData.nickName
    }
    try {
      const res = await axios.post('/user', payload)
      if (res.data.success) {
        createMessage(res.data.msg + '即将跳转登录页面', 'success')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (error) {

    }
  }
}
</script>
<style scoped>
.signup-page {
  width: 300px;
}
.signupbtn {
  margin-top: 20px;
}
</style>
