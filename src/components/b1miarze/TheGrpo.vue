<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col cols="12" class="center-text text-title"><p>انتخاب تامین کننده</p></v-col>
                        </v-row>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" lg="3" sm="3" md="3">
                                <v-text-field
                                v-model="searchCardCode"
                                label="کد"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" lg="3" sm="3" md="3">
                                <v-btn :disabled="searchCardCode < 5" @click="validateCardCode">بررسی تامین کننده</v-btn>
                            </v-col>    
                        </v-row>
                        <v-row v-if="isCardCodeChecked">
                            <v-col cols="6">
                                <v-text-field          
                                v-model="cardCodeData.cardCode"
                                label="کد تامین کننده"
                                single-line
                                required
                                disabled
                                hide-details></v-text-field>
                            </v-col>  
                            <v-col cols="6">
                                <v-text-field          
                                v-model="cardCodeData.cardName"
                                label="نام تامین کننده"
                                single-line
                                required
                                disabled
                                hide-details></v-text-field>
                            </v-col>  
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="isCardCodeChecked">
            <v-col cols="6">
                <choose-product @delete="deleteItem" @push="addToOrder"></choose-product>
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col cols="12" class="center-text text-title"><p>تنظیمات سند</p></v-col>
                        </v-row>                       
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" lg="4" sm="4" md="6">
                                <v-text-field
                                label="کد انبار"
                                v-model="purchase.fromWhsCode">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" lg="4" sm="4" md="6">
                                <v-select
                                label="کد مالیات"
                                v-model="purchase.vatGroup"
                                :items="taxCodeItems"
                                item-text="text"
                                item-value="value">
                                </v-select>
                            </v-col>
                            <v-col cols="12" lg="4" sm="4" md="6">
                                <v-text-field
                                label="توضیحات سند"
                                v-model="purchase.comment">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" lg="4" sm="4" md="6">
                            <date-picker label="تاریخ سند" v-model="purchase.docdate"></date-picker>
                        </v-col>
                        </v-row>

                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row v-if="isCardCodeChecked">
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                    <v-row>
                        <v-col cols="12" class="center-text text-title"><p>اطلاعات فاکتور</p></v-col>
                    </v-row>
                    </v-card-title>
                    <v-card-text>
                    <v-data-table
                    fixed-header
                    hide-default-footer
                    dense
                    :headers="headers"
                    :items-per-page="-1"
                    :items="purchase.items">
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
                    <div style="margin-top: 15px;" v-if="purchase.items.length > 0" >
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
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row  v-if="isCardCodeChecked">
            <v-btn :disabled="purchase.totalPaid < 1" color="green" @click="createGrpo">ثبت سند</v-btn>
        </v-row>
        <v-dialog v-model="showModal" max-width="500">

        </v-dialog>
        <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>در حال عملیات</p>
        </v-overlay>
    </v-container>
</template>
<script>
import DatePicker from '../DatePicker.vue'
import ChooseProduct from './_ChoosingProduct.vue'
export default {
    components:{ DatePicker,ChooseProduct},
    data(){
        return{
            purchase:{
                items:[],
                docdate:"",
                vendor_code:"",
                totalPaid: 0,
                fromWhsCode:"",
                vatGroup:"",
                comment:"",
                vendor_name:""
            },
            cardCodeData:{
                cardCode:"",
                cardName:""
            },           
            debounceTimeout: null,           
            isCardCodeChecked: false,
            isLoading: false,
            showModal:false,
        }
    },
    methods:{
        deleteItem(item){
            this.purchase.items = this.purchase.items.filter(i => i !== item)
        },
        addToOrder(item){
            this.purchase.items.push(item)
        },
        updateAmount(){
            this.purchase.totalPaid = event.target.value
        },
        validateCardCode(){
            this.$store.dispatch(`nillError`) 
            this.cardCodeData ={
                cardCode:"",
                cardName: ""
            }
            this.isCardCodeChecked = false
            let payload = {cardcode: this.searchCardCode}
            this.isLoading = true;            
            this.$store.dispatch('validateCardCode', payload).then((response)=>{
                
                if (!this.$store.getters.getError){
                    this.isCardCodeChecked = true
                  
                    this.cardCodeData = response.data
                    this.purchase.vendor_code = this.cardCodeData.cardCode
                    this.purchase.vendor_name = this.cardCodeData.cardName
                }
                this.isLoading = false;  
            })
        },
        createGrpo(){
            this.$store.dispatch(`nillError`) 
            this.isLoading = true; 
            this.$store.dispatch('createGrpo', this.purchase).then((response)=>{
                if (response.is_success){
                    console.log(response.result[0])
                    console.log(response.result)
                    this.$toasted.show(`موفقیت! شماره سند: ${response.result}`, {
                        position: 'bottom-center',
                        type: 'success',
                        duration: 15000
                    }),
                    this.purchase = {
                        items:[],
                        docdate:"",
                        vendor_code:"",
                        totalPaid: 0,
                        fromWhsCode:"",
                        vatGroup:"",
                        comment:""
                    },
                    this.cardCodeData={
                        cardCode:"",
                        cardName:""
                    },
            
                    this.debounceTimeout= null,
                    
                    this.searchProduct='',
                    this.isCardCodeChecked = false,
                    this.isLoading= false,
                    this.searchCardCode="",
                    this.showModal = false
                }
                else{
                        this.$toasted.show("خطا در ایجاد سند", {
                        position: 'bottom-center',
                        type: 'error',
                        duration: 5000
                    })
                    }
                this.isLoading = false;
        })
        }
    },
    computed:{
        headers(){
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
        items(){
            return this.$store.getters.getFilteredProducts
        },
        totalLineTotal() {
            let total = this.purchase.items.reduce((total, item) => total + item.LineTotal, 0);
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
    watch: {
        searchProduct: {
            handler(newValue) {
                if (newValue && newValue.trim() !== "") {
                    this.debounce(this.loadFilteredProducts, 300); // 300 ms debounce
                }
            },
            immediate: true,
        }
    },
    filters:{
      formatAmount(value){
        const stringVlue = String(value)
        const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedIntegerPart
      },
    }
}
</script>