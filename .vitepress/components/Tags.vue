<script setup lang="ts">
import DocList from './DocList.vue';
import { onMounted,ref, watch } from "vue";
import { useDoc } from "../composable/UseDoc";

const { tags } = useDoc();

const selectedTag = ref<string[]>([]);
onMounted(() => {
  const url = new URL(window.location.href);
  const tag = url.searchParams.get("tag");

  if(tag) {
    selectedTag.value.push(...tag.split(","));
  }
});

watch(selectedTag, (val) => {
  if(val.length > 0) {
    const url = new URL(window.location.href);
    url.searchParams.set("tag", val.join(','));
    window.history.pushState({}, "", url.href);
  } else {
    const url = new URL(window.location.href);
    url.searchParams.delete("tag");
    window.history.pushState({}, "", url.href);
  }
});

</script>

<template>
  <v-container>
    <v-row>
      <v-col auto>
        <v-chip-group
          class="mb-3"
          multiple
          v-model="selectedTag"
          selected-class="text-success"
          column
        >
          <v-chip class="ma-2"  link  v-for="tag in tags" :value="tag">
            {{  tag }}
          </v-chip>
        </v-chip-group>
        <DocList :tags="selectedTag"></DocList>
      </v-col>
    </v-row>
  </v-container>
</template>
