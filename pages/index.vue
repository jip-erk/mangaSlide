<template>
  <div v-if="constant" class="column">
    <div v-if="loading" class="loader">loading</div>
    <div class="ImgContainer">
      <div class="img-wrapper" @click="isActive = !isActive">
        <img
          :class="{ defuse: !isActive }"
          :src="constant.posterUrl"
          alt="posterImg"
        />
        <div v-if="!isActive" class="descriptionCont">
          <p
            v-for="key in constant.descriptionParagraphs"
            :key="key"
            class="desc"
          >
            {{ key }}
          </p>
        </div>
      </div>
    </div>

    <div class="uiCont">
      <h2>
        {{ constant.title }}
        <NuxtLink style="text-decoration: none; float: right" to="/mangatags"
          >⚙️</NuxtLink
        >
      </h2>
      <p>Chapters: {{ chapterLength }}</p>

      <div class="buttonCont">
        <div
          class="1"
          @click="
            addManga('already-read')
            setPage()
          "
        >
          already read
        </div>
        <div
          class="2"
          @click="
            addManga('not-interested')
            setPage()
          "
        >
          not interested
        </div>
        <div
          class="3"
          @click="
            () => {
              addManga('read')
              setPage()
              $router.push({ path: constant.slug })
            }
          "
        >
          read
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { searchMangadex, scrapeMangadex } from '../scraper/mangadex.js'
export default {
  name: 'IndexPage',
  data() {
    return {
      tags: [],
      constant: null,
      isActive: true,
      chapterLength: 0,
      page: null,
    }
  },
  computed: {
    ...mapGetters({
      getPage: ['notes/getCurrentPage'],
      loading: ['notes/getLoading'],
      getMangaList: ['notes/getMangas'],
    }),
  },
  mounted() {
    this.updatePage()
  },
  methods: {
    ...mapActions('notes', [
      'updateManga',
      'createManga',
      'setCurrentPage',
      'getCurrentPage',
      'getMangas',
      'checkIfMangaExists',
    ]),
    updateTest() {
      this.updateManga(this.constant)
    },
    setPage() {
      this.page++
      this.setCurrentPage(this.page).then(() => {
        this.updatePage()
      })
    },
    updatePage() {
      this.getCurrentPage().then(() => {
        this.page = this.getPage.data.currentPage

        searchMangadex(this.page).then((res) => {
          scrapeMangadex(res).then((res) => {
            this.getMangas().then(() => {
              this.constant = res.constant
              this.chapterLength = res.data.allChapters.length
            })
          })
        })
      })
    },
    addManga(Status) {
      const data = {
        slug: this.constant.slug,
        status: Status,
        currentChapter: '',
      }
      this.createManga(data)
    },
  },
}
</script>

<style lang="scss">
.column {
  .loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;

    z-index: 100;
  }
  .uiCont {
    display: flex;
    padding: 0 20px;
    flex-direction: column;

    h2 {
      margin: 0;
      padding: 0;
      font-size: 1.5rem;
      cursor: pointer;
    }

    p {
      margin: 0;
      margin-bottom: 10px;
    }

    .buttonCont {
      margin: 10px 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      grid-column-gap: 10px;
      grid-row-gap: 10px;

      div {
        height: 70px;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        background-color: #0f0f0f;
      }

      :nth-child(1) {
        grid-area: 1 / 1 / 2 / 2;
        border: solid 2px #c4a84c;
      }

      :nth-child(2) {
        grid-area: 1 / 2 / 2 / 3;
        border: solid 2px #772323;
      }

      :nth-child(3) {
        grid-area: 2 / 1 / 3 / 3;
        border: solid 2px #237743;
      }
    }
  }
  .ImgContainer {
    display: flex;
    padding: 20px;
    justify-content: center;
    align-items: center;
    position: relative;

    .img-wrapper {
      position: relative;
      img {
        width: auto;
        max-width: 100%;
        max-height: 400px;
      }

      .defuse {
        filter: opacity(0.1);
      }

      .descriptionCont {
        position: absolute;
        top: 0;
        width: auto;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        overflow: scroll;

        .desc {
          box-sizing: border-box;
          position: relative;
        }
      }
    }
  }
}
</style>
