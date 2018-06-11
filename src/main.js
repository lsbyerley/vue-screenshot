// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex';
import App from './App'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false

Vue.use(Buefy)

const isProd = process.env.NODE_ENV !== 'development'

Vue.use(VueAnalytics, {
  id: 'UA-114371448-2',
  router,
  debug: {
    enabled: !isProd,
    sendHitTask: isProd
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
