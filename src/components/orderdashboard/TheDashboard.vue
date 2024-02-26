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
        <the-customer :order="order"></the-customer>
        <the-order :order="order"></the-order>
        <the-finance :order="order"></the-finance>
        <v-card v-if="hasChange">
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
        <v-card v-if="hasAction">
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
        <!-- لودینگ -->
        <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>در حال عملیات</p>
        </v-overlay>
    </v-container>
</template>

<script>
import DatePicker from '../DatePicker.vue'
import TheFinance from './_finance.vue'
import TheCustomer from './_customer.vue'
import TheOrder from './_order.vue'
import  {cheqAgent} from '@/services/agent'
var jalaali = require('jalaali-js')
export default{
    components:{DatePicker,TheFinance, TheCustomer, TheOrder},
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
            selectedDelivery:[],
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

      async getB1Token(){
        try{
          let payload = {Username:"ShahinCamunda", Password:"kAFy24iCosIb2r9jliLB"}
        const response = await cheqAgent.post('/Login',payload)
        if(response.status == 200){
          return response.data
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
        try{
          let token = await this.getB1Token()
          let nextStateCode = item.code.substring(1)
        let docEntry = this.order.order.docEntry
        let operatorGroupCode = this.$store.getters.getUser.role
        let operatorCode = this.$store.getters.getUser.b1_operator_code

        let payload = {
          token: String(token),
          DocEntry: docEntry,
          NextStateCode: nextStateCode,
          OperatorGroupCode: operatorGroupCode,
          OperatorCode: operatorCode
          }
            console.log(payload)
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
        this.isLoading = true
        if (this.selectedDelivery.length != 1){
            this.$toasted.show("لطفا یک دلیوری انتخاب کنید",{
                position: 'bottom-center',
                type: 'error',
                duration: 5000
            })
        }else{
            
        let payload = {
            action_id:item.id,
            so_doc_entry: this.order.order.docEntry,
            delivery_doc_entry:this.selectedDelivery[0].docEntry,
        }
        if (this.newPayDueDate){
            payload.new_pay_due_date= this.newPayDueDate
        }
        if (this.newDate){
            payload.new_date = this.newDate
        }
        console.log(payload)
        this.$store.dispatch("doB1ActionBpms", payload).then((response)=>{
            this.isLoading = false
            if (response.is_success == true){
                this.refreshData()
                this.$toasted.show('با موفقیت انجام شد',{
                    position: 'bottom-center',
                    duration: 5000,
                    type:'success'
                })
            }else{
                this.$toasted.show(response.error,{
                    position: 'bottom-center',
                    duration: 5000,
                    type: 'error'
                })
            }
            }
        )
        }
      }

    },
    computed:{
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
        },
        hasAction(){
            if (this.actions == null ){
                return false
            }else{
                return this.actions.length > 0
            }
        },
        hasChange(){
            return this.order && this.nextStatesData?.length > 0
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
