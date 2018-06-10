import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    errorFetching: false,
    isFetching: false,
    screenshot: {
      type: "",
      data: []
    }
  },
  actions: {
    async getScreenshot({ commit }, payload) {
      commit("setErrorFetching", { errorFetching: false });
      commit("setFetching", { isFetching: true });

      try {
        if (!payload.url || !payload.viewportSize) throw "The URL or Viewport Size is missing - " + payload;

        const encodedUrl = encodeURIComponent(payload.url);
        const url = `/api/screenshot/${encodedUrl}/${payload.viewportSize}/${payload.fullPage}`;
        const res = await axios.get(url);
        commit("setScreenshot", { screenshot: res.data });
        commit("setFetching", { isFetching: false });
      } catch (err) {
        console.error(err);
        commit("setErrorFetching", { errorFetching: true });
        commit("setFetching", { isFetching: false });
      }
    }
  },
  mutations: {
    setErrorFetching(state, payload) {
      Vue.set(state, "errorFetching", payload.errorFetching)
    },
    setFetching(state, payload) {
      Vue.set(state, "isFetching", payload.isFetching);
    },
    setScreenshot(state, payload) {
      Vue.set(state.screenshot, "type", payload.screenshot.type);
      Vue.set(state.screenshot, "data", payload.screenshot.data);
    }
  }
});

export default store;
