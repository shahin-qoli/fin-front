<template>
    <v-container>
        <v-card  class="dialogCard">
            <v-card-title>
                <v-row v-if="!purchase.is_synced">
                    <v-col cols="12">
                        <v-switch
                        
                        v-model="enableEdit"
                        label="ویرایش"
                        ></v-switch>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-expansion-panels v-model="openPanel" focusable multiple>
                    <v-expansion-panel>
                        <v-expansion-panel-header>اطلاعات سفارش</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field
                                    disabled
                                    label="کد تامین کننده"
                                    v-model="purchase.vendor_code"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field
                                    disabled
                                    label="نام تامین کننده"
                                    v-model="purchase.vendor_name"
                                ></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-checkbox
                                    label="درخواست صدور سند"
                                    disabled
                                    v-model="purchase.is_requested"
                                    ></v-checkbox>
                                </v-col>
                                <v-col cols="4">
                                    <v-checkbox
                                    label="تکمیل شده"
                                    disabled
                                    v-model="purchase.is_synced"
                                    ></v-checkbox>
                                </v-col>
                                <v-col cols="4">
                                    <v-checkbox
                                    label="پیش نویس"
                                    disabled
                                    v-model="purchase.is_draft"
                                    ></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>تنظیمات سفارش</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-col cols="12">                 
                                    <v-form>
                                        <v-row>
                                            <v-col cols="4">
                                                <v-text-field
                                                disabled
                                                label="کد انبار"
                                                v-model="purchase.data.fromWhsCode"
                                            ></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-text-field
                                                disabled
                                                label="کد مالیات"
                                                v-model="purchase.data.vatGroup"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-text-field
                                                disabled
                                                label="توضیحات سند"
                                                v-model="purchase.data.comment"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-text-field
                                                disabled
                                                label="تاریخ سند"
                                                v-model="purchase.docdate"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-form>                     
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel >
                        <v-expansion-panel-header>خطوط سفارش</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <choose-product v-if="enableEdit" @delete="deleteItem" @push="addToOrder" ></choose-product>
                            <v-data-table
                            fixed-header
                            v-if="purchase.data.items.length"
                            :key="purchase.data.items.length"
                            hide-default-footer
                            dense
                            :headers="itemHeaders"
                            :items-per-page="-1"
                            :items="purchase.data.items">
                            <template v-slot:[`item.delete`]="props">
                                <v-btn :disabled="!enableEdit" class="mx-2" small  @click="deleteItem(props.item)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <template v-slot:[`item.LineTotal`]="{ item }">
                                <p>{{ item.LineTotal | formatAmount }}</p>
                            </template>
                            <template v-slot:[`item.Price`]="{ item }">
                                <p>{{ item.Price | formatAmount }}</p>
                            </template>
                            <template v-slot:[`item.Vat`]="{ item }">
                                <p>{{ item.Vat | formatAmount }}</p>
                            </template>
                            <template v-slot:[`item.Gross`]="{ item }">
                                <p>{{ item.Gross | formatAmount }}</p>
                            </template>
                            <template v-slot:footer>
                            <v-divider></v-divider>
                            </template>
                            </v-data-table>
                            <div style="margin-top: 15px;" v-if="purchase.data.items.length > 0" >
                                <v-row justify="end" >
                                <v-col cols="12" lg="2" sm="4" md="4">
                                    <p class="total-text">جمع کل:</p>
                                </v-col>
                                <v-col cols="12" lg="3" sm="8" md="8">
                                <p class="total-text">{{ (isNaN(totalLineTotal.toFixed(0))  ?0 : totalLineTotal.toFixed(0) ) | formatAmount }} ریال</p>
                                </v-col>
                                </v-row> 
                                <v-row justify="end" >
                                <v-col cols="12" lg="2" sm="4" md="4">
                                    <p class="total-text">پرداختی:</p>
                                </v-col>
                                <v-col cols="12" lg="3" sm="8" md="8">
                                <v-text-field
                                :disabled="!enableEdit"
                                :value="formatAmountMethod"
                                @blur="updateAmount"
                                ></v-text-field>
                                </v-col>
                                </v-row>         
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel >
                        <v-expansion-panel-header>درخواست های ثبت سند</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-data-table
                            fixed-header
                            hide-default-footer
                            dense
                            :headers="requestHeaders"
                            :items-per-page="-1"
                            :items="purchase.b1_requests"></v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-col cols="6">
                    <v-btn dark color="red" @click="close">بستن</v-btn>     
                </v-col>
                <v-col cols="6">          
                    <v-btn v-if="!purchase.is_synced" dark color="blue" @click="updateRetry" >ثبت مجدد</v-btn>                         
                </v-col>
            </v-card-text>
        </v-card>
        <v-overlay :value="isLoading">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>در حال عملیات</p>
        </v-overlay>
    </v-container>
</template>

<script>
var jalaali = require('jalaali-js')
import DatePicker from '../DatePicker.vue'
import ChooseProduct from './_ChoosingProduct.vue'
export default {
    props:{
        purchase:{}
    },
    emits:['close',],
    components:{ DatePicker,ChooseProduct},
    data(){
        return {
            openPanel:[0,1,2],
            isLoading: false,
            enableEdit: false,
        }
    },
    computed:{
        itemHeaders(){
            return [
                {
                text: "کد کالا",
                align: "center",
                sortable: false,
                value: "ItemCode",
                }, 
                {
                text: "نام کالا",
                align: "center",
                sortable: false,
                value: "ItemName",
                }, 
                {
                text: "تعداد",
                align: "center",
                sortable: false,
                value: "ItemQty",
                },
                {
                text: "قیمت",
                align: "center",
                sortable: false,
                value: "Price",
                },
                {
                text: "جمع",
                align: "center",
                sortable: false,
                value: "LineTotal",
                }, 
                {
                text: "توضیحات",
                align: "center",
                sortable: false,
                value: "FreeText",
                }, 
                {
                text: "",
                align: "center",
                sortable: false,
                value: "delete",
                }
            ]
        },
        requestHeaders(){
            return [
                {
                text: "تاریخ",
                align: "center",
                sortable: false,
                value: "created_at",
                }, 
                {
                text: "موفقیت",
                align: "center",
                sortable: false,
                value: "is_success",
                }, 
                {
                text: "متن درخواست",
                align: "center",
                sortable: false,
                value: "request",
                },
                {
                text: "متن جواب",
                align: "center",
                sortable: false,
                value: "result",
                }
            ]
        },
        items(){
            console.log("HERE")
            console.log(this.$store.getters.getCreatedGrpo)
            return this.$store.getters.getCreatedGrpo;
        },
        itemCount(){
            return this.$store.getters.getItemCountCreatedGrpo;
        },
        totalLineTotal() {
            console.log("go to calculate total")
           let total = this.purchase.data.items.reduce((total, item) => total + item.LineTotal, 0);
            
            this.purchase.totalPaid = total;
            // console.log(this.purchase)
            // return total;
        },
        formatAmountMethod() {
            console.log("go to formatAmount")
            console.log(this.purchase)
            const stringVlue = String(this.purchase.totalPaid)
            const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return formattedIntegerPart
        },
        taxCodeItems(){
            return [
                {
                    text:"GST-E1",
                    value: "GST-E1"
                },
                {
                    text:"tax1",
                    value: "tax1"
                }
            ]
        },
    },
    methods:{  
        deleteItem(item){
            this.purchase.data.items = this.purchase.data.items.filter(i => i !== item)
            this.purchase.data.items = [...this.purchase.data.items];
        },
        addToOrder(item){
            this.purchase.data.items.push(item)
            this.purchase.data.items = [...this.purchase.data.items]
        },
        close(){
            this.$emit('close')
        },
        updateAmount(){
            this.purchase.data.totalPaid = event.target.value
        },
        updateRetry(){
            this.isLoading = true
            if (typeof this.purchase.totalPaid === 'string'){
                this.purchase.totalPaid = parseInt(this.purchase.totalPaid.replace(/,/g, ''), 10);
            }
            this.$store.dispatch('updateRetryCreateGrpo', this.purchase).then((response)=>{
                this.isLoading = false;
                if (response.is_success){
                    console.log(response.result[0])
                    console.log(response.result)
                    this.$toasted.show(`موفقیت! شماره سند: ${response.result}`, {
                        position: 'bottom-center',
                        type: 'success',
                        duration: 15000
                    })           
                }
                else{
                        this.$toasted.show("خطا در ایجاد سند", {
                        position: 'bottom-center',
                        type: 'error',
                        duration: 5000
                    })
                    }
                
            })
        }     
    },
    filters:{
        formatDate(geoDate){          
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        },
        formatAmount(value){
        const stringVlue = String(value)
        const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedIntegerPart
      },
    },
    watch: {
    'purchase.data.items': {
        handler() {
            this.totalLineTotal;  // Trigger computed recalculation
            this.formatAmountMethod;
        },
        deep: true
        }   
    }
//    ,
 //   created(){
 //       this.loadLogs();
//    }
}
</script>
<style scoped>
.dialogCard{
    margin: 10px;
    border: 2px;
    border-style: solid;
    padding: 5px;
}
</style>