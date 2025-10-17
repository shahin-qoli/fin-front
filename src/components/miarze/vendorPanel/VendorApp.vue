<template>
<div>

      <v-app-bar
        right
        :collapse="!collapseOnScroll"
        :collapse-on-scroll="collapseOnScroll"
        absolute
        color="deep-purple accent-4"
        dark
   
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
  
        <v-toolbar-title>مدیریت تامین می‌ارزه!</v-toolbar-title>
  
        <v-spacer></v-spacer>
  

        <!-- <v-checkbox
          v-model="collapseOnScroll"
          color="white"
          hide-details
        ></v-checkbox> -->
      </v-app-bar>
      

            <MainPage></MainPage>



      </div>
  </template>
  <script>
  import MainPage from './mainPage.vue';

  export default {
    components:{MainPage},
    data: () => ({
      collapseOnScroll: true,
    }),
  }
</script>