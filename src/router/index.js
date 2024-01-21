import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
let index = "";
if (
  window.WEB_CONFIG &&
  window.WEB_CONFIG.token &&
  window.WEB_CONFIG.token[0] &&
  window.WEB_CONFIG.token[0].tokenId
) {
  index = "/otc/trade/" + window.WEB_CONFIG.token[0].tokenId;
}

const routes = [
  {
    path: "/",
    redirect: index,
  },
  {
    path: "/otc",
    component: () => import("./otc/index.vue"),
    children: [
      {
        path: "/",
        redirect: index,
      },
      {
        path: "trade/",
        redirect: index,
      },
      {
        path: "trade/:tokenId",
        component: () => import("./trade/index.vue"),
        name: "trade",
      },
      {
        path: "order",
        component: () => import("./order/index.vue"),
        name: "order",
      },
      {
        path: "order/detail/:orderId",
        component: () => import("./order/detail.vue"),
        name: "orderDetail",
      },
      {
        path: "login",
        component: () => import("./login/index.vue"),
        name: "login",
      },
      {
        path: "settings",
        component: () => import("./settings/index.vue"),
        name: "settings",
      },
      {
        path: "offer",
        component: () => import("./offer/index.vue"),
        name: "offer",
      },
    ],
  },
];

const router = new Router({
  routes,
  mode: "history",
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});
export default router;
