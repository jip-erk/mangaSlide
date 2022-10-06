<template>
  <div>
    <div v-for="tag in tags" :key="tag.id" class="container">
      <div
        v-if="getAllTags?.data?.included_tags.some((e) => e.id === tag.id)"
        class="included"
        @click="removeIncludedTag(tag.id)"
      >
        <p>{{ tag.attributes.name.en }}</p>
      </div>
      <div
        v-else-if="getAllTags?.data?.excluded_tags.some((e) => e.id === tag.id)"
        class="excluded"
        @click="removeExcludedTag(tag.id)"
      >
        <p>{{ tag.attributes.name.en }}</p>
      </div>
      <div v-else class="adding">
        <div>
          <button @click="includedTag(tag.attributes.name.en, tag.id)">
            -
          </button>
        </div>
        <div>{{ tag.attributes.name.en }}</div>
        <div>
          <button @click="excludedTag(tag.attributes.name.en, tag.id)">
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import { getTags } from '../scraper/mangadex.js'
export default {
  name: 'MangaTagsPage',
  data() {
    return {
      tags: [],
      excludedTagsList: [],
      includedTagsList: [],
    }
  },
  computed: {
    ...mapState('notes', ['loading']),
    ...mapGetters({
      Loading: ['notes/getLoading'],
      getSingleNote: ['notes/getNote'],
      getAllTags: ['notes/getTags'],
    }),
  },
  mounted() {
    getTags().then((tags) => {
      this.tags = tags
    })
    this.getdbTags().then(() => {
      this.getAllTags.data.excluded_tags.forEach((e) => {
        this.excludedTagsList.push(e)
      })
      this.getAllTags.data.included_tags.forEach((e) => {
        this.includedTagsList.push(e)
      })
    })
  },
  methods: {
    ...mapActions('notes', ['includedTags', 'excludedTags', 'getdbTags']),
    async excludedTag(Name, Id) {
      this.includedTagsList.push({ name: Name, id: Id })
      try {
        await this.includedTags(this.includedTagsList)
      } catch (err) {
        console.log(err)
      }
      this.getdbTags()
    },
    async includedTag(Name, Id) {
      this.excludedTagsList.push({ name: Name, id: Id })
      try {
        await this.excludedTags(this.excludedTagsList)
      } catch (err) {
        console.log(err)
      }
      this.getdbTags()
    },

    async removeIncludedTag(Id) {
      this.includedTagsList = this.includedTagsList.filter((e) => e.id !== Id)
      try {
        await this.includedTags(this.includedTagsList)
      } catch (err) {
        console.log(err)
      }
      this.getdbTags()
    },

    async removeExcludedTag(Id) {
      this.excludedTagsList = this.excludedTagsList.filter((e) => e.id !== Id)
      try {
        await this.excludedTags(this.excludedTagsList)
      } catch (err) {
        console.log(err)
      }
      this.getdbTags()
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  .adding {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #191a1c;
    color: #fff;
  }

  div {
    padding: 20px;
    text-align: center;
  }

  .excluded {
    background-color: #f75050;
    color: #fff;
  }
  p {
    padding: 20px;
    margin: 0;
  }

  .included {
    background-color: #6dd66d;
    color: #fff;
  }
}

.isSelected {
  color: red;
}

.default {
  color: black !important;
}
</style>
