<template>
    <v-container>
        <v-card outlined>
            <v-card-title >
                <v-row justify="space-between">
                    <v-col>
                        <v-row >
                            <v-col
                            cols="3"
                            v-if="!options.withoutSalePerson"
                            >    
                            <v-autocomplete
                                v-model="options.selectedPayaneCodes"
                                :items="payaneCodes"
                                item-value="payane_code"
                                item-text="payane_code"
                                label="پایانه"
                                multiple
                                filled
                                outlined
                                small-chips
                                :search-input.sync="searchPayaneCodes" 
                            ></v-autocomplete>
                            </v-col>
                            <v-col
                            cols="3"
                            ><date-picker label="تاریخ" v-model="options.selectedDate"></date-picker>
                            </v-col>
                            <v-col cols="3" v-if="!options.withoutSalePerson">
                                <v-select 
                                    v-model="options.selectedType" 
                                    label="نوع"
                                    :items="personTypes"
                                    item-text="type_name"
                                    item-value="type"
                                ></v-select>
                            </v-col>
                            <v-col col="3">
                                <v-text-field
                                v-model="options.amount" 
                                hint="120000000" 
                                label="مبلغ">
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col>
                        <v-row>
                            <v-col>
                                <v-switch
                                v-model="options.withoutSalePerson"
                                label="پایانه‌های بدون مالک"
                                class="pa-3"
                                ></v-switch>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table
            fixed-header
            show-expand
            :single-expand="singleExpand"
            dense
            :headers="headers"
            :items="payaneReports"
            item-key="id"
            :loading="isLoading"
            :options.sync="options"
            :server-items-length="itemCount"
            >
            <template v-slot:[`item.transaction_date`]="{item}">
                <p>{{ item.transaction_date | formatDate }}</p>
            </template>  
            <template v-slot:[`item.amount`]="{ item }">
            <p>{{ item.amount | formatAmount }}</p>
            </template>
            <template v-slot:[`item.payane_code`]="{ item }">
            <p>{{ item.bank_payane.payane_code }}</p>
            </template>
            <template v-slot:[`item.visitor_name`]="{ item }">
            <p>{{ item.active_payane_person?.sale_person_name }}</p>
            </template>
            <template v-slot:[`item.sale_person_type`]="{ item }">
                <p>{{ item.active_payane_person?.sale_person_type }}</p>
            </template>
            <template v-slot:[`item.visitor_b1_slpcode`]="{ item }">
            <p>{{ item.active_payane_person?.sale_person_code }}</p>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                        small
                        class="mr-2"
                        v-bind="attrs"
                        v-on="on"
                        @click="viewMore(item)"
                        >
                        mdi-eye
                        </v-icon>

                <v-btn v-if="isUsed(item.is_used)" :disabled="noSalePerson(item.active_payane_person)" class="mx-2" small  @click="usePoses(item)">
                            <v-icon>mdi-check-outline</v-icon>
                </v-btn>
            </template>
            <template v-slot:expanded-item="{ headers,item}">
                <td :colspan="headers.length">
                    <div>
                        <v-container  fluid style="margin: 0px; padding: 0px; width: 100%">
                            <v-row d-flex>
                                <v-col cols="4">
                                    <date-picker
                                    label="تاریخ صدور سند"
                                    v-model="newDocDate">
                                    </date-picker>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-checkbox v-model="isDifferentAccount" label="صدور روی صندوق موقت"></v-checkbox>    
                                    </v-col>    
                                    <v-col cols="4">
                                        <v-btn :disabled="item.is_used" color="green"  @click="usePoses(item)">صدور سند</v-btn>
                                    </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </td>
            </template>
            </v-data-table>
            <v-btn
            class="mx-2"
            fab
            dark
            color="teal"
            @click="exportData"
            >
            <v-icon dark>
                mdi-format-list-bulleted-square
            </v-icon>
            </v-btn>
        </v-card>
        <v-dialog
                    v-model="dialog"
                    fullscreen
                    hide-overlay
                    transition="dialog-bottom-transition"
                    >
                    <v-card outlined>
                        <v-card-title>
                            <v-row>
                                <v-col cols="12" class="d-flex justify-center align-center">
                                    <p>لیست واریزهای کارتخوان</p>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <v-data-table
                    fixed-header
                    dense
                    :headers="detailHeaders"
                    :items="posRawsDetails"
                    item-key="id"
                        >
                        <template v-slot:[`item.amount`]="{ item }">
      <p>{{ item.amount | formatAmount }}</p>
    </template>
            <template v-slot:[`item.is_used`]="{ item }">
                <v-simple-checkbox
                v-model="item.is_used"
                disabled
                ></v-simple-checkbox>
                </template>
            </v-data-table>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="green darken-1"
                            text
                            @click="dialog = false"
                        >
                            بستن
                        </v-btn>
                        </v-card-actions>
                    </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import {finAgent} from '@/services/agent'

import FileSaver from 'file-saver'
import DatePicker from '../DatePicker.vue'
var jalaali = require('jalaali-js')
    export default{
        components:{
        DatePicker
    },
        data(){
        return{
            singleExpand: true,
            exportError: false,
            dialog: false,
            isLoading:null,
            posRawsDetails: [],
            options: {
            itemsPerPage: 10,
            page:1, 
            selectedPayaneCodes: '',
            selectedDate:'',
            selectedType: '',
            withoutSalePerson: false,
            amount:"",
            },
            searchPayaneCodes:"98",
            personTypes: [
              {type: 'sale_person', type_name: 'ویزیتور'},
              {type: 'driver', type_name: 'راننده'},
              {type: 'customer', type_name: 'مشتری'},  
        ]   ,
        newDocDate:'',
        isDifferentAccount: false,       
        }
    },
        watch:{
        options:{
      handler(){
      this.loadPayaneReports();    
      },  deep: true
         },
         searchPayaneCodes:{
            handler(){
                setTimeout(() => {
                    this.loadBankPayanes();
                }, 1000);
                        
        }
    },
    },
        methods:{
            formatAmount(value){
        const stringVlue = String(value)
        const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedIntegerPart
      },
            async exportData(){
                try{
                    const response = await finAgent.get(`/front/pos_payane_reports/export_filtered_table?payane_codes=${this.options.selectedPayaneCodes}&report_date=${this.options.selectedDate}&person_type=${this.options.selectedType}`, {responseType: 'blob'} );
                    if (response.data.type === 'application/json') {
                    this.exportError = true;
                     } else {
   
                    FileSaver.saveAs(response.data, "financ-export-data.xlsx")
                     }    
                     }
                    catch(err){
                        const error = new Error(
                    
                    err || 'Failed to fetch'
                );
                this.exportError = true;
                throw error;
                    }
            },
            displayText(item) {
            if (item.active_payane_person && item.active_payane_person.sale_person_name) {
                return item.active_payane_person.sale_person_name;
            } else {
                return item.payane_code;
            }
                    },
            viewMore(item) {
                // console.log(item)
                this.posRawsDetails = item.pos_raws
                this.dialog = true
            },
            loadPayaneReports() {
                // console.log(this)
                this.$store.dispatch('loadPayaneReports',this.options)
            },
            loadBankPayanes() {

                this.$store.dispatch('loadBankPayanes', this.searchPayaneCodes)
            },
            usePoses(item){
                this.loading = true;

            var payload = {...item, isDifferentAccount: this.isDifferentAccount, newDocDate: this.newDocDate}
            this.$store.dispatch('usePayaneReport',payload)
            .finally(() => {
                this.loading = false;
                this.isDifferentAccount = false;
                this.newDocDate = '';
              })
            },
            isUsed(isUsed){
                return isUsed != true;
            },
            noSalePerson(salePerson){
                return salePerson == null;
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
        computed:{
            customItemText() {
            return this.payaneCodes.map((item) => this.displayText(item));
            },
            itemCount(){
            return this.$store.getters.getPosReportItemCount;
            },
            detailHeaders(){
                
                return [
                {
                    text: "تاریخ تراکنش",
                    align: "center",
                    //sortable: false,
                    value: "transaction_date",
                },
                {
                    text: "ساعت تراکنش",
                    value: "transaction_time",
                    align: "center",
                    filterable: false,
                },
                {
                    text: "توضیحات",
                    value: "description",
                    align: "center",
                    filterable: false
        
                },
                {
                    text: "مبلغ",
                    align: "center",
                    value: "amount",
                },
                {
                    text: "شماره پیگیری",
                    align: "center",
                    value: "peygiri_number",
        
                },
                {
                    text: "تاریخ واریز",
                    align: "center",
                    value: "variz_date",
        
                },
                {
                    text: "کد پایانه",
                    align: "center",
                    value: "payane_code",
        
                },
                {
                    text: "شماره ارجاع",
                    align: "center",
                    value: "erja_code",
                    
                },
                {
                    text: "شماره فایل",
                    align: "center",
                    value: "job_id"
                },
                {
                    text: "شماره حساب",
                    align: "center",
                    value: "owner_account_number"
                }
                ,
                {
                text: "استفاده شده",
                align: "center",
                value: "is_used"
                }
                ];
      
            },
            headers(){
                return [
                    {
                        text: "تاریخ",
                        align: "center",
                        value: "transaction_date",
                    },
                    {
                        text: "کد پایانه",
                        align: "center",
                        value: "payane_code",
                    },                {
                        text: "نام صاحب کارتخوان",
                        align: "center",
                        value: "visitor_name",
                    },
                    {
                        text: "کد صاحب کارتخوان",
                        align: "center",
                        value: "visitor_b1_slpcode",
                    },
                    {
                        text: "نوع صاحب کارتخوان",
                        align: "center",
                        value: "sale_person_type",
                    },                   
                    {
                        text: "مبلغ تجمیعی",
                        align: "center",
                        value: "amount",
                    },
                    {
                    text: "",
                    align: "center",
                    //sortable: false,
                    value: "actions",
                    }

                ]
            },
            payaneReports(){
                return this.$store.getters.getPayaneReports
            },
            salePersons(){
            return this.$store.getters.getSalePersons
            },
            payaneCodes(){
            return this.$store.getters.getBankPayanes
            },
        },
    //     created(){

    //     this.loadBankPayanes();
    // }
    }

</script>
