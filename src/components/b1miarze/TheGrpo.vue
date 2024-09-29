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
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="isCardCodeChecked">
            <v-col cols="6">
                <v-card >
                    <v-card-title>
                        <v-row>
                            <v-col cols="12" class="center-text text-title"><p>انتخاب کالا</p></v-col>
                        </v-row>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" lg="4" sm="4" md="4">
                                <v-autocomplete
                                v-model="selectedToAdd.itemCode"
                                :items="items"
                                placeholder="کد کالا"
                                solo
                                filled
                                dense
                                item-text="item_code"
                                item-value="item_code"
                                :search-input.sync="searchProduct"
                                @input="updateSelectedToAdd"
                                >
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" lg="8" sm="8" md="8">
                                <v-text-field
                                v-model="selectedToAdd.itemName"
                                abel="نام"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" lg="8" sm="8" md="8">
                                <v-text-field
                                v-model="selectedToAdd.price"
                                label="قیمت">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" lg="4" sm="4" md="4">
                                <v-text-field
                                v-model="selectedToAdd.quantity"
                                label="تعداد">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" lg="3" sm="3" md="3">
                                <v-text-field
                                v-model="selectedToAdd.comment"
                                label="شماره سفارش">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" lg="3" sm="3" md="3">
                            <v-btn color="green" :disabled="selectedToAdd.quantity<1"  @click="addToOrder">افزودن</v-btn>
                            </v-col>    
                        </v-row>
                    </v-card-text>
                </v-card>
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

export default {
    components:{ DatePicker},
    data(){
        return{
            purchase:{
                items:[],
                docdate:"",
                vendor_code:"",
                totalPaid: 0,
                fromWhsCode:"",
                vatGroup:"",
                comment:""
            },
            selectedToAdd: {
                itemCode: '',
                quantity: '',
                price: "",
                itemName: '',
                comment:""
            },
            cardCodeData:{
                cardCode:"",
                cardName:""
            },
            
            debounceTimeout: null,
            
            searchProduct:'',
            isCardCodeChecked: false,
            isLoading: false,
            searchCardCode:"",
            showModal:false,
        }
    },
    methods:{
        loadFilteredProducts(){
            if (this.selectedToAdd.itemCode) return; // Prevent search if an item is selected
            this.$store.dispatch('fetchFilteredProducts', this.searchProduct);
        },
        addToOrder(){
            console.log("STAAAAAAAAAAAAART")
            let itemToAdd = this.items.filter(item => {
                        return item.item_code === this.selectedToAdd.itemCode
                    })
            console.log(itemToAdd)        
            let foundIndex = this.purchase.items.findIndex(item => {
                return item.ItemCode === this.selectedToAdd.itemCode;
            });

            if (foundIndex !== -1)  {
                this.purchase.items[foundIndex].ItemQty += Number.parseInt(this.selectedToAdd.quantity);
                this.purchase.items[foundIndex].Price = Number.parseInt(this.selectedToAdd.price);
                this.purchase.items[foundIndex].LineTotal = this.purchase.items[foundIndex].ItemQty * this.purchase.items[foundIndex].Price
            }else{    

            this.purchase.items.push({
                ItemCode: itemToAdd[0].item_code,
                ItemQty: Number.parseInt(this.selectedToAdd.quantity),
                ItemName: itemToAdd[0]?.item_name,
                Price: Number.parseInt(this.selectedToAdd.price),
                LineTotal: Number.parseInt(this.selectedToAdd.price) * Number.parseInt(this.selectedToAdd.quantity),
                FreeText: itemToAdd[0]?.comment,
            })}
            this.selectedToAdd= {
                itemCode: '',
                quantity: '',
                price: '' ,
                comment:"",
                }
            
        },
        deleteItem(item){
            this.purchase.items = this.purchase.items.filter(i => i !== item)
        },
        debounce(func, delay) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(func, delay);
        },
        updateSelectedToAdd(){
            this.selectedToAdd.itemName = this.items.filter(item => {
                return item.item_code === this.selectedToAdd.itemCode
            })[0]?.item_name
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
                }
                this.isLoading = false;  
            })
        },
        createGrpo(){
            this.$store.dispatch(`nillError`) 
            this.isLoading = true; 
            this.$store.dispatch('createGrpo', this.purchase).then((response)=>{
                if (response.status == 200 && (response.error == "" || response.error == null)){
                    this.$toasted.show("با موفقیت انجام شد", {
                        position: 'bottom-center',
                        type: 'success',
                        duration: 5000
                    })
                    this.purchase = {
                        items:[],
                        docdate:"",
                        vendor_code:"",
                        totalPaid: 0,
                        fromWhsCode:"",
                        vatGroup:"",
                        comment:""
                    }
                    this.showModal = false}
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
                if (newValue.trim() !== "") {
                    this.debounce(this.loadFilteredProducts, 300); // 300 ms debounce
                }
            },
            immediate: true,
        }
    },
  
}
</script>