<template>
  <div>
    <NuxtLink style="text-decoration: none" to="/">
      <h1 style="margin-left: 20px">⏪</h1>
    </NuxtLink>
    <div v-for="chapter in allChapters" :key="chapter.id" class="chapterList">
      <NuxtLink :to="id + '/' + chapter.id">
        <div>
          <p>{{ chapter.attributes.title }}</p>

          <p>{{ chapter.attributes.publishAt.split('T')[0] }}</p>
        </div>
      </NuxtLink>
      <div>#{{ chapter.attributes.chapter }}</div>
    </div>
  </div>
</template>

<script>
import { scrapeMangadex } from '../../scraper/mangadex.js'
export default {
  data() {
    return {
      id: this.$route.params.slug,
      allChapters: [],
    }
  },
  mounted() {
    scrapeMangadex(this.id).then((res) => {
      console.log(res)
      // sort res.data.allChapters by chapter.attributes.chapter
      const sort = res.data.allChapters.sort((a, b) => {
        return a.attributes.chapter - b.attributes.chapter
      })
      this.allChapters = sort
    })
  },
}
</script>

<style lang="scss" scoped>
.chapterList {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #191a1c;
  border-bottom: rgb(87, 87, 87) solid 1px;
  p {
    margin: 0;
  }
}
</style>
