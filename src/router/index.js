import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CardtocardView from '../views/CardtocardView.vue'
import CardtocardListView from '../views/CardtocardListView.vue'

import PosView from '../views/PosView.vue'
import PosListView from '../views/PosListView.vue'

import RequestView from '../views/RequestView.vue'
import LoginView from '../views/LoginView.vue'
import JobListView from '../views/JobListView.vue'
import SaleUseTransaction from '../views/SaleUseTransaction.vue'
import BankCardList from '../views/BankCardListView.vue'
import BankAccountList from '../views/BankAccountListView.vue'
Vue.use(VueRouter)
function guardMyrouteAdmin(to, from, next)
{
  console.log (to)
 var isAuthenticated= false;
//this is just an example. You will have to find a better or 
// centralised way to handle you localstorage data handling 
if(localStorage.getItem('token'))
  isAuthenticated = true;
 else
  isAuthenticated= false;
 if(isAuthenticated && (localStorage.getItem('userRole') == 'admin' || localStorage.getItem('userRole') == 'finance' ) )
 {
  next(); // allow to enter route
 } 
 else
 {
  next('/login'); // go to '/login';
 }
}
function guardMyrouteAdminSale(to, from, next)
{
  console.log (to)
 var isAuthenticated= false;
//this is just an example. You will have to find a better or 
// centralised way to handle you localstorage data handling 

if(localStorage.getItem('token'))
  isAuthenticated = true;
 else
  isAuthenticated= false;
 if(isAuthenticated && (localStorage.getItem('userRole') == 'admin' || localStorage.getItem('userRole') == 'finance' 
 || localStorage.getItem('userRole') == 'sale' ) )
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
    beforeEnter : guardMyrouteAdminSale,
    component: HomeView
  },  {
    path: '/cardtocard',
    name: 'cardtocard',
    beforeEnter : guardMyrouteAdmin,
    
    component: CardtocardView
  },{
    path: '/cardtocardlist',
    name: 'cardtocardlist',
    beforeEnter : guardMyrouteAdmin,
    component: CardtocardListView
  },  {
    path: '/pos',
    name: 'pos',
    beforeEnter : guardMyrouteAdmin,
    component: PosView
  },{
    path: '/poslist',
    name: 'poslist',
    beforeEnter : guardMyrouteAdmin,
    component: PosListView
  },{
    path: '/requests',
    name: 'requests',
    beforeEnter : guardMyrouteAdminSale,
    component: RequestView
  },{
    path: '/joblist',
    name: 'jobslist',
    beforeEnter : guardMyrouteAdmin,
    component: JobListView
  },  {
    path: '/bankcardlist',
    name: 'bankcardlist',
    beforeEnter : guardMyrouteAdmin,
    component: BankCardList
  },{
    path: '/bankaccountlist',
    name: 'bankaccountlist',
    beforeEnter : guardMyrouteAdmin,
    component: BankAccountList
  },
  {
    path: '/usetransaction',
    name: 'usetransaction',
    beforeEnter : guardMyrouteAdminSale,
    component: SaleUseTransaction
  },
  
  
  {
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
