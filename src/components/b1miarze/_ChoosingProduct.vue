<template>
    <v-card class="card">
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
                    <v-checkbox
                    v-model="selectedToAdd.hasBatch"
                    label="بچ دارد">
                    </v-checkbox>
                </v-col>
                <v-col v-if="selectedToAdd.hasBatch" cols="12" lg="3" sm="3" md="3">
                    <v-text-field
                    v-model="selectedToAdd.batchNumber"
                    label="شماره بچ">
                    </v-text-field>
                </v-col>
                <v-col cols="12" lg="3" sm="3" md="3">
                <v-btn color="green" :disabled="(selectedToAdd.comment.length < 5 || this.selectedToAdd.quantity<1 )"  @click="addToOrder">افزودن</v-btn>
                </v-col>    
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default{
    emits:['push', 'delete'],
    data(){
        return{
            searchProduct:'',
            selectedToAdd: {
                itemCode: '',
                quantity: '',
                price: "",
                itemName: '',
                comment:"",
                hasBatch:false,
                batchNumber:""
            },
        }
    },
    computed:{
        items(){
                return this.$store.getters.getFilteredProducts
            },
    },
    methods:{
        addToOrder(){
            let itemToAdd = this.items.filter(item => {
                        return item.item_code === this.selectedToAdd.itemCode
                    })
            let itemToPush ={
                ItemCode: itemToAdd[0].item_code,
                ItemQty: Number.parseInt(this.selectedToAdd.quantity),
                ItemName: itemToAdd[0]?.item_name,
                Price: Number.parseInt(this.selectedToAdd.price),
                LineTotal: Number.parseInt(this.selectedToAdd.price) * Number.parseInt(this.selectedToAdd.quantity),
                FreeText: this.selectedToAdd.comment,
                HaveBatch: this.selectedToAdd.hasBatch,
                BatchName: this.selectedToAdd.batchNumber,
            }
            this.$emit('push', itemToPush)
            this.selectedToAdd= {
                itemCode: '',
                quantity: '',
                price: '' ,
                comment:"",
                hasBatch:false,
                batchNumber:""
                }
            
        },
        verifiedItem(){
            return this.selectedToAdd.quantity>1 && this.selectedToAdd.comment
        },
        loadFilteredProducts(){
            if (this.selectedToAdd.itemCode) return; // Prevent search if an item is selected
            this.$store.dispatch('fetchFilteredProducts', this.searchProduct);
        },
        deleteItem(item){
            this.$emit('delete', item)
        },debounce(func, delay) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(func, delay);
        },
        updateSelectedToAdd(){
            this.selectedToAdd.itemName = this.items.filter(item => {
                return item.item_code === this.selectedToAdd.itemCode
            })[0]?.item_name
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
}
</script>
<style scoped>
.card{
    margin: 1px;
    border: 2px;
    border-style: solid;
}
</style>