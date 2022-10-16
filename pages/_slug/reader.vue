<template>
  <div>
    <div
      v-if="openMenu"
      :class="{ fullMenu: fullMenu }"
      class="menu"
      @click="fullMenu = !fullMenu"
    >
      <span v-if="!fullMenu">
        {{
          `${currentImage} of ${chapterImages.length} - S${
            chapterData.currentChapter.attributes.volume || 0
          } Ch ${chapterData.currentChapter.attributes.chapter || 0}`
        }}
      </span>
      <div v-else>
        <div
          v-for="chapter in allChapters"
          :key="chapter.id"
          class="chapterList"
          @click="
            () => {
              $router.push({ query: { id: chapter.id } })
              // reload page
              location.reload()
            }
          "
        >
          <div>
            <p>{{ chapter.attributes.title }}</p>

            <p>{{ chapter.attributes.publishAt.split('T')[0] }}</p>
          </div>
          <div>#{{ chapter.attributes.chapter }}</div>
        </div>

        <NuxtLink :to="'/' + slug"><button>list</button></NuxtLink>
        <NuxtLink to="/"> <button>home</button></NuxtLink>
      </div>
    </div>
    <div
      @click="
        openMenu = !openMenu
        fullMenu = false
      "
    >
      <!-- <div v-if="!imgLoaded" class="overlay">
        <div class="percentage">
          {{ Math.round((chapterLoaded / chapterImages.length) * 100) }} %
        </div>
      </div> -->
      <div class="img-cont">
        <template v-for="(page, index) in pagesContainer">
          <img
            v-for="img in page.data"
            :key="img"
            :class="{ hidden: page.hidden }"
            :src="'/proxy-image?url=' + img"
            alt="chapterImage"
            rel="preload"
            @load="loaded(page, index)"
          />
        </template>
      </div>
    </div>
    <div
      v-if="pagesContainer.length > 1"
      class="nextChapter"
      @click="nextChapter"
    >
      ⏭
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { scrapeMangadex } from '../../scraper/mangadex.js'
export default {
  data() {
    return {
      slug: this.$route.params.slug,
      id: this.$route.query.id,
      chapterImages: [],
      imgLoaded: false,
      chapterLoaded: 0,
      currentImage: 0,
      openMenu: false,
      fullMenu: false,
      atBottom: false,
      pagesContainer: [],
      chapterData: {
        prevChapter: null,
        nextChapter: null,
        nextnextChapter: null,
        currentChapter: null,
      },
      allChapters: [],
      loadIndex: 0,
    }
  },
  computed: {
    allLoaded() {
      // if all pagesContainer are loaded and pagescontainer.length is lower than 3 return true
      // return (
      //   this.pagesContainer.filter((page) => page.loaded).length ===
      //     this.pagesContainer.length && this.pagesContainer.length < 4
      // )
      return this.pagesContainer.every((page) => page.loaded)
    },
  },
  watch: {
    allLoaded() {
      if (this.allLoaded) {
        // if (this.pagesContainer.length === 1) {
        //   console.log('only one page')
        //   this.scrape(this.chapterData.nextChapter, true)
        // } else if (this.pagesContainer.length === 2) {
        //   console.log('two pages')
        //   this.scrape(this.chapterData.nextnextChapter, true)
        // }

        if (this.loadIndex + 1 < this.allChapters.length) {
          this.loadIndex++
          this.scrape(this.allChapters[this.loadIndex].id, true)
        }
      }
    },
  },

  beforeMount() {
    scrapeMangadex(this.slug, this.id).then((res) => {
      // this.preloadImages(res.data.chapterImages)
      const sort = res.data.allChapters.sort((a, b) => {
        return a.attributes.chapter - b.attributes.chapter
      })

      this.allChapters = sort

      for (let i = 0; i < sort.length; i++) {
        if (sort[i].id === this.id) {
          this.loadIndex = i
        }
      }

      this.checkSort(this.allChapters)
      this.pagesContainer.push({
        data: res.data.chapterImages,
        hidden: false,
        loaded: false,
      })
    })
  },

  methods: {
    ...mapActions('notes', ['updateCurrentChapter']),
    loaded(page, index) {
      this.chapterLoaded++

      if (this.chapterLoaded === page.data.length) {
        // if (!this.imgLoaded) {

        this.pagesContainer[index].loaded = true
        this.chapterLoaded = 0
        this.imgLoaded = true

        // this.scrape(this.nextChapterId, true)
        // remove first item from pagesContainer
        // }
      }
    },
    checkSort(sort) {
      for (let i = 0; i < sort.length; i++) {
        if (sort[i].id === this.id) {
          if (sort[i - 1]) {
            this.chapterData.prevChapter = sort[i - 1].id
          }
          if (sort[i + 1]) {
            this.chapterData.nextChapter = sort[i + 1].id
          }
          if (sort[i + 2]) {
            this.chapterData.nextnextChapter = sort[i + 2].id
          }
          this.chapterData.currentChapter = sort[i]
        }
      }
    },
    nextChapter() {
      // if there in no next chapter return

      this.$router.push({
        query: {
          id: this.chapterData.nextChapter,
        },
      })
      this.id = this.chapterData.nextChapter
      this.checkSort(this.allChapters)
      this.pagesContainer.shift()
      this.pagesContainer[0].hidden = false
      window.scrollTo(0, 0)
    },
    scrape(Id) {
      if (!Id) return
      scrapeMangadex(this.slug, Id).then((res) => {
        this.pagesContainer.push({
          data: res.data.chapterImages,
          hidden: true,
          loaded: false,
        })
      })
    },
    async preloadImages(res) {
      // preload images and after each image is loaded, push it to the array in async await
      // console.time('preload')
      // for (let i = 0; i < res.length; i++) {
      //   const img = await this.preload(res[i])
      //   this.chapterImages.push(img)
      // }
      // console.timeEnd('preload')
      // if (!this.imgLoaded) {
      //   this.imgLoaded = true
      //   this.scrape(this.nextChapterId)
      // }
    },
    preload(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => (img.src = url)
        img.onerror = reject
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.chapterListContainer {
  position: relative;
}
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
.nextChapter {
  width: 100%;
  height: 80px;
  text-align: center;
  font-size: 2rem;
  line-height: 80px;
  background-color: #4747a7;
}
.hidden {
  display: none;
}
.navContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  p {
    margin: 0;
  }
  button {
    background-color: #6d7179;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  width: 100% !important;
}

.fullMenu {
  width: 70% !important;
  height: 90% !important;
  align-items: normal !important;
  overflow: scroll;

  // on img-cont set over flow to hidden
}
.menu {
  position: fixed;
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  padding: 0 10px;
  height: 32px;
  border-radius: 5px;
  background-color: rgb(32, 32, 32);
  border: solid 2px rgb(51, 51, 51);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  animation-name: menu;
  animation-duration: 0.2s;

  button {
    background-color: #6d7179;
    border: none;
    padding: 5px;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }
}

@keyframes menu {
  from {
    bottom: -50px;
  }
  to {
    bottom: 35px;
  }
}
.img-cont {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 100%;
  }
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #191a1c;
  z-index: 100;
}

.percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  color: #fff;
}
</style>
