<template>
    <v-container>
        <!-- <v-card>
            <v-card-title>
                <h2>به روز رسانی چک با شماره</h2>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-form @submit.prevent="submitAction" ref="form">
                                <v-row>
                                    <v-col cols="3">
                                        <v-text-field                             
                                        v-model="checkNum"
                                        label="شماره چک"
                                        single-line
                                        required
                                        hide-details></v-text-field>
                                    </v-col>
                                    </v-row>
                                    <v-row>
                                    <v-col cols="2"><p>انتخاب وضعیت چک:</p></v-col>
                                    <v-col cols="3">
                                        <v-select :items="possibleNextStates"
                                        item-text="text"
                                        item-value="value"
                                        v-model="selectedState"></v-select>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col cols="2"><p>انتخاب وضعیت ثبت چک:</p></v-col>
                                    <v-col cols="3">
                                        <v-select :items="possibleNextReg"
                                        item-text="text"
                                        item-value="value"
                                        v-model="selectedReg"></v-select>
                                    </v-col>   
                                      </v-row>
                                    <v-row>                       
                                    <v-col cols="6">
                                        <v-select 
                                        :items="possibleBankAccounts"
                                        v-model="depositeDetails.bankAccount"
                                        label="انتخاب بانک"
                                        item-text="acctName"
                                        item-value="accountCode"
                                        required
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field 
    
                                        v-model="depositeDetails.payer"
                                        label="نام شخص تحویلدار"
                                        single-line
                                        required
                                        hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field 

                                        v-model="depositeDetails.bank"
                                        label="نام بانک"
                                        required
                                        hide-details></v-text-field>
                                    </v-col>
                                    <v-col  cols="6">
                                        <v-text-field 
                        
                                        v-model="depositeDetails.branch"
                                        label="شعبه بانک"
                                        single-line
                                        required
                                        hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field  
                                        v-model="depositeDetails.reference"
                                        label="رفرنس(شماره سند بانکی)"
                                        single-line
                                        required
                                        hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <date-picker v-model="depositeDetails.depositDate" label="تاریخ عملیات"></date-picker>
                                    </v-col>                                                     
                                    <v-col cols="3">
                                        <v-btn :loading="isLoading" color="green" type="submit">به روزرسانی</v-btn>
                                    </v-col>
                                </v-row>
                        </v-form>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card> -->
        <v-card>
            <v-card-title>
                <h2>به روز رسانی وضعیت چک با شماره</h2>
                <h4 style="color:crimson">لطفا توجه داشته باشید در این به روز رسانی هیچ سندی صادر یا لغو نخواهد شد.</h4>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-form @submit.prevent="submitAction" ref="form">
                            <v-row>
                                <v-col cols="3">
                                    <v-text-field                             
                                    v-model="checkNum"
                                    label="شماره چک"
                                    single-line
                                    required
                                    hide-details></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                        <date-picker v-model="dueDate" label="تاریخ چک"></date-picker>
                                    </v-col>
                            </v-row>
                            <v-row>
                            <v-col cols="2"><p>انتخاب وضعیت چک:</p></v-col>
                            <v-col cols="3">
                                <v-select :items="possibleNextStates"
                                item-text="text"
                                item-value="value"
                                v-model="selectedState"></v-select>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="2"><p>انتخاب وضعیت ثبت چک:</p></v-col>
                            <v-col cols="3">
                                <v-select :items="possibleNextReg"
                                item-text="text"
                                item-value="value"
                                v-model="selectedReg"></v-select>
                            </v-col>   
 
                            </v-row>
                            <v-row>                                                                         
                                <v-col cols="3">
                                    <v-btn :loading="isLoading" color="green" type="submit">به روزرسانی</v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-model="showModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="reportResult?.error"></p>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="reportResult.message"></p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="showModal = false">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import DatePicker from '../DatePicker.vue'
export default {
    components: {DatePicker},
    data() {
        return {
            selectedState:'',
            selectedReg:'',
            dueDate:"",
            checkNum: "",
            isLoading: null,
            depositeDetails : {
                bankAccount: "",
                payer: "",
                bank: "",
                branch: "",
                depositedAccount: "",
                reference: "",
                depositDate:"",
            },
            showModal: false,
            reportResult:"",
        }
    },
    computed:{
        possibleNextReg(){
            return [
                {
                    text: "10 ثبت نشده توسط مشتری",
                    value: 10
                },
                {
                    text: "20 ثبت شده توسط مشتری و تایید نشده توسط شرکت",
                    value: 20
                },
                {
                    text: "30 ثبت شده توسط مشتری و تایید شده توسط شرکت",
                    value: 30
                },
                {
                    text: "40 انتقال شده به مشتری پس از استرداد",
                    value: 40
                },
                {
                    text: "50 قفل شده در بانک",
                    value: 50
                },
                {
                    text: "60 صادره شده توسط شرکت",
                    value: 60
                },
                {
                    text: "70 ثبت شده در سامانه",
                    value: 70
                },
                {
                    text: "80 تاییدی شده توسط تامین کننده",
                    value: 80
                },
                {
                    text: "90 انتقال داده شده از تامین کننده",
                    value: 90
                },
            ]
        }, 
        possibleNextStates(){
            return [
                {
                    text: "نزد مشتری",
                    value: 100
                },
                {
                    text: "نزد ویزیتور",
                    value: 110
                },
                {
                    text: "نزد راننده",
                    value: 120
                },
                {
                    text: "نزد توزیع",
                    value: 130
                },
                {
                    text: "نزد واحد فروش",
                    value: 140
                },
                {
                    text: "نزد ثبت چک",
                    value: 200
                },
                {
                    text: "نزد گاوصندوق",
                    value: 210
                },
                {
                    text: "نزد تحصیل دار",
                    value: 220
                },
                {
                    text: "واگذار به بانک",
                    value: 300
                },                {
                    text: "وصول شده",
                    value: 310
                },
                {
                    text: "برگشت شده نزد بانک",
                    value: 320
                },
                {
                    text: "واگذار مجدد نزد بانک",
                    value: 330
                },
                {
                    text: "وصول شده بعد از واگذار مجدد",
                    value: 340
                },                {
                    text: "برگشت شده بعد از واگذار مجدد",
                    value: 350
                },
                {
                    text: "برگشت شده نزد شرکت",
                    value: 400
                },
                {
                    text: "برگشت شده بعد از واگذار مجدد نزد شرکت",
                    value: 410
                },
                {
                    text: "تسویه شده بعد از برگشتی نزد شرکت",
                    value: 420
                },
                {
                    text: "مسترد شده بعد از تسویه به مشتری",
                    value: 430
                },
                {
                    text: "مشکوک الوصول",
                    value: 500
                },
                {
                    text: "سوخت شده",
                    value: 510
                },
                {
                    text: "اقدام حقوقی",
                    value: 520
                },
                {
                    text: "سوختی کسر شده از واحد فروش",
                    value: 530
                },
                {
                    text: "چک صادر شده نزد شرکت",
                    value: 600
                },
                {
                    text: "چک صادر شده نزد بازرگانی",
                    value: 610
                },
                {
                    text: "چک صادر شده نزد تامین کننده",
                    value: 620
                },
                {
                    text: "چک صادر شده برگشتی نزد تامین کننده",
                    value: 630
                },
                {
                    text: "چک صادر وصول شده نزد تامین کننده",
                    value: 640
                },
                {
                    text: "چک صادره وصول مجدد شده",
                    value: 650
                },
                {
                    text: "چک صادره برگشت خورده عودت شده",
                    value: 660
                },
                {
                    text: "چک صادره وصول نشده عودت شده",
                    value: 670
                },
            ]
        },
        possibleBankAccounts(){
            return [
                    {
                        "accountCode": "111307",
                        "glAccount": "111307",
                        "acctName": "اسناد دریافتنی در جریان وصول صادرات 2001",
                        "glaccountName": "اسناد دریافتنی در جریان وصول صادرات 2001",
                        "nextAccntCode": "111102006012",
                        "nextAccntName": "صادرات كيوانفر 0110963362001- رسمي"
                    },
                    {
                        "accountCode": "111309",
                        "glAccount": "111309",
                        "acctName": "اسناد دریافتنی در جریان وصول ملت 9720",
                        "glaccountName": "اسناد دریافتنی در جریان وصول ملت 9720",
                        "nextAccntCode": "111102008004",
                        "nextAccntName": "ملت زرند بهشتي  8893209720"
                    },
                    {
                        "accountCode": "111312",
                        "glAccount": "111312",
                        "acctName": "-اسناد دریافتنی در جریان وصول صادرات 178008",
                        "glaccountName": "-اسناد دریافتنی در جریان وصول صادرات 178008",
                        "nextAccntCode": "111102006004",
                        "nextAccntName": "صادرات سید خندان 0107088178008- رسمي"
                    },
                    {
                        "accountCode": "111327",
                        "glAccount": "111327",
                        "acctName": "اسناد درجریان وصول سپه حیدرزاده3101057536673",
                        "glaccountName": "اسناد درجریان وصول سپه حیدرزاده3101057536673",
                        "nextAccntCode": "111102004030",
                        "nextAccntName": "سپه حیدر زاده 3101057536672"
                    }
                ]
        }
    },
    methods:{
        submitAction(){
        console.log("start")
        this.isLoading= true;
        console.log(this.isLoading)
        let payload = {check_num: this.checkNum,
                    due_date: this.dueDate,
                     next_state: this.selectedState,
                     reg_state: this.selectedReg,
                    deposite_details: this.depositeDetails}
        this.$store.dispatch('updateCheques', payload).then((response) => {
            console.log(response);

        this.showModal=true;
        this.reportResult = response.sucess_results[0];
        this.isLoading= false;
        })          
        this.selectedState = ''
        this.selectedReg= ''
       
        this.depositeDetails = {
                bankAccount: "",
                payer: "",
                bank: "",
                branch: "",
                depositedAccount: "",
                reference: "",
                depositDate:"",
            }
      }
    }
}
</script>
