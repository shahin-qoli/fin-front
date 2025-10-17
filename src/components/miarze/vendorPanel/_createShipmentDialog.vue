<template>
  <v-dialog v-model="dialog" max-width="900px" persistent scrollable>
    <v-card rounded="xl" elevation="12">
      <!-- 🔹 Header -->
      <v-card-title class="headline d-flex align-center justify-space-between py-4 px-6">
        <span class="headlineText font-weight-bold">ایجاد حمل و نقل جدید</span>
        <v-btn icon color="grey" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">

        <!-- 🟢 بخش ۱: انتخاب از سفارش -->
        <v-sheet class="section pa-4 mb-6" elevation="2" rounded>
          <div class="section-title">
            <v-icon left color="deep-purple accent-4">mdi-package-variant</v-icon>
            <span>انتخاب از سفارش فعلی</span>
          </div>

          <v-list dense shaped>
            <v-list-item-group v-model="selectedItems" multiple>
              <v-list-item
                v-for="(item, i) in lineItems"
                :key="i"
                :value="item"
                active-class="deep-purple--text text--accent-4"
                class="py-2"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <div class="list-row">
                      <v-list-item-title>{{ item.variant.name }}</v-list-item-title>
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
        </v-sheet>

        <!-- 🟣 بخش ۲: انتخاب نوع عملیات -->
        <v-sheet class="section pa-4 mb-6" elevation="2" rounded>
          <div class="section-title">
            <v-icon left color="deep-purple accent-4">mdi-cog-outline</v-icon>
            <span>انتخاب نوع عملیات</span>
          </div>

          <v-select
            v-model="selectedAction"
            :items="commonActions"
            label="نوع عملیات را انتخاب کنید"
            outlined
            dense
            item-text="text"
            item-value="value"
            hide-details
          ></v-select>
        </v-sheet>

        <!-- 🔵 بخش ۳: انتخاب از سایر سفارشات -->
        <v-sheet class="section pa-4 mb-6" elevation="2" rounded>
          <div class="section-title">
            <v-icon left color="deep-purple accent-4">mdi-cart-outline</v-icon>
            <span>انتخاب از سایر سفارش‌ها (اختیاری)</span>
          </div>

          <div v-if="otherOrderItems.length">
            <v-list dense shaped>
              <v-list-item-group v-model="selectedOtherItems" multiple>
                <v-list-item
                  v-for="(item, i) in otherOrderItems"
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
          </div>
          <div v-else class="text-center text-grey py-6">
            <v-icon large color="grey lighten-1">mdi-tray-alert</v-icon>
            <div class="mt-2">هیچ آیتمی از سایر سفارش‌ها یافت نشد</div>
          </div>
        </v-sheet>

        <!-- 🟡 بخش ۴: خلاصه آیتم‌های انتخاب‌شده -->
        <v-expand-transition>
          <v-sheet
            v-if="allSelectedLineItems.length"
            class="section pa-4 mb-6"
            elevation="2"
            rounded
          >
            <div class="section-title">
              <v-icon left color="deep-purple accent-4">mdi-format-list-bulleted</v-icon>
              <span>آیتم‌های انتخاب‌شده نهایی</span>
            </div>

            <v-list dense>
              <v-list-item
                v-for="(item, i) in allSelectedLineItems"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title>شناسه: {{ item.vendor_line_item_id }}</v-list-item-title>
                  <v-list-item-subtitle>تعداد: {{ item.quantity }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-expand-transition>

        <!-- 🧾 بخش ۵: فرم اطلاعات ارسال -->
        <v-sheet class="section pa-4" elevation="2" rounded>
          <div class="section-title">
            <v-icon left color="deep-purple accent-4">mdi-truck-fast</v-icon>
            <span>اطلاعات حمل و نقل</span>
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
                required
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

      <!-- 🔻 Footer -->
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
import DatePicker from '../../DatePicker.vue';

export default {
  emits:["create-transfer"],
  components: { DatePicker },
  props: {
    value: { type: Boolean, default: false },
    lineItems: { type: Array, required: true },
  },
  data() {
    return {
      dialog: this.value,
      selectedAction: '',
      selectedItems: [],
      selectedOtherItems: [],
      shipment: {
        date: '',
        shipped_by: '',
        shipping_type: '',
        total_cost: '',
        description: '',
        details: [],
        kar: '',
      },
    };
  },
  computed: {
    commonActions() {
    if (!this.selectedItems.length) return [];

    const actionsForSelected = this.selectedItems.map(line =>
      (line.vendor_line_item?.possible_action_bundles || []).map(b => ({
        text: this.formatStateText(b.action).text,
        value: b.action
      }))
    );
      console.log(actionsForSelected)
    return actionsForSelected.reduce(
      (acc, arr) => acc.filter(a => arr.find(x => x.value === a.value)),
      actionsForSelected[0] || []
    );
  },
    otherOrderItems() {
      return [
        ...new Set(
          this.selectedItems
            .flatMap(item => item.vendor_line_item?.possible_action_bundles || [])
            .flatMap(bundle => bundle.bundles || [])
            .flatMap(b => b.other_order || [])
        ),
      ];
    },
    allSelectedLineItems() {
      const fromCurrent = this.selectedItems.map(i => ({
        vendor_line_item_id: i.vendor_line_item.id,
        quantity: i.vendor_line_item.quantity,
      }));
      const fromOther = this.selectedOtherItems.map(line => ({
        vendor_line_item_id: line.id,
        quantity: line.quantity,
      }));
      return [...fromCurrent, ...fromOther];
    },
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit('input', val);
    },
    allSelectedLineItems: {
      handler(newVal) {
        this.shipment.details = newVal;
      },
      deep: true,
      immediate: true,
    },
    selectedAction(newVal) {
      this.shipment.kar = newVal;
    },
  },
  methods: {
    refreshData(){
      
      this.selectedAction= '';
      this.selectedItems= [];
      this. selectedOtherItems= [];
      this.shipment= {
        date: '',
        shipped_by: '',
        shipping_type: '',
        total_cost: '',
        description: '',
        details: [],
        kar: '',
      }
    },
    close() {
      this.refreshData()
      this.dialog = false;
    },
    submitShipment() {
      const payload = { ...this.shipment };
      this.$emit('create-transfer',payload)
      //this.$store.dispatch('createVendorLineItemTransfer', payload);
      this.close();
    },
    formatStateText(text) {
      const states = {
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
        base_to_vendor: { color: 'green', text:"تأمین‌کننده → پایگاه" },
        vendor_to_base: { color: 'green', text:"پایگاه → تأمین‌کننده" },
  
      
      };
      console.log(states[text])
      return states[text] || { color: 'grey', text: 'نامشخص' };
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
  font-family: "iranyekan", sans-serif;
}
</style>
