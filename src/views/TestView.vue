<template>
  <main>
    <p>Test</p>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {};
  },
  async mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const app_id = 10100;
      const format = 'json';
      const account = 'kjnwjn38';
      const password = '941a9d9a295bae57e6d211e5327f4a7c';
      const return_url = 'https%3A%2F%2Faccount.garena.com%2F';
      const api_url = 'https://sso.garena.com/api/login';
      const request_id = Date.now();
      console.log(request_id);

      await axios
        .get(
          `${api_url}?app_id=${app_id}&account=${account}&password=${password}{&redirect_uri=${return_url}&format=${format}&id=${request_id}`,
        )
        .then(res => {
          console.log({res});
        })
        .catch(e => {
          console.log({Error: e});
        });
    },
  },
};
</script>

<style></style>
