<template>
    <v-container>
        <v-card>
            <v-card-title>
                <v-row >
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="3">
                                <v-text-field v-model="options.cardCode" hint="c50000" label="کد مشتری"></v-text-field>
                            </v-col>
                            <!-- <v-col cols="3">
                                <v-switch v-model="options.isSynced" label="نمایش فاکتور شده"></v-switch>
                            </v-col>
                            <v-col cols="3">
                                <v-switch v-model="options.readyToInvoice" label="نمایش آماده فاکتور"></v-switch>
                            </v-col> -->
                            <v-col cols="3">
                                <date-picker label="تاریخ شروع" v-model="options.startDate"></date-picker>
                            </v-col>
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
                            <!-- <v-col cols="1">
                                <v-btn dark color="green" type="submit">جستجو</v-btn>
                            </v-col>
                            <v-col cols="1">
                                <v-btn dark color="red" @click="clearForm">پاک کردن</v-btn>
                            </v-col> -->
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
                <template v-slot:[`item.docdate`]="{item}">
                    <p>{{ item.docdate | formatDate }}</p>
                </template>
                <template v-slot:[`item.more`]="props">
                    <v-row>
                        <v-col cols="6">
                            <v-btn v-if="isNeedToUpdate(props.item)" class="mx-2" small  @click="updateReadyToInvoiceSingle(props.item)">
                            بررسی
                            </v-btn>
                        </v-col>
                        <v-col cols="6">            
                            <v-btn style="color: red" v-if="isReadyToInvoice(props.item)" class="mx-2" small  @click="createInvoiceSingle(props.item)">
                            صدور فاکتور
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog v-model="showModal" max-width="500">
            <v-card>
                <v-card-text>
                    <h3 class="success-text" v-if="errorMessage == null">
                        با موفقیت انجام شد
                    </h3>
                    <h3 class="failure-text" v-else>
                        خطا در عملیات:
                        {{ errorMessage }}
                    </h3>
                </v-card-text>
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
        selectedFilter: "needProcess"
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
                    text: "تاریخ",
                    align: "center",
                    value: "docdate",
                },
                {
                    text: "شماره داخلی",
                    align: "center",
                    value: "docentry",
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
                    text: "وضعیت",
                    align: "center",
                    value: "state",
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
                    text: "وضعیت سند",
                    align: "center",
                    value: "state",
                },                
                {
                    text: "جمع",
                    align: "center",
                    value: "document_total",
                },
                {
                    text: "همگام سازی",
                    align: "center",
                    value: "is_synced",
                },           
                {
                    text: "نیاز به فاکتور",
                    align: "center",
                    value: "need_invoice",
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
            if(!resp.isSuccess){
                this.errorMessage= resp.error
            }
            this.isLoading = false
            this.showModal = true
            this.loadOrders();  
        })
      },
      createInvoiceSingle(item){
        this.isLoading = true
        this.$store.dispatch("createInvoiceSingle", item.id).then(resp=>{
            if(!resp.isSuccess){
                this.errorMessage= resp.error
            }
            this.isLoading = false
            this.showModal = true
            this.loadOrders();  
        })
      }
    },    filters:{
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
    watch:{
        selectedFilter:{
            handler(value){
                switch (value){
                    case "needProcess":
                        this.options.isSynced = false
                        this.options.needInvoice = true
                        this.options.readyToInvoice = false;
                        break;
                    case "readyToInvoice":
                        this.options.isSynced = false
                        this.options.needInvoice = true
                        this.options.readyToInvoice = true;
                        break;
                    case "invoiced":
                        this.options.isSynced = true
                        this.options.needInvoice = ""
                        this.options.readyToInvoice = "";
                        break;
                    default:
                        this.options.isSynced = false
                        this.options.needInvoice = true
                        this.options.readyToInvoice = false;
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