<script setup lang="ts">
import { useRouter } from 'vitepress';
import { IArticle } from '../composable/UseDoc';
const props = defineProps<{
  doc: IArticle
}>()

const router = useRouter();

function goTagsPage(tag: string) {
  router.go('tags?tag=' + tag);
}

function goArticlePage() {
  router.go(props.doc.path);
}
</script>

<template>
  <div class="card" @click="goArticlePage">
    <h2 class="card__title">
      {{ doc.title }}
    </h2>
    <p class="card__desc">
      {{ doc.desc}}
    </p>
    <div class="card__footer">
      <span class="card__footer__item">
        <v-icon  icon="mdi-clock" />
        {{  doc.date }}
      </span>
      
      <span class="card__footer__item" v-if="doc.tags?.length">
        <v-icon icon="mdi-tag" />
        <span class="card__footer__tag" v-for="tag in doc.tags" :key="tag" @click.stop="goTagsPage(tag)">
          {{ tag }}
        </span>
      </span>
    </div>
  </div>
</template>
<style lang="scss">
.card {
  cursor: pointer;
  padding: 20px;
  transition: all 0.5s ease-in-out;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  
  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  &__desc {
    font-size: 1rem;
    margin-bottom: 10px;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; // 超過三行變成...
    -webkit-box-orient: vertical;
  }

  &__footer {
    display: flex;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #999;

    &__item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    &__tag {
      &:hover {
        color: var(--vp-c-brand);
      }
    }
  }
}
</style>