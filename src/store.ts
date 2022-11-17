import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from '@/helper'
export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  description?: string;
  avatar?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createAt? :string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
  author?: string;
}
export interface PostProps {
  _id?: string;
  title?: string;
  excerpt?: string
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  author?:string | UserProps;
  column?:ColumnProps| string ;
}
interface ListProps<P>{
  [id: string]: P;
}
export interface GolbalErrorProps {
  status:boolean;
  message?: string;
}

export interface GolbalDataProps{
  error: GolbalErrorProps;
  token: string;
  loading: boolean;
  columns:{data:ListProps<ColumnProps>, currentPage:number, total:number};
  posts:{data:ListProps<PostProps>, loadedColumns:ListProps<{total?:number;currentPage?:number}>};
  user: UserProps;
  usersColumns:ColumnProps[]
}
const getAndCommit = async (url:string, mutationName: string, commit:Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}

const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}
const asyncAndCommit = async (url:string, mutationName: string, commit:Commit, config:AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  console.log(extraData)

  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const store = createStore<GolbalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: {} },
    user: { isLogin: false }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    fetchPost (state, rawData) {
      // state.post = rawData.data
      console.log('rawData', rawData.data)
      state.posts.data[rawData.data._id] = rawData.data
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost (state, { data, extraData: postId }) {
      console.log('???')
      delete state.posts.data[postId]
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumnsAdd (state, rawData) {
      state.columns.data = arrToObj(rawData.data.list)
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      console.log(rawData, columnId)
      const { data } = state.posts
      const { list, count, currentPage } = rawData.data
      state.posts.data = { ...data, ...arrToObj(list) }
      state.posts.loadedColumns[columnId] = {
        currentPage,
        total: count
      }
    },
    fetchCurrentUser (state, rawData) {
      state.user = {
        isLogin: true,
        ...rawData.data
      }
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GolbalErrorProps) {
      state.error = e
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = rawData.data.token
      if (token) {
        localStorage.setItem('token', token)
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
      }
    },
    logout (state) {
      state.user = { isLogin: false }
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return getAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      } else {
        return { data: state.columns.data[cid] }
      }
    },
    fetchPosts ({ state, commit }, params = { }) {
      const { cid = '', currentPage = 1, pageSize = 10 } = params
      if ((state.posts.loadedColumns[cid]?.currentPage || 0) < currentPage) {
        return asyncAndCommit(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, {
          method: 'get'
        }, cid)
      }
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    createPost ({ commit }, payload) {
      return postAndCommit('/post', 'createPost', commit, payload)
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/post/${id}`, 'deletePost', commit, { method: 'delete' }, id)
    },
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return getAndCommit(`/post/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/post/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    login ({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id:string) => {
      return state.posts.data[id]
    }
  }
})
export default store
