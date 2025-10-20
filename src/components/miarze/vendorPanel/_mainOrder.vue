<template>
  <v-container>
    <transition name="zoom-fade">
      <v-card
        v-if="order"
        elevation="12"
        class="main-order-card rounded-xl overflow-hidden"
      >
        <!-- 🔹 Toolbar بالا -->
        <v-toolbar
          flat
          color="primary"
          dark
          class="d-flex justify-space-between align-center"
        >
          <v-toolbar-title >
            جزئیات سفارش شماره {{ order.number }}
          </v-toolbar-title>
  
          <v-btn
            color="orange"
            variant="text"
            class="text-primary rounded-pill"
            @click="$emit('back')"
          >
            <v-icon left>mdi-arrow-right</v-icon>
            بازگشت
          </v-btn>
        </v-toolbar>
  
        <!-- 🔹 تب‌ها -->
        <v-tabs v-model="tab" vertical right class="main-tabs">
          <v-tab>
            <v-icon left>mdi-information</v-icon>
          تامین کننده
          </v-tab>
          <v-tab>
            <v-icon left>mdi-package-variant</v-icon>
            حمل و نقل
          </v-tab>

<!-- 🔸 تب اول -->
<v-tab-item>
<VendingTab
:lineItems="reactiveLineItems"
  @open-assign-dialog="handleOpenAssignDialog"
  @open-delivery-mean-dialog="handleOpenDeliveryMeanDialog"

></VendingTab>
</v-tab-item>
          <!-- 🔸 تب دوم -->
          <v-tab-item>
            <TransferTab
            :shipments="reactiveShipments"
            @open-create-transfer-dialog="handleOpenCreateTransferDialog"
            @open-shipment-detail="handleOpenShipmentDetail"
            ></TransferTab>
          </v-tab-item>
          

        </v-tabs>
      </v-card>
    </transition>
    <shipment-detail
      v-model="shipmentDetailDialog"
      :shipment="selectedShipment"
    />
    <!-- 🔹 دیالوگ تخصیص تامین‌کننده -->
    <AssignSupplierDialog
  :value="assignDialog"
  :item="selectedItem"
  @assigned="handleSupplierAssigned"
  @input="assignDialog = $event"
/>
<DeliveryMeanDialog
  :value="deliveryMeanDialog"
  :item="selectedItem"
  @assigned="handleDeliveryMeanAssigned"
  @input="deliveryMeanDialog = $event"
/>

<CreateShipmentDialog
:value="createTransferDialog"
  :lineItems="reactiveLineItems"
  @create-transfer="handleCreateTransfer"
  @input="createTransferDialog = $event"/>
  <TheLoader
    :visible="isLoading"
    ></TheLoader>
    <OperationResult
      :visible="operationResult.visible"
      :type="operationResult.type"
      :message="operationResult.message"
      @close="closeOperationResult"
    />
  </v-container>
  </template>
  
  <script>
import AssignSupplierDialog from './_assignSupplierDialog.vue';
import DeliveryMeanDialog from './_assignDeliveryMeanDialog.vue';
import CreateShipmentDialog from './_createShipmentDialog.vue';
import VendingTab from './_vendingTab.vue'
import TransferTab from './_transferTab.vue'
import TheLoader from '@/components/TheLoader.vue';
import OperationResult from '@/components/OperationResult.vue';
import ShipmentDetail from './_shipmentDetail.vue';
  export default {
    components: {CreateShipmentDialog, AssignSupplierDialog,
      DeliveryMeanDialog,VendingTab,TransferTab,TheLoader,OperationResult,ShipmentDetail },

    props: {
      order: { type: Object, required: true },
    },
    data() {
      return {
        tab: 0,
        createTransferDialog: false,
        shipmentDetailDialog: false,
        assignDialog: false,
        selectedItem: null,
        selectedShipment:null,
        deliveryMeanDialog: false,
        isLoading: false,
        operationResult:{
          visible: false,
          type:"",
          message:""
        }
      };
    },
    computed:{
      reactiveLineItems() {
    // دریافت نسخه به‌روز از store
    const order = this.$store.getters.getMVOrders.find(o => o.number === this.order.number);
    return order ? order.line_items : [];
  },reactiveShipments(){
    const order = this.$store.getters.getMVOrders.find(o => o.number === this.order.number);
    return order ? order.related_vendor_line_item_shipments : [];
  },
        lineItems(){
          return this.order.line_items

        }
      },
      
    methods: {
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
      handleOpenCreateTransferDialog(){
        this.createTransferDialog = true
      },
      handleOpenDeliveryMeanDialog(item){
        this.selectedItem = item;
        this.deliveryMeanDialog = true;
      },
      handleOpenAssignDialog(item) {
      this.selectedItem = item;
      this.assignDialog = true;
    },
    handleDeliveryMeanAssigned(mean){

      this.isLoading = true
        this.$store.dispatch('assignDeliveryMean',mean).then((resp)=> {
          this.isLoading = false
          console.log(resp)
          if (resp[0]){
            this.operationResult={
          visible: true,
          type:"success",
          message:"حمل با موفقیت ایجاد شد"
        }
          }
        else{
          this.operationResult={
          visible: true,
          type:"error",
          message:`خطا در ایجاد حمل:${resp1[1]}`
        }
        }

        });
      // اینجا می‌تونی درخواست API یا آپدیت local بدی
      this.deliveryMeanDialog = false;      
    },
    handleSupplierAssigned(data) {

      this.isLoading = true
        this.$store.dispatch('assignVendorLineItem',data).then((resp)=> {
          this.isLoading = false
         
          if (resp[0]){
            this.operationResult={
          visible: true,
          type:"success",
          message:"سفارش با موفقیت تخصیص داده شد"
        }
          }
        else{
          this.operationResult={
          visible: true,
          type:"error",
          message:`خطا درتخصیص سفارش:${resp1[1]}`
        }
        }

        });
      // اینجا می‌تونی درخواست API یا آپدیت local بدی
      this.assignDialog = false;
    },
    handleOpenShipmentDetail(data){
      this.selectedShipment = data
      console.log("OOOOOOOOOOO")
      console.log(data)
      this.shipmentDetailDialog = true
    },

  getStatusIcon(status) {
    switch (status) {
      case 'در انتظار تخصیص':
        return 'mdi-timer-sand';
      case 'در حال تأمین':
        return 'mdi-truck-fast';
      case 'تأمین شد':
        return 'mdi-check-circle';
      case 'لغو شده':
        return 'mdi-close-circle';
      default:
        return 'mdi-information';
    }
  },


      formatDate(dateStr) {
        if (!dateStr) return "---";
        const date = new Date(dateStr);
        return date.toLocaleDateString("fa-IR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },

    },
  };
  </script>
  
  <style scoped>
  .main-order-card {
    max-width: 1000px;
    margin: 60px auto;
    background-color: #fafafa;
    animation: cardEnter 0.8s ease-in-out;
    border-radius: 20px;
    overflow: hidden;
  }
  
  /* 🔹 تب‌ها */
  .main-tabs {
    min-height: 600px;
    background-color: #fff;
  }
  
  /* 🔹 افکت hover روی آیتم‌ها */
  .hoverable-line {
    background: #f5f7fa;
    transition: all 0.2s ease;
  }
  .hoverable-line:hover {
    background: #e3f2fd;
    transform: scale(1.02);
  }
  .order-line-card {
  width: 100%;
  transition: all 0.25s ease;
}
.order-line-card:hover {
  transform: scale(1.01);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.action-panel {
  border-right: 3px solid #1976d2;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
  
  /* 🔹 افکت انیمیشن ورود */
  @keyframes cardEnter {
    from {
      transform: scale(0.92);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  /* 🔹 انیمیشن zoom + fade */
  .zoom-fade-enter-active {
    transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .zoom-fade-leave-active {
    transition: all 0.6s ease-in-out;
  }
  .zoom-fade-enter-from {
    transform: scale(0.85);
    opacity: 0;
  }
  .zoom-fade-leave-to {
    transform: scale(1.05);
    opacity: 0;
  }
  .order-line-card {
  width: 100%;
  transition: all 0.25s ease;
  background-color: #fff;
}

.order-line-card:hover {
  transform: scale(1.01);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.left-panel {
  border-right: 4px solid #1976d2;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.custom-chip {
  font-family: "iranyekan", sans-serif !important;
  font-weight: 500;
  font-size: 14px;
  height: auto !important;       
  min-height: 32px;              
  line-height: 1.4;              
  padding: 6px 12px !important;  
  white-space: normal !important; 
  margin: 4px 4px 4px 0; /* فاصله بین چیپ‌ها */
  display: inline-flex;           /* کنار هم بدون شکستن layout */
}

  </style>
  