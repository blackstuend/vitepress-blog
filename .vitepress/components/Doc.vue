<script setup lang="ts">
import { IArticle } from '../composable/UseDoc';
defineProps<{
  doc: IArticle
}>()
</script>

<template>
  <div class="card">
    <h2 class="card__title">
      {{ doc.title }}
    </h2>
    <p class="card__desc">
      {{ doc.desc}}
    </p>
    <div class="card__footer">
      <span class="">
        {{  doc.date }}
      </span>
      
      <span>
        {{ doc.tags }}
      </span>
    </div>
  </div>
</template>
<style lang="scss">
.card {
  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  &__desc {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  &__footer {
    display: flex;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #999;
  }
}
</style>