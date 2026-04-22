<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        v-for="(item, i) in lineItems"
        :key="i"
        cols="12"
      >
        <v-card
          elevation="8"
          class="order-line-card d-flex flex-wrap align-start rounded-xl overflow-hidden"
        >
          <!-- 🔹 بخش راست: عکس و اطلاعات کالا -->
          <div class="d-flex align-center pa-4 product-section">
            <v-img
              :src="getImageUrl(item.variant)"
              height="110"
              width="110"
              class="rounded-lg mr-4"
              contain
            ></v-img>

            <div class="d-flex flex-column justify-center">
              <div class="mb-1">
                {{ item.variant.name }}
              </div>
              <div class=" grey--text">
                کد کالا: {{ item.variant.sku || 'ندارد' }}
              </div>
              <div class=" grey--text">
                تعداد: <strong>{{ item.quantity }}</strong>
              </div>
              <div class=" grey--text">
                قیمت فروش: <strong>{{ formatNumber(item.price) }} ریال</strong>
              </div>
              <div class=" grey--text">
                قیمت تأمین‌کننده:
                <strong>{{ formatNumber(item.vendor_line_item.vendor_price) }} ریال</strong>
              </div>
            </div>
          </div>

<!-- 🔹 بخش چپ: وضعیت‌ها و دکمه‌ها -->
<div class="left-panel d-flex flex-column">
  <!-- چیپ‌ها -->
  <div class="chip-wrapper mb-4">
    <v-chip
      v-for="(chip, index) in getChips(item)"
      :key="index"
      :color="chip.color"
      small
      text-color="white"
      class="custom-chip"
    >
      {{ chip.label }}
    </v-chip>
  </div>

  <!-- دکمه‌ها در باکس جدا با تمایز واضح -->
  <v-sheet class="button-box mt-auto pa-3" elevation="3" rounded>
    <v-row dense>
      <v-col cols="6">
        <v-btn
          color="lime"
          small
          rounded
          block
          @click="openVendingTypeDialog(item)"
        >
          <v-icon left small>mdi-truck</v-icon>
          تعیین روش تامین
        </v-btn>
      </v-col>      
      <v-col cols="6">
        <v-btn
        v-if="!isVendingByB360(item)"
          color="primary"
          small
          rounded
          block
          @click="openAssignDialog(item)"
        >
          <v-icon left small>mdi-account-plus</v-icon>
          تخصیص تأمین‌کننده
        </v-btn>
      </v-col>

      <v-col cols="6">
        <v-btn
        v-if="hasValidVending(item)"
          color="secondary"
          small
          rounded
          block
          @click="openDeliveryMeanDialog(item)"
        >
          <v-icon left small>mdi-truck</v-icon>
          تعیین روش ارسال
        </v-btn>
      </v-col>

    </v-row>
  </v-sheet>
</div>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  emits: ['open-assign-dialog', 'open-delivery-mean-dialog','open-vending-type-dialog'],
  props: {
    lineItems: { type: Array, required: true },
  },
  methods: {
    openAssignDialog(item) {
      this.$emit('open-assign-dialog', item);
    },
    openDeliveryMeanDialog(item) {
      this.$emit('open-delivery-mean-dialog', item);
    },
    formatNumber(num) {
      if (!num) return '0';
      return Number(num).toLocaleString('fa-IR');
    },
    getChips(item) {
      return [
        {
          label: `روش تامین: ${this.formatStateText(item.vendor_line_item.vending_type).text}`,
          color: this.getStatusColor(item.vendor_line_item.vending_type),
        },
        // {
        //   label: `خرید: ${this.formatStateText(item.vendor_line_item.purchase_state).text}`,
        //   color: this.getStatusColor(item.vendor_line_item.purchase_state),
        // },
        {
          label: `ارسال: ${this.formatStateText(item.vendor_line_item.delivery_state).text}`,
          color: this.getStatusColor(item.vendor_line_item.delivery_state),
        },
        {
          label: `تأمین‌کننده: ${item.vendor_line_item.vendor?.name || 'نامشخص'}`,
          color: 'green',
        },
        {
          label: `روش ارسال: ${this.formatStateText(item.vendor_line_item.delivery_type).text || 'نامشخص'}`,
          color: 'blue',
        },
      ];
    },
    formatStateText(text) {
 
      const states = {
        unknown_vending: { color: 'red', text: 'نامشخص' },
        burux_vending: { color: 'green', text: "تامین بروکس" },
        "360_vending": { color: 'green', text: "تامین 360" },
        sure_vendor_vending: { color: 'green', text: "تامین کننده خارجی قطعی" },
        risky_vendor_vendong: { color: 'orange', text: "تامین کننده خارجی ریسکی" },
        negotiable_vendor_vending: { color: 'yellow', text: "تامین کننده خارجی نیاز به مذاکره" },
        unknown_vending: { color: 'red', text: 'نامشخص' },
        no_purchase: { color: 'grey', text: 'خرید نشده' },
        no_need_purchase: { color: 'green', text: 'عدم نیاز' },
        purchasing: { color: 'orange', text: 'در حال خرید' },
        purchased: { color: 'green', text: 'انجام شده' },
        no_vendor: { color: 'grey', text: 'بدون تأمین‌کننده' },
        has_vendor: { color: 'green', text: 'تأمین‌کننده دارد' },
        in_stock: { color: 'green', text: 'در انبار' },
        burux_vendor: { color: 'teal', text: 'تأمین بروکس' },
        no_delivery: { color: 'grey', text: 'ارسال نشده' },
        in_vendor_stock: { color: 'orange', text: 'نزد تأمین‌کننده' },
        in_base_stock: { color: 'yellow darken-2', text: 'در پایگاه' },
        delivered: { color: 'green', text: 'تحویل شده' },
        unknown: { color: 'grey', text: 'نامشخص' },
        vendor_to_base_to_customer: { color: 'green', text: "مشتری → پایگاه → تأمین‌کننده" },
        vendor_to_customer: { color: 'green', text: "مشتری → تأمین‌کننده" },
        warehouse_to_base_to_customer: { color: 'green', text: "مشتری → پایگاه → انبار" },
        warehouse_to_customer: { color: 'green', text:  "مشتری → انبار" },
        base_to_customer: { color: 'green', text:"مشتری → پایگاه" },
  
      
      };
      return states[text] || { color: 'grey', text: 'نامشخص' };
    },
    getStatusColor(state) {
      return this.formatStateText(state).color || 'grey';
    },
    generateUrl(url) {
      if (!url) return '';
      return `https://shopback.miarze.com${url}`;
    },
    getImageUrl(variant) {
      if (!variant?.images?.length) return '/logo.png';
      const image = variant.images[0].styles.find((s) => s.width === '128');
      return this.generateUrl(image?.url || variant.images[0].styles[0].url);
    },
    openVendingTypeDialog(item){
      this.$emit('open-vending-type-dialog', item);
    },
    isVendingByB360(item){
      return (item.vendor_line_item.vending_type ==="burux_vending" || item.vendor_line_item.vending_type ==="360_vending" )
    },
    hasValidVending(item){
      console.log(item)
      return !(item.vendor_line_item.vending_type ==="unknown_vending" )
    }
  },computed:{

  }
};
</script>
<style scoped>
.order-line-card {
  display: flex;
  flex-wrap: wrap;
  background-color: #fafafa;
  transition: all 0.3s ease;
}
.order-line-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.product-section {
  flex: 1 1 45%;
  border-left: 1px solid #eee;
}

.left-panel {
  flex: 1 1 55%;
  background-color: #f8fafc;
}

.chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.custom-chip {
  margin: 4px 4px 0 0;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 12px;
}

/* واکنش‌گرا */
@media (max-width: 960px) {
  .order-line-card {
    flex-direction: column;
  }
  .product-section,
  .left-panel {
    flex: 1 1 100%;
    border-left: none;
  }
}
.left-panel {
  flex: 1 1 55%;
  display: flex;
  flex-direction: column;
  background-color: #f3f6fa; /* روشن‌تر از محصول */
  border-left: 1px solid #dce1e6; /* حاشیه جداکننده */
  padding: 16px;
}

.chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.custom-chip {
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 14px;
}

/* باکس دکمه‌ها */
.button-box {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.button-box .v-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.button-box .v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

/* واکنش‌گرا */
@media (max-width: 960px) {
  .left-panel {
    flex: 1 1 100%;
    border-left: none;
  }
}

</style>
