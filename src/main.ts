import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
import moment from 'moment'

import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'
axios.defaults.baseURL = 'http://localhost:3000/note/api/'
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, err => {
  const { msg } = err.response.data
  store.commit('setError', { status: true, message: msg })
  store.commit('setLoading', false)
  return Promise.reject(msg)
})

VMdEditor.use(githubTheme, {
  Hljs: hljs
})

// createApp(App).use(router).use(store).use(VMdEditor).mount('#app')
const app = createApp(App)
app.use(router)
app.use(store)
app.use(VMdEditor)
app.config.globalProperties.$moment = moment
app.mount('#app')
