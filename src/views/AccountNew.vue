<template>
  <main>
    <Loading :active="isLoading" :is-full-page="true" :can-cancel="false" />
    <div
      class="flex items-center mb-4 text-green-700 font-bold text-lg uppercase">
      <ThemifyIcon icon="menu" />
      <h1 class="ml-2">Create new account</h1>
    </div>
    <div class="mb-6">
      <div class="mb-2 text-md font-medium text-gray-900 flex items-center">
        <ThemifyIcon icon="settings" />
        <p class="ml-2">Import accounts from excel:</p>
      </div>
      <div class="flex mb-6">
        <input
          v-on:change="uploadFile"
          ref="file"
          class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer pl-2 py-2 mr-4"
          type="file" />
        <div
          v-on:click="importExcelHandler"
          class="flex justify-center items-center bg-blue-400 hover:bg-blue-500 transition-all text-white w-80 text-center rounded cursor-pointer">
          <ThemifyIcon icon="upload" />
          <button class="ml-2">Import</button>
        </div>
      </div>
      <div class="mb-2 text-md font-medium text-gray-900 flex items-center">
        <ThemifyIcon icon="settings" />
        <p class="ml-2">Download file format of excel to import accounts:</p>
      </div>
      <div
        v-on:click="downloadExampleHandler"
        class="flex justify-center items-center bg-green-400 hover:bg-green-500 transition-all text-white w-60 py-2 rounded mb-3 cursor-pointer">
        <ThemifyIcon icon="download" />
        <button class="ml-2">Donwload example</button>
      </div>
    </div>

    <div>
      <div class="mb-2 text-md font-medium text-gray-900 flex items-center">
        <ThemifyIcon icon="settings" />
        <p class="ml-2">Insert new product manually:</p>
      </div>
      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >User code</label
          >
          <input
            v-model="userCode"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="User code"
            required="" />
        </div>
        <div>
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Full name</label
          >
          <input
            v-model="fullName"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Fullname"
            required="" />
        </div>
        <div>
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="example@gmail.com"
            required="" />
        </div>
        <div>
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Phone number</label
          >
          <input
            v-model="phoneNumber"
            type="tel"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="0123-456-789"
            pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}"
            required="" />
        </div>
      </div>
      <div class="mb-6">
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Password</label
        >
        <input
          v-model="password"
          type="password"
          id="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Password"
          required="" />
      </div>
      <div class="mb-6">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Role</label
        >
        <select
          v-model="role"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
          <option value="STAFF" selected>STAFF</option>
          <option value="MANAGER">MANAGER</option>
        </select>
      </div>
      <button
        type="submit"
        v-on:click="registerAccountHandler"
        class="text-white transition-all bg-blue-400 hover:bg-blue-500 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-2.5 text-center">
        Submit
      </button>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import ThemifyIcon from 'vue-themify-icons/ThemifyIcon.vue';
import {mapState} from 'vuex';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {ThemifyIcon, Loading},
  data() {
    return {
      isLoading: false,
      fileImport: null,
      userCode: null,
      fullName: null,
      email: null,
      phoneNumber: null,
      password: null,
      role: 'STAFF',
    };
  },
  methods: {
    uploadFile() {
      this.fileImport = this.$refs.file.files[0];
    },
    async downloadExampleHandler() {
      await axios({
        url: `${process.env.VUE_APP_API_URL}/account/download-example?token=${this.accessToken}`,
        method: 'GET',
        responseType: 'blob',
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        const fileName = 'account-example.xlsx';
        fileLink.setAttribute('download', fileName);
        fileLink.setAttribute('target', '_blank');
        document.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove();
      });
    },
    async importExcelHandler() {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.fileImport);
      const headers = {'Content-Type': 'multipart/form-data'};
      await axios
        .post(
          `${process.env.VUE_APP_API_URL}/account/import?token=${this.accessToken}`,
          formData,
          {headers},
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
      this.isLoading = false;
    },
    async registerAccountHandler() {
      this.isLoading = true;
      await axios
        .post(
          `${process.env.VUE_APP_API_URL}/account/register?token=${this.accessToken}`,
          {
            userCode: this.userCode,
            fullName: this.fullName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            password: this.password,
            role: this.role,
          },
        )
        .then(res => {
          if (res.data.status) {
            this.toastify.success(res.data.msg.en);
            this.fileImport = null;
            this.userCode = null;
            this.fullName = null;
            this.email = null;
            this.phoneNumber = null;
            this.password = null;
            this.role = null;
          } else {
            this.toastify.error(res.data.msg.en);
          }
        })
        .catch(err => {
          this.toastify.error(err.response.data.msg.en);
        });
      this.isLoading = false;
    },
  },
  computed: {...mapState(['accessToken', 'payload', 'toastify'])},
};
</script>
