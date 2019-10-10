/* jshint esversion: 6 */
import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/Recommend/Recommend.vue'
import Singer from '../components/Singer/Singer.vue'
import Search from '../components/Search/Search.vue'
import Rank from '../components/Rank/Rank.vue'
import SingerDetail from '../components/Singer-detail/Singer-detail.vue'
Vue.use(Router)
export default new Router({
  routes: [{
      path: '/',
      redirect: '/Recommend'
    },
    {
      path: '/Recommend',
      component: Recommend
    },
    {
      path: '/Singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },

    {
      path: '/Search',
      component: Search
    },
    {
      path: '/Rank',
      component: Rank
    }
  ],
})
