<script lang="ts" setup>
import { useDoc } from '../composable/UseDoc'
import { useRouter } from 'vitepress'

const router = useRouter()
const { tags, list } = useDoc()

function goTagsPage (tag) {
  router.go('tags?tag=' + tag)
}
</script>
<template>
  <div class="sidebar">
    <img
      src="/private/headShot.jpg"
      alt="headShot"
      class="sidebar__headShot"
    >
    <h2 class="sidebar__title">
      Lucian
    </h2>
    <div class="sidebar__attr">
      <div class="sidebar__attr__item">
        {{ list.length }}<br>
        文章
      </div>
      <v-divider vertical />
      <div class="sidebar__attr__item">
        {{ tags.size }}<br>
        標籤
      </div>
    </div>
    <h2 class="sidebar__title">
      標籤
    </h2>
    <v-divider class="mb-5" />
    <div class="sidebar__tags">
      <v-chip-group
        selected-class="text-primary"
        column
      >
        <v-chip
          v-for="tag in tags"
          :key="tag"
          @click="goTagsPage(tag)"
        >
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  &__headShot {
    border-radius: 50%;
    max-width: 200px;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }

  &__title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 20px 0;
  }

  &__attr {
    display: flex;
    justify-content: space-around;
    font-size: 1.2rem;
    margin-bottom: 20px;
    position: relative;

    &__item {
      text-align: center;
    }
  }
}
</style>
