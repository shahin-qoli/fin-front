<template>
    <v-container class="py-10">
        <v-card class="pt-10 pb-8 px-6">
      <!-- 🔍 فیلترها -->
      <!-- <v-card v-if="!isLoading" class="mb-8 px-4 py-4 filter-box" elevation="2" rounded="xl">
        <v-row dense>
          <v-col cols="12" md="3" sm="6">
            <v-text-field
              v-model="filters.number"
              label="شماره حمل"
              dense
              outlined
              clearable
            />
          </v-col>



        </v-row>
      </v-card> -->
      <!-- دکمه ایجاد حمل جدید -->
<div v-if="!isLoading" class="text-center my-6">
  <v-btn
    color="green darken-1"
    rounded
    large
    @click="handleOpenCreateTransferDialog"
  >
    <v-icon left>mdi-truck-plus</v-icon>
    ایجاد حمل جدید
  </v-btn>
</div>
      <!-- 🧾 لیست حمل ها -->
      <transition v-if="!isLoading" name="flip" mode="out-in">
        <div v-if="!showDetails" key="list">
          <h2 class="text-center mb-10">لیست حمل‌ها</h2>

          <div class="card-grid">
            <v-card
              v-for="(item, i) in shipments"
              :key="i"
              class="order-card"
              elevation="5"
              rounded="xl"
            >
              <v-card-text class="order-content">
                <div class="order-header">
                  <span>حمل #{{ item.id }}</span>
                </div>

                <v-divider class="my-3"></v-divider>

                <div class="order-info">
                  <div class="info-row">
                    <span class="label">نام حمل کننده:</span>
                    <span class="value">{{ item.shipped_by }} </span>
                  </div>
                  <div class="info-row">
                    <span class="label">نوع حمل:</span>
                    <span class="value">{{ item.action }} </span>
                  </div>
                  <div class="info-row">
                    <span class="label">تاریخ تکمیل:</span>
                    <span class="value">{{ formatDate(item.date) }}</span>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions class="justify-center mt-4">
                <v-btn
                  color="cyan darken-1"
                  class="text-white rounded-pill px-6 font-weight-bold"
                  @click="handleOpenShipmentDetail(item)"
                >
                  دیدن جزئیات
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>

          <!-- 📄 صفحه‌بندی -->
          <div class="text-center mt-10">
            <v-pagination
              v-model="options.page"
              :length="pageCount"
              total-visible="7"
              circle
              color="cyan darken-1"
            />
          </div>
        </div>


      </transition>      
    </v-card>
    <CreateShipment
    :value="createTransferDialog"
  @create-transfer="handleCreateTransfer"
  @input="createTransferDialog = $event"/> />
    <TheLoader :visible="isLoading" />
    <OperationResult
      :visible="operationResult.visible"
      :type="operationResult.type"
      :message="operationResult.message"
      @close="closeOperationResult"
    />
    <shipment-detail
      v-model="shipmentDetailDialog"
      :shipment="selectedShipment"
    />
    </v-container>
    
    </template>
    
    <script>
    import ShipmentDetail from './_shipmentDetail.vue';

    import OperationResult from '@/components/OperationResult.vue';
    import jalaali from 'jalaali-js';
    import CreateShipment from './shipment/_createShipment.vue';
    import TheLoader from '@/components/TheLoader.vue';
    export default{
        components: { TheLoader,CreateShipment,OperationResult ,ShipmentDetail},
        data(){
            return{
                selectedShipment:null,
                shipmentDetailDialog: false,
                operationResult:{
          visible: false,
          type:"",
          message:""
        },
                showDetails: false,
                createTransferDialog: false,
                selectedOrder: null,
                isLoading: false,
                debounceTimer: null,
                options:
                 {
                    page: 1,
                    itemsPerPage: 8,
                },
                filters: {
                    number: ''
                },
            }
        },
    computed:{
        shipments(){
            return this.$store.getters.getMVShipments
        },
        itemCount() {
      return this.$store.getters.getMVShipmentsItemCount;
    },
    pageCount(){
      return Math.ceil(this.itemCount / this.options.itemsPerPage);

    }
    },
    methods:{
        handleOpenShipmentDetail(data){
      this.selectedShipment = data
      this.shipmentDetailDialog = true
    },
        closeOperationResult(){
        this.operationResult = {
          visible: false,
          type:"",
          message:""
      }},
        handleCreateTransfer(shipment){
        this.isLoading = true
        this.$store.dispatch('createVendorLineItemTransfer',shipment).then((resp)=> {
          this.isLoading = false
          if (resp[0]){
            this.operationResult={
          visible: true,
          type:"success",
          message:"حمل با موفقیت ایجاد شد"
        }
        this.loadOrders()
          }
        else{
          this.operationResult={
          visible: true,
          type:"error",
          message:`خطا در ایجاد حمل:${resp1[1]}`
        }
        }

        });
      },
        debounce(func, delay) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(func, delay);
    },
    formatAmount(value) {
      if (!value) return '0';
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    formatDate(geoDate) {
      if (!geoDate) return '-';
      const date = new Date(geoDate);
      const jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return `${jdate.jy}/${jdate.jm.toString().padStart(2, '0')}/${jdate.jd.toString().padStart(2, '0')}`;
    },
    async loadOrders() {
        console.log("LEEEEEEEEEEEETS GO")
      this.isLoading = true;
      const payload = {
        ...this.options,
        ...this.filters,
      };
      try {
       await this.$store.dispatch('loadMVShipments', payload);
      } finally { 
        this.isLoading = false;
      }
    },
    goToOrder(order) {
      this.selectedOrder = order;
      this.showDetails = true;
    },
    backToList() {
      this.showDetails = false;
    },
        handleOpenCreateTransferDialog(){
            this.createTransferDialog = true
        },
   
    },
    watch: {
    // واکنش به فیلترها
    filters: {
      handler() {
        this.options.page = 1; // هر بار فیلتر تغییر کرد برگرد صفحه اول
        this.debounce(this.loadOrders, 500);
      },
      deep: true,
    },

    // واکنش به تغییر صفحه
    'options.page': {
      handler() {
        this.loadOrders();
      },
    },

  },   
   created(){
        this.loadOrders();
    },
    activated() {
  // وقتی با <keep-alive> برمی‌گرده
  this.loadOrders();
},

beforeRouteEnter(to, from, next) {
  next(vm => {
    // وقتی وارد صفحه میشه (حتی از back)
    vm.loadOrders();
  });
    }}
    </script>
    <style scoped>
    .filter-box {
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
    }
    
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      justify-content: center;
      padding: 0 16px;
    }
    
    .order-card {
      background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
      color: #004d40;
      transition: all 0.3s ease;
      border-radius: 16px;
    }
    .order-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    </style>
    