<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
  id: number;
  modelValue: boolean;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function addToFavorites(id: number) {
  const favorites: string | null = localStorage.getItem("favorites");
  let favoritesArray;
  if (favorites) {
    favoritesArray = JSON.parse(favorites);
    favoritesArray.push(id);
    localStorage.setItem("favorites", JSON.stringify(favoritesArray));
  } else {
    localStorage.setItem("favorites", JSON.stringify([id]));
  }

  value.value = true;
}

function removeFromFavorites(id: number) {
  const favorites: string | null = localStorage.getItem("favorites");
  let favoritesArray;
  if (favorites) {
    favoritesArray = JSON.parse(favorites);
    const index = favoritesArray.indexOf(id);
    if (index !== -1) {
      favoritesArray.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favoritesArray));
  } else {
    localStorage.setItem("favorites", JSON.stringify([id]));
  }

  value.value = false;
}

function toggleFavourite(id: number) {
  if (value.value) {
    removeFromFavorites(id);
  } else {
    addToFavorites(id);
  }
}
</script>

<template>
  <q-btn
    flat
    round
    :icon="value ? `favorite` : `favorite_outline`"
    :title="value ? `Remove from favorites` : `Add to favorites`"
    color="negative"
    class="q-mr-sm"
    @click="toggleFavourite(id)"
  />
</template>
