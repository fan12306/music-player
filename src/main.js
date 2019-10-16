// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyLoad'
import store from './store'
import 'lib-flexible/flexible'

import './common/stylus/index.styl'

import fastclick from 'fastclick'
fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('./common/images/default.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: c => c(App),
  store
})
