<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img class="w-50" src="../assets/callout.svg" alt="callout" srcset="">
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <RouterLink to="/create" class="btn btn-primary my-2">开始写文章</RouterLink>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :list="list" />
    <div class="d-flex  justify-content-center mb-2">
      <button v-if="!isLastPage" type="button" class="btn btn-outline-primary" @click="loadMorePage">查看更多</button>
      <h5 v-else class="font-weight-bold text-center">没有更多了</h5>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList from '../components/ColumnList.vue'
import { useStore } from 'vuex'
import { GolbalDataProps } from '../store'
import useLoadMore from '@/hooks/useLoadMore'
const store = useStore<GolbalDataProps>()
const total = computed(() => store.state.columns.total)
const currentPage = computed(() => store.state.columns.currentPage)
const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { pageSize: 6, currentPage: currentPage.value ? currentPage.value + 1 : 2 })
const list = computed(() => store.getters.getColumns)
onMounted(() => {
  store.dispatch('fetchColumns', { currentPage: 1, pageSize: 6 })
})

</script>
<style>
.home-page {
  overflow: hidden;
}
</style>
