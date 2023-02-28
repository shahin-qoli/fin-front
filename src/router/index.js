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
import LoginView from '../views/LoginView.vue'
import JobListView from '../views/JobListView.vue'
Vue.use(VueRouter)
function guardMyroute(to, from, next)
{
 var isAuthenticated= false;
//this is just an example. You will have to find a better or 
// centralised way to handle you localstorage data handling 
if(localStorage.getItem('token'))
  isAuthenticated = true;
 else
  isAuthenticated= false;
 if(isAuthenticated) 
 {
  next(); // allow to enter route
 } 
 else
 {
  next('/login'); // go to '/login';
 }
}
const routes = [
  {
    path: '/',
    name: 'home',
    beforeEnter : guardMyroute,
    component: HomeView
  },  {
    path: '/cardtocard',
    name: 'cardtocard',
    beforeEnter : guardMyroute,
    component: CardtocardView
  },{
    path: '/cardtocardlist',
    name: 'cardtocardlist',
    beforeEnter : guardMyroute,
    component: CardtocardListView
  },{
    path: '/cardtocardusedlist',
    name: 'cardtocardusedlist',
    beforeEnter : guardMyroute,
    component: CardtocardUsedListView
  },  {
    path: '/pos',
    name: 'pos',
    beforeEnter : guardMyroute,
    component: PosView
  },{
    path: '/poslist',
    name: 'poslist',
    beforeEnter : guardMyroute,
    component: PosListView
  },{
    path: '/posusedlist',
    name: 'posusedlist',
    beforeEnter : guardMyroute,
    component: PosUsedListView
  },{
    path: '/requests',
    name: 'requests',
    beforeEnter : guardMyroute,
    component: RequestView
  },{
    path: '/joblist',
    name: 'jobslist',
    beforeEnter : guardMyroute,
    component: JobListView
  },{
    path: '/login',
    name: 'login',
    component: LoginView
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
