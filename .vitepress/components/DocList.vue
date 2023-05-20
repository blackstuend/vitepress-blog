<script setup lang="ts">
import { useDoc } from '../composable/UseDoc';
import Doc from './Doc.vue';
const { list } = useDoc();
</script>
<template>
  <div>
    <Doc v-for="doc in list" :key="doc.title" :doc="doc"></Doc>
  </div>
</template>