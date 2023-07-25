<template>
<div>    
<v-navigation-drawer v-if="userLoged" width="175" v-model="drawer" right app>   
    <v-container class="grey lighten-5" id="main-container" >
        <v-row align-content="center">
            <v-col cols="12">
                <v-img
                max-width="192"
                max-height="192"
                src = "../assets/android-chrome-192x192.png"
                />
            </v-col>
            <v-col cols="12">
            <v-divider/>
            </v-col>
            <v-col cols="12">
            <v-expansion-panels accordion class="grey lighten-5">
              <v-col cols="12" v-if="transactionsAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                    <h3>تراکنش ها</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">            
                  <v-col cols="12">
                      <router-link  style="text-decoration: none;" to='/cardtocard'><h5>کارت به کارت</h5></router-link>           
                  </v-col>
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/pos'><h5>کارتخوان</h5></router-link>              
                  </v-col>
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/accounttoaccountlist'><h5>حساب به حساب</h5></router-link>              
                  </v-col>
                
                </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="requestAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                    <h3>درخواست ها</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                     <router-link style="text-decoration: none;" to='/requests'><h5>درخواست ها</h5></router-link> 
                    </v-col>
                    <v-col cols="12" v-if="!saleRole">
                      <router-link style="text-decoration: none;" to='/joblist'><h5>همگام سازی</h5></router-link> 
                    </v-col>    
                    <v-col cols="12" v-if="saleRole">
                        <router-link style="text-decoration: none;" to='/usetransaction'><h5>درخواست ثبت سند</h5></router-link>  
                    </v-col> 
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="transactionsAccess">
                <v-expansion-panel class="grey lighten-5">
                <v-expansion-panel-header class="grey lighten-5">
                <h3>صندوق</h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="grey lighten-5">
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/payanereport'><h5>گزارشات صندوق</h5></router-link> 
                  </v-col>
                </v-expansion-panel-content>
              </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="transactionsAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                  <h3>تنظیمات</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/bankcardlist'><h5>تنظیمات شماره کارت</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/bankaccountlist'><h5>تنظیمات شماره حساب</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/salepersonlist'><h5>تنظیمات دارنده پایانه</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/payanevisitorlist'><h5>تنظیمات پایانه</h5></router-link> 
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="chequeAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                  <h3>چک</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/cheque'><h5>داشبود چک</h5></router-link> 
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
            </v-expansion-panels>
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
      this.$router.push('/login')
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
    chequeAccess(){
      const user = this.$store.getters.getUser;
      return user.role == 'finance' || user.role == 'admin' || user.role == 'credit'
    },
    requestAccess(){
      const user = this.$store.getters.getUser;
      return user.role == 'sale' || user.role == 'admin' || user.role == 'finance'
    },
    transactionsAccess(){
      const user = this.$store.getters.getUser;
      return user.role == 'finance' || user.role == 'admin' 
    },
    userLoged(){
      console.log(this.$store.getters.getUser !={})
      return this.$store.getters.isLogged 
    }

  },
};
</script>

