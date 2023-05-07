<template>
    <v-app >
       <v-main>
          <v-container>
             <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                   <v-card class="elevation-12">
                      <v-toolbar dark color="primary">
                         <v-toolbar-title>ورود</v-toolbar-title>
                      </v-toolbar>
                      <v-card-text>
                      <form ref="form" @submit.prevent="login()">
                             <v-text-field
                               v-model="email"
                               name="email"
                               label="نام کاربری"
                               type="text"
                               placeholder="username"
                               required
                            ></v-text-field>
                            
                             <v-text-field
                               v-model="password"
                               name="password"
                               label="رمز عبور"
                               type="password"
                               placeholder="password"
                               required
                            ></v-text-field>
                            <v-alert v-if="loginError" type="error" class="mt-4">{{ loginError }}</v-alert>
                            <v-btn type="submit" class="mt-4" color="primary" value="log in">ورود</v-btn>
                       </form>
                      </v-card-text>
                   </v-card>
                 
                </v-flex>
             </v-layout>
          </v-container>
       </v-main>
    </v-app>
 </template>
 
 <script>


 export default {
   name: "TheLogin",
   data() {
     return {
       email: "",
       password: "",
       loginError: "",
     };
   },
   methods: {
      async login() {
       const { email, password } = this;
       var data = {"email": email, "password": password}
       try{
       await this.$store.dispatch('userLogin', data)
      if(localStorage.getItem('token')){
      this.$router.replace({name:'home'})
   }
     }catch (error) {
        this.loginError = "نام کاربری یا رمز عبور اشتباه است.";
      }
   },
   },
 };
 </script>