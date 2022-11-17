<template>
  <div class="container" >
    <ModelBox
      title="删除文章"
      :visable="modalIsVisable"
      @modal-on-close="modalIsVisable = false"
      @modal-on-confirm="deletePost"
    >
      <p>确定要删除这篇文章吗?</p>
    </ModelBox>
    <nav aria-label="breadcrumb" >
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink to="/">首页</RouterLink>
        </li>
        <li class="breadcrumb-item" >
          <RouterLink :to="`/column/${currentPost.column}`">{{columnTitle}}</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{currentPost.title}}</li>
      </ol>
    </nav>
    <img v-if="currentPost.image?.url" class="post-image mb-4" :src="currentPost.image?.url" :alt="currentPost.title" />
    <h2 class="mb-4">{{currentPost.title}}</h2>
    <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
      <div class="col">
        <div class="d-flex align-items-cneter">
          <img class="rounded-circle img-thumbnail" :src="currentPost.author.avatar?.url || vueimg" :alt="currentPost.author.nickName">
          <div class="ml-2 align-items-center">
            <h6 class="d-block mb-0">{{currentPost.author.nickName}}</h6>
            <span class="text-muted text-truncate d-block">{{currentPost.author.description}}</span>
          </div>
        </div>
      </div>
      <span class="col">发表于:{{moment(currentPost.createdAt).format('yyyy-MM-DD hh:mm:ss')}}</span>
    </div>
    <div v-html="md.render(currentPost.content)"></div>
    <div v-if="showEditArea" class="btn-group mt-2" role="group" aria-label="Basic mixed styles example">
      <RouterLink
        type="button"
        class="btn btn-primary"
        :to="{name:'create',query:{id:currentPost.id}}"
      >编辑</RouterLink>
      <!-- <button type="button" @click="editPost()" >编辑</button> -->
      <button type="button" @click.prevent="modalIsVisable = true" class="btn btn-danger">删除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import moment from 'moment'
// import axios from 'axios'
import ModelBox from '@/components/ModalBox.vue'
import createMessage from '@/components/createMessage'
import vueimg from '@/assets/vue.svg'
const route = useRoute()
const router = useRouter()
const store = useStore()
const currentId = route.params.id
const currentPost = reactive({
  id: '',
  title: '',
  content: '',
  image: {
    url: ''
  },
  createdAt: '',
  column: '',
  author: {
    _id: '',
    avatar: {
      url: ''
    },
    nickName: '',
    description: ''
  }
})
const columnTitle = ref('')
const modalIsVisable = ref(false)
const md = new MarkdownIt()
onMounted(async () => {
  const { data } = await store.dispatch('fetchPost', currentId)
  console.log('data', data)
  if (data) {
    currentPost.id = data._id
    currentPost.title = data.title
    currentPost.content = data.content
    currentPost.image = data.image
    currentPost.createdAt = data.createdAt
    currentPost.column = data.column
    currentPost.content = data.content
    currentPost.author = data.author
    const currentColumn = await store.dispatch('fetchColumn', data.column)
    columnTitle.value = currentColumn.data.title
  } else {
    router.push('/')
  }
})
const deletePost = async () => {
  const data = await store.dispatch('deletePost', currentPost.id)
  if (data.success) {
    modalIsVisable.value = false
    createMessage('删除成功！2秒跳转到专栏', 'success')
    store.dispatch('fetchPosts', { cid: currentPost.column, currentPage: 1, pageSize: 10 })
    setTimeout(() => {
      router.push(`/column/${currentPost.column}`)
    }, 2000)
  }
}

// 控制文章编辑权限
const showEditArea = computed(() => {
  const { isLogin, _id } = store.state.user
  if (currentPost.author._id !== '' && isLogin) {
    return currentPost.author._id === _id
  } else {
    return false
  }
})

</script>
<style>
/* .container {
  padding: 10px;
} */
.post-image {
  width: 100%;
}

.user-profile-component img {
  width: 50px;
  height: 50px;
}

.rounded-circle {
  border-radius: 50% !important;
}

.img-thumbnail {
  padding: .25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: .25rem;
}

.border-bottom {
  border-bottom: 1px solid #dee2e6 !important;
}

.border-top {
  border-top: 1px solid #dee2e6 !important;
}

.text-muted {
  --bs-text-opacity: 1;
  color: #6c757d !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
