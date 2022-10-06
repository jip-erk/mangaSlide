<template>
  <div>
    <div
      v-if="openMenu"
      :class="{ fullMenu: fullMenu }"
      class="menu"
      @click="fullMenu = !fullMenu"
    >
      <Transition>
        <span v-if="!fullMenu">
          {{
            `${currentImage} of ${chapterImages.length} - S${currentChapter.attributes.volume} Ch ${currentChapter.attributes.chapter}`
          }}
        </span>
        <div v-else>
          <button>previeus</button>
          {{ `${currentImage} of ${chapterImages.length}` }}
          <button>next</button>
        </div>
      </Transition>
    </div>
    <div
      @click="
        openMenu = !openMenu
        fullMenu = false
      "
    >
      <div v-if="!imgLoaded" class="overlay">
        <div class="percentage">
          {{ Math.round((chapterLoaded / chapterImages.length) * 100) }} %
        </div>
      </div>
      <div v-for="img in chapterImages" :key="img" class="img-cont">
        <img :src="img" alt="chapterImage" @load="loaded()" />
      </div>
      <div>
        <NuxtLink v-if="prevChapterId" :to="prevChapterId"> prev </NuxtLink>
        <NuxtLink v-if="nextChapterId" :to="nextChapterId"> next </NuxtLink>
      </div>
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
      id: this.$route.params.id,
      chapterImages: [],
      imgLoaded: false,
      chapterLoaded: 0,
      prevChapterId: '',
      nextChapterId: '',
      currentChapter: {},
      currentImage: 0,
      openMenu: false,
      fullMenu: false,
    }
  },
  mounted() {
    const data = {
      slug: this.slug,
      currentChapter: this.id,
    }
    this.updateCurrentChapter(data)
    scrapeMangadex(this.slug, this.id).then((res) => {
      this.chapterImages = res.data.chapterImages

      const sort = res.data.allChapters.sort((a, b) => {
        return a.attributes.chapter - b.attributes.chapter
      })

      for (let i = 0; i < sort.length; i++) {
        if (sort[i].id === this.id) {
          if (sort[i - 1]) {
            this.prevChapterId = sort[i - 1].id
          }
          if (sort[i + 1]) {
            this.nextChapterId = sort[i + 1].id
          }
          this.currentChapter = sort[i]
          console.log(this.currentChapter)
        }
      }
      console.log(this.nextChapterId, 'tes', this.prevChapterId)
    })
  },
  methods: {
    ...mapActions('notes', ['updateCurrentChapter']),
    loaded() {
      this.chapterLoaded++
      if (this.chapterLoaded === this.chapterImages.length) {
        this.imgLoaded = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  width: 100% !important;
}

.fullMenu {
  width: 100% !important;
  bottom: 0 !important;
}
.menu {
  position: fixed;
  bottom: 25px;
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
}

@keyframes menu {
  from {
    bottom: -50px;
  }
  to {
    bottom: 25px;
  }
}
.img-cont {
  display: flex;
  justify-content: center;
  align-items: center;
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
