<script setup lang="ts">
import axios from "axios";
import { QTableProps } from "quasar";
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import User from "../types/User";
import FavouriteButton from "../components/FavouriteButton.vue";
import AppHeader from "../components/AppHeader.vue";

const isLoading = ref<boolean>(true);

const pagination = ref<QTableProps["pagination"]>({
  page: 1,
  rowsPerPage: 6,
  rowsNumber: 0,
});

const users = ref<Array<User>>([]);
const filteredUsers = ref<Array<User>>([]);

const columns: QTableProps["columns"] = [
  {
    name: "avatar",
    required: true,
    label: "",
    align: "center",
    field: "avatar",
  },
  {
    name: "first_name",
    required: true,
    label: "First name",
    align: "left",
    field: "first_name",
  },
  {
    name: "last_name",
    required: true,
    label: "Last name",
    align: "left",
    field: "last_name",
  },
  {
    name: "email",
    required: true,
    label: "Email",
    align: "left",
    field: "email",
  },
  {
    field: "id",
    name: "actions",
    label: "Actions",
    align: "center",
  },
];

const router = useRouter();

function goToDetails(id: number) {
  router.push({
    name: "user",
    params: {
      id,
    },
  });
}

function isUserFavourite(id: number) {
  const favorites: string | null = localStorage.getItem("favorites");

  if (!favorites) {
    return false;
  }

  return JSON.parse(favorites).includes(id);
}

function getUsers(page = 1) {
  axios
    .get(`https://reqres.in/api/users?page=${page}`)
    .then((res) => {
      users.value = res.data.data.map((item: User) => {
        return { ...item, favourite: isUserFavourite(item.id) };
      });

      pagination.value!.page = res.data.page;
      pagination.value!.rowsPerPage = res.data.per_page;
      pagination.value!.rowsNumber = res.data.total;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function handleRequest(
  props: Parameters<NonNullable<QTableProps["onRequest"]>>[0]
) {
  getUsers(props.pagination.page);
}

const searchTerm = ref<string>("");

watchEffect(() => {
  isLoading.value = true;
  if (searchTerm.value.trim().length === 0) {
    filteredUsers.value = users.value;
  } else {
    filteredUsers.value = users.value.filter(
      (item) =>
        item.first_name
          .toLowerCase()
          .includes(searchTerm.value.toLowerCase()) ||
        item.last_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        item.first_name
          .toLowerCase()
          .concat(" ", item.last_name.toLowerCase())
          .includes(searchTerm.value.toLowerCase())
    );
  }
  isLoading.value = false;
});

onMounted(() => {
  getUsers();
});
</script>

<template>
  <app-header title="Users" />
  <article>
    <q-table
      :rows="filteredUsers"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[6]"
      :loading="isLoading"
      :filter="searchTerm"
      v-model:pagination="pagination"
      @request="handleRequest"
    >
      <template v-slot:top-right>
        <q-input
          v-model="searchTerm"
          placeholder="Search"
          :debounce="300"
          dense
          outlined
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            key="avatar"
            :props="props"
          >
            <q-avatar>
              <img
                :src="props.row.avatar"
                :alt="`${props.row.first_name} ${props.row.last_name} avatar photo`"
                loading="lazy"
              />
            </q-avatar>
          </q-td>
          <q-td
            key="first_name"
            :props="props"
          >
            {{ props.row.first_name }}
          </q-td>
          <q-td
            key="last_name"
            :props="props"
          >
            {{ props.row.last_name }}
          </q-td>
          <q-td
            key="email"
            :props="props"
          >
            {{ props.row.email }}
          </q-td>

          <q-td
            key="actions"
            :props="props"
          >
            <favourite-button
              :id="props.row.id"
              v-model="props.row.favourite"
            />
            <q-btn
              round
              flat
              color="primary"
              icon="keyboard_arrow_right"
              title="Go to details"
              size="small"
              @click="goToDetails(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </article>
</template>
