<template>
  <div >
    <GlobalHeader :user="currentUser" class="globalHeader"></GlobalHeader>
    <div style="height: 70px;"></div>
    <!-- <MessageBox v-if="error.status" type="error" :message="error.message"></MessageBox> -->
    <LoaderComponents v-if="isLoading" text="正在读取..." />
    <router-view class="containers"></router-view>
    <footer class="text-center py-4 text-seondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item"><RouterLink to="/">首页</RouterLink></li>
          <li class="list-inline-item"><RouterLink to="/about">关于</RouterLink></li>
          <li class="list-inline-item"><a href="https://github.com/Yoiiii/Front-end-Note">github</a></li>
          <li class="list-inline-item"><a href="https://gitee.com/ShawYoi/Front-end-Note">gitee</a></li>
          <li class="list-inline-item"><a href="https://beian.miit.gov.cn/">粤ICP备20019631号</a></li>
          <li class="list-inline-item">powered by ShawYoi</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import LoaderComponents from './components/LoaderComponents.vue'
import createMessage from './components/createMessage'
const store = useStore()
const currentUser = computed(() => store.state.user)
const isLoading = computed(() => store.state.loading)
const error = computed(() => store.state.error)

watch(() => error.value.status, () => {
  const { status, message } = error.value
  if (status && message) {
    createMessage(message, 'error')
  }
})

</script>

<style scoped>
.containers {
  /* margin-top: 20px; */
  padding:20px 10px;
}
.globalHeader {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}
</style>
