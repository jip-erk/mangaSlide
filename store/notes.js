// store/notes.js

import {
  includedTags,
  excludedTags,
  getdbTags,
  updateManga,
  createManga,
  setCurrentPage,
  getCurrentPage,
  updateCurrentChapter,
  getMangas,
  checkIfMangaExists,
  contentRating,
} from '../api/index'

export const state = () => ({
  loading: false,
  tags: null,
  currentPage: 0,
  mangas: null,
})

export const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  GetAllTags(state, data) {
    state.tags = data
  },
  GetCurrentPage(state, data) {
    state.currentPage = data
  },
  getMangas(state, data) {
    state.mangas = data
  },
}

export const actions = {
  async includedTags(context, data) {
    context.commit('SET_LOADING', true)
    try {
      await includedTags(data)
    } catch (err) {
      console.log('store error includedTags', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async excludedTags(context, data) {
    context.commit('SET_LOADING', true)
    try {
      await excludedTags(data)
    } catch (err) {
      console.log('store error excludedTags', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async updateManga(context, slug) {
    context.commit('SET_LOADING', true)
    try {
      await updateManga(slug)
    } catch (err) {
      console.log('store error updateManga', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async checkIfMangaExists(context, slug) {
    context.commit('SET_LOADING', true)
    try {
      await checkIfMangaExists(slug)
    } catch (err) {
      console.log('store error checkIfMangaExists', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async updateCurrentChapter(context, data) {
    context.commit('SET_LOADING', true)
    try {
      await updateCurrentChapter(data)
    } catch (err) {
      console.log('store error updateCurrentChapter', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async getdbTags(context) {
    context.commit('SET_LOADING', true)
    try {
      const tags = await getdbTags()
      context.commit('GetAllTags', tags)
    } catch (err) {
      console.log('store error getTags', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async getCurrentPage(context) {
    context.commit('SET_LOADING', true)
    try {
      const currentPage = await getCurrentPage()
      console.log('store getCurrentPage', currentPage)
      context.commit('GetCurrentPage', currentPage)
    } catch (err) {
      console.log('store error getCurrentPage', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async getMangas(context) {
    context.commit('SET_LOADING', true)
    try {
      console.log('store getMangas')
      const mangas = await getMangas()
      context.commit('getMangas', mangas)
    } catch (err) {
      console.log('store error getMangas', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async contentRating(context, data) {
    context.commit('SET_LOADING', true)
    try {
      await contentRating(data)
    } catch (err) {
      console.log('store error contentRating', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async createManga(context, data) {
    context.commit('SET_LOADING', true)
    try {
      await createManga(data)
    } catch (err) {
      console.log('store error createManga', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },

  async setCurrentPage(context, data) {
    context.commit('SET_LOADING', true)
    try {
      await setCurrentPage(data)
    } catch (err) {
      console.log('store error setCurrentPage', err)
    } finally {
      context.commit('SET_LOADING', false)
    }
  },
}

export const getters = {
  getLoading: (state) => state.loading,
  getTags: (state) => state.tags,
  getCurrentPage: (state) => state.currentPage,
  getMangas: (state) => state.mangas,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
