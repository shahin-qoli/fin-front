<template>
    <v-container>
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="center-text text-title"><p>انتخاب تامین کننده</p></v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" lg="8" sm="8" md="8">
                        <v-text-field
                        v-model="selectedToAdd.itemName"
                        abel="نام"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" sm="3" md="3">
                    <v-text-field
                    v-model="selectedToAdd.price"
                    label="قیمت">
                    </v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" sm="3" md="3">
                    <v-text-field
                    v-model="selectedToAdd.quantity"
                    label="تعداد">
                    </v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" sm="3" md="3">
                    <v-btn color="green" :disabled="selectedToAdd.quantity<1"  @click="addToOrder">افزودن</v-btn>
                    </v-col>    
                </v-row>
            </v-card-text>
        </v-card>
        <v-card>
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
                    <v-col cols="12" lg="3" sm="3" md="3">
                    <v-text-field
                    v-model="selectedToAdd.price"
                    label="قیمت">
                    </v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" sm="3" md="3">
                    <v-text-field
                    v-model="selectedToAdd.quantity"
                    label="تعداد">
                    </v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" sm="3" md="3">
                    <v-btn color="green" :disabled="selectedToAdd.quantity<1"  @click="addToOrder">افزودن</v-btn>
                    </v-col>    
                </v-row>
            </v-card-text>
        </v-card>
        <v-row>
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
                    :items="purchaseItems">
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
                    <div style="margin-top: 15px;" v-if="purchaseItems.length > 0" >
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
    </v-container>
</template>
<script>
export default {
    data(){
        return{
            searchProduct:'',
            selectedToAdd: {
                itemCode: '',
                quantity: '',
                price: "",
                itemName: '',
            },
            purchaseItems:[],
            debounceTimeout: null,
            totalPaid: 0,
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
            let foundIndex = this.purchaseItems.findIndex(item => {
                return item.ItemCode === this.selectedToAdd.itemCode;
            });

            if (foundIndex !== -1)  {
                this.purchaseItems[foundIndex].ItemQty += Number.parseInt(this.selectedToAdd.quantity);
                this.purchaseItems[foundIndex].Price = Number.parseInt(this.selectedToAdd.price);
                this.purchaseItems[foundIndex].LineTotal = this.purchaseItems[foundIndex].ItemQty * this.purchaseItems[foundIndex].Price
            }else{    

            this.purchaseItems.push({
                ItemCode: itemToAdd[0].item_code,
                ItemQty: Number.parseInt(this.selectedToAdd.quantity),
                ItemName: itemToAdd[0]?.item_name,
                Price: Number.parseInt(this.selectedToAdd.price),
                Quantity:  Number.parseInt(this.selectedToAdd.quantity),
                LineTotal: Number.parseInt(this.selectedToAdd.price) * Number.parseInt(this.selectedToAdd.quantity),

            })}
            this.selectedToAdd= {
                itemCode: '',
                quantity: '',
                price: ''            }
            
        },
        deleteItem(item){
            this.purchaseItems = this.purchaseItems.filter(i => i !== item)
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
            this.totalPaid = event.target.value
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
            let total = this.purchaseItems.reduce((total, item) => total + item.LineTotal, 0);
            this.totalPaid = total;
            return total;
        },
        formatAmountMethod() {
            const stringVlue = String(this.totalPaid)
            const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return formattedIntegerPart
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