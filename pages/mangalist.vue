<template>
  <div class="mangaWrapper">
    <div class="tabs">
      <span
        :class="{ active: activeTab === 'read' }"
        @click="activeTab = 'read'"
        >reading</span
      >
      <span
        :class="{ active: activeTab === 'already-read' }"
        @click="activeTab = 'already-read'"
        >already-read</span
      >
      <span
        :class="{ active: activeTab === 'not-interested' }"
        @click="activeTab = 'not-interested'"
        >L</span
      >
    </div>
    <div class="mangaContainer">
      <NuxtLink style="text-decoration: none" to="/">
        <h1 style="margin-left: 20px">⏪</h1>
      </NuxtLink>
      <template v-for="manga in mangaList.data">
        <div
          :key="manga.data.slug"
          class="manga"
          v-if="manga.data.status === activeTab"
          @click="
            () => {
              $router.push('/' + manga.data.slug)
            }
          "
        >
        
          <img :src="manga.data.posterUrl" alt="posterImg" />
          <span>{{ manga.data.name }}</span>
          <span>{{ manga.data.chapters }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeTab: 'read',
    }
  },
  computed: {
    ...mapGetters({
      getPage: ['notes/getCurrentPage'],
      loading: ['notes/getLoading'],
      mangaList: ['notes/getMangas'],
    }),
  },
  mounted() {
    setTimeout(() => {
      console.log(this.mangaList.data)
    }, 1000)
  },
}
</script>

<style lang="scss" scoped>
.mangaContainer {
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
  background-color: #2c2c2c;
  overflow: scroll;

  .manga {
    height: 200px;
    display: flex;

    img {
      width: auto;
      height: 100%;
    }
  }
}

.mangaWrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.tabs {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;

  .active {
    background-color: #2c2c2c;

    // border-radius: 10px 10px 0 0;
  }

  span {
    padding: 10px;
    text-align: center;
  }

  :nth-child(1) {
    grid-area: 1 / 1 / 2 / 2;
  }

  :nth-child(2) {
    grid-area: 1 / 2 / 2 / 3;
  }

  :nth-child(3) {
    grid-area: 1 / 3 / 2 / 4;
  }
}
</style>
