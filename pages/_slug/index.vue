<template>
  <div>
    <div v-for="chapter in allChapters" :key="chapter.id" class="chapterList">
      <div>
        <NuxtLink :to="id + '/' + chapter.id">
          <p>{{ chapter.attributes.title }}</p>
        </NuxtLink>
        <p>{{ chapter.attributes.publishAt.split('T')[0] }}</p>
      </div>
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
