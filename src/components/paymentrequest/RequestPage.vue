<template>
    <v-container>
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="d-flex justify-center align-center">
                        <p>ثبت درخواست</p>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="submitRequest">
                    <v-row>
                        <v-col cols="4">
                            <v-autocomplete
                            v-model="request.cardCode"
                            :items="customers"
                            placeholder="کد مشتری"
                            solo
                            filled
                            dense
                            item-text="card_code"
                            item-value="card_code"
                            :search-input.sync="searchCustomer"                      
                            >
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            label="نام مشتری"
                            disabled
                            v-model="selectedCustomerName"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-select
                            :items="transactionTypes"
                            item-text="text"
                            item-value="value"
                            required
                            label="نوع تراکنش"
                            v-model="request.transactionType"
                            @input="loadRequestAccounts"></v-select>
                        </v-col>
                        <v-col cols="4">
                            <v-select
                            :items="itemForType(request.transactionType)"
                            item-text="text"
                            item-value="value"
                            label="حساب مقصد"
                            v-model="request.toAccount"
                            required
                            @input="loadRequestAccounts"></v-select>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            label="حساب مبدا"
                            v-model="request.fromAccount"
                            required></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            label="مبلغ"
                            :value="formatAmountMethod"
                            @blur="updateAmount"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            label="شماره پیگیری"
                            v-model="request.peygiriNumber"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            label="توضیحات"
                            v-model="request.requestExtraInfo"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <date-picker label="تاریخ تراکنش" v-model="request.transactionDate"></date-picker>
                        </v-col>
                        <v-col  cols="4">
                            <v-file-input
                                accept="image/*"
                                label="بارگذاری عکس"
                                v-model="request.file"
                            />
                        </v-col>
                        <v-col cols="6">
                            <v-btn dark color="red" @click="refreshData">بازنشانی</v-btn>
                            <v-btn dark  color="green" type="submit">ثبت</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
        <v-overlay :value="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>در حال عملیات</p>
  </v-overlay>
    </v-container>
</template>
<script>
var jalaali = require('jalaali-js')
import DatePicker from '../DatePicker.vue'
export default {
    components:{
        DatePicker
    },
    data() {
        return{
            searchCustomer:'',
            request:{
                cardCode:null,
                transactionType:null,
                toAccount:null,
                fromAccount:null,
                transactionDate:null,
                peygiriNumber:null,
                requestExtraInfo:null,
                amount:'',
                file:null
            },
            
            isLoading:false
        }
    },
    computed:{
        formatAmountMethod() {
      // Format the amount in the input field by adding commas
      console.log(`Req AMOUNT: ${this.request.amount }`)

      const stringVlue = String(this.request.amount)
      const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedIntegerPart

    },
        user(){
            return this.$store.getters.getUser
        },
        customers(){
            return this.$store.getters.getFilteredCustomers
        },
        transactionTypes(){
            return[
                {
                    text:"کارت به کارت",
                    value:1
                },
                {
                    text:"حساب به حساب",
                    value:2
                }
            ]
        },
        requestCards(){
            return this.$store.getters.getRequestCards
        },
        requestAccounts(){
            return this.$store.getters.getRequestAccounts
        },
        isReady(){

            return (this.request.amount >0 && this.request.file 
            && this.request.transactionType !=null 
            && this.request.toAccount !=null && this.request.fromAccount !=null 
            && this.request.amount !=null && this.request.peygiriNumber !=null )
        },
        selectedCustomerName(){
            if (this.request.cardCode !== null)
           return this.customers.filter(item => item.card_code == this.request.cardCode)[0].card_name
        else
            return ""
        }
    },methods:{
        refreshData(){
            this.request={
                cardCode:null,
                transactionType:null,
                toAccount:null,
                fromAccount:null,
                transactionDate:null,
                peygiriNumber:null,
                requestExtraInfo:null,
                requestedBy: null,
                amount:'',
                file: null
            }
        },
        loadFilteredCustomers(){
            
            this.$store.dispatch('fetchFilteredCustomers', this.searchCustomer)
        },
        loadRequestAccounts(){
            if (this.request.transactionType ==1){
                this.$store.dispatch('fetchRequestCards')
            }else{
                this.$store.dispatch('fetchRequestAccounts')
            }
        },
        submitRequest(){
            console.log("this is ready")
            console.log(this.isReady)
            if (!this.isReady){
                this.$toasted.show("فرم را تکمیل کنید", {
                    duration: 3000,
                    position: 'bottom-center',
                    type: 'error'
                })
            }else{
                this.isLoading= true
            this.request.requestedBy = this.user.id
            this.$store.dispatch('createPaymentRequest', this.request).then((response) =>{
                this.isLoading= false
                if (response == true){
                    this.$toasted.show('درخواست با موفقیت ثبت شد', {
                      duration: 5000,
                      position: 'bottom-center',
                      type: 'success'
                    })
                    this.refreshData()
                }else{
                    this.$toasted.show('خطا، دوباره تلاش کنید',{
                        duration: 3000,
                        position: 'bottom-center',
                        type: 'error'
                    })
                }
               
        })}},
        itemForType(type){
            if (type == 1){
                return this.requestCards
            }else{
                return this.requestAccounts
            } 
        },
        updateAmount(){
            console.log('Updating amount:', event.target.value);
            this.request.amount = event.target.value
            console.log('Updated amount:', this.request.amount);
        }
    },
        filters:{
    formatAmount(value){
      const stringVlue = String(value)
      const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedIntegerPart
    },
    formatDate(geoDate){
            
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
    },
    watch:{
        searchCustomer:{
            handler(){
                setTimeout(() => {
                    this.loadFilteredCustomers();
                }, 1000);
                        
        }
    },
    
}
}
</script>
