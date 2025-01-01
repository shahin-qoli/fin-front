<template>
    <v-container>
        <v-card outlined>
            <v-card-title>
                <v-row >
                <v-col cols="12">
                        <v-row>
                            <v-col cols="4">
                                <v-text-field v-model="options.amount" hint="120000000" label="مبلغ"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="options.orderNumber" hint="R8787656" label="شماره سفارش"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <date-picker label="تاریخ" v-model="options.transactionDate"></date-picker>
                            </v-col>
                            
                            <v-col cols="4">
                                <v-switch
                                v-model="options.isUsed"
                                label="تراکنش های استفاده شده"
                                class="pa-3"
                            ></v-switch>
                            </v-col>
                            <v-col cols="4">
                                <v-switch
                                    v-model="options.isPaied"
                                    label="تراکنش های موفق"
                                    class="pa-3"
                                ></v-switch>
                            </v-col>                              
                        </v-row>
    
                </v-col>
                </v-row>                
            </v-card-title>
            <v-card-text>
                <v-data-table
                fixed-header
                    dense
                    :headers="headers"
                    :items="payments"
                    item-key="id"
                :options.sync="options"
                :server-items-length="itemCountPaymentMiarze"
                    class="elevation-1"    
                >
                <template v-slot:[`item.amount`]="{ item }">
                            <p>{{ item.amount | formatAmount }}</p>
                </template>
                <template v-slot:[`item.is_used`]="{ item }">
                    <v-simple-checkbox
                        v-model="item.is_used"
                        disabled
                    ></v-simple-checkbox>
                </template>
                <template v-slot:[`item.is_paied`]="{ item }">
                    <v-simple-checkbox
                        v-model="item.is_paied"
                        disabled
                    ></v-simple-checkbox>
                </template>
                <template v-slot:[`item.created_at`]="{ item }">
                    <p>{{ item.created_at | formatDate }}</p>
                </template>
                          
                </v-data-table>
                </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import DatePicker from '../DatePicker.vue'
import _ from 'lodash';
var jalaali = require('jalaali-js')
export default{
    components:{DatePicker},
    data(){
        return{
            options:{           
            itemsPerPage: 10,
            page:1,
            transactionDate:"",
            isPaied: true,
            isUsed: true,
            amount:"",
            orderNumber:""
           },
            dialog: false,
            isLoading: false,
            debouncedLoadPayments: null,
        }
    },
    created() {
    // Initialize the debounced function with a delay of 300ms
    this.debouncedLoadPayments = _.debounce(this.loadPayments, 1000);
  },
    methods:{
        loadPayments(){
            this.$store.dispatch('loadMiarzePayments',this.options)
        }
    },
    computed:{
        headers(){
            return [
                {
                    text: "شماره",
                    value:"id"
                },
                {
                    text: "شماره سفارش",
                    value:"order.number"
                },                {
                    text: "تاریخ درگاه",
                    value:"created_at"
                },
                {
                    text: "مبلغ",
                    value: "amount"
                },
                {
                    text: "مرجع بانک",
                    value: "bank_ref"
                },
                {
                    text: "شماره تراکنش",
                    value: "bank_tran"
                },
                {
                    text: "پرداخت موفق",
                    value: "is_paied"
                },
                {
                    text: "استفاده شده",
                    value: "is_used"
                }
            ]
        },
        itemCountPaymentMiarze(){
            return this.$store.getters.getMiarzePaymentsItemCount;
    },
    payments(){
        return this.$store.getters.getMiarzePayments;

    }},
    watch:{
        options:{
      handler(){
        this.debouncedLoadPayments();   
      },  deep: true
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
        }}
}
</script>