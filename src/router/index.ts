import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/funnel",
    name: "funnel",
    component: () => import("../views/funnel.vue"),
  },
  {
    path: "/vList",
    name: "vList",
    component: () => import("../views/virtualList.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/child-site"),
  routes,
});

export default router;
