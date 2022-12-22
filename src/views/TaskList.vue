<template>
  <main>
    <Loading :active="isLoading" :is-full-page="true" :can-cancel="false" />
    <div
      class="flex items-center mb-4 text-green-700 font-bold text-lg uppercase">
      <ThemifyIcon icon="menu" />
      <h1 class="ml-2">Task list management</h1>
    </div>
    <div class="mb-6">
      <div class="mb-2 text-md font-medium text-gray-900 flex items-center">
        <ThemifyIcon icon="settings" />
        <p class="ml-2">Start to create a new task:</p>
      </div>
      <div class="flex mb-6">
        <input
          v-model="taskName"
          class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 pl-2 py-2 mr-4"
          placeholder="Enter task name..."
          type="text" />
        <div
          v-on:click="newTaskHandler"
          class="flex justify-center items-center transition-all bg-green-400 hover:bg-green-500 text-white w-80 text-center rounded cursor-pointer">
          <ThemifyIcon icon="plus" />
          <button class="ml-2">New task</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-md font-medium text-gray-900 flex items-center">
      <ThemifyIcon icon="settings" />
      <p class="ml-2">List of all tasks:</p>
    </div>
    <div class="flex items-center mb-4 text-gray-700 font-bold uppercase">
      <h1 class="ml-2">Total task: {{ totalTask }}</h1>
    </div>
    <div class="overflow-x-auto relative">
      <table
        class="overflow-scroll w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">Task name</th>
            <th scope="col" class="py-3 px-6">Members</th>
            <th scope="col" class="py-3 px-6">Created At</th>
            <th scope="col" class="py-3 px-6">Last modified</th>
            <th scope="col" class="py-3 px-6" v-if="payload.role == 'ADMIN'">
              Remove
            </th>
            <th scope="col" class="py-3 px-6" v-if="payload.role == 'ADMIN'">
              Mark done
            </th>
            <th
              scope="col"
              class="py-3 px-6 bg-"
              v-if="payload.role == 'ADMIN'">
              Export
            </th>
          </tr>
        </thead>
        <tbody v-if="taskList && taskList.data.length > 0">
          <tr
            :class="{
              'bg-green-100 border-b': task.isDone,
              'bg-yellow-100 border-b': !task.isDone,
            }"
            v-for="(task, i) in taskList.data"
            :key="i">
            <router-link
              :to="'/task/' + task.taskID"
              v-if="payload.role == 'ADMIN'">
              <th
                scope="row"
                class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ task.taskName }}
              </th>
            </router-link>
            <td class="py-4 px-6">{{ task.memberList.length }}</td>
            <td class="py-4 px-6">{{ dateFormat(task.createdAt) }}</td>
            <td class="py-4 px-6">{{ dateFormat(task.updatedAt) }}</td>
            <td
              class="py-4 px-6"
              v-on:click="taskRemoveHandler(task.taskID)"
              v-if="payload.role == 'ADMIN'">
              <div class="text-red-500 cursor-pointer flex items-center">
                <ThemifyIcon icon="trash" />
                <p class="ml-1">Delete</p>
              </div>
            </td>
            <td class="py-4 px-6" v-if="payload.role == 'ADMIN' && task.isDone">
              <div class="text-gray-500 flex items-center">
                <ThemifyIcon icon="check" />
                <p class="ml-1">Mark done</p>
              </div>
            </td>
            <td
              class="py-4 px-6"
              v-on:click="taskMarkDoneHandler(task.taskID)"
              v-if="payload.role == 'ADMIN' && !task.isDone">
              <div class="text-green-500 cursor-pointer flex items-center">
                <ThemifyIcon icon="check" />
                <p class="ml-1">Mark done</p>
              </div>
            </td>
            <td
              class="py-4 px-6"
              v-on:click="taskExportHandler(task.taskID)"
              v-if="payload.role == 'ADMIN' && task.isDone">
              <div class="text-blue-500 cursor-pointer flex items-center">
                <ThemifyIcon icon="export" />
                <p class="ml-1">Export</p>
              </div>
            </td>
            <td
              class="py-4 px-6"
              v-if="payload.role == 'ADMIN' && !task.isDone">
              <div class="text-gray-500 flex items-center">
                <ThemifyIcon icon="export" />
                <p class="ml-1">Export</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!taskList" class="flex w-full justify-center p-8">
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
      taskName: '',
      isLoading: true,
      taskList: null,
      totalTask: 0,
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
          `${process.env.VUE_APP_API_URL}/task/get-all?token=${this.accessToken}`,
        )
        .then(res => {
          console.log(res.data);
          if (res.data.status) {
            this.taskList = res.data.result;
            this.totalTask = res.data.result.total;
          } else {
            this.taskList = null;
            this.totalTask = 0;
          }
        })
        .catch(() => {
          this.taskList = null;
        });
      this.isLoading = false;
    },
    async taskRemoveHandler(taskID) {
      this.isLoading = true;
      await axios
        .delete(
          `${process.env.VUE_APP_API_URL}/task/${taskID}/delete?token=${this.accessToken}`,
        )
        .then(res => {
          if (res.data.status) {
            this.toastify.success(res.data.msg.en);
          }
        })
        .catch(err => {
          this.toastify.error(err.response.data.msg.en);
        });
      this.fetchData();
      this.isLoading = false;
    },
    async taskMarkDoneHandler(taskID) {
      this.isLoading = true;
      await axios
        .post(
          `${process.env.VUE_APP_API_URL}/task/${taskID}/mark-done?token=${this.accessToken}`,
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
    async newTaskHandler() {
      this.isLoading = true;
      await axios
        .post(
          `${process.env.VUE_APP_API_URL}/task/new?token=${this.accessToken}`,
          {
            taskName: this.taskName,
          },
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
      this.taskName = '';
      this.fetchData();
      this.isLoading = false;
    },
    async taskExportHandler(taskID) {
      this.isLoading = true;
      const date = new Date();
      await axios({
        url: `${process.env.VUE_APP_API_URL}/task/${taskID}/export?token=${this.accessToken}`,
        method: 'POST',
        responseType: 'blob',
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        const fileName = `product-list-${date}.xlsx`;
        fileLink.setAttribute('download', fileName);
        fileLink.setAttribute('target', '_blank');
        document.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove();
      });
      this.isLoading = false;
    },
  },
  computed: {...mapState(['accessToken', 'payload', 'toastify'])},
  components: {ThemifyIcon, Loading},
};
</script>

<style></style>
