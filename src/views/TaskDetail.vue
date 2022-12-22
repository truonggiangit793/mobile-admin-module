<template>
  <main>
    <Loading :active="isLoading" :is-full-page="true" :can-cancel="false" />
    <div
      class="flex items-center mb-4 text-green-700 font-bold text-lg uppercase">
      <ThemifyIcon icon="menu" />
      <h1 class="ml-2">Task detail</h1>
    </div>
    <ThemifyIcon />
    <div class="mb-6">
      <div class="mb-2 text-md font-medium text-gray-900 flex items-center">
        <ThemifyIcon icon="settings" />
        <p class="ml-2">List of members:</p>
      </div>
      <div class="overflow-x-auto relative">
        <table
          class="overflow-scroll w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="py-3 px-6">User code</th>
              <th scope="col" class="py-3 px-6">Fullname</th>
              <th scope="col" class="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody v-if="accountList && accountList.data.length > 0">
            <tr
              class="border-b"
              v-for="(account, i) in accountList.data"
              :key="i">
              <th
                scope="row"
                class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ account.userCode }}
              </th>
              <td class="py-4 px-6">{{ account.fullName }}</td>
              <td
                class="py-4 px-6"
                v-on:click="addMemberHandler(account.userCode)"
                v-if="
                  task &&
                  !task.memberList.some(mem => mem.userCode == account.userCode)
                ">
                <div class="text-green-500 cursor-pointer flex items-center">
                  <ThemifyIcon icon="plus" />
                  <p class="ml-1">Add member</p>
                </div>
              </td>
              <td class="py-4 px-6" v-else>
                <div class="text-gray-500 flex items-center">
                  <p class="ml-1">Added</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!accountList" class="flex w-full justify-center p-8">
          <h1 class="">Empty list, there is no data!</h1>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <div class="mb-2 text-md font-medium text-gray-900 flex items-center">
        <ThemifyIcon icon="settings" />
        <p class="ml-2">List of products:</p>
      </div>
      <div class="overflow-x-auto relative">
        <table
          class="overflow-scroll w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="py-3 px-6">Barcode</th>
              <th scope="col" class="py-3 px-6">User code</th>
              <th scope="col" class="py-3 px-6">Product name</th>
              <th scope="col" class="py-3 px-6">Expired</th>
              <th scope="col" class="py-3 px-6">Quantity</th>
            </tr>
          </thead>
          <tbody v-if="task && task.productTracked.total > 0">
            <tr
              class="border-b"
              v-for="(product, i) in task.productTracked.list"
              :key="i">
              <th
                scope="row"
                class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ product.barcode }}
              </th>
              <td class="py-4 px-6">{{ product.userCode }}</td>
              <td class="py-4 px-6">{{ product.productName }}</td>
              <td class="py-4 px-6">{{ product.expiredDate }}</td>
              <td class="py-4 px-6">{{ product.quantity }}</td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="!task || task.productTracked.total <= 0"
          class="flex w-full justify-center p-8">
          <h1 class="">Empty list, there is no data!</h1>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import ThemifyIcon from 'vue-themify-icons/ThemifyIcon.vue';
import {mapState} from 'vuex';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      task: null,
      isLoading: false,
      accountList: null,
    };
  },
  async mounted() {
    this.isLoading = true;
    this.fetchData();
    this.isLoading = false;
  },
  methods: {
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
      await axios
        .get(
          `${process.env.VUE_APP_API_URL}/task/${this.$route.params.taskID}/detail?token=${this.accessToken}`,
        )
        .then(res => {
          if (res.data.status) {
            this.task = res.data.task;
          } else {
            this.$router.push('/404');
          }
        })
        .catch(() => {
          this.$router.push('/404');
        });
      this.isLoading = false;
      console.log(this.task.memberList.some(mem => mem.userCode == 'ADMIN'));
    },
    async addMemberHandler(userCode) {
      this.isLoading = true;
      await axios
        .post(
          `${process.env.VUE_APP_API_URL}/task/${this.$route.params.taskID}/add-members?token=${this.accessToken}`,
          {userCode},
        )
        .then(res => {
          if (res.data.status) {
            this.toastify.success(res.data.msg.en);
          } else {
            this.toastify.error(res.data.msg.en);
          }
        })
        .catch(e => {
          console.log({Error: e});
          this.toastify.error('An error occurred, please try again!');
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
