<template>
  <div class="post-list">
    <article v-for="post in props.list" :key="post._id" class="card mb-3 shadow">
      <div class="card-body">
        <RouterLink class="link"  :to="`/post/${post._id}`"><h4 >{{post.title}}</h4></RouterLink>
        <div class="row my-3 align-items-center d-flex">
          <div v-if="post.image" class="col-4">
            <img :src="post.image.url" :alt="post.title" class="rounded-lg post-image">
          </div>
          <p :class="{'col-8':post.image}">{{post.excerpt}}</p>
        </div>
        <span class="text-muted">{{$moment(post.createdAt).format('YYYY-MM-DD hh:mm:ss')}}</span>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { PostProps } from '@/store'
const props = defineProps({
  list: {
    type: Array as PropType<PostProps[]>,
    required: true
  }
})

</script>
<style>
.post-image {

  width: 100%;
  object-fit: fill;
}
.link {
  text-decoration: none;
  color: #1a1a1a;
}
</style>
