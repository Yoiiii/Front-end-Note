<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img :src="column.avatar?.url" :alt="column.title" class="rounded-circle  border border-light  my-3"/>
          <h5 class="card-body">
            <router-link class="link" :to="`/column/${column._id}`" >{{ column.title }}</router-link>
          </h5>
          <p class="card-text text-left">{{ column.description }}</p>
          <!-- <router-link :to="{name:'column',params:{id:column.id}}" class="btn btn-outline-primary">进入专栏</router-link> -->
          <slot :columnId="column._id">
          <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script  lang="ts" setup>
import { PropType, computed } from 'vue'
import { ColumnProps } from '@/store'
import vueimg from '@/assets/vue.svg'
const props = defineProps({
  list: {
    type: Array as PropType<ColumnProps[]>,
    required: true
  }
})

const columnList = computed(() => {
  return props.list.map(column => {
    if (!column.avatar) {
      column.avatar = {
        url: vueimg
      }
    }
    return column
  })
})
</script>
<style  scoped>
.card-body img {
  width: 50px;
  height: 50px;
}
.link {
  text-decoration: none;
  color: #1a1a1a;
}
img {
  object-fit: cover;
}
</style>
