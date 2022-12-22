<template>
  <main>
    <Loading :active="isLoading" :is-full-page="true" :can-cancel="false" />
    <div
      class="flex items-center mb-4 text-green-700 font-bold text-lg uppercase">
      <ThemifyIcon icon="menu" />
      <h1 class="ml-2">Accounts list</h1>
    </div>
    <div class="flex items-center mb-4 text-gray-700 font-bold uppercase">
      <h1 class="ml-2">Total accounts: {{ totalAccounts }}</h1>
    </div>
    <div class="overflow-x-auto relative">
      <table
        class="overflow-scroll w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">User code</th>
            <th scope="col" class="py-3 px-6">Fullname</th>
            <th scope="col" class="py-3 px-6">Email</th>
            <th scope="col" class="py-3 px-6">Phone</th>
            <th scope="col" class="py-3 px-6">Role</th>
            <th scope="col" class="py-3 px-6">Created At</th>
            <th scope="col" class="py-3 px-6">Last modified</th>
            <th scope="col" class="py-3 px-6" v-if="payload.role == 'ADMIN'">
              Action
            </th>
          </tr>
        </thead>
        <tbody v-if="accountList && accountList.data.length > 0">
          <tr
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            v-for="(account, i) in accountList.data"
            :key="i">
            <th
              scope="row"
              class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ account.userCode }}
            </th>
            <td class="py-4 px-6">{{ account.fullName }}</td>
            <td class="py-4 px-6">{{ account.email }}</td>
            <td class="py-4 px-6">{{ account.phoneNumber }}</td>
            <td class="py-4 px-6">{{ account.role }}</td>
            <td class="py-4 px-6">{{ dateFormat(account.createdAt) }}</td>
            <td class="py-4 px-6">{{ dateFormat(account.updatedAt) }}</td>
            <td
              class="py-4 px-6"
              v-on:click="accountRemoveHandler(account.userCode)"
              v-if="payload.role == 'ADMIN'">
              <div class="text-red-500 cursor-pointer">
                <ThemifyIcon icon="trash" />Delete
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!accountList" class="flex w-full justify-center p-8">
        <h1 class="">Empty list, there is no data!</h1>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import ThemifyIcon from 'vue-themify-icons/ThemifyIcon.vue';
import {mapState} from 'vuex';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import dateFormat from '../helpers/dateFormat';

export default {
  data() {
    return {
      isLoading: true,
      accountList: null,
      totalAccounts: 0,
    };
  },
  async mounted() {
    this.fetchData();
  },
  methods: {
    dateFormat,
    async fetchData() {
      this.isLoading = true;
      await axios
        .get(
          `${process.env.VUE_APP_API_URL}/account/get-all?token=${this.accessToken}`,
        )
        .then(res => {
          if (res.data.status) {
            this.accountList = res.data.result;
            this.totalAccounts = res.data.result.total;
          }
        })
        .catch(() => {
          this.accountList = null;
        });
      this.isLoading = false;
    },
    async accountRemoveHandler(userCode) {
      this.isLoading = true;
      await axios
        .delete(
          `${process.env.VUE_APP_API_URL}/account/${userCode}/delete?token=${this.accessToken}`,
        )
        .then(res => {
          if (res.data.status) {
            this.toastify.success(res.data.msg.en);
          } else {
            this.toastify.error(res.data.msg.en);
          }
        })
        .catch(err => {
          this.toastify.error(err.response.data.msg.en);
        });
      this.fetchData();
      this.isLoading = false;
    },
  },
  computed: {...mapState(['accessToken', 'payload', 'toastify'])},
  components: {ThemifyIcon, Loading},
};
</script>

<style></style>
