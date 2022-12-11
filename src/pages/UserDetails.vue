<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import User from "../types/User";
import axios from "axios";
import FavouriteButton from "../components/FavouriteButton.vue";
import AppHeader from "../components/AppHeader.vue";

const user = ref<User>({
  id: 0,
  first_name: "",
  last_name: "",
  email: "",
  avatar: "",
  favourite: false,
});
const route = useRoute();
const router = useRouter();

function goBack() {
  router.push({
    name: "users",
  });
}

function isUserFavourite(id: number) {
  const favorites: string | null = localStorage.getItem("favorites");

  if (!favorites) {
    return false;
  }

  return JSON.parse(favorites).includes(id);
}

onMounted(() => {
  axios.get(`https://reqres.in/api/users/${route.params.id}`).then((res) => {
    user.value = {
      ...res.data.data,
      favourite: isUserFavourite(+route.params.id),
    };
  });
});
</script>

<template>
  <app-header title="User details" />
  <article>
    <q-avatar
      rounded
      size="124px"
    >
      <img
        :src="user.avatar"
        :alt="`${user.first_name} ${user.last_name} avatar photo`"
        loading="lazy"
      />
    </q-avatar>
    <favourite-button
      :id="user.id"
      v-model="user.favourite"
      class="q-ml-sm"
    />

    <section class="q-mt-md">
      <h2 class="text-weight-medium text-uppercase q-mb-sm">
        {{ user.first_name }}
        {{ user.last_name }}
      </h2>
      <q-icon name="mail" />
      {{ user.email }}
    </section>
    <div class="q-mt-md">
      <q-btn
        color="primary"
        label="Go back"
        @click="goBack"
      />
    </div>
  </article>
</template>
