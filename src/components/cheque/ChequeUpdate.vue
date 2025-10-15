<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h2>به روز رسانی وضعیت چک با شماره</h2>
                <h4 style="color:crimson">لطفا توجه داشته باشید در این به روز رسانی هیچ سندی صادر یا لغو نخواهد شد.</h4>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-form @submit.prevent="submitSearch" ref="form">
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
                                <v-col cols="3">
                                    <v-btn :loading="isLoading" color="green" type="submit">جستجو</v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-if="chequesFound">
            <v-card-text>
                <v-card-text>
                <v-data-table
                fixed-header
                dense
                :headers="headers"
                :items="cheques"
                item-key="checkKey"
                show-select
                item-value="checkKey"
                v-model="selectedItems"
                @input="handleTableSelectionChange"
                class="elevation-1">
                    <template v-slot:[`item.state`]="{ item }">
                        <p>{{ item.state | formatState(chequeStates) }}</p>
                    </template>
                    <template v-slot:[`item.regSate`]="{ item }">
                        <p>{{ item.regSate | formatState(regStates) }}</p>
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
                </v-data-table>
            </v-card-text>
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
                                <v-col cols="3">
                                    <v-btn :disabled="isSelectedAction" color="green" type="submit">به روزرسانی</v-btn>
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
                            <p v-html="reportResult.faild_results"></p>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row v-if="reportResult.error != ''">
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="reportResult.error"></p>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="reportResult.sucess_results"></p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="showModal = false">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showModalError" max-width="500">
            <v-card>
                <v-card-title class="text-h5">خطا</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="error"></p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="showModalError = false, error = ''">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>

export default {
    data() {
        return {
            // chequesFound: true,
            selectedState:'',
            selectedReg:'',
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
            showModalError: false,
            reportResult:"",
            error: "",
            selectedItems:[],
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
        isSelectedCheque(){
            return this.selectedItems.length > 0
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
        },
        cheques(){
      return this.$store.getters.getFoundCheques;
        },
        chequesFound(){
            return this.$store.getters.getFoundCheques.length > 0;
        },
        isThereError(){
            return this.error.length > 0;
        }

    },
    methods:{
        submitSearch(){
        this.isLoading= true;
        let payload =  this.checkNum
        this.$store.dispatch('searchCheques', payload).then((resp) =>{
            this.isLoading= false
     
            if (isNaN(parseInt(resp,10))) {
                this.error = resp;
                this.showModalError=true
            }else if (resp == 0){
                this.error = "سند یافت نشد";
                this.showModalError=true
            }}
            ).catch(error => {
                this.isLoading = false
                this.error = error;
       
            })         
      },
      submitAction(){
        
        const selectedCheques = this.selectedItems.map(item => item.checkKey)
        let payload = {check_keys: selectedCheques,
                     next_state: this.selectedState,
                     reg_state: this.selectedReg}
        this.$store.dispatch('updateChequeStates', payload).then((response) => {
        this.showModal=true;

        this.reportResult = response;
        this.selectedState = ''
        this.selectedItems =[]
        this.selectedReg= ''
        })
        this.$store.dispatch('nillError')            

      }
    }
}
</script>
