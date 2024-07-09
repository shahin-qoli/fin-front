<template>
    <v-container>
        <v-card>
            <v-card-title>
                <v-row >
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="2">
                                <v-text-field v-model="options.cardCode" hint="c50000" label="کد مشتری"></v-text-field>
                            </v-col>
                            <v-col cols="2">
                                <date-picker label="تاریخ شروع" v-model="options.startDate"></date-picker>
                            </v-col>
                            <v-col cols="6">
                                <v-btn-toggle
                                v-model="selectedFilter"
                                tile
                                color="deep-purple accent-3"
                                group
                            >
                                <v-btn value="needProcess">
                                فاکتور نشده ها
                                </v-btn>

                                <v-btn value="readyToInvoice">
                                آماده فاکتورها
                                </v-btn>

                                <v-btn value="invoiced">
                                فاکتور شده ها
                                </v-btn>
                            </v-btn-toggle>
                            </v-col>

                            <v-spacer></v-spacer>
                            <v-col cols="2">
                                <v-btn @click="dialog = true">عملیات کلی</v-btn>
                            </v-col>

                        </v-row>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-data-table
                        fixed-header
                        dense
                        :headers="headers"
                        :items="orders"
                        item-key="id"          
                        :options.sync="options"
                        :server-items-length="itemCount"
                        class="elevation-1"                   
                >
                <template v-slot:[`item.is_synced`]="{ item }">
                    <v-simple-checkbox
                    v-model="item.is_synced"
                    disabled
                    ></v-simple-checkbox>
                </template>
                <template v-slot:[`item.need_invoice`]="{ item }">
                    <v-simple-checkbox
                    v-model="item.need_invoice"
                    disabled
                    ></v-simple-checkbox>
                </template>
                <template v-slot:[`item.ready_to_invoice`]="{ item }">
                    <v-simple-checkbox
                    v-model="item.ready_to_invoice"
                    disabled
                    ></v-simple-checkbox>
                </template>
                <template v-slot:[`item.document_total`]="{ item }">
                <p>{{ item.document_total | formatAmount }}</p>
                </template>
                <template v-slot:[`item.delivery_total`]="{ item }">
                <p v-if="item.delivery_total >0">{{ item.delivery_total | formatAmount }}</p>
                <p v-else>{{ item.delivery_total }}</p>
                </template>
                <template v-slot:[`item.docdate`]="{item}">
                    <p>{{ item.docdate | formatDate }}</p>
                </template>
                <template v-slot:[`item.first_del_date`]="{item}">
                    <p v-if="item.first_del_date != null">{{ item.first_del_date | formatDate }}</p>
                </template>
                <template v-slot:[`item.more`]="props">
                    <v-row>
                        <v-col cols="6" v-if="isNeedToUpdate(props.item)">
                            <v-btn  small  @click="updateReadyToInvoiceSingle(props.item)">
                            بررسی
                            </v-btn>
                        </v-col>
                        <v-col cols="6" v-if="isReadyToInvoice(props.item)">            
                            <v-btn style="color: red" small  @click="createInvoiceSingle(props.item)">
                            صدور فاکتور
                            </v-btn>
                        </v-col>
                        <v-col cols="6" v-if="hasB1Errors(props.item)" >            
                            <v-btn style="color: red"  small  @click="showB1Erros(props.item)">
                            مشاهده خطا
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog v-model="showModal" max-width="500"  @input="onDialogInput">
            <v-card>
                <v-card-text>
                    <h3 class="success-text" v-if="errorMessage == null">
                        با موفقیت انجام شد
                    </h3>
                    <h4  v-if="resultMessage != null">
                        تعداد {{ resultMessage.success.length }} فاکتور در بی وان ثبت شد.
                        تعداد {{ resultMessage.failure.length }} فاکتور در بی وان ناموفق بود.
                        شماره سفارش های ناموفق: {{ resultMessage.failure }}

                    </h4>
                    <h3 class="failure-text" v-else>
                        خطا در عملیات:
                        {{ errorMessage }}
                    </h3>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="b1ErrorsDialog" max-width="500">
            <v-card>
                <v-card-text>
                    {{ b1ErrorsDialogMessage }}
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="600">
            <v-card>
            <v-card-actions>
                <v-btn color="green" @click="updateDataFromB1">دریافت سفارشات از بی وان</v-btn>
                <v-btn color="yellow" @click="checkAllOrders">بررسی همه سفارش ها</v-btn>
                <v-btn color="orange" @click="createInvoiceAll">فاکتور کردن آماده ها</v-btn>
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
var jalaali = require('jalaali-js')
import DatePicker from '../DatePicker.vue'
export default{
    components:{ DatePicker},
    data(){        
        return{
        options: {
        itemsPerPage: 10,
        page:1,
        orderState: "",
        cardCode: "",
        isSynced: false,
        readyToInvoice: false,
        needInvoice: true,
        startDate: null
            },
        isLoading: false,
        showModal: false,
        errorMessage: null,
        selectedFilter: "needProcess",
        dialog: false,
        b1ErrorsDialog: false,
        b1ErrorsDialogMessage: null,
        resultMessage: null
        }
        
    },
    computed:{
        headers(){
            return[
                {
                    text: "شماره",
                    align: "center",
                    value: "docnum",
                },
                {
                    text: "تاریخ Delivery",
                    align: "center",
                    value: "first_del_date",
                },
                {
                    text: "تاریخ so",
                    align: "center",
                    value: "docdate",
                },
                {
                    text: "کد مشتری",
                    align: "center",
                    value: "card_code",
                },
                {
                    text: "نام",
                    align: "center",
                    value: "card_name",
                },
                {
                    text: "payduedate",
                    align: "center",
                    value: "payduedate",
                },
                {
                    text: "زمان پرداخت",
                    align: "center",
                    value: "payment_time",
                },
                {
                    text: "روش پرداخت",
                    align: "center",
                    value: "settle_type",
                },             
                {
                    text: "جمع SO",
                    align: "center",
                    value: "document_total",
                },
                {
                    text: "جمع Delivery",
                    align: "center",
                    value: "delivery_total",
                },
                {
                    text: "فاکتور شده",
                    align: "center",
                    value: "is_synced",
                },           
                {
                    text: "آماده فاکتور",
                    align: "center",
                    value: "ready_to_invoice",
                },   
                {
                    text: "دلیل رد شدن",
                    align: "center",
                    value: "not_ready_reason",
                },               
                {
                    text: "عملیات",
                    align: "center",
                    value: "more",
                }
            ]
        },
        orders(){
            return this.$store.getters.getAutomatedOrders
        },
        itemCount(){
        return this.$store.getters.getAutomatedOrdersItemCount;
      },


    },
    methods:{
        loadOrders(){
            this.isLoading = true
            this.errorMessage= null
            this.$store.dispatch('fetchtAutomateOrders',this.options).then(resp=>{
                if (!resp){
                    this.errorMessage= resp.error
                    this.isLoading = false
                    this.showModal = true
                }
                this.isLoading = false
            })
        },
        isNeedToUpdate(item){
        return item.need_invoice && !item.ready_to_invoice && !item.is_synced
        },        
        isReadyToInvoice(item){
            return item.need_invoice && !item.is_synced
        },
        updateReadyToInvoiceSingle(item){
            this.isLoading = true
            this.errorMessage= null
            this.$store.dispatch("updateReadyToInvoiceSingle", item.id).then(resp=>{
                if(!resp.is_success){
                    this.errorMessage= resp.error
                }
                this.isLoading = false
                this.showModal = true
                this.loadOrders();  
            })
        },
        createInvoiceSingle(item){
            this.errorMessage = null
            this.isLoading = true
            this.$store.dispatch("createInvoiceSingle", item.id).then(resp=>{
                if(!resp.is_success){
                    this.errorMessage= resp.error
                }
                this.isLoading = false
                this.showModal = true
                this.loadOrders();  
            })
        },
        updateDataFromB1(){
            this.dialog = false
            this.isLoading = true
            this.errorMessage= null
            this.$store.dispatch("updateDataFromB1AutomateOrder").then(resp=>{
                if(!resp.is_success){
                    this.errorMessage= resp.error
                }
                this.isLoading = false
                this.showModal = true
                this.loadOrders(); 
        })},
        checkAllOrders(){
            this.dialog = false
            this.isLoading = true
            this.errorMessage= null
            this.$store.dispatch("checkAllOrdersAutomateOrder").then(resp=>{
                if(!resp.is_success){
                    this.errorMessage= resp.error
                }
                this.isLoading = false
                this.showModal = true
                this.loadOrders(); 
        })} ,
        createInvoiceAll(){
            this.dialog = false
            this.isLoading = true
            this.errorMessage= null
            this.$store.dispatch("createInvoiceAllAutomateOrder").then(resp=>{
                if(!resp.is_success){
                    this.errorMessage= resp.error
                }else{
                    this.resultMessage = resp.result
                }
                this.isLoading = false
                this.showModal = true
                this.loadOrders(); 
        })},
        hasB1Errors(item){
            return this.selectedFilter =="readyToInvoice" && item.need_invoice && !item.is_synced &&
            item.b1_requests.length > 0 && item.b1_requests.some(request=>request.is_success == false)
        },
        showB1Erros(item){
            this.b1ErrorsDialog = true
            this.b1ErrorsDialogMessage= item.b1_requests
        },
        onDialogInput(isOpen) {
      if (!isOpen) {
        this.errorMessage = null;
        this.resultMessage = null;
      }
    }
    },
    filters:{
        formatAmount(value){
        const stringVlue =  Number.parseFloat(value).toFixed(0) 
        const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedIntegerPart
        },
                
        formatDate(geoDate){
                
                var date = new Date(geoDate);
                let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
                return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
            }
    },
    watch:{
        selectedFilter:{
            handler(value){
                switch (value){
                    case "needProcess":
                        this.options.isSynced = false
                        this.options.needInvoice = true
                        this.options.readyToInvoice = false
                        this.options.itemsPerPage= 10
                        this.options.page= 1
                        break;
                    case "readyToInvoice":
                        this.options.isSynced = false
                        this.options.needInvoice = true
                        this.options.readyToInvoice = true;
                        this.options.itemsPerPage= 10
                        this.options.page= 1
                        break;
                    case "invoiced":
                        this.options.isSynced = true
                        this.options.needInvoice = ""
                        this.options.readyToInvoice = "";
                        this.options.itemsPerPage= 10
                        this.options.page= 1
                        break;
                    default:
                        this.options.isSynced = false
                        this.options.needInvoice = true
                        this.options.readyToInvoice = false;
                        this.options.itemsPerPage= 10
                        this.options.page= 1
                }
                
            }
        },
    options:{
      handler(){
      this.loadOrders();    
      },  deep: true
    }
    },
}
</script>
<style scoped>
.success-text{
    color: green;
}
.failure-text{
    color: red;
}
</style>