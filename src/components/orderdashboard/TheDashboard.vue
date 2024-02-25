<template>
    <v-container>
        <!-- کارت انتخاب سفارش -->
        <!-- <v-card v-if="!order">
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
        </v-card> -->
        <!-- کارت اطلاعات سفارش -->
        <v-card v-if="order">
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <h2>اطلاعات مشتری</h2>
                    </v-col>
                </v-row>               
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.cardCode"
                        label="کد"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.cardName"
                        label="نام"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.city"
                        label="شهر"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.groupName"
                        label="گروه مشتری"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.slpname"
                        label="ویزیتور"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.order.docTime"
                        label="تاریخ فاکتور"
                        ></v-text-field>    
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>  
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
                                :value="order.order.marketingdetails.campaign"
                                disabled></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                label="نوع فاکتور"
                                :value="invType"
                                disabled></v-text-field>
                            </v-col>
                            <v-col  cols="4">
                              <v-text-field label="وضعیت سند" disabled :value="order.order.docStatus"></v-text-field>
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
        <v-card v-if="order">
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
                                    :class="defineClass"></v-text-field>
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
                                </v-data-table>
                            </v-col>   
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>
        <v-card v-if="order && nextStatesData">
            <v-card-title>
                <v-col cols="12" class="d-flex justify-center align-center">
                        <h2>تغییر وضعیت سفارش</h2>
                    </v-col>
            </v-card-title>
          <v-card-text>
            <v-row align="center" justify="center" >
              <v-col v-for="(item,index) in nextStatesData" :key="index" cols="4" class="d-flex justify-center align-center">
                <v-btn color="green" @click="changeState(item)">{{item.title}}</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card v-if="order && actions">
            <v-card-title>
                <v-col cols="12" class="d-flex justify-center align-center">
                        <h2>صدور سند</h2>
                    </v-col>
            </v-card-title>
          <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-data-table
                    hide-default-footer
                    :items="order.order.deliveryDocs"
                    :headers="deliveryHeaders"
                    show-select
                    item-key="docEntry"
                    item-value="docEntry"
                    v-model="selectedDelivery">
                    </v-data-table>
                </v-col>
                <v-col cols="4">
                    <v-select
                    :items="payDueDate"
                    name="bankAccount"
                    label="موعد پرداخت جدید"
                    solo
                    item-text="text"
                    item-value="value"
                    v-model="newPayDueDate"
                    ></v-select>
                    </v-col>
                    <v-col cols="4">   
                    <date-picker v-model="newDate" label="تاریخ جدید"></date-picker>
                </v-col>
              <v-col v-for="(item,index) in actions" :key="index" cols="4">
                <v-btn color="green" @click="doB1Action(item)">{{item.title}}</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card v-if="order">
          <v-row>
              <v-col cols="4">
                <v-btn  color="orange" @click="refreshData">بازگشت</v-btn>
              </v-col>
          </v-row>
        </v-card>
        <!-- لودینگ
        <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>در حال بارگذاری</p>
        </v-overlay> -->
    </v-container>
</template>

<script>
import DatePicker from '../DatePicker.vue'

import  {cheqAgent} from '@/services/agent'
var jalaali = require('jalaali-js')
export default{
    components:{DatePicker},
    props:{
        // docNum: Number 
        order: Object,
        nextStatesData: Array,
        actions: Array
    },
    data(){
        return {
            // docNum:'',
            // order: null,
            isLoading: false,
            newPayDueDate:null,
            newDate: null,
            selectedDelivery:null,
            // nextStatesData:null
        }
    },
    methods:{
      refreshData(){

        this.$emit("close")
      },
      formatAmount(value){
        let fixed = Number(value).toFixed(0)
        const stringVlue = fixed //String(value)
        const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedIntegerPart
      },

      getB1Token(){
        try{
          let payload = {Username:"ShahinCamunda", Password:"kAFy24iCosIb2r9jliLB"}
        const response = cheqAgent.post('/Login',payload)
        if(response.status == 200){
          return response
        }
        }catch{
          this.isLoading=false
          this.$toasted.show("خطا در بی وان، توکن",{
            position: 'bottom-center',
            type:"error",
            duration: 5000
          })
        }

      },
      async changeState(item){
        this.isLoading = true
        console.log(item)
        try{
          let token = this.getB1Token()
          let NextStateCode = item.code.substring(1)
            let DocEntry = this.order.docEntry
            let OperatorGroupCode = this.$store.getters.getUser.userRole
        let OperatorCode = this.$store.getters.getUser.userRole
        let payload = {

          token: token,
          DocEntry: DocEntry,
          NextStateCode: NextStateCode,
          OperatorGroupCode: OperatorGroupCode,
          OperatorCode: OperatorCode
          }
            console.log(`rhis: ${payload}`)
          const response = await cheqAgent.post('/ChangeOrderStatus', payload)
          if(response.status == 200){
          this.isLoading = false
          this.refreshData()
          if (response.data.results == true){
            this.$toasted.show('با موفقیت انجام شد',{
            position: 'bottom-center',
            duration: 5000,
            type: 'success'
          })
          }else{
            this.$toasted.show(response.data.error,{
            position: 'bottom-center',
            duration: 5000,
            type: 'error'
          })
          }
        }else if(response.status < 500){
          this.isLoading = false
          this.$toasted.show(response.data.error,{
            position: 'bottom-center',
            duration: 5000,
            type: 'error'
          })
        }else{
          this.isLoading = false
          this.$toasted.show('خطا در برقراری ارتباط با B1',{
            position: 'bottom-center',
            duration: 5000,
            type: 'error'
          })
        }

        }catch(e){
          this.isLoading = false
          this.$toasted.show(e.message,{
            position: 'bottom-center',
            duration: 5000,
            type: 'error'
          })
        }  
      },
      async doB1Action(item){
        if (this.selectedDelivery == null){
            this.$toasted.show("لطفا یک دلیوری انتخاب کنید",{
                position: 'bottom-center',
                type: 'error',
                duration: 5000
            })
        }else{
        let payload = {
            action_id:item.id,
            so_doc_entry: this.order.DocEntry,
            delivery_doc_entry:this.selectedDelivery,
        }
        if (this.newPayDueDate){
            payload.new_pay_due_date= this.newPayDueDate
        }
        if (this.newDate){
            payload.new_date = this.newDate
        }
        console.log(payload)
        // this.$store.dispatch("doB1ActionBpms", payload).then((response)=>{
        //     if (response.is_success == true){
        //         this.refreshData()
        //         this.$toasted.show('با موفقیت انجام شد',{
        //             position: 'bottom-center',
        //             duration: 5000,
        //             type:'success'
        //         })
        //     }else{
        //         this.$toasted.show(response.error,{
        //             position: 'bottom-center',
        //             duration: 5000,
        //             type: 'error'
        //         })
        //     }
        //     }
        // )
        }
      }

    },
    computed:{
        defineClass(){

            return this.order.customer.ballance < 0 ? 'red-text' : ''
        },
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
        requiredCash(){
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
        cardGroupCodes(){
        return [
            {
            text: "مشتریان عادی",
            value: 166
            },        {
            text: "مشتریان برنزی",
            value: 167
            },        {
            text: "مشتریان نقره ای",
            value: 168
            },        {
            text: "مشتریان طلایی",
            value: 169
            }]
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
        deliveryHeaders(){
            return [
                {
                    text: 'شماره سند',
                    value: 'docNum'
                },  
                {
                    text: 'تاریخ سند',
                    value: 'docTime'
                },  
                {
                    text: 'مبلغ سند',
                    value: 'docTotal'
                },  
                {
                    text: 'مشتری',
                    value: 'cardCode'
                }, 
            ]
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

    }
</script>
<style  scoped>
.v-card{
    margin: 10px;
}

</style>
