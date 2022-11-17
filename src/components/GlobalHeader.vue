<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand" href="">前端笔记</RouterLink>
      <ul v-if="!props.user.isLogin" class="list-inline mb-0">
        <li class="list-inline-item">
          <RouterLink to="/login" class="btn btn-outline-light my-2 mr-2" style="margin-right: 10px">登录</RouterLink>
          <RouterLink to="/signup" class="btn btn-outline-light my-2">注册</RouterLink>
        </li>
      </ul>
      <ul v-else class="list-inline mb-0">
        <li class="list-inline-item">
          <DropDown :title="`你好 `+props.user.nickName">
            <DropDownItem><RouterLink to="/create"  class="dropdown-item">新建笔记</RouterLink></DropDownItem>
            <DropDownItem><RouterLink to="/columnList"  class="dropdown-item">我的专栏</RouterLink></DropDownItem>
            <DropDownItem><RouterLink to="/edit" class="dropdown-item">编辑资料</RouterLink></DropDownItem>
            <DropDownItem><a href="#" @click="logout" class="dropdown-item">退出登录</a></DropDownItem>
          </DropDown>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import DropDown from './DropDown.vue'
import DropDownItem from './DropDownItem.vue'
import { UserProps } from '../store'
import store from '@/store'
const props = defineProps({
  user: {
    type: Object as PropType<UserProps>,
    required: true
  }
})
const logout = () => {
  store.commit('logout')
}
</script>
