<template>
    <v-card  class="dialogCard">
        <v-card-title>
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
                <v-col cols="4">
                    <v-switch
                    :disabled="disableEditBtn"
                    v-model="disableEdit"
                    label="ویرایش"
                    ></v-switch>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
            <v-expansion-panels v-model="openPanel" focusable>
                <v-expansion-panel>
                    <v-expansion-panel-header>اطلاعات سفارش</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12">                 
                                <v-form>
                                    <v-row>
                                        <v-col cols="4">
                                            <v-text-field
                                            :disabled="disableEdit"
                                            label="کد انبار"
                                            v-model="purchase.fromWhsCode"
                                        ></v-text-field>
                                        </v-col>
                                        <v-col cols="4">
                                            <v-text-field
                                            :disabled="disableEdit"
                                            label="کد مالیات"
                                            v-model="purchase.vatGroup"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="4">
                                            <v-text-field
                                            :disabled="disableEdit"
                                            label="توضیحات سند"
                                            v-model="purchase.comment"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="4">
                                            <v-text-field
                                            :disabled="disableEdit"
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
                <v-expansion-panel>
                    <v-expansion-panel-header>خطوط سفارش</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-data-table
                        fixed-header
                        hide-default-footer
                        dense
                        :headers="itemHeaders"
                        :items-per-page="-1"
                        :items="purchase.data.items">
                        <template v-slot:[`item.delete`]="props">
                            <v-btn class="mx-2" small  @click="deleteItem(props.item)">
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
                            :value="formatAmountMethod"
                            @blur="updateAmount"
                            ></v-text-field>
                            </v-col>
                            </v-row>         
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
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
                <v-btn  dark color="blue" >ثبت مجدد</v-btn>                         
            </v-col>
        </v-card-text>
    </v-card>
</template>

<script>
var jalaali = require('jalaali-js')
import DatePicker from '../DatePicker.vue'
export default {
    props:{
        purchase:{}
    },
    emits:['close'],
    components:{ DatePicker},
    data(){
        return {
            openPanel:[0],
            options: {
            itemsPerPage: 10,
            page: 1
            },
            search:{
                startDate: '',
                endDate: '',
                isSuccess: false,
            },
            searchLoaded:{},
            dialog: false,
            disableEdit: true,
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
        disableEditBtn(){
            this.purchase.is_synced || !this.disableEdit
        },
        totalLineTotal() {
            let total = this.purchase.data.items.reduce((total, item) => total + item.LineTotal, 0);
            this.purchase.totalPaid = total;
            return total;
        },
        formatAmountMethod() {
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
        close(){
            this.$emit('close')
        },
        updateAmount(){
            this.purchase.totalPaid = event.target.value
        },
        submitSearch(){
        // this.loadLogs();
      },
      loadCreatedGrpo(){
        this.$store.dispatch('loadCreatedGrpo',this.options)
      },
      detailsDialog(item){
            this.dialog=true;
            this.purchase= {...item.item}
        },
    },
    watch:{
        options:{
        handler(){   
            this.loadCreatedGrpo();    
        },  deep: true
        }, 
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
    }
//    ,
 //   created(){
 //       this.loadLogs();
//    }
}
</script>
<style scoped>
.dialogCard{
    margin: 1px;
    border: 2px;
    border-style: solid;
}
</style>