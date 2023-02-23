import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CardtocardView from '../views/CardtocardView.vue'
import CardtocardListView from '../views/CardtocardListView.vue'
import CardtocardUsedListView from '../views/CardtocardUsedListView.vue'

import PosView from '../views/PosView.vue'
import PosListView from '../views/PosListView.vue'
import PosUsedListView from '../views/PosUsedListView.vue'
import RequestView from '../views/RequestView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },  {
    path: '/cardtocard',
    name: 'cardtocard',
    component: CardtocardView
  },{
    path: '/cardtocardlist',
    name: 'cardtocardlist',
    component: CardtocardListView
  },{
    path: '/cardtocardusedlist',
    name: 'cardtocardusedlist',
    component: CardtocardUsedListView
  },  {
    path: '/pos',
    name: 'pos',
    component: PosView
  },{
    path: '/poslist',
    name: 'poslist',
    component: PosListView
  },{
    path: '/posusedlist',
    name: 'posusedlist',
    component: PosUsedListView
  },{
    path: '/requests',
    name: 'requests',
    component: RequestView
  },


  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
