<template>
<div>    
<v-navigation-drawer v-if="userLoged" width="175" v-model="drawer" right app>   
    <v-container class="grey lighten-5" id="main-container" >
        <v-row align-content="center">
            <v-col cols="3">
                <v-img
                max-width="50"
                max-height="50"
                src = "../assets/logo.png"
                />
            </v-col>
            <v-col align-self="center" cols="3"><h2 style="bold center" >بروکس</h2>
                
            </v-col>
            <v-col cols="12">
            <v-divider/>
          </v-col>
          <v-col cols="12" v-if="!saleRole">
            <v-col cols="12">
                <router-link  style="text-decoration: none;" to='/cardtocard'><h3>کارت به کارت</h3></router-link>
               
            </v-col>
            <v-col cols="12">
            <v-divider/>
          </v-col>
            <v-col cols="12">
            <router-link style="text-decoration: none;" to='/pos'><h3>کارتخوان</h3></router-link> 
            
            </v-col>
            <v-col cols="12">
            <v-divider/>
          </v-col>
          <v-col cols="12">
            <router-link style="text-decoration: none;" to='/joblist'><h3>همگام سازی</h3></router-link> 
          </v-col>
          <v-col cols="12">
            <v-divider/>
          </v-col>
        </v-col>
      
          <v-col cols="12">
            <router-link style="text-decoration: none;" to='/requests'><h3>درخواست ها</h3></router-link> 
          </v-col>
          <v-col cols="12">
            <v-divider/>
          </v-col>
          <v-col cols="12" v-if="saleRole">
          <v-col  cols="12">
            <router-link style="text-decoration: none;" to='/usetransaction'><h3>درخواست ثبت سند</h3></router-link> 
          </v-col>   
          <v-col cols="12">
            <v-divider/>
          </v-col>         
        </v-col>
        </v-row>
    </v-container>
</v-navigation-drawer> 
<v-app-bar color="deep-purple accent-4"
      dense
      dark
      app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>منو</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-title v-if="userLoged"> <v-btn dark color="green" @click="exitUser"> خروج از سامانه</v-btn></v-app-bar-title>
</v-app-bar>
</div>
</template>

<style scoped>
 .header{
    background: #000;
    
 }
 #main-container{
    height: 100%;

 }
</style>

<script>
export default {
  data: () => ({
    drawer: null,
  }),
  methods:{
    exitUser(){
      this.$store.dispatch('cleanUser')
      this.$router.push('/')
    }
  },
  computed:{
    saleRole(){
      
      const user = this.$store.getters.getUser;
      return user.role == 'sale'
    },adminRole(){
      const user = this.$store.getters.getUser;
      return user.role == 'admin'

    },
    userLoged(){
      console.log(this.$store.getters.getUser !={})
      return this.$store.getters.isLogged 
    }

  },
};
</script>

