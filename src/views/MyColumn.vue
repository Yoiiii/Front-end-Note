<template>
  <div>
    <ModelBox
      title="删除文章"
      :visable="modalIsVisable"
      @modal-on-close="modalIsVisable = false"
      @modal-on-confirm="deleteColumn"
    >
      <p>确定要删除这个专栏吗?</p>
    </ModelBox>
    <div class="d-flex justify-content-between mb-1">
    <h2>我的专栏</h2>
    <RouterLink class="btn btn-primary" type="button"  :to="`/createColumn`">新增专栏</RouterLink>
    </div>
    <ColumnList :list="list" v-slot="slotProps">
      <div  class="btn-group mt-2">
        <RouterLink class="btn btn-primary" type="button"  :to="`/createColumn?id=${slotProps.columnId}`">编辑</RouterLink>
        <button class="btn btn-danger" type="button" @click.prevent="setDeleteColumnId(slotProps.columnId)">删除</button>
      </div>
    </ColumnList>
  </div>
</template>
<script setup lang="ts">
import ColumnList from '../components/ColumnList.vue'
import ModelBox from '@/components/ModalBox.vue'
import createMessage from '@/components/createMessage'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
const store = useStore()
onMounted(async () => {
  getUserColumn()
})
const list = ref([])
const getUserColumn = async () => {
  const { data } = await axios.get(`/usercolumns/${store.state.user._id}`)
  list.value = data.data
}
const modalIsVisable = ref(false)
const columnId = ref('')
const setDeleteColumnId = (ID: string) => {
  columnId.value = ID
  modalIsVisable.value = true
}
const deleteColumn = async () => {
  console.log(columnId.value)
  const { data } = await axios.delete(`/columns/${columnId.value}`)
  if (data.success) {
    modalIsVisable.value = false
    createMessage('删除成功！', 'success')
    getUserColumn()
  }
}
</script>
