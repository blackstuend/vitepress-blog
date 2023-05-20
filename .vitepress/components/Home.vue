<script setup lang="ts">
import DocList from './DocList.vue';
import HomeSidebar from './HomeSidebar.vue';
import HomeBanner from './HomeBanner.vue';
</script>

<template>
  <div>
    <HomeBanner></HomeBanner>
    <v-container>
      <v-row>
        <v-col md="9" sm="12">
          <DocList></DocList>
        </v-col>
        <v-col md="3" sm="12">
          <HomeSidebar></HomeSidebar>
        </v-col>
      </v-row>
    </v-container>
</div>
</template>
