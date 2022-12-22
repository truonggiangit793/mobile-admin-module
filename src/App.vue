<template>
  <div id="app">
    <div class="left-menu">
      <div
        class="flex text-white justify-center items-center p-4"
        style="background: #458b69">
        <img src="@/assets/logo.png" width="25px" />
        <h1 class="font-bold text-2xl uppercase ml-4">Vue dashboard</h1>
      </div>
      <div class="w-full p-6">
        <h1 class="text-2xl text-center">
          {{ payload ? `Hi, ${payload.fullName}` : 'Welcome!' }}
        </h1>
        <div class="menu-list mt-8" v-if="payload && accessToken">
          <div v-if="payload.role === 'ADMIN' || payload.role === 'MANAGER'">
            <ul class="mb-3">
              <div class="flex items-center mb-1 text-white">
                <ThemifyIcon icon="arrow-circle-right" />
                <h1 class="ml-2 font-bold uppercase">Task Management</h1>
              </div>
              <router-link to="/task-list">
                <div class="flex items-center w-full pl-6 transition-all">
                  <ThemifyIcon icon="user" />
                  <li class="p-1 pl-2">Task List</li>
                </div>
              </router-link>
            </ul>
            <hr class="my-4 opacity-50" />
            <ul class="mb-3">
              <div class="flex items-center mb-1 text-white">
                <ThemifyIcon icon="arrow-circle-right" />
                <h1 class="ml-2 font-bold uppercase">Account Management</h1>
              </div>
              <router-link to="/account">
                <div class="flex items-center w-full pl-6 transition-all">
                  <ThemifyIcon icon="user" />
                  <li class="p-1 pl-2">Account List</li>
                </div>
              </router-link>
              <router-link
                to="/account/register"
                v-if="payload.role == 'ADMIN'">
                <div class="flex items-center w-full pl-6 transition-all">
                  <ThemifyIcon icon="plus" />
                  <li class="p-1 pl-2">Import data</li>
                </div>
              </router-link>
            </ul>
            <hr class="my-4 opacity-50" />
            <ul class="mb-3">
              <div class="flex items-center mb-1 text-white">
                <ThemifyIcon icon="arrow-circle-right" />
                <h1 class="ml-2 font-bold uppercase">Products & Supplier</h1>
              </div>
              <router-link to="/product-list">
                <div class="flex items-center w-full pl-6 transition-all">
                  <ThemifyIcon icon="harddrives" />
                  <li class="p-1 pl-2">Products list</li>
                </div>
              </router-link>
              <router-link to="/product/import">
                <div class="flex items-center w-full pl-6 transition-all">
                  <ThemifyIcon icon="plus" />
                  <li class="p-1 pl-2">Import data</li>
                </div>
              </router-link>
            </ul>
          </div>
        </div>
        <div
          v-if="accessToken && payload"
          class="logout-btn py-2 hover:bg-red-500 transition-all bg-red-400 flex justify-center items-center cursor-pointer"
          v-on:click="handleSignOut">
          <ThemifyIcon icon="power-off" />
          <button class="ml-4">Logout</button>
        </div>
      </div>
    </div>
    <main class="main-container">
      <router-view />
    </main>
  </div>
</template>

<script>
import ThemifyIcon from 'vue-themify-icons/ThemifyIcon.vue';
import {mapState} from 'vuex';

export default {
  mounted() {
    this.$store.commit('set_toastify', this.$vToastify);
  },
  methods: {
    handleSignOut() {
      localStorage.removeItem('x-access-token');
      localStorage.removeItem('payload');
      this.$store.commit('set_access_token', null);
      this.$store.commit('set_payload', null);
      this.$router.push('/login');
    },
  },
  components: {ThemifyIcon},
  computed: {
    ...mapState(['accessToken', 'payload']),
  },
};
</script>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.left-menu {
  position: fixed;
  width: 400px;
  top: 0;
  bottom: 0;
  background: #79bda1;
  color: white;
  box-shadow: 8px 0 10px 0 #0000001f;
  z-index: 10;
}
.left-menu-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  background: #458b69;
  color: #79bda1;
}
main.main-container {
  position: absolute;
  width: calc(100% - 400px);
  transform: translateX(400px);
  padding: 20px 20px;
}
a.is-active div {
  background: white;
  color: black;
  border-radius: 100px;
}
.logout-btn {
  width: 85%;
  position: absolute;
  font-size: 20px;
  border-radius: 100px;
  bottom: 40px;
}
.vld-overlay.is-full-page {
  height: 100vh;
}
</style>
