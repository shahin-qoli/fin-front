<template>
    <v-container>
        <v-card outlined>
            <v-card-title>
                <v-row>
                    <v-col cols="3">
                        از تاریخ<date-picker v-model="options.completedAtGteq"></date-picker>
                    </v-col>
                    <v-col cols="3">
                        تا تاریخ<date-picker v-model="options.completedAtLteq"></date-picker>
                    </v-col>
                    <v-col cols="3">
                        شماره سفارش
                        <v-text-field 
                            v-model="options.number"
                            label="R546415337"
                            single-line
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-switch
                            v-model="options.hasB1Docs"
                            label="سفارشات ثبت شده"
                            class="pa-3"
                        ></v-switch>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-data-table
                fixed-header
                dense
                :headers="headers"
                :items="orders"
                item-key="number"
                show-select
                item-value="number"
                v-model="selectedItems"
                :options.sync="options"
                :server-items-length="itemCount"
                class="elevation-1"
                >
                <template v-slot:[`item.completed_at`]="{item}">
                    <p>{{ item.completed_at | formatDate }}</p>
                </template> 
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-card v-if="selectedInvoice" outlined>
            <v-card-title>
                <p>عملیات</p>
            </v-card-title>
            <v-card-text>
                <v-row v-if="isReadyForSo">
                    <v-col cols="3">
                        <v-select 
                        
                                    name="bankAccount"
                                    label="شماره حساب"
                                    solo
                                    item-text="item"
                                    item-value="value"
                                    v-model="selectedAccount"
                        :items="accounts">صدور  SO</v-select>
                    </v-col>
                    <v-col cols="3">
                        <v-btn :loading="isLoading" :disabled="!selectedAccount" @click="createSo">صدور  SO</v-btn>
                    </v-col>               
                </v-row>
                <v-row v-if="isReadyForInvoice">
                    <v-col cols="3">
                        <v-btn :loading="isLoading"  @click="createInvoice">صدور  Invoice</v-btn>
                    </v-col>  
                </v-row>
                
            </v-card-text>
        </v-card>
            <!-- Modal -->
        <v-dialog v-model="showModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12"><p>نتایج</p></v-col>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="reportResult"></p>
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
var jalaali = require('jalaali-js')
import DatePicker from '../DatePicker.vue'
export default {
    components:{DatePicker},
    data(){
        return {
            selectedItems: [],
            selectedAccount: null,
            options: {
                itemsPerPage: 10,
                page:1,
                state: 'complete',
                hasB1Docs: false,
                completedAtGteq:"",
                completedAtLteq: "",
                number: "",
                needB1Docs: true,
            },
            showModal: false,
            reportResult: [],
            isLoading: false,
        }
    },
    computed:{
        headers(){
            return [
                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "number",
                },
                {
                    text: "تاریخ سفارش",
                    align: "center",
                    //sortable: false,
                    value: "completed_at",
                },
                {
                    text: "SO DocEntry",
                    align: "center",
                    //sortable: false,
                    value: "b1_doc_entry",
                },
                {
                    text: "SO DocNumber",
                    align: "center",
                    //sortable: false,
                    value: "b1_doc_num",
                },
                {
                    text: "وضعیت همگام سازی",
                    align: "center",
                    //sortable: false,
                    value: "b1_documented",
                },
                {
                    text: "نیاز به همگام سازی",
                    align: "center",
                    //sortable: false,
                    value: "need_document",
                },
                {
                    text: "DL DocEntry",
                    align: "center",
                    //sortable: false,
                    value: "delivery_b1_doc_entry",
                },
                {
                    text: "DL DocNum",
                    align: "center",
                    //sortable: false,
                    value: "delivery_b1_doc_num",
                },
                {
                    text: "Inoice DocEntry",
                    align: "center",
                    //sortable: false,
                    value: "invoice_b1_doc_entry",
                },                {
                    text: "Invoice DocNum",
                    align: "center",
                    //sortable: false,
                    value: "invoice_b1_doc_num",
                },                {
                    text: "Payment DocEntry",
                    align: "center",
                    //sortable: false,
                    value: "payment_b1_doc_entry",
                },                {
                    text: "Payment DocNum",
                    align: "center",
                    //sortable: false,
                    value: "payment_b1_doc_num",
                },
            ]
        },
        orders(){
            return this.$store.getters.getOrders;
        },
        itemCount(){
            return this.$store.getters.getItemCount;
        },
        selectedInvoice(){
            return this.selectedItems.length > 0;
        },
        accounts(){
            return [        {
            item:"111102008004",
            value: "111102008004"
        },  {
            item:"111102006018",
            value: "111102006018"
        },
    ]

        },
        isReadyForSo(){
            return this.selectedItems.every(item => item.b1_doc_entry == null) &&  this.selectedItems.every(item => item.need_document ==  true )
        },
        isReadyForInvoice(){
            return ((!this.selectedItems.every(item => item.b1_doc_entry == null)) &&
            (this.selectedItems.every(item => item.invoice_b1_doc_entry == null)))
        }
    },
    methods:{
        loadOrders(){
            this.$store.dispatch('loadOrders', this.options)
        },
        createSo(){
            let payload = {selectedItems: this.selectedItems,selectedAccount: this.selectedAccount};
            this.isLoading = true
            this.$store.dispatch('createSo', payload).then((response) =>{
                this.loadOrders();
                this.showModal=true;
                this.selectedItems= [];
                this.isLoading = false
                this.reportResult = response;
            })
        },
        createInvoice(){
            let payload = {selectedItems: this.selectedItems};
            this.isLoading = true
            this.$store.dispatch('createInvoice', payload).then((response) =>{
                this.loadOrders();
                this.showModal=true;
                this.selectedItems= [];
                this.isLoading = false
                this.reportResult = response;
            })
        }
    },
    filters:{
        formatDate(geoDate){
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
    },
    watch:{
    options:{
      handler(){
      this.loadOrders();    
      },  deep: true
    }
}
}
</script>
