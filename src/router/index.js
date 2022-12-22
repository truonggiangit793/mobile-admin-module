import Vue from 'vue';
import VueRouter from 'vue-router';
import auth from '@/middlewares/auth';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    beforeEnter: () => {
      router.push('/account');
    },
  },
  {
    path: '/task-list',
    name: 'taskList',
    beforeEnter: auth,
    component: () =>
      import(/* webpackChunkName: "taskList" */ '../views/TaskList.vue'),
  },
  {
    path: '/task/:taskID',
    name: 'taskDetail',
    beforeEnter: auth,
    component: () =>
      import(/* webpackChunkName: "taskDetail" */ '../views/TaskDetail.vue'),
  },
  {
    path: '/account',
    name: 'account',
    beforeEnter: auth,
    component: () =>
      import(/* webpackChunkName: "account" */ '../views/AccountList.vue'),
  },
  {
    path: '/account/register',
    name: 'accountRegister',
    beforeEnter: auth,
    component: () =>
      import(
        /* webpackChunkName: "accountRegister" */ '../views/AccountNew.vue'
      ),
  },
  {
    path: '/product-list',
    name: 'productList',
    beforeEnter: auth,
    component: () =>
      import(/* webpackChunkName: "productList" */ '../views/ProductList.vue'),
  },
  {
    path: '/product/import',
    name: 'productImport',
    beforeEnter: auth,
    component: () =>
      import(
        /* webpackChunkName: "productList" */ '../views/ProductImport.vue'
      ),
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
  },
  {
    path: '/test',
    name: 'testView',
    component: () =>
      import(/* webpackChunkName: "testView" */ '../views/TestView.vue'),
  },
  {
    path: '*',
    name: 'notfound',
    beforeEnter: auth,
    component: () =>
      import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'is-active',
  base: process.env.BASE_URL,
  routes,
});

export default router;
