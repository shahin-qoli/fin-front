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
import AccounttoaccountListView from '../views/AccounttoaccountListView.vue'
import SalePersonListView from '../views/SalePersonListView.vue'
import PayaneVisitorListView from '../views/PayaneVisitorView.vue'
import payanereportView from '../views/PayaneReportsView.vue'
import chequeView from '../views/ChequeView.vue'
import SyncDashboard from '../views/SyncDashboard.vue'
import MiarzeMarketingView from '../views/MiarzeMarketingView.vue'
import spreeInvoiceDashboardView from '../views/SpreeInvoiceDashboardView.vue'
import chequeLogs from '../views/ChequeLogsView.vue'
import ChequeUpdate from '../views/ChequeUpdateView.vue'
import BankList from '../views/BankListView.vue'
import ImportTemplateView from '../views/ImportTemplateView.vue'
import ClubMainView from '../views/ClubMainView.vue'
import MiarzeMessageTemplateView from '../views/MiarzeMessageTemplatesView.vue'
import RegisterationDashboardView from '../views/RegistrationDashboardView.vue'
import spreeInvoiceVendorDashboardView from '../views/SpreeInvoiceVendorView.vue'
import ClubPublicView from '../views/ClubPublicView.vue'
import UploadPictureView from '../views/UploadPictureView.vue'
import AddPictureView from '../views/AddPictureView.vue'
import UsingPromotions from '../views/UsingPromotionsView.vue'
import TaxServiceDashboard from '../views/TaxServiceDashboardView.vue'
import GoldenPayaneReportView from '../views/GoldenPayaneReportView.vue'
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
 || localStorage.getItem('userRole') == 'sale' || localStorage.getItem('userRole') == 'credit' ) )
 {
  next(); // allow to enter route
 } 
 else
 {
  next('/login'); // go to '/login';
 }
}
function guardMyrouteCheque(to, from, next){
  var isAuthenticated= false;
  //this is just an example. You will have to find a better or 
  // centralised way to handle you localstorage data handling 
  
  if(localStorage.getItem('token'))
    isAuthenticated = true;
   else
    isAuthenticated= false;
   if(isAuthenticated && (localStorage.getItem('userRole') == 'admin' || localStorage.getItem('userRole') == 'finance' 
   || localStorage.getItem('userRole') == 'credit' ) )
   {
    next(); // allow to enter route
   } 
   else
   {
    next('/login'); // go to '/login';
   }
}

function guardMyrouteSpree(to, from, next){
  var isAuthenticated= false;
  //this is just an example. You will have to find a better or 
  // centralised way to handle you localstorage data handling 
  
  if(localStorage.getItem('token'))
    isAuthenticated = true;
   else
    isAuthenticated= false;
   if(isAuthenticated && (localStorage.getItem('userRole') == 'admin' || localStorage.getItem('userRole') == 'spree') )
   {
    next(); // allow to enter route
   } 
   else
   {
    next('/login'); // go to '/login';
   }
}
function guardMyrouteLoggedIn(to, from, next){
  var isAuthenticated= false;
  //this is just an example. You will have to find a better or 
  // centralised way to handle you localstorage data handling 
  
  if(window.localStorage.getItem('token'))
    isAuthenticated = true;
   else
    isAuthenticated= false;
   if(isAuthenticated )
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
    path: '/addpicture2',
    name: 'addpicture2',
    // beforeEnter : guardMyrouteAdmin,
    
    component: UploadPictureView
  }, 
  {
    path: '/addpicture',
    name: 'addpicture',
    // beforeEnter : guardMyrouteAdmin,
    
    component: AddPictureView
  }, 
  {
    path: '/registartiondashboard',
    name: 'registartiondashboard',
    component: RegisterationDashboardView
  }, {
    path: '/club/use',
    name: 'clubuse',
    // beforeEnter : guardMyrouteAdmin,
    
    component: UsingPromotions
  },  {
    path: '/club',
    name: 'club',
    // beforeEnter : guardMyrouteAdmin,
    
    component: ClubMainView
  },{
    path: '/club/:mobile',
    name: 'club',
    // beforeEnter : guardMyrouteAdmin,
    
    component: ClubPublicView
  },
  {
    path: '/',
    name: 'home',
    beforeEnter : guardMyrouteLoggedIn,
    component: HomeView
  },  {
    path: '/cardtocard',
    name: 'cardtocard',
    beforeEnter : guardMyrouteAdmin,
    
    component: CardtocardView
  },{
    path: '/cheque',
    name: 'cheque',
    beforeEnter : guardMyrouteCheque,
    
    component: chequeView
  }
  ,{
    path: '/chequeupdate',
    name: 'chequeupdate',
    beforeEnter : guardMyrouteCheque,
    
    component: ChequeUpdate
  },  {
    path: '/sync',
    name: 'sync',
    beforeEnter : guardMyrouteCheque,
    component: SyncDashboard
  },{
    path: '/taxsync',
    name: 'taxsync',
    beforeEnter : guardMyrouteCheque,
    component: TaxServiceDashboard
  },
  {
    path: '/chequelogs',
    name: 'chequelogs',
    beforeEnter : guardMyrouteCheque,
    component: chequeLogs
  },
  {
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
    path: '/accounttoaccountlist',
    name: 'accounttoaccountlist',
    beforeEnter : guardMyrouteAdmin,
    component: AccounttoaccountListView
  },{
    path: '/poslist',
    name: 'poslist',
    beforeEnter : guardMyrouteAdmin,
    component: PosListView
  },
  {
    path: '/importtemplate',
    name: 'importtemplate',
    beforeEnter : guardMyrouteAdmin,
    component: ImportTemplateView
  }
  ,{
    path: '/requests',
    name: 'requests',
    beforeEnter : guardMyrouteAdminSale,
    component: RequestView
  },{
    path: '/joblist',
    name: 'jobslist',
    beforeEnter : guardMyrouteAdmin,
    component: JobListView
  }, {
    path: '/banklist',
    name: 'banklist',
    beforeEnter : guardMyrouteAdmin,
    component: BankList
  },
   {
    path: '/bankcardlist',
    name: 'bankcardlist',
    beforeEnter : guardMyrouteAdmin,
    component: BankCardList
  },{
    path: '/bankaccountlist',
    name: 'bankaccountlist',
    beforeEnter : guardMyrouteAdmin,
    component: BankAccountList
  },{
    path: '/salepersonlist',
    name: 'salepersonlist',
    beforeEnter : guardMyrouteAdmin,
    component: SalePersonListView
  },{
    path: '/payanevisitorlist',
    name: 'payanevisitorlist',
    beforeEnter : guardMyrouteAdmin,
    component: PayaneVisitorListView
  },{
    path: '/payanereport',
    name: 'payanereport',
    beforeEnter : guardMyrouteAdmin,
    component: payanereportView
  },{
    path: '/goldenpayanereport',
    name: 'goldenpayanereport',
    beforeEnter : guardMyrouteAdmin,
    component: GoldenPayaneReportView
  },
  {
    path: '/usetransaction',
    name: 'usetransaction',
    beforeEnter : guardMyrouteAdminSale,
    component: SaleUseTransaction
  },
  {
    path: '/spree',
    name: 'spreedashboard',
    beforeEnter : guardMyrouteSpree,
    component: spreeInvoiceDashboardView
  },  {

    path: '/miarzemarketing',
    name: 'miarzemarketing',
    beforeEnter : guardMyrouteSpree,
    component: MiarzeMarketingView
  },{
    path: '/miarzemessagetemplates',
    name: 'miarzemessagetemplates',
    beforeEnter : guardMyrouteSpree,
    component: MiarzeMessageTemplateView
  },{
    path: '/spreevendor',
    name: 'spreevendor',
    beforeEnter : guardMyrouteSpree,
    component: spreeInvoiceVendorDashboardView
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
