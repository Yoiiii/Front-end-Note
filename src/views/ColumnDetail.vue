<template>
  <div class="column-detail-page w-690 ">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center">
      <div class="col-3 text-center ">
        <img :src="column?.avatar?.url" :alt="column?.title" class="circle border  avatar" @error="imgeError()">
      </div>
      <div class="col-9">
        <h4>{{column?.title}}</h4>
        <p class="text-muted">{{column?.description}}</p>
      </div>
    </div>
    <PostList :list="list"></PostList>
    <div class="d-flex  justify-content-center mb-2">
      <button v-if="!isLastPage" type="button" class="btn btn-outline-primary" @click="loadMorePage">查看更多</button>
      <h5 v-else class="font-weight-bold text-center">没有更多了</h5>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GolbalDataProps } from '../store'
import PostList from '@/components/PostList.vue'
import vueimg from '@/assets/vue.svg'
import useLoadMore from '@/hooks/useLoadMore'
const store = useStore<GolbalDataProps>()
const route = useRoute()
const currrentId = route.params.id
const column = computed(() => {
  const column = store.getters.getColumnById(currrentId)
  if (column) {
    if (!column.avatar) {
      column.avatar = {
        url: vueimg
      }
    }
  }
  return column
})
const total = computed(() => store.state.posts.loadedColumns[currrentId.toString()]?.total || 0)
const list = computed(() => store.getters.getPostsByCid(currrentId))
const currentPage = computed(() => store.state.posts.loadedColumns[currrentId.toString()]?.currentPage)
const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { pageSize: 10, currentPage: currentPage.value ? currentPage.value + 1 : 2 })
onMounted(() => {
  console.log('??????')
  store.dispatch('fetchColumn', currrentId)
  store.dispatch('fetchPosts', { cid: currrentId, currentPage: 1, pageSize: 10 })
})
</script>
<style>
.w-690 {
  width: 690px;
  margin:0 auto;
}
.card-body {
  padding: 1rem 1rem;
}
.card {
  padding: 0;
}
.avatar {
  object-fit: cover;
  width: 100px !important;
  height: 100px !important;
}
</style>
