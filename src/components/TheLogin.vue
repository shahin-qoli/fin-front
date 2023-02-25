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
 import  {finAgent} from '@/services/agent'

 export default {
   name: "TheLogin",
   data() {
     return {
       email: "",
       password: "",
     };
   },
   methods: {
     async login() {
       const { email, password } = this;
       var data = {"email": email, "password": password}
       try{
        console.log(data)
        const {data: requestsData} = await finAgent.post('http://192.168.1.80:3400/api/auth/login', data)
        localStorage.setItem('token', requestsData.token)
        this.$router.replace({name:'home'})

       } catch (err) {
            //console.log(err.response);
            const error = new Error(
				err.response.data.error || 'Failed to fetch'
			);
			throw error;
         }
     },
   },
 };
 </script>