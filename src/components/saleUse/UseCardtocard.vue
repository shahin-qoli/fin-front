<template>
    <v-container>
        <v-row >
            <v-col cols="12">
                <v-toolbar dark color="gold">           
                            <h3 class="text-center">ورود اطلاعات کارت به کارت</h3>
                </v-toolbar>
            </v-col>
            <v-col cols="12">
                <v-form @submit.prevent="submitForm">
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="cardStart" hint="6273" label="چهار رقم اول کارت واریزکننده"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="cardEnd" hint="6273" label="چهار رقم آخر کارت واریزکننده"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="amount" hint="120000000" label="مبلغ"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="peygiriNumber" hint="8787656" label="شماره پیگیری"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <date-picker v-model="transactionDate"></date-picker>
                        </v-col>
                        <v-col cols="9">
                            <v-btn dark color="green" type="submit">جستجو</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
        <p :v-if="errorMessage">{{ errorMessage }}</p>
        <v-row v-if="isSuccess">
            <v-divider></v-divider>
            <v-col cols="12">
                <v-toolbar dark color="gold">           
                            <h3 class="text-center">استفاده از تراکنش</h3>
                </v-toolbar>
            </v-col>
            <v-form @submit.prevent="useTransaction">
                <v-col cols="12">
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="toUseData.from_card"  label="شماره کارت مبدا" disabled></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="toUseData.to_card"   label="شماره کارت مقصد" disabled></v-text-field>           
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="toUseData.amount"  label="مبلغ" disabled></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="toUseData.peygiri_number" label="شماره پیگیری" disabled></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="toUseData.transaction_date" label="تاریخ" disabled></v-text-field>
                            </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="toUseData.used_for" label="کد مشتری" hint="C33389"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-file-input
                                accept="image/*"
                                label="بارگذاری عکس"
                                v-model="file"
                            />
                        </v-col>
                        <v-col cols="6">
                            <v-btn dark color="green" type="submit">ثبت</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-form>
            <p>{{  useMessage}}</p>
        </v-row>
    </v-container>
</template>


<script>
import { finAgent } from '@/services/agent'
import DatePicker from '../DatePicker.vue'
export default{
    components:{
        DatePicker
    },
    data(){
        return {
            file: null,
            isLoading: null,
            errorMessage: '',
            useMessage:'',
            isSuccess: null,
            cardStart: '',
            cardEnd: '',
            transactionDate: new Date().toISOString().substr(0, 10),
            peygiriNumber: null,
            amount: null,
            toUseData:{
                peygiri_number: null,
                from_card: "",
                to_card: "",
                amount: null,
                transaction_date: "",
                used_for:""
            }
        }
    },
    methods:{
        async useTransaction(){
            var payload = this.toUseData;
            const responseData= await finAgent.post('/v1/card_to_card_raws/use_payment',payload)
            console.log(responseData)
            console.log(this.file)
            if (responseData){
                if(responseData.data.error){
                this.useMessage = responseData.data.error}
            else if(responseData.data.result){
                var usedId = responseData.data.used_id
                let formData = new FormData()
                formData.append('file', this.file,this.file.name)
                
                const imageData = await finAgent.post(`/front/used_payments/${usedId}/upload_image`,formData)
                console.log(imageData)
                if(imageData.data.result)

                 this.useMessage = `با موفقیت انجام شد، شماره درخواست : ${usedId}` 

        }
            }
        },
        setDate(date){
            console.log(date)
            this.transactionDate = date;
        },
        async submitForm(){
            this.errorMessage= null
            this.toUseData={}
            this.isSuccess = null;
            console.log("starting")
            console.log(this.data)
            this.isLoading= true;
           const responseData=await finAgent.get(`/v1/card_to_card_raws/find_payment?q[from_card_start]=${this.cardStart}&q[from_card_end]=${this.cardEnd}&q[transaction_date_eq]=${this.transactionDate}&q[amount_eq]=${this.amount}&q[peygiri_number_eq]=${this.peygiriNumber}`)
           console.log(responseData)
           this.isLoading= false
           if(responseData)
            if(responseData.data.error){
                this.errorMessage = responseData.data.error}
            else {
                this.toUseData = responseData.data[0]
                this.isSuccess = true
                console.log(this.toUseData)}

        }
    }
}

</script>

