

import Vue from 'vue';
import Vuex from 'vuex';
import cardtocards from './modules/cardtocard/index.js'


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
      cardtocards
        
    },
    state(){
      return{ apiUrl: 'http://192.168.142.128:3400/api'};
    }
});