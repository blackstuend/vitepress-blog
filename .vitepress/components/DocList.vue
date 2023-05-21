<script setup lang="ts">
import { ref,computed } from 'vue';
import { useDoc } from '../composable/UseDoc';
import Doc from './Doc.vue';

const props = defineProps<{
  tags?: string[];
}>()

const { list } = useDoc();
const pageSize = 10;
const currentPage = ref<number>(1);

const docs = computed(() => {
  let rawData = list.value;
  if(props.tags) {
      rawData =  list.value.filter((doc) => {
      return doc.tags?.some((tag) => props.tags?.includes(tag));
    });
  }

  const start = (currentPage.value - 1) * pageSize;
  const end = currentPage.value * pageSize;
  return rawData.slice(start, end);
});

const pageLength = computed(() => {
  return Math.ceil(list.value.length / pageSize);
});

</script>
<template>
  <div class="list">
    <Doc v-for="doc in docs" :key="doc.title" :doc="doc" class="doc"></Doc>
    <v-pagination
      v-if="pageLength > 1"
      v-model="currentPage"
      :length="pageLength"
    ></v-pagination>
  </div>
</template>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>