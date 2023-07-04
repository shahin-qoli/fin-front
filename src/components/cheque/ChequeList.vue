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
                                    item-text="stateName"
                                    item-value="stateId"
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
                item-value="checkKey"
                v-model="selectedItems"
                @input="handleTableSelectionChange"
                class="elevation-1"
                :search="searchLoaded">
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
                                <v-col cols="12">
                                    <v-select :items="possibleNextStates"
                                    item-text="title"
                                    item-value="state"
                                    v-model="selectedAction"></v-select>
                                </v-col>
                                <v-col v-if="isNeedDeposit" cols="12">
                                    <v-row>
                                        <v-col cols="6">
                                            <v-text-field 
                                            v-model="depositeDetails.bankAccount"
                                            :rules= "[requiredRule]"
                                            label="حساب بانک"
                                            single-line
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field 
                                            :rules= "[requiredRule]"
                                            v-model="depositeDetails.payer"
                                            label="پرداخت کننده"
                                            single-line
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field 
                                            :rules= "[requiredRule]"
                                            v-model="depositeDetails.bank"
                                            label="بانک"
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field 
                                            :rules= "[requiredRule]"
                                            v-model="depositeDetails.branch"
                                            label="شعبه بانک"
                                            single-line
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field 
                                            :rules="[requiredRule]"
                                            v-model="depositeDetails.depositedAccount"
                                            label="حساب دپوزیت شده"
                                            single-line
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field 
                                            :rules="[requiredRule]"
                                            v-model="depositeDetails.reference"
                                            label="رفرنس"
                                            single-line
                                            required
                                            hide-details></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn :disabled="isSelectedAction" color="green" type="submit">به روزرسانی</v-btn>
                                </v-col>
                                <v-col cols=4 v-if="errorUpdate" >
                                    {{ errorUpdate }}
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>
                </v-row>
           </v-card-text>
        </v-card>
    <!-- Modal -->
        <v-dialog v-model="showModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                <div class="modal-scroll">
                    <p v-html="reportResult"></p>
                </div>
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
    components:{ DatePicker},
    data() {
        return {
            searchLoaded: '',
            search: {
                startDate: '',
                endDate: '',
                CheckState: []
            },
            chequeStates: [
                {
                    stateName: 'نزد مشتری',
                    stateId: '100'
                },
                {
                    stateName: 'نزد ویزیتور',
                    stateId: '110'
                },
                {
                    stateName: 'نزد راننده',
                    stateId: '120'
                },
                {
                    stateName: 'نزد توزیع',
                    stateId: '130'
                },
                {
                    stateName: 'نزد واحد فروش',
                    stateId: '140'
                },
                {
                    stateName: 'نزد ثبت چک',
                    stateId: '200'
                },
                {
                    stateName: 'نزد گاوصندوق',
                    stateId: '210'
                },
                {
                    stateName: 'نزد تحصیل دار',
                    stateId: '220'
                },
                {
                    stateName: 'واگذار به بانک',
                    stateId: '300'
                },
                {
                    stateName: 'وصول شده',
                    stateId: '310'
                },
                {
                    stateName: 'برگشت شده نزد بانک',
                    stateId: '320'
                },
                {
                    stateName: 'واگذار مجدد نزد بانک',
                    stateId: '330'
                },
                {
                    stateName: 'وصول شده بعد از واگذار مجدد',
                    stateId: '340'
                },
                {
                    stateName: 'برگشت شده بعد از واگذار مجدد',
                    stateId: '350'
                },
                {
                    stateName: 'برگشت شده نزد شرکت',
                    stateId: '400'
                },
                {
                    stateName: 'برگشت شده بعد از واگذار مجدد نزد شرکت',
                    stateId: '410'
                },
                {
                    stateName: 'تسویه شده بعد از برگشتی نزد شرکت',
                    stateId: '420'
                },
                {
                    stateName: 'مسترد شده بعد از تسویه به مشتری',
                    stateId: '430'
                },
                {
                    stateName: 'مشکوک الوصول',
                    stateId: '500'
                },
                {
                    stateName: 'سوخت شده',
                    stateId: '510'
                },
                {
                    stateName: 'اقدام حقوقی',
                    stateId: '520'
                },
                {
                    stateName: 'سوختی کسر شده از واحد فروش',
                    stateId: '530'
                },
                {
                    stateName: "چک صادر شده نزد شرکت",
                    stateId: '600'
                },
                {
                    stateName: "چک صادر شده نزد بازرگانی",
                    stateId: '610'
                },
                {
                    stateName: 'چک صادر شده نزد تامین کننده',
                    stateId: '620'
                },
                {
                    stateName: "چک صادره برگشتی نزد تامین کننده",
                    stateId: '630'
                },
                {
                    stateName: 'چک صادره وصول شده نزد تامین کننده',
                    stateId: '640'
                },
                {
                    stateName: 'چک صادره وصول مجدد شده',
                    stateId: '650'
                },
                {
                    stateName: 'چک صادره برگشت خورده عودت شده',
                    stateId: '660'
                },
                {
                    stateName: 'چک صادره وصول نشده عودت شده',
                    stateId: '670'
                }
            ],
            selectedItems: [],
            possibleNextStates:'',
            selectedAction:'',
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
            reportResult: '',
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
                    text: "چک خروجی",
                    align: "center",
                    //sortable: false,
                    value: "isOutgoing",
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
    }, errorUpdate(){
        return this.$store.getters.getError;
    },
    isSelectedAction(){
        return this.selectedAction == ''
    },    
    isNeedDeposit(){
            if (this.selectedAction == ''){
                return false;
            }
            let selected = this.possibleNextStates.find(opt => opt.state == this.selectedAction)
            return selected.isNeedDeposit
    },
    isSelectedCheque(){
        return this.selectedItems.length > 0
    },
    requiredRule(){
        return [(v) => !!v || "این فیلد اجباری است"]
    }
    },
    methods:{
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
        this.$store.dispatch('loadCheques', this.search)
      },
      submitSearch(){
        this.loadCheques()
      },
      submitAction(){
        console.log("start")
        const selectedCheques = this.selectedItems.map(item => item.checkKey)
        let payload = {check_keys: selectedCheques,
                     next_state: this.selectedAction,
                    deposite_details: this.depositeDetails}
        this.$store.dispatch('updateCheques', payload).then((response) => {this.loadCheques(); this.showModal=true;
        this.reportResult = response;
        })
        this.$store.dispatch('nillError')            
        this.selectedAction = ''
        this.selectedItems =[]
        this.possibleNextStates ='',
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