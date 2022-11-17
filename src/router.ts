import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/HomePage.vue'
import Login from './views/myLogin.vue'
import ColumnList from '@/views/MyColumn.vue'
import CloumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import SignUp from './views/SignUp.vue'
import Edit from './views/EditInfo.vue'
import Post from './views/PostDetail.vue'
import EditPost from './views/EditPost.vue'
import CreateColumn from '@/views/CreateColumn.vue'
import About from '@/views/AboutPage.vue'
import axios from 'axios'
import store from './store'
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: CloumnDetail
    },
    {
      path: '/createColumn',
      name: 'createColumn',
      component: CreateColumn
    },
    {
      path: '/columnList',
      name: 'columnList',
      component: ColumnList
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requireLogin: true }
    },
    {
      path: '/post/:id',
      name: 'post',
      component: Post
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit,
      meta: { requireLogin: true }
    },
    {
      path: '/editpost/:id',
      name: 'editpost',
      component: EditPost,
      meta: { requireLogin: true }
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { requireLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.error(e)
        localStorage.removeItem('token')
        store.commit('logout')
        next('login')
      })
    } else {
      if (requireLogin) {
        next('/login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})
export default router
