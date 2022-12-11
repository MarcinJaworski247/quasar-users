<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
<template>
  <header class="q-mb-md">
    <h1>{{ title }}</h1>
  </header>
</template>
