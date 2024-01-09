<script setup lang="ts">
import DocList from '../components/DocList.vue'
import HomeSidebar from '../components/HomeSidebar.vue'
import { useDoc } from '../composable/UseDoc'
import HomeBanner from '../components/HomeBanner.vue'

const { tags } = useDoc()

const allTags = [...tags.value]

</script>

<template>
  <div>
    <HomeBanner />
    <v-container>
      <v-row>
        <v-col
          md="9"
          sm="12"
        >
          <DocList :tags="allTags" />
        </v-col>
        <v-col
          md="3"
          sm="12"
        >
          <HomeSidebar />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
