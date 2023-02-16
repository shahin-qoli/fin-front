<template>
  <v-app id="inspire">
  
    <!-- app bar start -->
   
    <the-drawer></the-drawer>

     <!-- app bar end -->

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import TheDrawer from "./components/TheDrawer.vue";
export default {
  components:{
    TheDrawer
  },
  name: 'App',

  data: () => ({

  }),
  methods:{
    setDrawer(){
      this.$store.dispatch('mainDrawer')
    }
  }

};
</script>
