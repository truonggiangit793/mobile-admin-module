import axios from 'axios';
import store from '@/store';
export default async function (to, from, next) {
  console.log({from, to, next});
  axios
    .get(
      `${process.env.VUE_APP_API_URL}/transaction/${to.params.transactionID}?token=${store.state.accessToken}`,
    )
    .then(res => {
      console.log(res);
    });
}
