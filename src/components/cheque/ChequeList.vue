<template>
    <v-container>
        <v-card outlined>
            <v-row>
                <v-col cols="12">
                    <v-form @submit.prevent="submitSearch">
                        <v-row>
                            <v-col cols="3">
                                <date-picker v-model="search.startDate" label="از تاریخ"></date-picker>
                            </v-col>
                            <v-col cols="3">
                                <date-picker v-model="search.endDate" label="تا تاریخ"></date-picker>
                            </v-col>
                            <v-col cols="6">
                                <v-select
                                    :items="chequeStates"
                                    name="chequeStates"
                                    label="وضعیت چک"
                                    item-text="text"
                                    item-value="value"
                                    v-model="search.CheckState"
                                    multiple
                                ></v-select>
                            </v-col>
                            <v-col cols="1">
                                <v-btn dark color="green" type="submit">جستجو</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-row>
        </v-card>
        <v-card outlined>
            <v-card-title>
                <v-row>
                    <v-col cols="12">
                    <v-text-field
                        v-model="searchLoaded"
                        append-icon="mdi-magnify"
                        label="جستجو در جدول"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-col>
                </v-row>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-text>
                <v-data-table
                fixed-header
                dense
                :headers="headers"
                :items="cheques"
                item-key="checkKey"
                show-select
                single-expand
                :expanded.sync="expanded"
                show-expand
                item-value="checkKey"
                v-model="selectedItems"
                @input="handleTableSelectionChange"
                class="elevation-1"
                :search="searchLoaded">
                    <template v-slot:[`item.state`]="{ item }">
                        <p>{{  formatState(item.state,chequeStates) }}</p>
                    </template>
                    <template v-slot:[`item.regSate`]="{ item }">

                        <p>{{ item.regSate | formatRegState(regStates) }} {{ }}</p>

                    </template>
                    <template v-slot:[`item.value`]="{ item }">
                        <p>{{ item.value | formatAmount }}</p>
                    </template>
                    <template v-slot:[`item.dueDate`]="{ item }">
                        <p>{{ item.dueDate | formatDate }}</p>
                    </template>
                    <template v-slot:[`item.receiptDate`]="{ item }">
                        <p>{{ item.receiptDate | formatDate }}</p>
                    </template>
                    <template v-slot:expanded-item="{ headers}">
                        <td :colspan="headers.length">
                            <v-row>
                                    <v-col cols="12"
                                    v-for="check in chequeHistory"
                                    :key="check.id"
                                    >
                                    <p>در تاریخ {{check.created_at | formatDate}} با بدنه درخواست {{check.request_body }} و نتیجه {{ check.is_success }}</p>
                                    </v-col>
                            </v-row>

                        </td>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-card  v-if="isSelectedCheque" outlined>
            <v-card-title><p>عملیات</p></v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-form @submit.prevent="submitAction" ref="form">
                            <v-row>
                                <v-col cols="2"><p>انتخاب وضعیت چک:</p></v-col>
                                <v-col cols="3">
                                    <v-select :items="possibleNextStates"
                                    item-text="title"
                                    item-value="state"
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
                                <v-col v-if="isNeedDeposit" cols="12">
                                    <v-row>
                                        <v-col v-if="!is310State" cols="6">
                                            <v-select 
                                            :items="possibleBankAccounts"
                                            v-model="depositeDetails.bankAccount"
                                            label="انتخاب بانک"
                                            item-text="acctName"
                                            item-value="accountCode"
                                            required
                                            ></v-select>
                                        </v-col>
                                        <v-col v-if="!is310State" cols="6">
                                            <v-text-field 
        
                                            v-model="depositeDetails.payer"
                                            label="نام شخص تحویلدار"
                                            single-line
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                        <v-col v-if="!is310State" cols="6">
                                            <v-text-field 

                                            v-model="depositeDetails.bank"
                                            label="نام بانک"
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                        <v-col v-if="!is310State" cols="6">
                                            <v-text-field 
                            
                                            v-model="depositeDetails.branch"
                                            label="شعبه بانک"
                                            single-line
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                        <v-col v-if="!is310State" cols="6">
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
                                    </v-row>
                                </v-col>
                                <v-col v-if="isNeedCardCode" cols="12">
                                    <v-row>
                                        <v-col cols="6">
                                            <v-text-field          
                                            v-model="payTo.cardCode"
                                            label="کد مشتری"
                                            single-line
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <date-picker v-model="payTo.date" label="تاریخ عملیات"></date-picker>
                                         </v-col>
                                        <v-col cols="6">
                                            <v-btn :disabled="payTo.cardCode.length < 5" @click="validateCardCode">بررسی مشتری</v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row v-if="isCardCodeChecked">
                                        <v-col cols="6">
                                            <v-text-field          
                                            v-model="cardCodeData.cardCode"
                                            label="کد مشتری"
                                            single-line
                                            required
                                            disabled
                                            hide-details></v-text-field>
                                        </v-col>  
                                        <v-col cols="6">
                                            <v-text-field          
                                            v-model="cardCodeData.cardName"
                                            label="نام مشتری"
                                            single-line
                                            required
                                            disabled
                                            hide-details></v-text-field>
                                        </v-col>  
   
                                    </v-row>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn :disabled="isSelectedAction" color="green" type="submit">به روزرسانی</v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>
                </v-row>
           </v-card-text>
        </v-card>
        <v-col cols=4 v-if="errorUpdate" >
                {{ errorUpdate }}
        </v-col>
    <!-- Modal -->
        <v-dialog v-model="showModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col v-if="isResultSuccess" cols="12"><p>نتایج موفق</p></v-col>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="reportResult.sucess_results"></p>
                            </div>
                        </v-col>
                        <v-col v-if="isResultFailed" cols="12"><p>نتایج ناموفق</p></v-col>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="reportResult.failed_results"></p>
                            </div>
                        </v-col>
                        <v-col v-if="isResultError" cols="12"><p>خطا</p>
                            <div class="modal-scroll">
                            <p v-html="reportResult?.error"></p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="showModal = false">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>در حال عملیات</p>
        </v-overlay>
    </v-container>
</template>

<script>

import DatePicker from '../DatePicker.vue'
var jalaali = require('jalaali-js')
export default {
    components:{ DatePicker},
    data() {
        return {
            chequeHistory: null,
            searchLoaded: '',
            payTo:{
                cardCode: "",
                date:""
            },          
            isCardCodeChecked: false,
            cardCodeData:{
                cardCode:"",
                cardName:""
            },
            search: {
                startDate: '',
                endDate: '',
                CheckState: []
                },

            chequeStates: [
                {
                    text: "100 نزد مشتری",
                    value: 100
                },
                {
                    text: "نزد ویزیتور 110",
                    value: 110
                },
                {
                    text: "نزد راننده 120",
                    value: 120
                },
                {
                    text: "نزد توزیع 130",
                    value: 130
                },
                {
                    text: "نزد واحد فروش 140",
                    value: 140
                },
                {
                    text: "نزد ثبت چک 200",
                    value: 200
                },
                {
                    text: "نزد گاوصندوق 210",
                    value: 210
                },
                {
                    text: "نزد تحصیل دار 220",
                    value: 220
                },               
                {
                    text: "230 درخواست استرداد به مشتری",
                    value: 230
                },                
                {
                    text: "240 تسویه و پذیرش استرداد به مشتری",
                    value: 240
                },
                {
                    text: "واگذار به بانک 300",
                    value: 300
                },              
                  {
                    text: "وصول شده 310",
                    value: 310
                },
                {
                    text: "برگشت شده نزد بانک 320",
                    value: 320
                },
                {
                    text: "واگذار مجدد نزد بانک 330",
                    value: 330
                },
                {
                    text: "وصول شده بعد از واگذار مجدد 340",
                    value: 340
                },                {
                    text: "برگشت شده بعد از واگذار مجدد 350",
                    value: 350
                },
                {
                    text: "برگشت شده نزد شرکت 400",
                    value: 400
                },
                {
                    text: "410 برگشت شده بعد از واگذار مجدد نزد شرکت",
                    value: 410
                },
                {
                    text: "تسویه شده بعد از برگشتی نزد شرکت 420",
                    value: 420
                },
                {
                    text: "مسترد شده بعد از تسویه به مشتری 430",
                    value: 430
                },
                {
                    text: "مشکوک الوصول 500",
                    value: 500
                },
                {
                    text: "سوخت شده 410",
                    value: 510
                },
                {
                    text: "اقدام حقوقی 520",
                    value: 520
                },
                {
                    text: "سوختی کسر شده از واحد فروش 530",
                    value: 530
                },
                {
                    text: "چک صادر شده نزد شرکت 600",
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
                },                {
                    text: "700 واگذار به تامین کننده",
                    value: 700
                },                {
                    text: "710 وصول شده نزد تامین کننده",
                    value: 710
                },                {
                    text: "720 برگشت شده نزد تامین کننده",
                    value: 720
                },                {
                    text: "730 واگذار مجدد نزد تامین کننده",
                    value: 730
                },                {
                    text: "740 وصول شده بعد از واگذار مجدد به تامین کننده",
                    value: 740
                },
                {
                    text: "750 برگشت شده مجدد نزد تامین کننده",
                    value: 750
                },
                {
                    text:  "760 تسویه با تامین کننده",
                    value: 760
                },
            ],
            regStates: [
                {
                    text: 'ثبت نشده توسط مشتری 10',
                    value: 10
                },
                {
                    text: 'ثبت شده توسط مشتری و تایید نشده توسط شرکت 20',
                    value: 20
                },
                {
                    text: 'ثبت شده توسط مشتری و تایید شده توسط شرکت 30',
                    value: 30
                },
                {
                    text: 'انتقال شده به مشتری پس از استرداد 40',
                    value: 40
                },
                {
                    text: 'قفل شده در بانک 50',
                    value: 50
                },
                {
                    text: 'صادره شده توسط شرکت 60',
                    value: 60
                },
                {
                    text: 'ثبت شده در سامانه 70',
                    value: 70
                },
                {
                    text: 'تاییدی شده توسط تامین کننده 80',
                    value: 80
                },
                {
                    text: 'انتقال داده شده از تامین کننده 90',
                    value: 90
                }
            ],
            selectedItems: [],
            possibleNextStates:'',
            selectedState:'',
            selectedReg:'',
            depositeDetails : {
                bankAccount: "",
                payer: "",
                bank: "",
                branch: "",
                depositedAccount: "",
                reference: "",
                depositDate:"",
            }, 
            expanded: [],
            showModal: false,
            reportResult: {
                "sucess_results" : [],
                "faild_results" : [],
                "error" : ''
            },
            isLoading: false,
        }
    },
    computed:{

        headers(){
            return [
                {
                    text: "کد چک",
                    align: "center",
                    //sortable: false,
                    value: "checkKey",
                },
                {
                    text: "شماره چک",
                    align: "center",
                    //sortable: false,
                    value: "checkNum",
                },
                {
                    text: "کد مشتری",
                    align: "center",
                    //sortable: false,
                    value: "cardCode",
                },                {
                    text: "نام مشتری",
                    align: "center",
                    //sortable: false,
                    value: "cardName",
                },{
                    text: "تاریخ چک",
                    align: "center",
                    //sortable: false,
                    value: "dueDate",
                },{
                    text: "مبلغ",
                    align: "center",
                    //sortable: false,
                    value: "value",
                },{
                    text: "نوع چک",
                    align: "center",
                    //sortable: false,
                    value: "type",
                },{
                    text: "وضعیت چک",
                    align: "center",
                    //sortable: false,
                    value: "state",
                },{
                    text: "وضعیت ثبت",
                    align: "center",
                    //sortable: false,
                    value: "regSate",
                },{
                    text: "قابل انتقال",
                    align: "center",
                    //sortable: false,
                    value: "transferable",
                },{
                    text: "کد بانک",
                    align: "center",
                    //sortable: false,
                    value: "bankCode",
                },{
                    text: "شعبه",
                    align: "center",
                    //sortable: false,
                    value: "branch",
                },{
                    text: "وضعیت واگذاری",
                    align: "center",
                    //sortable: false,
                    value: "deposited",
                },{
                    text: "لغو شده",
                    align: "center",
                    //sortable: false,
                    value: "canceled",
                },{
                    text: "جابجا شده",
                    align: "center",
                    //sortable: false,
                    value: "transfered",
                },{
                    text: "تاریخ رسید",
                    align: "center",
                    //sortable: false,
                    value: "receiptDate",
                },{
                    text: "عملیات",
                    align: "center",
                    //sortable: false,
                    value: "actions",
                },
            ]
        }, 
        cheques(){
      return this.$store.getters.getCheques;
        }, 
        errorUpdate(){
        return this.$store.getters.getError;
        },
        isSelectedAction(){
            return this.selectedState == ''
        },    
        isNeedDeposit(){
            if (this.selectedState == ''){
                return false;
            }
            let selected = this.possibleNextStates.find(opt => opt.state == this.selectedState)
            return selected.isNeedDeposit
        },    
        isNeedCardCode(){
            if (this.selectedState == ''){
                return false;
            }
            let selected = this.possibleNextStates.find(opt => opt.state == this.selectedState)
          
            return selected.isNeedCardCode
        },
        isSelectedCheque(){
            return this.selectedItems.length > 0
        },
        requiredRule(){
            return [(v) => !!v || "این فیلد اجباری است"]
        },
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
        possibleBankAccounts(){
            if (this.selectedState == ''){
                return null;
            }
            let selected = this.possibleNextStates.find(opt => opt.state == this.selectedState)
            return selected.bankAccounts;
        },
        is310State(){
            return this.selectedState == '310'

            // let selected = this.possibleNextStates.find(opt => opt.state == this.selectedState)
            // return selected.
        },
        isResultSuccess(){
            return this.reportResult.sucess_results.length > 0 
    },
        isResultFailed(){
            return this.reportResult.faild_results.length > 0 
    },  isResultError(){
            return this.reportResult.error.length > 0 ;
    }
    },
    methods:{
        initialStartDate(){
            // const today = new Date()
            // const month = today.getMonth();
            // today.setMonth(month - 1);
            // return today.toISOString().split('T')[0]
            return '1403/06/01'
        },
        handleTableSelectionChange() {
            const commonNextStates = this.selectedItems[0].nextStates;
            const possibleNextStates = commonNextStates.filter(nextState => {
            return this.selectedItems.every(item => {
                return item.nextStates.some(state => state.state === nextState.state);
            });
            });
            this.possibleNextStates = possibleNextStates
        },
        loadCheques() {
            this.isLoading = true
        this.$store.dispatch('loadCheques', this.search).then(()=>this.isLoading=false)
        },
        submitSearch(){
            this.loadCheques()
        },
        submitAction(){
          
            const selectedCheques = this.selectedItems.map(item => item.checkKey)
            let payload = {check_keys: selectedCheques,
                        next_state: this.selectedState,
                        reg_state: this.selectedReg,
                        deposite_details: this.depositeDetails,
                        pay_to: this.payTo,
                    }
            this.isLoading = true;            
            this.$store.dispatch('updateCheques', payload).then((response) => {
            this.loadCheques(); 
            this.isLoading = false;
            this.showModal=true;
            this.reportResult = response;
            })
            this.$store.dispatch('nillError')            
            this.selectedState = ''
            this.selectedItems =[]
            this.selectedReg= ''
            this.payTo={
                cardCode: "",
                date:""
            },          
            this.cardCodeData={
                cardCode:"",
                cardName:""
            },
            this.isCardCodeChecked= false,
            this.possibleNextStates =''
            this.depositeDetails = {
                    bankAccount: "",
                    payer: "",
                    bank: "",
                    branch: "",
                    depositedAccount: "",
                    reference: "",
                    depositDate:"",
                }
        },
        formatState(state, chequeStates){
                let index = chequeStates.findIndex(stat => stat.value == state )

                if (index >= 0)
                    return chequeStates[index].text
                else
                    return "تعریف نشده"
        },
        validateCardCode(){
            this.$store.dispatch(`nillError`) 
            this.cardCodeData ={
                cardCode:"",
                cardName: ""
            }
            this.isCardCodeChecked = false
            let payload = {cardcode: this.payTo.cardCode}
            this.isLoading = true;            
            this.$store.dispatch('validateCardCode', payload).then((response)=>{
                
                if (!this.$store.getters.getError){
                    this.isCardCodeChecked = true
                  
                    this.cardCodeData = response.data
                }
                this.isLoading = false;  
            })
        }
    },
    watch:{
        expanded(newExpanded, oldExpanded) {
            if (newExpanded !== oldExpanded && newExpanded.length != 0 ) {              
                this.$store.dispatch('loadChequeHistory', newExpanded).then((response) => {
                    this.chequeHistory = response
            })
        }else 
            {
                this.chequeHistory = null
            }
    }},
    filters:{
        formatRegState(state, regStates){
            let index = regStates.findIndex(stat => stat.value == state )

            if (index >= 0)
            return regStates[index].text            
            else
            return "تعریف نشده"
        },
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
    }
}
</script>