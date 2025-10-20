<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card rounded="xl" elevation="10">
      <!-- 🟣 Header -->
      <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
        <div class="d-flex align-center">
          <v-icon color="deep-purple accent-4" class="mr-2">mdi-truck-delivery-outline</v-icon>
          <span class="font-weight-bold text-h6">
            جزئیات حمل شماره {{ shipment?.id || '—' }}
          </span>
        </div>
        <v-btn icon color="grey" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- 🔹 Main Content -->
      <v-card-text class="pa-6" v-if="shipment">
        <!-- اطلاعات کلی -->
        <v-sheet class="section pa-4 mb-6" elevation="2" rounded>
          <div class="section-title mb-4">
            <v-icon left color="deep-purple accent-4">mdi-information-outline</v-icon>
            <span>اطلاعات کلی حمل</span>
          </div>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                :value="formatDate(shipment.created_at)"
                label="تاریخ ایجاد"
                outlined dense readonly
                prepend-inner-icon="mdi-calendar"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                :value="shipment.shipping_type || '-'"
                label="نوع حمل"
                outlined dense readonly
                prepend-inner-icon="mdi-truck"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                :value="shipment.shipped_by || '-'"
                label="نام حمل‌کننده"
                outlined dense readonly
                prepend-inner-icon="mdi-account"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                :value="shipment.total_cost ? shipment.total_cost.toLocaleString('fa-IR') + ' ریال' : '-'"
                label="هزینه حمل"
                outlined dense readonly
                prepend-inner-icon="mdi-currency-usd"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                :value="shipment.description || '-'"
                label="توضیحات"
                outlined dense readonly
                auto-grow rows="2"
                prepend-inner-icon="mdi-note-text-outline"
              />
            </v-col>
          </v-row>
        </v-sheet>

        <!-- 🧾 جزئیات اقلام -->
        <v-sheet class="section pa-4 mb-6" elevation="2" rounded>
          <div class="section-title mb-4">
            <v-icon left color="deep-purple accent-4">mdi-format-list-bulleted</v-icon>
            <span>اقلام ارسال‌شده</span>
          </div>

          <v-simple-table dense>
            <thead>
              <tr>
                <th class="text-right">#</th>
           
                <th class="text-right">نام کالا</th>
                <th class="text-right">تعداد</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in shipment.vendor_line_item_shipment_details || []" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ item?.vendor_line_item?.variant_name || item.variant_name }}</td>
                <td>{{ item.quantity || '-' }}</td>
              </tr>
            </tbody>
          </v-simple-table>

          <div v-if="!shipment.vendor_line_item_shipment_details?.length" class="text-center text-grey py-4">
            <v-icon large color="grey lighten-1">mdi-tray-alert</v-icon>
            <div class="mt-2">هیچ آیتمی در این حمل وجود ندارد</div>
          </div>
        </v-sheet>

        <!-- 👤 اطلاعات مسئول
        <v-sheet class="section pa-4" elevation="2" rounded>
          <div class="section-title mb-2">
            <v-icon left color="deep-purple accent-4">mdi-account-badge-outline</v-icon>
            <span>اطلاعات ثبت‌کننده</span>
          </div>
          <v-list-item>
            <v-list-item-avatar color="deep-purple accent-4">
              <v-icon dark>mdi-account</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ shipment.user?.name || 'نامشخص' }}</v-list-item-title>
              <v-list-item-subtitle>{{ shipment.user?.email || '-' }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-sheet> -->
      </v-card-text>

      <v-card-text v-else class="text-center py-12 grey--text">
        <v-icon large color="grey lighten-1">mdi-truck-delivery-outline</v-icon>
        <div class="mt-2">هیچ اطلاعاتی برای نمایش وجود ندارد</div>
      </v-card-text>

      <!-- 🔻 Footer -->
      <v-divider></v-divider>
      <v-card-actions class="justify-end px-6 py-4">
        <v-btn text color="grey darken-1" @click="close">
          <v-icon left>mdi-close</v-icon>
          بستن
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, default: false },
    shipment: {
      type: Object,
      default: () => ({ line_items: [] }), // ✅ از خطا جلوگیری می‌کند
    },
  },
  data() {
    return {
      dialog: this.value,
    };
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    close() {
      this.dialog = false;
    },
    formatDate(date) {
      if (!date) return "نامشخص";
      const d = new Date(date);
      return d.toLocaleDateString("fa-IR");
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
  font-size: 15px;
}
.headlineText {
  font-family: "iranyekan", sans-serif;
}
</style>
