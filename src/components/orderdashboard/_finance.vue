<template>
    <v-card>
        <v-card-title>
            <v-row>
                <v-col cols="12" class="d-flex justify-center align-center">
                    <h2>سوابق مالی</h2>
                </v-col>
            </v-row>
        </v-card-title>

        <v-card-text>
                <v-card class="ma-3">
                    <v-row>
                    <v-card-title>
                        <v-col cols="12" class="d-flex justify-center align-center">
                            <p>سابقه حساب باز و چک برگشتی مشتری</p>
                        </v-col>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="2">
                                <v-text-field
                                label="مانده مشتری"
                                :messages="order.customer.ballance < 0 ? 'منفی' : ''"
                                :value="formatAmount(order.customer.ballance)"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field
                                label="چک باز"
                                :messages="order.customer.openCheck < 0 ? 'منفی' : ''"
                                :value="formatAmount(order.customer.openCheck)"></v-text-field>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field
                                :messages="order.customer.rejectedCheck < 0 ? 'منفی' : ''"
                                label="چک برگشتی"
                                :value="formatAmount(order.customer.rejectedCheck)"></v-text-field>
                            </v-col> 
                            <v-col cols="2">
                                <v-text-field
                                :messages="order.customer.openDelivery < 0 ? 'منفی' : ''"
                                label="خروج باز"
                                :value="formatAmount(order.customer.openDelivery)"></v-text-field>
                            </v-col>
                            <v-col cols="2 ">
                                <v-text-field
                                label="سفارش باز"
                                :messages="order.customer.openOrder < 0 ? 'منفی' : ''"                                   
                                :value="formatAmount(order.customer.openOrder)"></v-text-field>
                            </v-col>                                                                                               
                        </v-row>
                    </v-card-text>
                    </v-row>   
            </v-card>

        </v-card-text>
        <v-card-text>
            <v-card class="ma-3">
                <v-card-title>
                    <v-row>
                        <v-col cols="12" class="d-flex justify-center align-center">
                            <h2>اطلاعات پرداخت های روی فاکتور</h2>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols=12>
                            <v-data-table
                            :headers="paymentHeaders"
                            :items="order.payment">
                                <template v-slot:[`item.paymentforLineTotal`]="item">
                                <p>  {{ formatAmount(item.item.paymentforLineTotal)}}</p>
                                </template>
                                <template v-slot:[`item.ipDueDate`]="item">
                                    <p>{{ item.item.ipDueDate | formatDate }}</p>
                                </template>
                                <template v-slot:[`item.ipDocDate`]="item">
                                    <p>{{ item.item.ipDocDate | formatDate }}</p>
                                </template>
                                <template v-slot:[`item.IpType`]="item">
                                    <p>{{ item.item.IpType == "T" ? "نقدی" : "چک"}}</p>
                                </template>                                       
                            </v-data-table>
                        </v-col>   
                    </v-row>
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>
</template>
<script>
var jalaali = require('jalaali-js')
export default{
    props:{
        order: Object
    },computed:{
        paymentHeaders(){
            return [
                {
                    text: 'شماره سند',
                    value: 'ipDocNum'
                },  
                {
                    text: 'تاریخ سند',
                    value: 'ipDocDate'
                }, 
                {
                    text: 'تاریخ موثر',
                    value: 'ipDueDate'
                }, 
                {
                    text: 'شماره صیادی',
                    value: 'U_SayadiNumber'
                }, 
                {
                    text: 'نوع',
                    value: 'IpType'
                }, 
                {
                    text: 'مبلغ',
                    value: 'paymentforLineTotal'
                }
            ]
        },
    },methods:{
        formatAmount(value){
          const stringVlue = Number(value).toFixed(0)
          const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return  formattedIntegerPart
        },
    
    },
    filters:{    formatAmount(value){
          const stringVlue = Number(value).toFixed(0)
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
