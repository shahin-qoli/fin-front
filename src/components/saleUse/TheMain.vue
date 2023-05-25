<template>
    <v-container>
      <v-select
        v-model="selectedValue"
        :items="displayNames"
        :menu-props="{ maxHeight: '200px' }"
        label="انتخاب نوع تراکنش"
      ></v-select>
      <v-card>
        <v-card-text>
          <component :is="componentMap[selectedValue]"></component>
          <!-- Render different components based on selectedValue -->
        </v-card-text>
      </v-card>
      </v-container>
  </template>
  
  <script>
  import UseCardtocard from './UseCardtocard.vue'
  import UsePos from "./UsePos.vue"
  import UseAccounttoaccount from "./UseAccounttoaccount.vue"
  
  export default {
    data() {
      return {
        selectedValue: 'کارتخوان',
        displayNames: ['کارت به کارت','انتقال حساب به حساب'], // Display names for v-select
        componentMap: { // Mapping between display names and component names
          'کارت به کارت': 'UseCardtocard',
          'انتقال حساب به حساب': 'UseAccounttoaccount',


        }
      };
    },
    components: {
        UseCardtocard,
        UsePos,
        UseAccounttoaccount

    }
  };
  </script>
