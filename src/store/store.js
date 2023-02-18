

import Vue from 'vue';
import Vuex from 'vuex';
import cardtocards from './modules/cardtocard/index.js';
import poses from './modules/pos/index.js'


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
      cardtocards,
      poses       
    },
    state(){
      return{ 
              apiUrl: 'http://192.168.142.128:3400/api',
               };
    },

    
});