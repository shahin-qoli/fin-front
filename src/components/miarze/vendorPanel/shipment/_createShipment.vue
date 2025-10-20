<template>
    <v-dialog v-model="dialog" max-width="900px" persistent scrollable>
      <v-card rounded="xl" elevation="12">
        <!-- Header -->
        <v-card-title class="headline d-flex align-center justify-space-between py-4 px-6">
          <span class="headlineText font-weight-bold">ایجاد حمل جدید</span>
          <v-btn icon color="grey" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
  
        <v-divider></v-divider>
  
        <v-card-text class="pa-6">
          <!-- 🟣 انتخاب نوع حمل -->
          <v-sheet class="section pa-4 mb-6" elevation="2" rounded>
            <div class="section-title">
              <v-icon left color="deep-purple accent-4">mdi-cog-outline</v-icon>
              <span>انتخاب نوع حمل</span>
            </div>
  
            <v-select
              v-model="selectedAction"
              :items="availableActions"
              label="نوع حمل را انتخاب کنید"
              outlined
              dense
              item-text="text"
              item-value="value"
              hide-details
              @change="fetchVendorLineItems"
            ></v-select>
          </v-sheet>
  
          <!-- 🟢 انتخاب نام مقصد/وندور/انبار -->
          <v-sheet
            v-if="selectedAction"
            class="section pa-4 mb-6"
            elevation="2"
            rounded
          >
            <div class="section-title">
              <v-icon left color="deep-purple accent-4">mdi-map-marker</v-icon>
              <span>{{ dynamicSelectLabel }}</span>
            </div>
  
            <v-select
              v-model="selectedDestination"
              :items="dynamicSelectItems"
              label="انتخاب کنید"
              outlined
              dense
              item-text="name"
              item-value="value"
              hide-details
            ></v-select>
          </v-sheet>
  
          <!-- 🔹 انتخاب آیتم‌ها بر اساس اکشن -->
          <v-sheet
            v-if="selectedDestination"
            class="section pa-4 mb-6"
            elevation="2"
            rounded
          >
            <div class="section-title">
              <v-icon left color="deep-purple accent-4">mdi-package-variant</v-icon>
              <span>انتخاب آیتم‌های حمل</span>
            </div>
  
            <div v-if="loadingItems" class="text-center py-6">
              <v-progress-circular indeterminate color="deep-purple accent-4"></v-progress-circular>
            </div>
  
            <v-list v-else dense shaped>
              <v-list-item-group v-model="selectedItems" multiple>
                <v-list-item
                  v-for="(item, i) in toSelectItems"
                  :key="i"
                  :value="item"
                  active-class="deep-purple--text text--accent-4"
                  class="py-2"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <div class="list-row">
                        <v-list-item-title>{{ item.variant_name }}</v-list-item-title>
                        <v-checkbox
                          :input-value="active"
                          color="deep-purple accent-4"
                          hide-details
                        ></v-checkbox>
                      </div>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
  
            <div
              v-if="!vendorLineItems.length && !loadingItems"
              class="text-center py-6 text-grey"
            >
              <v-icon large color="grey lighten-1">mdi-tray-alert</v-icon>
              <div class="mt-2">هیچ آیتمی موجود نیست</div>
            </div>
          </v-sheet>
  
          <!-- 🔵 نمایش آیتم‌های انتخاب شده -->
          <v-expand-transition>
            <v-sheet
              v-if="selectedItems.length"
              class="section pa-4 mb-6"
              elevation="2"
              rounded
            >
              <div class="section-title">
                <v-icon left color="deep-purple accent-4">mdi-format-list-bulleted</v-icon>
                <span>آیتم‌های انتخاب‌شده</span>
              </div>
  
              <v-list dense>
                <v-list-item v-for="(item, i) in selectedItems" :key="i">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.variant_name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      تعداد: {{ item.quantity }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-expand-transition>
  
          <!-- 🧾 فرم اطلاعات حمل -->
          <v-sheet class="section pa-4" elevation="2" rounded>
            <div class="section-title">
              <v-icon left color="deep-purple accent-4">mdi-truck-fast</v-icon>
              <span>اطلاعات حمل</span>
            </div>
  
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="shipment.total_cost"
                  label="قیمت حمل (ریال)"
                  type="number"
                  outlined
                  dense
                  prepend-inner-icon="mdi-currency-usd"
                />
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="shipment.shipped_by"
                  label="نام حمل‌کننده"
                  outlined
                  dense
                  prepend-inner-icon="mdi-account"
                />
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="shipment.shipping_type"
                  label="نوع حمل"
                  outlined
                  dense
                  prepend-inner-icon="mdi-truck"
                />
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="shipment.description"
                  label="توضیحات"
                  outlined
                  dense
                  prepend-inner-icon="mdi-note-text-outline"
                />
              </v-col>
  
              <v-col cols="12" md="6">
                <date-picker v-model="shipment.date" label="تاریخ حمل"></date-picker>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
  
        <!-- Footer -->
        <v-divider></v-divider>
        <v-card-actions class="justify-end px-6 py-4">
          <v-btn text color="red" @click="close">انصراف</v-btn>
          <v-btn color="deep-purple accent-4" dark @click="submitShipment">
            <v-icon left>mdi-check</v-icon>
            ثبت حمل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import DatePicker from '../../../DatePicker.vue';
  
  export default {
    components: { DatePicker },
    props: { value: { type: Boolean, default: false } },
    data() {
      return {
        dialog: this.value,
        selectedAction: '',
        selectedDestination: null,
        selectedItems: [],
        vendorLineItems: [],
        loadingItems: false,
        shipment: {
          date: '',
          shipped_by: '',
          shipping_type: '',
          total_cost: '',
          description: '',
          details: [],
          kar: '',
        },
        availableActions: [
          { text: 'از تامین کننده به پایگاه', value: 'vendor_to_base' },
          { text: 'از پایگاه به مشتری', value: 'base_to_customer' },
          { text: 'از انبار به مشتری', value: 'warehouse_to_customer' },
          { text: 'از انبار به پایگاه', value: 'warehouse_to_base' },
          { text: 'از تامین کننده به مشتری', value: 'vendor_to_customer' },
        ],
      };
    },
    computed: {
        toSelectItems(){
            if (!this.selectedDestination) return [];
            switch(this.selectedDestination.type){
                
                case "vendor":
                
                    return this.vendorLineItems.filter((item) => {
                        return item.vendor.id === this.selectedDestination.id
                    })
                case "customer":
                return this.vendorLineItems.filter((item) => {
                    
               
                    return item.order.user.id === this.selectedDestination.id
                    })      
                case "warehouse":
                return this.vendorLineItems
            }
    
        },
      dynamicSelectLabel() {
        switch (this.selectedAction) {
          case 'vendor_to_base':
          case 'vendor_to_customer':
            return 'انتخاب تامین‌کننده';
          case 'base_to_customer':
          case 'warehouse_to_customer':
            return 'انتخاب مشتری';
          case 'warehouse_to_base':
          
            return 'انتخاب انبار';
          default:
            return 'انتخاب مقصد';
        }
      },
      dynamicSelectItems() {
        // داده‌های فرضی؛ اینو با دیتا واقعی جایگزین کن
        switch (this.selectedAction) {
          case 'vendor_to_base':
          case 'vendor_to_customer':

            return this.vendorLineItems.map((item)=>{
                return {name: item.vendor.name,
                    value: {id:item.vendor.id,
                    type: "vendor"}
            }})
          case 'base_to_customer':
          case 'warehouse_to_customer':
          return this.vendorLineItems.map((item)=>{
                return {name: `${item.order.user.fi_name} ${item.order.user.la_name}`,
                    value: {id:item.order.user.id,
                    type: "customer"}
            }})
          case 'warehouse_to_base':      
            return [
              { value: 1, name: 'انبار مرکزی' ,type: "warehouse"},
              { value: 2, name: 'انبار فرعی' ,type: "warehouse"},
            ];
          default:
            return [];
        }
      },
    },
    watch: {
      value(val) {
        this.dialog = val;
      },
      dialog(val) {
        this.$emit('input', val);
      },
      selectedItems: {
        handler(newVal) {
          this.shipment.details = newVal.map(i => ({ vendor_line_item_id: i.id, quantity: i.quantity }));
        },
        deep: true,
      },
      selectedAction:{
        handler(newVal){
            this.shipment.kar = newVal
        }
      }

    },
    methods: {
      possibleDeliveryState(action) {
        switch (action) {
          case 'vendor_to_base':
          case 'vendor_to_customer':
            return 'in_vendor_stock';
          case 'base_to_customer':
            return 'in_base_stock';
          case 'warehouse_to_customer':
          case 'warehouse_to_base':
            return 'in_warehouse_stock';
        }
      },
      close() {
        this.reset();
        this.dialog = false;
      },
      reset() {
        this.selectedAction = '';
        this.selectedDestination = null;
        this.selectedItems = [];
        this.vendorLineItems = [];
        this.loadingItems = false;
        this.shipment = {
          date: '',
          shipped_by: '',
          shipping_type: '',
          total_cost: '',
          description: '',
          details: [],
        };
      },
      async fetchVendorLineItems() {
        if (!this.selectedAction) return;
        this.loadingItems = true;
        this.vendorLineItems = [];
        try {
          // نمونه فرضی: اینجا API واقعی بذار
          const deliveryState = this.possibleDeliveryState(this.selectedAction);
          const response = await this.$store.dispatch('fetchFilteredVendorLineItems', { deliveryState });
          this.vendorLineItems = response || [];
        } catch (err) {
          this.vendorLineItems = [];
        } finally {
          this.loadingItems = false;
        }
      },
      submitShipment() {
        const payload = { ...this.shipment };
        console.log(payload)
        this.$emit('create-transfer', payload);
        this.close();
        
      },
    },
  };
  </script>
  
  <style scoped>
  .section {
    background: #fafafa;
    border: 1px solid #eee;
  }
  .section-title {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 12px;
  }
  .list-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .headlineText {
    font-family: 'iranyekan', sans-serif;
  }
  </style>
  