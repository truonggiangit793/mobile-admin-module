export default {
  set_access_token(state, token) {
    state.accessToken = token;
  },
  set_payload(state, payload) {
    state.payload = payload;
  },
  set_toastify(state, obj) {
    state.toastify = obj;
  },
};
