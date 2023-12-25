<template>
    <v-container>
        <v-card>
        <v-data-table
        :headers="headers"
        :items="requests"
        :options.sync="options"
        :server-items-length="itemCount">
            <template v-slot:[`item.details`]="item">
                <v-btn @click="detailsDialog(item)">  <v-icon>mdi-eye</v-icon> </v-btn>
            </template>
        </v-data-table>
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
                            <v-text-field label="توضیحات رد" v-model="updateItem.rejectExteraInfo"></v-text-field>
                        </v-col>    
                        <v-col cols="4">
                            <v-text-field label="شماره سند بی وان" v-model="updateItem.b1DocNum"></v-text-field>
                        </v-col>   
                        <v-col cols="4">
                            <v-text-field label="شماره درخواست در نرم افزار" v-model="updateItem.transitionId"></v-text-field>
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
    </v-container>
</template>
<script>
export default{
    data(){
        return {
            options:{
            itemsPerPage: 10,
            page:1,
            state:'',
            requestedBy: ''
        },
        dialog: false,
        dialogItem:{card_code:''},
        updateItem:{
            rejectExteraInfo:'',
            b1DocNum:'',
            transitionId:'',
            id:'',
            updated_by:''
        }
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
                    text: 'وضعیت',
                    value: 'state'
                },
                {
                    text: 'جزییات',
                    value: 'details'
                }
            ]
        },
        requests(){
            return this.$store.getters.getPaymentRequests
        },
        itemCount(){
            return this.$store.state.paymentRequestsItemCount
        },
        user(){
            return this.$store.getters.getUser
        },
        saleRole(){
            return this.$store.getters.getUser.role === 'sale';
          },

    },
    methods:{
        detailsDialog(item){
            this.dialog=true;
            this.updateItem.id= item.item.id
            this.updated_by= this.user.id
            this.dialogItem= {...item.item}
        },
        loadPaymentRequests(){
            this.$store.dispatch('fetchPaymentRequests',this.options)
        },
        deny(){
            if(window.confirm('آیا از رد این درخواست اطمینان دارید؟')){
                        this.$store.dispatch('denyPaymentRequest', this.updateItem)
                        .then((response) => {
                            if (response == true){
                                this.$toasted.show('درخواست با موفقیت رد شد', {
                                    duration: 3000,
                                    type: 'success'
                                });
                            }else{
                                this.$toasted.show("خطا در عملیات",{
                                    duration: 3000,
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
                        this.$store.dispatch('verifyPaymentRequest', this.updateItem)
                        .then((response) => {
                            if (response == true){
                                this.$toasted.show('درخواست با موفقیت تایید شد', {
                                    duration: 3000,
                                    type: 'success'
                                });
                            }else{
                                this.$toasted.show("خطا در عملیات",{
                                    duration: 3000,
                                    type: 'error'
                                })
                            }                    
                            this.dialog = false
                            this.loadPaymentRequests()
                        })
                    }
                }
        ,
        proccess(){
            this.$store.dispatch('processingPaymentRequest', this.updateItem)
                        .then((response) => {
                            if (response == true){
                                this.$toasted.show('درخواست با موفقیت تایید شد', {
                                    duration: 3000,
                                    type: 'success'
                                });
                            }else{
                                this.$toasted.show("خطا در عملیات",{
                                    duration: 3000,
                                    type: 'error'
                                })
                            }                    
                            this.dialog = false
                            this.loadPaymentRequests()
                        })
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