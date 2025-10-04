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
                  <!-- <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/importtemplate'><h5>ورود اطلاعات با الگو</h5></router-link>              
                  </v-col>            -->
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/bankimport'><h5>ورود اطلاعات</h5></router-link>              
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
                    <!-- <v-col cols="12" v-if="saleRole">
                        <router-link style="text-decoration: none;" to='/usetransaction'><h5>درخواست ثبت سند</h5></router-link>  
                    </v-col>  -->
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="transactionsAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                    <h3>سامانه تردد</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/hrm-attendance-request-list'><h5>درخواست ها</h5></router-link>
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="transactionsAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                    <h3>تطبیق</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/reconciliation'><h5>صفحه اصلی</h5></router-link>
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="transactionsAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                    <h3>باشگاه مشتریان</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/usagedatalist'><h5>درخواست ها</h5></router-link>
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
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/goldenpayanereport'><h5>قرارداد طلایی</h5></router-link> 
                  </v-col>
                </v-expansion-panel-content> 

              </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="requestAccess">
                <v-expansion-panel class="grey lighten-5">
                <v-expansion-panel-header class="grey lighten-5">
                <h3>درخواست پرداخت</h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="grey lighten-5">
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/createpaymentrequest'><h5>ایجاد درخواست</h5></router-link> 
                  </v-col>
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/paymentrequestlist'><h5>فهرست درخواست ها</h5></router-link> 
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
                    <router-link style="text-decoration: none;" to='/bankcardlist'><h5>شماره کارت</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/bankaccountlist'><h5>شماره حساب</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/salepersonlist'><h5>دارنده پایانه</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/payanevisitorlist'><h5>پایانه</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                      <router-link style="text-decoration: none;" to='/banklist'><h5>بانک</h5></router-link> 
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
                    <router-link style="text-decoration: none;" to='/cheque'><h5>داشبورد چک</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/chequeupdate'><h5>به روزرسانی چک</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/chequelogs'><h5>B1 Logs</h5></router-link> 
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="spreeAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                  <h3>می‌ارزه!</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/spree'><h5>همگام سازی</h5></router-link> 
                    </v-col>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/miarzemarketing'><h5>ارسال پیامک</h5></router-link> 
                    </v-col>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/miarzemessagetemplates'><h5>قالب پیامک</h5></router-link> 
                    </v-col>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content class="grey lighten-5">
                  <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/ordermessage'><h5>پیامک های سفارش</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/createinventorytransfer'><h5>ساخت انتقال بین انبار</h5></router-link>              
                  </v-col>         
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/creategrpo'><h5>ساخت GRPO</h5></router-link>              
                  </v-col>  
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/grpolist'><h5>لیست GRPO</h5></router-link>              
                  </v-col> 
                  <v-col cols="12">
                  <router-link style="text-decoration: none;" to='/miarzepayments'><h5>درگاه پرداخت</h5></router-link>              
                  </v-col> 
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="syncAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                  <h3>همگام ساز</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/sync'><h5>داشبورد</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/taxsync'><h5>سامانه مودیان</h5></router-link> 
                    </v-col>
                  </v-expansion-panel-content>                  
                </v-expansion-panel>
              </v-col>
              <v-col cols="12" v-if="requestAccess">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                  <h3>داشبورد فروش</h3>
                  </v-expansion-panel-header>
                  <!-- <v-expansion-panel-content v-if="transactionsAccess" class="grey lighten-5">
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/financialdasboard'><h5>Sale Order</h5></router-link> 
                    </v-col>
                  </v-expansion-panel-content> -->
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/financialmain'><h5>لیست سفارشات</h5></router-link> 
                    </v-col>
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/automatesaleorder'><h5>اتوماسیون</h5></router-link> 
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>  
              <v-col cols="12" v-if="b1Access">
                <v-expansion-panel class="grey lighten-5">
                  <v-expansion-panel-header class="grey lighten-5">
                    <h3>کمپین</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey lighten-5">
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/campaigndashboard'><h5>ساخت کمپین</h5></router-link> 
                    </v-col>         
                    <v-col cols="12">
                    <router-link style="text-decoration: none;" to='/campaignlist'><h5>لیست کمپین</h5></router-link> 
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
    b1Role(){
      const user = this.$store.getters.getUser;
      return user.role == 'b1'
    },
    creaditRole(){
      const user = this.$store.getters.getUser;
      return user.role == 'credit'
    },
    spreeRole(){
      const user = this.$store.getters.getUser;
      return user.role == 'spree'
    },
    financeRole(){
      const user = this.$store.getters.getUser;
      return user.role == 'finance'     
    },
    saleRole(){
      const user = this.$store.getters.getUser;
      return user.role == 'sale'
    },adminRole(){
      const user = this.$store.getters.getUser;
      return user.role == 'admin'
    },
    chequeAccess(){
      return this.financeRole || this.creaditRole || this.adminRole
    },
    requestAccess(){
      const user = this.$store.getters.getUser;
      return user.role == 'sale' || user.role == 'admin' || user.role == 'finance'
    },
    transactionsAccess(){
      return this.financeRole || this.adminRole
    },
    spreeAccess(){
      return this.adminRole || this.spreeRole
    },
    userLoged(){
      console.log(this.$store.getters.getUser !={})
      return this.$store.getters.isLogged 
    },syncAccess(){
      return this.adminRole || this.creaditRole
    },
    b1Access(){
      return this.adminRole || this.b1Role
    }

  },
};
</script>

