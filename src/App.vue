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


<style scoped>
@font-face {
    font-family: iranyekan;
    font-style: normal;
    font-weight: normal;
    font-display: swap;
    src: url('./assets/fonts/iranyekan/eot/iranyekanwebregular(fanum).eot');
    src: url('./assets/fonts/iranyekan/eot/iranyekanwebregular(fanum).eot?#iefix') format('embedded-opentype'), /* IE6-8 */
    url('./assets/fonts/iranyekan/woff2/iranyekanwebregular(fanum).woff2') format('woff2'), /* FF39+,Chrome36+, Opera24+*/
    url('./assets/fonts/iranyekan/ttf/iranyekanwebregular(fanum).ttf') format('truetype');
}
#inspire {
  font-family: iranyekan;
}


</style>