<template>
    <v-container>
        <v-card outlined v-if="!moreDialog">
            <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-form @submit.prevent="loadOrders">
                        <v-row>
                            <v-col cols="3">
                                <date-picker v-model="search.startDate" label="از تاریخ"></date-picker>
                            </v-col>
                            <v-col cols="3">
                                <date-picker v-model="search.endDate" label="تا تاریخ"></date-picker>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field v-model="search.cardCode" label="کد مشتری"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field v-model="search.docNum" label="شماره سفارش"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-select
                                    :items="orderStates"
                                    name="orderStates"
                                    label="وضعیت سفارش"
                                    item-text="text"
                                    item-value="value"
                                    v-model="search.orderState"
                                    solo
                                ></v-select>
                            </v-col>
                            <v-col cols="1">
                                <v-btn dark color="green" type="submit">جستجو</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-row>
        </v-card-text>
        </v-card>
        <v-card v-if="!moreDialog">
            <v-card-title>
                <v-row>
                    <v-col cols="12">
                    <v-text-field
                        v-model="searchLoaded"
                        append-icon="mdi-magnify"
                        label="جستجو در جدول"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-col>
                </v-row>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-text>
            <v-data-table
                        fixed-header
                        dense
                        :headers="headers"
                        :items="orders"
                        item-key="id"          
                        :search="searchLoaded"
                        :loading="isLoading"   
                        class="elevation-1"                   
                    >
                    <template v-slot:[`item.U_State`]="item">
                        <p>{{ formatState(item.item.U_State,orderStates) }}</p>
                    </template>
                    <template v-slot:[`item.DocDate`]="item">
                        {{ item.item.DocDate | formatDate  }}
                    </template>
                    <template v-slot:[`item.more`]="item">
                            <v-btn @click="openMoreDialog(item)">  دیدن </v-btn>
                    </template>
            </v-data-table>
        </v-card-text>
        </v-card>
        <v-card
        v-if="moreDialog">
        <the-dashboard :order="order" :actions="actions" :nextStatesData="nextStatesData"  @close="closeMoreDialog"></the-dashboard>
        </v-card>
        <!-- لودینگ -->
        <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>در حال بارگذاری</p>
        </v-overlay>
    </v-container>
</template>
<script>
import DatePicker from '../DatePicker.vue'
import TheDashboard from './TheDashboard.vue'
var jalaali = require('jalaali-js')

export default{
    components:{TheDashboard,DatePicker},
    data(){
        return{
            isLoading: false,
            searchLoaded:'',
            search:{
                docNum: "",
                orderState:null,
                cardCode:"",
                endDate:"",
                startDate:""
            },
            moreDialog:false,
            selectedDocEntry:"",
            order:null,
            nextStatesData: null,
            actions: null
        }
    },
    computed:{
        headers(){
            return[
                {
                    text: "تاریخ",
                    align: "center",
                    value: "DocDate",
                },
                {
                    text: "شماره",
                    align: "center",
                    value: "DocNum",
                },
                {
                    text: "کد مشتری",
                    align: "center",
                    value: "CardCode",
                },
                {
                    text: "نام",
                    align: "center",
                    value: "CardName",
                },
                {
                    text: "وضعیت",
                    align: "center",
                    value: "U_State",
                },
                {
                    text: "عملیات",
                    align: "center",
                    value: "more",
                }
            ]
        },
        orders(){
            return this.$store.getters.getFinancialOrders
        },
        orderStates(){
            return[
                {
          text: 'همه وضعیت‌ها', // Change this text to whatever is suitable
          value: null // Set the value to null or an appropriate value
        },
                {
                    text: 'پیش سفارش',
                    value: 120
                },
                {
                    text: 'تایید مشتری',
                    value: 130
                },
                {
                    text: 'تایید مدیر',
                    value: 160
                },                
                {
                    text: 'تایید سرپرست',
                    value: 150
                },
                {
                    text: 'تایید ویزیتور',
                    value: 140
                },
                {
                    text: 'رد شده',
                    value: -190
                },
                {
                    text: 'ثبت شده',
                    value: 190
                },
                {
                    text: 'آماده توزیع',
                    value: 370
                },
                {
                    text: 'تایید واحد مالی',
                    value: 310
                },                
                {
                    text: 'دریافت اطلاعات پرداخت',
                    value: 230
                },
                {
                    text: 'مغایرت در پرداخت',
                    value: 240
                },
                {
                    text: 'ثبت اولیه پرداخت',
                    value: 225
                },
                {
                    text: 'عملیات انبار',
                    value: 350
                },
                {
                    text: 'تایید پای بار واحد فروش',
                    value: 305
                },
                {
                    text: 'در انتظار پرداخت',
                    value: 220
                },
                {
                    text: 'تحویل شده',
                    value: 390
                },
                {
                    text: 'بخشی تحویل شده',
                    value: 380
                },
                {
                    text: 'آماده توزیع',
                    value: 370
                },
                {
                    text: 'در حال ارسال',
                    value: 385
                },
                {
                    text: 'در حال ارسال بخشی',
                    value: 382
                },
                {
                    text: 'فاکتور شده',
                    value: 490
                },
                {
                    text: 'بخشی فاکتور شده',
                    value: 470
                },
                {
                    text: 'بخشی تحویل و بخشی فاکتور شده',
                    value: 460
                },
                {
                    text: 'تحویل کامل و بخشی فاکتور شده',
                    value: 480
                },
                {
                    text: 'برگشت شده',
                    value: -390
                },

            ]
        }
    },
    methods:{
        formatState(state,orderStates){
            let index = orderStates.findIndex(stat => stat.value == state )
            if (index >= 0)
                return orderStates[index].text
            else
                return "تعریف نشده"
        },
        findOrder(){
          this.isLoading= true;
          this.$store.dispatch('prepareFinancialDashboardData', this.selectedDocEntry).then((response) =>{
              this.isLoading = false;
              if (response.success)
              console.log(response),
                  this.order = response.data,
                  this.nextStatesData = response.nextStates,
                  this.actions = response.actions,
                  this.moreDialog = true
              else
                //   this.docNum = ''
                  this.$toasted.show(response.error,{
                      duration: 3000,
                      position: 'bottom-center',
                      type: 'error'
              })
          })
      },
        openMoreDialog(item){
            this.selectedDocEntry = item.item.DocEntry
            this.findOrder()
            
        },
        loadOrders(){
            this.isLoading=true
            if (this.search.orderState == null){
                this.search.orderState = ""
            }
            this.$store.dispatch("fetchtFinancialOrders",this.search).then(()=>this.isLoading=false)
        },
        closeMoreDialog(){
            this.moreDialog=false
            this.selectedDocEntry = ""
            this.order=null
            this.nextStatesData=null
            this.actions = null
        }
    },filters:{
        formatDate(geoDate){
            
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
    },
    // created(){
    //     this.loadOrders()
    // }
}
</script>
