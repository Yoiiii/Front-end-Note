<template>
  <div class="login-page mx-auto p-3 w-330">
    <h2>登录</h2>
    <ValidateForm action="" @form-submit="onFormSubmit">
      <div class="mb-3">
        <label for="form-label">邮箱地址</label>
        <ValidateInput
          ref="inputRef"
        :rules = "emailRules"
        v-model="emailVal"
        placeholder="请输入邮箱地址"
        type="text"
        />
      </div>
      <div class="mb-3">
        <label for="form-label">密码</label>
        <ValidateInput
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="passwordVal"
          @keyup.enter="onFormSubmit"
        />
      </div>
      <RouterLink to="/signup" >还没有账户？去注册一个新的吧！</RouterLink>
      <template #submit>
        <span class="btn btn-primary signupbtn">登录</span>
      </template>
    </ValidateForm>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useStore } from 'vuex'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '@/components/createMessage'

const router = useRouter()
const store = useStore()

const emailVal = ref('')
const emailRules: RulesProp = [
  { type: 'required', message: '电子邮箱地址不能为空' },
  { type: 'email', message: '请输入正确的电子邮箱格式' }
]

const passwordVal = ref('')
const passwordRules: RulesProp = [
  { type: 'required', message: '密码不能为空' }
]

const inputRef = ref<any>()
const onFormSubmit = (result: boolean) => {
  if (result) {
    const payload = {
      email: emailVal.value,
      password: passwordVal.value
    }
    store.dispatch('loginAndFetch', payload).then(data => {
      createMessage('登陆成功，2秒后跳转首页', 'success')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }).catch(e => {
      console.log(e)
    })
  }
}
</script>
<style scoped>
.login-page {
  width: 300px;
}
.signupbtn {
  margin-top: 20px;
}
</style>
