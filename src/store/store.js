

import Vue from 'vue';
import Vuex from 'vuex';
import cardtocards from './modules/cardtocard/index.js';
import poses from './modules/pos/index.js'
import requests from './modules/used/index.js'
import jobs from './modules/job/index.js'
import user from './modules/user/index.js'
import bankcard from './modules/bankcard/index.js';
import bankaccount from './modules/bankaccount/index.js';
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
      cardtocards,
      poses,
      requests,
      jobs,
      user,
      bankcard,
      bankaccount       
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