<template>
  <v-app id="inspire">
    <v-navigation-drawer  v-model="drawer" right app>
    <!-- app bar start -->
   
    <the-drawer></the-drawer>
    </v-navigation-drawer>
     <!-- app bar end -->
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>منو</v-toolbar-title>
    </v-app-bar>
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
    drawer: null
  }),
  created(){
    //console.log(this)
  }
};
</script>
