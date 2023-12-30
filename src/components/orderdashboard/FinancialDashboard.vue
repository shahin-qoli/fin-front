<template>
    <v-container>
        <!-- کارت انتخاب سفارش -->
        <v-card v-if="!order">
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <p>انتخاب سفارش</p>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="findOrder">
                    <v-row>
                        <v-col cols="4">
                            <v-text-field
                            v-model="docNum"
                            label="شماره سفارش">
                            </v-text-field> 
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="green" type="submit">جستجو</v-btn>
                        </v-col>
                    </v-row>                   
                </v-form>
            </v-card-text>
        </v-card>
        <!-- کارت اطلاعات سفارش -->
        <v-card v-else>
         
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <p>اطلاعات سفارش</p>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <!-- کارت جزییات سفارش -->
                    <v-col cols="6">
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-data-table
                                :items="order.orderLines"
                                :headers="orderHeaders"
                                ></v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <!-- کارت جزییات پرداخت -->
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col cols="12" class="d-flex justify-center align-center">
                                <p>اطلاعات پرداخت</p>
                            </v-col>
                        </v-row>
                    </v-card-title>                    
                    <v-card-text>
                        <v-row>
                            <v-col cols="3">
                                <p>پرداخت نقدی:</p>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                label="مبلغ لازم"
                                v-model="requiredCash"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                label="مبلغ پرداختی"
                                v-model="paidCash"
                                disabled></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <p>پرداخت چک:</p>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                label="مبلغ لازم"
                                v-model="requiredCheque"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                label="مبلغ پرداختی"
                                v-model="paidCheque"
                                disabled></v-text-field>
                            </v-col>
                        </v-row>                        
                    </v-card-text>
                </v-card>
            </v-col>
            </v-row>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <h2>سوابق مالی</h2>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <p>سابقه حساب باز و چک برگشتی مشتری</p>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <p>اطلاعات پرداخت های روی فاکتور</p>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <p>اطلاعات پرداخت های بدون فاکتور</p>
                    </v-col>
                </v-row>
            </v-card-title>
        </v-card>
    </v-container>
</template>

<script>

export default{
    data(){
        return {
            docNum:''
        }
    },
    methods:{
        findOrder(){
            this.$store.dispatch('findOrderFinancial', this.docNum).then(() => this.loadOrder)
        },

    },
    computed:{
        order(){
            return   {
                orderLines:[{
                    ItemCode: '5322',
                    ItemName: '10 وات مهتابی',
                    ItemQty: '100',
                    ItemFee: 2,
                    ItemDiscPrcnt: 10,
                    ItemTotal: 180
                }],
                payDueDate:1,
                paymentTime:1,
                docDiscPrcnt: 10,
                docTotal:162
            }
            // this.$store.getters.getOrderFinancial;
        },
        orderHeaders(){
            return [
                {
                    text: 'کد',
                    value: 'ItemCode'
                },            
                {
                    text: 'شرح',
                    value: 'ItemName'
                },     
                {
                    text: 'تعداد',
                    value: 'ItemQty'
                },     
                {
                    text: 'فی',
                    value: 'ItemFee'
                },  
                {
                    text: 'درصد تخفیف',
                    value: 'ItemDiscPrcnt'
                },       
                {
                    text: 'جمع',
                    value: 'ItemTotal'
                },  
            ]
        },
        requiredCash(){
            return 2000;
        },
        paidCash(){
            return 2000;
        },
        requiredCheque(){
            return 0;
        },
        paidCheque(){
            return 0;
        }
    }
}
</script>
