<template>
            <v-card v-if="order">         
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <h2>اطلاعات سفارش</h2>
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
                                hide-default-footer

                                :items="order.order.marketingLines"
                                :headers="orderHeaders"
                                >
                                <template v-slot:[`item.priceAfterDiscount`]="item" >
                                    <p>{{ item.item.priceAfterDiscount.toFixed(0) | formatAmount }}</p>
                                </template>
                                <template v-slot:[`item.lineTotal`]="item" >
                                    <p>{{ item.item.lineTotal.toFixed(0) | formatAmount }}</p>
                                </template>                                
                                </v-data-table>
                                <div style="margin-top: 15px;" >
                                    <v-row justify="end" >
                                    <v-col cols="12" lg="2" sm="4" md="4">
                                        <p class="total-text">جمع کل:</p>
                                    </v-col>
                                    <v-col cols="12" lg="3" sm="8" md="8">
                                    <p class="total-text">{{ (order.order.documentTotal+order.order.marketingdetails.documentDiscount)| formatAmount }} ریال</p>
                                    </v-col>
                                    </v-row>
                                    <v-row justify="end" >
                                    <v-col cols="12" lg="2" sm="4" md="4">
                                        <p class="total-text">درصد تخفیف:</p>
                                    </v-col>
                                    <v-col cols="12" lg="3" sm="8" md="8">
                                    <p class="total-text">{{ order.order.marketingdetails.documentDiscountPercent }}</p>
                                    </v-col>
                                    </v-row>    
                                    <v-row justify="end" >
                                    <v-col cols="12" lg="2" sm="4" md="4">
                                        <p class="total-text">قابل پرداخت:</p>
                                    </v-col>
                                    <v-col cols="12" lg="3" sm="8" md="8">
                                    <p class="total-text">{{ order.order.documentTotal | formatAmount }} ریال</p>
                                    </v-col>
                                    </v-row>         
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <!-- کارت جزییات سفارش -->
            <v-col cols="6">
                <v-card class="ma-3">
                    <v-card-title>
                        <v-row>
                            <v-col cols="12" class="d-flex justify-center align-center">
                                <p>جزییات</p>
                            </v-col>
                        </v-row>
                    </v-card-title>                    
                    <v-card-text>                                             
                        <v-row>
                            <v-col cols="4">
                                <v-text-field
                                label="روش تسویه"
                                :value="settleType"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                label="موعد تسویه"
                                :value="payDueDateText"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                label="زمان پرداخت"
                                :value="paymentTime"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                label="روش ارسال"
                                :value="deliveryType"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                label="کمپین"
                                :value="formatCampaign(order.order.marketingdetails.campaign)"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                label="نوع فاکتور"
                                :value="invType"
                                disabled></v-text-field>
                            </v-col>
                            <v-col  cols="4">
                              <v-text-field label="وضعیت سند" disabled :value="formatState(order.order.docStatus,orderStates)"></v-text-field>
                            </v-col> 
                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- کارت جزییات پرداخت -->
                <v-card class="ma-3">
                    <v-card-title>
                        <v-row>
                            <v-col cols="12" class="d-flex justify-center align-center">
                                <p>پرداختی ها</p>
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
                            <v-col cols="12">
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
                                label="روز مورد انتظار"
                                v-model="expectedChequeDays"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                label="مبلغ پرداختی"
                                v-model="paidCheque"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                label="راس چک"
                                v-model="calRas"
                                disabled></v-text-field>
                            </v-col>                            
                        </v-row>                        
                    </v-card-text>
                </v-card>
            </v-col>
            </v-row>
            </v-card-text>
        </v-card>
</template>

<script>
export default{
    props:{
        order: Object
    },
    methods:{
        formatAmount(value){
        let fixed = Number(value).toFixed(0)
        const stringVlue = fixed //String(value)
        const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedIntegerPart
      },
      formatState(state,orderStates){
            let index = orderStates.findIndex(stat => stat.value == state )
            if (index >= 0)
                return orderStates[index].text
            else
                return "تعریف نشده"
        },
        formatCampaign(value){
            let index = this.campaigns.findIndex(stat => stat.value == value )
            if (index >= 0)
                return this.campaigns[index].text
            else
                return "تعریف نشده"
        },
    },
    computed:{
        
        requiredCash(){
            console.log("requiredCash")
            let payduedate =  this.payDueDate.filter(x => x.value == this.order.order.marketingdetails.payDueDate)[0];
            return  this.formatAmount((this.order.order.documentTotal * payduedate.cash).toFixed(0))
        },
        paidCash(){
            let paid= 0
            if (this.order.payment.length < 1)
                return paid
            else{
           this.order.payment.filter(x => x.IpType == "T").forEach((item) => paid += Number.parseFloat(item.paymentforLineTotal))
            // console.log(pym)
             return this.formatAmount(paid.toFixed(0))}
        },
        requiredCheque(){

            let payduedate =  this.payDueDate.filter(x => x.value == this.order.order.marketingdetails.payDueDate)[0];
            return this.formatAmount((this.order.order.documentTotal * payduedate.cheque).toFixed(0))
        },
        paidCheque(){
            let paid= 0
            if (this.order.payment.length < 1)
                return paid
            else{
           this.order.payment.filter(x => x.IpType == "C").forEach((item) => paid += Number.parseFloat(item.paymentforLineTotal))

            return this.formatAmount(paid.toFixed(0))}
        },
        expectedChequeDays(){


            return this.payDueDate.filter(x => x.value == this.order.order.marketingdetails.payDueDate)[0].days;
        },
        orderHeaders(){
            return [
                {
                    text: 'کد',
                    value: 'itemCode'
                },            
                {
                    text: 'شرح',
                    value: 'itemName'
                },     
                {
                    text: 'تعداد',
                    value: 'itemQty'
                },     
                {
                    text: 'فی',
                    value: 'priceAfterDiscount'
                },  
                {
                    text: 'درصد تخفیف',
                    value: 'discountPercent'
                },       
                {
                    text: 'جمع',
                    value: 'lineTotal'
                },  
            ]
        }, 
        settleType(){
        let data = [
            {
            text: "نقد",
            value: 1
            },
            {
            text: "چک",
            value: 2
            },
            {
            text: "NotSet",
            value: 3
            },
            {
            text: "ترکیبی",
            value: 4
            },
            {
            text: "pos",
            value: 8
            },
            {
            text: "online",
            value: 16
            },
            {
            text: "card",
            value: 32
            },
            {
            text: "pos_cheque",
            value: 10
            },
            {
            text: "online_cheque",
            value: 18
            },
            {
            text: "card_cheque",
            value: 34
            }
        ]
            return data.filter(item => item.value == this.order.order.marketingdetails.settleType)[0].text
        },
        paymentTime(){
        let data = [
            {
            text: "واریز",
            value: 1
            },
            {
            text: "پای بار",
            value: 2
            },
            {
            text: "گارانتی",
            value: 3
            },
            {
            text: "تسویه بعد از ارسال",
            value: 4
            },
            {
            text: "اینترنتی",
            value: 5
            },
            {
            text: "NotSet",
            value: 6
            },
        ]
        return data.filter(item => item.value == this.order.order.marketingdetails.paymentTime)[0].text
        },
        deliveryType(){
        let data =  [
            {
            text: "ماشین توزیع",
            value: 11
            },
            {
            text: "ماشین اجاره ای",
            value: 12
            },
            {
            text: "باربری",
            value: 13
            },
            {
            text: "پخش گرم",
            value: 14
            },
            {
            text: "توسط ویزیتور",
            value: 15
            },
            {
            text: "NotSet",
            value: 16
            },
            {
            text: "توسط مشتری",
            value: 17
            },
            {
            text: "پیک",
            value: 18
            },
            {
            text: "می ارزه",
            value: 19
            },
        ]   
        return data.filter(item => item.value == this.order.order.marketingdetails.deliveryType)[0].text
        },
        payDueDate(){
        return [
            {
            text: "نقدی",
            value: 1,
            settletype:1,
            cash:1,
            cheque: 0
            },
            {
            text: "15 روزه",
            value: 2,
            settletype:1,
            cash:1,
            cheque: 0,
            days: 15
            },
            {
            text: "30 روزه",
            value: 3,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 30
            },
            {
            text: "45 روزه",
            value: 4,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 45
            },
            {
            text: "NotSet",
            value: 5,
            cash:1,
            cheque: 0
            },
            {
            text: "60 روزه",
            value: 6,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 60
            },
            {
            text: "75 روزه",
            value: 7,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 75
            },
            {
            text: "90 روزه",
            value: 8,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 90
            },
            {
            text: "105 روزه",
            value: 9,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 105
            },      
            {
            text: "120 روزه",
            value: 10,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 120
            },
            {
            text: "135 روزه",
            value: 11,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 135
            },
            {
            text: "150 روزه",
            value: 12,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 150
            },
            {
            text: "165 روزه",
            value: 13,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 165
            },
            {
            text: "180 روزه",
            value: 14,
            settletype:2,
            cash:0,
            cheque: 1,
            days: 180
            },
            {
            text: "25%نقد - 75% چک 60 روزه",
            value: 15,
            settletype:4,
            cash:0.25,
            cheque: 0.75,
            days: 60
            },
            {
            text: "50%نقد - 50% چک 90 روزه",
            value: 16,
            settletype:4,
            cash:0.5,
            cheque: 0.5,
            days: 90
            },{
            text: "20%نقد - 80% چک 90 روزه",
            value: 17,
            settletype:4,
            cash:0.2,
            cheque: 0.8,
            days: 90
            },
            {
            text: "30%نقد - 70% چک 120 روزه",
            value: 18,
            settletype:4,
            cash:0.3,
            cheque: 0.7,
            days: 120
            },
            {
            text: "50%نقد - 50% چک 150 روزه",
            value: 19,
            settletype:4,
            cash:0.5,
            cheque: 0.5,
            days: 150
            },        
            {
            text:  "10%نقد - 90% چک 30 روزه",
            value: 20,
            settletype:4,
            cash:0.1,
            cheque: 0.9,
            days: 30
            },
            {
            text: "10%نقد - 90% چک 60 روزه",
            value: 21,
            settletype:4,
            cash:0.1,
            cheque: 0.9,
            days: 60
            },
            {
            text:  "10%نقد - 90% چک 90 روزه",
            value: 22,
            settletype:4,
            cash:0.1,
            cheque: 0.9,
            days: 90
            },
            {
            text: "10%نقد - 90% چک 120 روزه",
            value: 23,
            settletype:4,
            cash:0.1,
            cheque: 0.9,
            days: 120
            },
            {
            text:  "50%نقد - 50% چک 30 روزه",
            value: 24,
            settletype:4,
            cash:0.5,
            cheque: 0.5,
            days: 30
            },
            {
            text:  "30%نقد - 70% چک 60 روزه",
            value: 25,
            settletype:4,
            cash:0.3,
            cheque: 0.7,
            days: 60
            },
            {
            text: "40%نقد - 60% چک 90 روزه",
            value: 26,
            settletype:4,
            cash:0.4,
            cheque: 0.6,
            days: 90
            },
            {
            text:  "50%نقد - 50% چک 120 روزه",
            value: 27,
            settletype:4,
            cash:0.5,
            cheque: 0.5,
            days: 120
            },        
            {
            text:  "20%نقد - 80% چک 60 روزه",
            value: 28,
            settletype:4,
            cash:0.2,
            cheque: 0.8,
            days: 60
            },
            {
            text: "30%نقد - 70% چک 90 روزه",
            value: 36,
            settletype:4,
            cash:0.3,
            cheque: 0.7,
            days: 90
            },
            {
            text:  "40%نقد - 60% چک 120 روزه",
            value: 37,
            settletype:4,
            cash:0.4,
            cheque: 0.6,
            days: 120
            }
            ]
        },    
        payDueDateText(){
        let text = this.payDueDate.filter(item => item.value == this.order.order.marketingdetails.payDueDate)[0].text
            return  text ? text : "تعریف نشده"
        },
        invType(){
        let data = [
            {
            text: "رسمی",
            value: 1,
            settletype:1
            },
            {
            text: "گارانتی",
            value: 2,
            settletype:1
            },
            {
            text: "غیر رسمی",
            value: 3,
            settletype:2
            }
    
            ]
            return data.filter(item => item.value == this.order.order.marketingdetails.invType)[0].text
        },
        calRas(){
            let today = Date.now()
            let weighted = 0
            let total = 0
            let cheques = this.order.payment.filter((item)=> item.IpType =="C")
            if (cheques.length < 1)
                return 0 
            else
                cheques.forEach((item) => {
                    let duedate = Date.parse(item.ipDueDate)
                    let daysDifference = (duedate - today) / (1000 * 60 * 60 * 24);
                    weighted += Number(item.paymentforLineTotal) * daysDifference
                    total += Number(item.paymentforLineTotal)
                })
                return (weighted/total).toFixed(0)
        },
        orderStates(){
            return[
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
        },
        campaigns(){
            return [
                { text: 'خرید عادی', value: '0' },
        { text: 'فروش ویژه چراغ خطی', value: '20' },
        { text: 'فروش ویژه چراغ خطی آریان', value: '21' },
        { text: 'طرح ده وات طلایی', value: '18' },
        { text: 'طرح وات های طلایی', value: '14' },
        { text: 'طرح پیشین', value: '00' },
        { text: 'طرح نورواره 2', value: '12' },
        { text: 'طرح نورواره 2-ویژه', value: '22' },
        { text: 'طرح عیدانه', value: '01' },
        { text: 'طرح ویژه 10 وات', value: '10' },
        { text: 'طرح پخش گرم 10 وات', value: '11' },
        { text: 'تابستان داغ', value: '24' },
        { text: 'حراجستان', value: '25' },
        { text: 'طرح چراغ خطی 1401', value: '26' },
        { text: 'BELEX2022', value: '27' },
        { text: 'طرح شب یلدای روشنایی', value: '28' },
        { text: 'طرح شب یلدای باتری', value: '29' },
        { text: 'بسته های یلدا', value: '30' },
        { text: 'همایش بلکس شیراز 1401', value: '31' },
        { text: 'نورواره3', value: '32' },
        { text: 'آخرین قیمت سال 1401', value: '33' },
        { text: 'همایش تهران و مشهد 1402', value: '34' },
        { text: 'می ارزه', value: '35' },
        { text: 'همایش اردبیل 1402', value: '36' },
        { text: 'همایش کرمانشاه 1402', value: '37' },
        { text: 'همایش ایلام 1402', value: '38' },
        { text: 'همایش لرستان 1402', value: '39' },
        { text: 'اقلامی همایش', value: '40' },
        { text: 'گارانتی تعویض', value: '41' },
        { text: 'همایش کردستان 1402', value: '42' },
        { text: 'همایش همدان 1402', value: '43' },
        { text: 'ده وات طلایی_اپ الکتریکی', value: '44' },
        { text: 'طرح 10 وات پایدار آبان', value: '45' },
        { text: 'همایش بلکس 2023', value: '46' },
        { text: 'فروش امتیازی باشگاه', value: '47' },
        { text: 'بسته های همایش بلکس 2023', value: '48' },
        { text: 'فروش ابزارآلات همایش بلکس 2023', value: '49' },
        { text: 'طرح اقلامی زمستان 1402 (30گروه)', value: '50' },
        { text: 'حبابی های زمستان 1402', value: '51' },
        { text: 'طرح اقلامی زمستان 1402 (69گروه)', value: '52' },
        { text: 'طرح اقلامی سنگین زمستان 1402 (69گروه)', value: '53' },
        { text: 'عیدانه بروکس - چک 6 ماهه', value: '54' },
        { text: 'عیدانه بروکس - نقدی', value: '55' }
            ]
        }
    },
    filters:{
        formatAmount(value){
          const stringVlue = String(value)
          const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return formattedIntegerPart
        },
}
}
</script>
