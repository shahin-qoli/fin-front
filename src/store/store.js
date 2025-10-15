

import Vue from 'vue';
import Vuex from 'vuex';
import cardtocards from './modules/cardtocard/index.js';
import poses from './modules/pos/index.js'
import requests from './modules/used/index.js'
import jobs from './modules/job/index.js'
import user from './modules/user/index.js'
import bankcard from './modules/bankcard/index.js';
import bankaccount from './modules/bankaccount/index.js';
import accounttoaccount from './modules/accounttoaccount/index.js';
import saleperson from './modules/saleperson/index.js';
import payanevisitor from './modules/payanevisitor/index.js';
import payanereport from './modules/payanereport/index.js';
import posrawdetails from './modules/posrawdetails/index.js';
import bankpayane from './modules/bankpayane/index.js';
import cheque from './modules/cheque/index.js';
import miarze from './modules/miarze/index.js';
import sync from './modules/sync/index.js';
import club from './modules/club/index.js'
import spree from './modules/spree/index.js'
import b1logs from './modules/b1logs/index.js';
import bank from './modules/bank/index.js'
import exhabition from './modules/exhabition/index.js'
import paymentrequest from './modules/paymentrequest/index.js';
import financialdashboard from './modules/financialdashboard/index.js';
import campaign from './modules/campaign/index.js';
import hrm from './modules/hrm/index.js';
import b1actions from './modules/b1actions/index.js';
import reconciliation from './modules/reconciliation/index.js';
import miarzeVendor from './modules/miarze/vendor/index.js'
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
      cardtocards,
      poses,
      requests,
      jobs,
      user,
      bankcard,
      bankaccount,
      accounttoaccount,
      saleperson,
      payanevisitor,
      payanereport,
      posrawdetails,
      bankpayane,
      cheque,
      sync,     
      spree,
      b1logs,
      bank, 
      miarze, 
      club, 
      exhabition,  
      paymentrequest,
      financialdashboard,
      campaign,
      hrm, 
      b1actions,
      reconciliation,
      miarzeVendor
    },
    state(){
      return{ 
              apiUrl: 'http://192.168.1.80:3400',
              isLoading: true,
              userLogged: false
               };
    },
    actions:{
      changeIsLoading(context, payload){
        context.commit('setIsLoading', payload)
      }

    },
    mutations:{
      setIsLoading(state, payload){
        state.isLoading = payload;
      }
    },
    getters:{
      isLoading(state){
        return state.isLoading;
      }
    }
    
});