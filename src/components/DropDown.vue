<template>
  <div class="dropdown" ref="dropdownRef">
    <a v-bind="$attrs" href="" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">{{ props.title }}</a>
    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineExpose } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
const isOpen = ref(false)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}
defineExpose({ toggleOpen })
const dropdownRef = ref<null| HTMLElement>(null)
// const handler = (e: MouseEvent) => {
//   if (dropdownRef.value) {
//     console.log(dropdownRef.value)
//     if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) {
//       isOpen.value = false
//     }
//   }
// }
// onMounted(() => {
//   document.addEventListener('click', handler)
// })
// onUnmounted(() => {
//   document.removeEventListener('click', handler)
// })

const isClickOutside = useClickOutside(dropdownRef)
watch(isClickOutside, () => {
  if (isOpen.value && isClickOutside.value) {
    isOpen.value = false
  }
})
</script>
