<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        v-for="(item, i) in lineItems"
        :key="i"
        cols="12"
      >
        <v-card
          elevation="10"
          class="order-line-card d-flex align-center justify-space-between rounded-xl overflow-hidden"
          height="200"
        >
          <!-- 🔹 بخش راست: عکس و نام محصول -->
          <div class="d-flex align-center px-4 py-2" style="width: 45%;">
            <v-img
              :src="getImageUrl(item.variant)"
              height="120"
              width="120"
              class="rounded-lg me-4"
              cover
            ></v-img>

            <div class="d-flex flex-column">
              <span class="text-h6 font-weight-bold">
                {{ item.variant.name }}
              </span>
              <span class="text-body-2 text-grey-darken-1 mt-1">
                {{ item.variant.sku || 'بدون کد' }}
              </span>
              <span class="text-body-2 text-grey-darken-1 mt-1">
               تعداد: {{ item.quantity || 'بدون کد' }}
              </span>
              <span class="text-body-2 text-grey-darken-1 mt-1">
               قیمت واحد: {{ item.price || 'بدون کد' }}
              </span>

            </div>
          </div>

          <!-- 🔹 بخش چپ: وضعیت و اکشن‌ها -->
          <div
            class="left-panel d-flex flex-column justify-space-between pa-4"
            style="width: 55%; background-color: #f8fafc;"
          >
            <!-- 🔸 وضعیت تامین -->
            <div class="d-flex flex-wrap align-start mb-4">

  <v-chip
    :color="getStatusColor(item.vendor_line_item.vending_state)"
    variant="flat"
    class="custom-chip"
  >
    وضعیت تأمین: {{ item.vendor_line_item.vending_state || 'در انتظار تخصیص تأمین‌کننده' }}
  </v-chip>
  <v-chip
    :color="getStatusColor(item.vendor_line_item.delivery_state)"
    variant="flat"
    class="custom-chip"
  >
  وضعیت خرید: {{ item.vendor_line_item.purchase_state || 'نامشخص' }}
  </v-chip>
  <v-chip
    :color="getStatusColor(item.vendor_line_item.delivery_state)"
    variant="flat"
    class="custom-chip"
  >
    وضعیت ارسال: {{ item.vendor_line_item.delivery_state || 'نامشخص' }}
  </v-chip>

  <v-chip
    color="green"
    variant="flat"
    class="custom-chip"
  >
    تامین کننده: {{ item.vendor_line_item.vendor?.name || 'نامشخص' }}
  </v-chip>
  <v-chip
    :color="getStatusColor(item.vendor_line_item.delivery_state)"
    variant="flat"
    class="custom-chip"
  >
    روش ارسال: {{ item.vendor_line_item.delivery_type || 'نامشخص' }}
  </v-chip>
</div>


            <!-- 🔸 اکشن‌ها -->
            <div class="d-flex justify-space-around align-center mt-auto">
              <v-btn
          color="success"
          size="small"
        rounded
          width="45%"
          prepend-icon="mdi-account-plus"
          @click="openAssignDialog(item)"
          >
            تخصیص تأمین‌کننده
          </v-btn>

          <v-btn
          color="orange"
          size="small"
        rounded
          width="45%"
          prepend-icon="mdi-account-plus"
          @click="openDeliveryMeanDialog(item)"
          >
          تعیین روش ارسال
          </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
    emits: ['open-assign-dialog',
        'open-delivery-mean-dialog'
    ],
    props: {
        lineItems: { type: Array, required: true },
    },
    methods:{
        openAssignDialog(item){
            this.$emit('open-assign-dialog', item)
        },
        openDeliveryMeanDialog(item){
            this.$emit('open-delivery-mean-dialog', item)
        },
        getStatusColor(status) {
    switch (status) {

      case 'no_purchase':
        return 'grey';
        case 'no_need_purchase':
        return 'green';
        case 'purchasing':
        return 'yellow';
        case 'purchased':
        return 'green'; 

      case 'no_vendor':
        return 'grey';
        case 'has_vendor':
        return 'green';
        case 'in_stock':
        return 'green';
        case 'burux_vendor':
        return 'green';  
        
        
      case 'no_delivery':
        return 'grey';
      case 'in_vendor_stock':
        return 'orange';
      case 'in_base_stock':
        return 'yellow';
      case 'delivered':
        return 'green';
        case 'in_warehouse_stock':
          return 'yellow'
      default:
        return 'blue-grey';
    }
  },
  generateUrl(url) {
      if (!url) return ""
      return `http://192.168.192.129:4500${url}`
    },
    getImageUrl(variant) {
      if (!variant?.images?.length) return "/logo.png"

      // Find the style with width = "128"
      const image = variant.images[0].styles.find(
        s => s.width === "128"
      )

      return this.generateUrl(image?.url || variant.images[0].styles[0].url)
    },
    }
}
</script>