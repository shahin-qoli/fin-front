

import Vue from 'vue';
import Vuex from 'vuex';
import cardtocards from './modules/cardtocard/index.js';
import poses from './modules/pos/index.js'
import requests from './modules/used/index.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
      cardtocards,
      poses,
      requests       
    },
    state(){
      return{ 
              apiUrl: 'http://192.168.1.80:3400/api',
              isLoading: true
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