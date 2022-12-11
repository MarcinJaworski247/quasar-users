import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/users",
  },
  {
    path: "/users",
    component: () => import("../pages/UsersIndex.vue"),
    name: "users",
  },
  {
    path: "/user/:id",
    component: () => import("../pages/UserDetails.vue"),
    name: "user",
  },
];

export default routes;
