<template>
  <main>
    <Loading :active="isLoading" :is-full-page="true" :can-cancel="false" />
    <div
      class="flex items-center mb-4 text-green-700 font-bold text-lg uppercase">
      <ThemifyIcon icon="menu" />
      <h1 class="ml-2">List of all products</h1>
    </div>
    <div
      class="flex items-center mb-4 text-gray-700 font-bold text-md uppercase">
      <h1 class="ml-2">Total products: {{ totalProducts }}</h1>
    </div>
    <div class="overflow-x-auto relative">
      <table
        class="overflow-scroll w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">Barcode</th>
            <th scope="col" class="py-3 px-6">Product name</th>
            <th scope="col" class="py-3 px-6">Last modified</th>
            <th scope="col" class="py-3 px-6">Action</th>
          </tr>
        </thead>
        <tbody
          v-if="
            productsData.result
              ? productsData.result.perPage > 0
                ? true
                : false
              : false
          ">
          <tr
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            v-for="(product, i) in productsData.result.data"
            :key="i">
            <th
              scope="row"
              class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ product.barcode }}
            </th>
            <td class="py-4 px-6">{{ product.productName }}</td>
            <td class="py-4 px-6">{{ dateFormat(product.updatedAt) }}</td>
            <td class="py-4 px-6" v-on:click="handleDelete(product.barcode)">
              <div class="text-red-500 cursor-pointer">
                <ThemifyIcon icon="trash" />Delete
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="
          productsData.result
            ? productsData.result.perPage <= 0
              ? true
              : false
            : true
        "
        class="flex w-full justify-center p-8">
        <h1 class="">Empty list, there is no data!</h1>
      </div>
      <div
        class="flex items-center"
        v-if="
          productsData.result
            ? productsData.result.perPage > 0
              ? true
              : false
            : false
        ">
        <button
          class="underline px-2 py-1 rounded-full"
          v-if="productsData && productsData.currentPage != 1"
          v-on:click="pagePagination(productsData.currentPage - 1)">
          Previous
        </button>
        <p class="px-2 py-4 font-bold">
          {{ `${productsData.currentPage}/${productsData.pageTotal}` }}
        </p>
        <button
          class="underline px-2 py-1 rounded-full"
          v-if="
            productsData && productsData.currentPage < productsData.pageTotal
          "
          v-on:click="pagePagination(productsData.currentPage + 1)">
          Next
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import ThemifyIcon from 'vue-themify-icons/ThemifyIcon.vue';
import {mapState} from 'vuex';
import dateFormat from '../helpers/dateFormat';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  data() {
    return {
      isLoading: false,
      productsData: {
        currentPage: null,
        msg: null,
        pageTotal: null,
        result: null,
        status: null,
        statusCode: null,
        totalProducts: null,
      },
      totalProducts: 0,
    };
  },
  async mounted() {
    this.fetchData();
  },
  methods: {
    dateFormat,
    pagePagination(page) {
      this.$router.push(`/product-list?page=${page}`);
      this.fetchData();
      this.isLoading = false;
    },
    async fetchData(page = 1) {
      this.isLoading = true;
      let pageSelect = this.$route.query
        ? parseInt(this.$route.query.page)
        : page;
      await axios
        .get(
          `${process.env.VUE_APP_API_URL}/product/get-all?page=${pageSelect}&token=${this.accessToken}`,
        )
        .then(res => {
          if (res.data.status && (res.data.result.perPage ? true : false)) {
            this.productsData = res.data;
            this.totalProducts = res.data.totalProducts;
          } else {
            this.productsData = {
              currentPage: null,
              msg: null,
              pageTotal: null,
              result: null,
              status: null,
              statusCode: null,
              totalProducts: null,
            };
          }
        });
      this.isLoading = false;
    },
    async handleDelete(barcode = null) {
      this.isLoading = true;
      console.log(barcode);
      await axios
        .delete(
          `${process.env.VUE_APP_API_URL}/product/${barcode}/delete?token=${this.accessToken}`,
        )
        .then(res => {
          if (res.data.status) {
            this.toastify.success(res.data.msg.en);
          } else {
            this.toastify.success(res.data.msg.en);
          }
        })
        .catch(err => {
          this.toastify.error(err.response.data.msg.en);
        });
      this.isLoading = false;
      this.fetchData();
    },
  },
  computed: {...mapState(['accessToken', 'toastify'])},
  components: {ThemifyIcon, Loading},
};
</script>

<style></style>
