<template>
    <v-container>
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex align-center justify-center">
                        <p>فیلترها</p>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                        :items="requestStates"
                        placeholder="وضعیت سند"
                        solo
                        filled
                        dense
                        item-text="text"
                        item-value="value"
                        v-model="options.state"
                        ></v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        v-model="options.cardCode"
                        label="کد مشتری"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-data-table
                :headers="headers"
                :items="requests"
                item-key="id"
                :options.sync="options"
                :server-items-length="itemCount">
                    <template v-slot:[`item.amount`]="item">
                        <v-row>
                            <v-col class="d-flex align-center">
                                <p>{{ item.item.amount | formatAmount }}</p>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-slot:[`item.created_at`]="item">
                        <p>{{ item.item.created_at | formatDate }}</p>
                    </template>
                    <template v-slot:[`item.transaction_type`]="item">
                        <p>{{ transactionTypeFromatted(item.item.transaction_type) }}</p>
                    </template>
                    <template v-slot:[`item.details`]="item">
                        <v-btn @click="detailsDialog(item)">  <v-icon>mdi-eye</v-icon> </v-btn>
                    </template>
                    <template v-slot:[`item.state`]="item">
                        <v-chip small dark :color="getColorRequestStatus(item.item.state)">
                  {{ transformRequestStatus(item.item.state) }}
                </v-chip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
            <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            >
            <v-card>
            <v-row class="dialogCard">
                <v-col cols="12">                 
                <v-form>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field
                            disabled
                            label="کد مشتری"
                            v-model="dialogItem.card_code"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            disabled
                            label="نوع تراکنش"
                            v-model="dialogItem.transactionType"
                           ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            disabled
                            label="حساب مقصد"
                            v-model="dialogItem.from_account"
                           ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            disabled
                            label="حساب مبدا"
                            v-model="dialogItem.from_account"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            disabled
                            label="مبلغ"
                            v-model="dialogItem.amount"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            disabled
                            label="شماره پیگیری"
                            v-model="dialogItem.peygiri_number"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                            disabled
                            label="توضیحات"
                            v-model="dialogItem.request_extra_info"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field disabled label="تاریخ تراکنش" v-model="dialogItem.transaction_date"></v-text-field>
                        </v-col>
                        <v-col  cols="4">
                            <v-btn v-if="dialogItem.image" :href="dialogItem.image" target="_blank">  <v-icon>mdi-download</v-icon> </v-btn>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field disabled label="وضعیت" v-model="dialogItem.state"></v-text-field>
                        </v-col>         
                        <v-col cols="4">
                            <v-text-field label="توضیحات رد" v-model="updateItem.reject_extra_info"></v-text-field>
                        </v-col>    
                        <v-col cols="4">
                            <v-text-field label="شماره سند بی وان" v-model="updateItem.b1_docnum"></v-text-field>
                        </v-col>   
                        <v-col cols="4">
                            <v-text-field label="شماره درخواست در نرم افزار" v-model="updateItem.transaction_id"></v-text-field>
                        </v-col>               
                        <v-col cols="6">
                            <v-btn dark color="red" @click="dialog=false">بستن</v-btn>
                            <v-btn :disabled="saleRole" dark color="green" @click="verify">تایید</v-btn>
                            <v-btn :disabled="saleRole" dark color="blue" @click="proccess">درحال بررسی</v-btn>
                            <v-btn :disabled="saleRole" dark color="orange" @click="deny">رد</v-btn>
                        </v-col>
                    </v-row>
                </v-form>               
         
                </v-col>
            </v-row>
        </v-card>
        </v-dialog>
        <v-overlay :value="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>در حال عملیات</p>
  </v-overlay>
    </v-container>
</template>
<script>
var jalaali = require('jalaali-js')
import {TheStatus} from '../../mixins/TheStatus.js'
export default{
    mixins:[TheStatus],
    data(){
        return {
            options:{
            itemsPerPage: 10,
            page:1,
            state:'',
            requestedBy: '',
            selectedState:'',
            cardCode:''
        },
        dialog: false,
        dialogItem:{card_code:''},
        updateItem:{
            reject_extra_info:'',
            b1_docnum:'',
            transaction_id:'',
            id:'',
            updated_by:''
        },
        isLoading: false,
        }
    },
    computed:{
        headers(){
            return [
                {
                    text: 'ردیف',
                    value: 'id'
                },
                {
                    text: 'کد مشتری',
                    value: 'card_code'
                },
                {
                    text: 'تاریخ درخواست',
                    value: 'created_at'
                },
                {
                    text: 'نوع تراکنش',
                    value: 'transaction_type'
                },
                {
                    text: 'مبلغ',
                    value: 'amount'
                },
                {
                    text: 'درخواست توسط',
                    value: 'requested_by_name'
                },
                {
                    text: 'به روزرسانی توسط',
                    value: 'updated_by_name'
                },
                {
                    text: 'وضعیت',
                    value: 'state'
                },
                {
                    text: 'جزییات',
                    value: 'details'
                }
            ]
        },
        requestStates(){
            return [
                {
                    text: 'درخواست شده',
                    value: 'requested'
                },
                {
                    text: 'رد شده',
                    value: 'denied'
                },
                {
                    text: 'تایید شده',
                    value: 'completed'
                },
                {
                    text: 'در حال بررسی',
                    value: 'processing'
                },
            ]
        },
        requests(){
            return this.$store.getters.getPaymentRequests
        },
        itemCount(){
            return this.$store.getters.getPaymentRequestsItemCount
        },
        user(){
            return this.$store.getters.getUser
        },
        saleRole(){
            return this.$store.getters.getUser.role === 'sale';
          },


    },
    methods:{
        transactionTypeFromatted(item){
            if (item == 1 )
            return "کارت به کارت"
            else if (item ==2)
            return "حساب به حساب"
        else
        return ""
          },
        detailsDialog(item){
            this.dialog=true;
            this.updateItem.id= item.item.id
            this.updateItem.updated_by = item.item.updated_by
            this.updateItem.reject_extra_info = item.item.reject_extra_info
            this.updateItem.b1_docnum = item.item.b1_docnum
            this.transaction_id = item.item.transaction_id
            this.dialogItem= {...item.item}
        },
        loadPaymentRequests(){
            this.isLoading= true
            this.$store.dispatch('fetchPaymentRequests',this.options).then(()=>this.isLoading= false)
        },
        deny(){
            if(window.confirm('آیا از رد این درخواست اطمینان دارید؟')){
                         this.isLoading= true
                        this.updateItem.updated_by= this.user.id
                        this.$store.dispatch('denyPaymentRequest', this.updateItem)
                        .then((response) => {
                            this.isLoading= false
                            if (response == true){
                                this.$toasted.show('درخواست با موفقیت رد شد', {
                                    duration: 3000,
                                    type: 'success',
                                    position: 'bottom-center'
                                });
                            }else{
                                this.$toasted.show("خطا در عملیات",{
                                    duration: 3000,

                                    position: 'bottom-center',
                                    type: 'error'
                                })
                            }                    
                            this.dialog = false
                            this.loadPaymentRequests()
                        })
                    }
                }
        ,
        verify(){
            if(window.confirm('آیا از تایید این درخواست اطمینان دارید؟')){
                this.isLoading= true
                this.updateItem.updated_by= this.user.id
                        this.$store.dispatch('verifyPaymentRequest', this.updateItem)
                        .then((response) => {
                            this.isLoading= false
                            if (response == true){
                                this.$toasted.show('درخواست با موفقیت تایید شد', {
                                    duration: 3000,
                                    position: 'bottom-center',
                                    type: 'success'
                                });
                            }else{
                                this.$toasted.show("خطا در عملیات",{
                                    duration: 3000,
                                    type: 'error',
                                    position: 'bottom-center'
                                })
                            }                    
                            this.dialog = false
                            this.loadPaymentRequests()
                        })
                    }
                }
        ,
        proccess(){
            this.isLoading= true
            this.updateItem.updated_by= this.user.id
            this.$store.dispatch('processingPaymentRequest', this.updateItem)
                        .then((response) => {
                            this.isLoading= false
                            if (response == true){
                                this.$toasted.show('درخواست با موفقیت تایید شد', {
                                    duration: 3000,
                                    type: 'success',
                                    position: 'bottom-center'
                                });
                            }else{
                                this.$toasted.show("خطا در عملیات",{
                                    duration: 3000,
                                    type: 'error',
                                    position: 'bottom-center'
                                })
                            }                    
                            this.dialog = false
                            this.loadPaymentRequests()
                        })
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
    options:{
      handler(){   
      this.loadPaymentRequests();    
      },  deep: true
    }},
    created(){
        this.options.requestedBy = this.user.role =="sale" ? this.user.id :''
    }
}
</script>
<style scoped>
.dialogCard{
    margin: 1px;
    border: 2px;
    border-style: solid;
}
</style>