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
                        <!-- <v-col cols="4">
                            <v-text-field
                            label="نام مشتری"
                            :v-bind="request.customerName"
                            ></v-text-field>
                        </v-col> -->
                        <v-col cols="4">
                            <v-select
                            :items="transactionTypes"
                            item-text="text"
                            item-value="value"
                            required
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
                            v-model="request.amount"
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
    </v-container>
</template>
<script>
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
            },
            file:'',
        }
    },
    computed:{
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
            console.log(` this is file : ${this.file}`)
            return (this.request.amount >0 )
            // && this.request.transactionType !=null 
            // && this.request.toAccount !=null && this.request.fromAccount !=null 
            // && this.request.amount !=null && this.request.peygiriNumber !=null 
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
                requestedBy: null
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
                    type: 'error'
                })
            }else{
            this.request.requestedBy = this.user.id
            this.$store.dispatch('createPaymentRequest', this.request).then((response) =>{
                if (response == true){
                    this.$toasted.show('درخواست با موفقیت ثبت شد', {
                      duration: 3000,
                      type: 'success'
                    })
                    this.refreshData()
                }else{
                    this.$toasted.show('خطا، دوباره تلاش کنید',{
                        duration: 3000,
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
