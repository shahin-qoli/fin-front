<template>

    <v-container>
        <v-dialog :value="value" @input="$emit('input', $event)" max-width="500px" persistent>
      <v-card rounded>
        <v-card-title class="headline">تخصیص تأمین‌کننده</v-card-title>
  
        <v-card-text>
          <v-row>
          <v-col cols="12" lg="3" sm="3" md="3">
          <v-autocomplete
                    v-model="selectedVendor.b1_code"
                    :items="items"
                    placeholder="نام تامین کننده"
                    solo
                    filled
                    dense
                    item-text="name"
                    item-value="b1_code"
                    :search-input.sync="searchVendor"
                    @input="updateSelectedVendor"
                    >
          </v-autocomplete>
          </v-col>
          </v-row>

                        <v-row v-if="isCardCodeChecked">
                            <v-col cols="6">
                                <v-text-field          
                                v-model="selectedVendor.b1_code"
                                label="کد تامین کننده"
                                single-line
                                required
                                disabled
                                hide-details></v-text-field>
                            </v-col>  
                            <v-col cols="6">
                                <v-text-field          
                                v-model="selectedVendor.name"
                                label="نام تامین کننده"
                                single-line
                                required
                                disabled
                                hide-details></v-text-field>
                            </v-col>  
                            <v-col cols="6">
                                <v-text-field          
                                v-model="selectedVendor.vendor_price"
                                label="قیمت تامین"
                                single-line
                                required
                              
                                hide-details></v-text-field>
                            </v-col> 
                        </v-row>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions class="d-flex justify-end pa-4">
          <v-btn text @click="closeDialog">انصراف</v-btn>
          <v-btn color="primary" :disabled="!isCardCodeChecked" @click="confirmAssign">
            تایید تخصیص
          </v-btn>
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
import vendor from '@/store/modules/miarze/vendor';

  export default {
    name: "AssignSupplierDialog",
    props: {
      value: { type: Boolean, default: false }, // Vuetify 2 style
      item: { type: Object, default: null },
    },
    data() {
      return {
        searchVendor: '',
        isLoading:false,
        isCardCodeChecked: false,
        selectedSupplier: null,
        searchCardCode:'',
        vendorPrice: '',
        suppliers: [
          { id: 1, name: "شرکت بهین تجارت" },
          { id: 2, name: "فروشگاه مدرن تأمین" },
          { id: 3, name: "بازرگانی خاورمیانه" },
          { id: 4, name: "تأمین‌یار سپهر" },
        ],
        selectedVendor:{
          b1_code:"",
          name:"",
          vendor_price:""
        }
      };
    },
    computed:{
      items(){
                return this.$store.getters.getFilteredVendors;
            },
    },
    methods: {
      debounce(func, delay) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(func, delay);
        },
      updateSelectedVendor(){
        console.log(this.selectedVendor)
        this.isCardCodeChecked = true
          this.selectedVendor.name = this.items.filter(item => {
                return item.b1_code === this.selectedVendor.b1_code
            })[0]?.name
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

                }
                this.isLoading = false;  
            })
        },
      closeDialog() {
        this.$emit("input", false); // بستن دیالوگ
        this.selectedSupplier = null;
      },
      loadFilteredVendors(){
        
           // if (this.selectedVendor.itemCode) return; // Prevent search if an item is selected
            this.$store.dispatch('fetchFiltereVendors', this.searchVendor);
        },
      confirmAssign() {
        let payload = {
            vendor_b1code: this.selectedVendor.b1_code,
            vendor_name: this.selectedVendor.name,
            vendor_line_item_id: this.item.vendor_line_item.id,
            vendor_price: this.selectedVendor.vendor_price
        }
        this.$emit("assigned", payload);
        this.closeDialog();
      },
    },
    watch: {
      searchVendor: {
            handler(newValue) {
                if (newValue && newValue.trim() !== "") {
                    this.debounce(this.loadFilteredVendors, 300); // 300 ms debounce
                }
            },
            immediate: true,
        }
    },
  };
  </script>
  
  <style scoped>
  .v-select {
    direction: rtl;
  }
  </style>
  