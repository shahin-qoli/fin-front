<template>
  <div class="card-grid">
    <!-- 🟢 کارت ساخت Shipment جدید -->
    <v-card
      class="order-card create-card"
      elevation="8"
      rounded="xl"
      @click="openCreateDialog"
    >
      <v-card-text class="text-center py-8">
        <v-icon size="56" class="mb-3">mdi-truck-plus</v-icon>

        <div >برای ایجاد حمل جدید کلیک کنید</div>
      </v-card-text>
    </v-card>

    <!-- 🔵 کارت‌های Shipment -->
    <v-card
      v-for="(item, i) in shipments"
      :key="i"
      class="order-card shipment-card"
      elevation="8"
      rounded="xl"
    >
      <v-card-text class="py-6">
        <div class="text-h6 font-weight-bold mb-2 d-flex align-center justify-center">
          <v-icon left small class="mr-1">mdi-truck-delivery</v-icon>
          شناسه حمل: {{ item.id }}
        </div>

        <v-divider class="my-3" color="white"></v-divider>

        <div class="text-body-2 text-center">
          <div>
            <v-icon left small class="mr-1">mdi-calendar</v-icon>
            تاریخ: {{ formatDate(item.created_at) }}
          </div>

          <div class="mt-2">
            <v-icon left small class="mr-1">mdi-package-variant</v-icon>
            تعداد اقلام: {{ item.line_items?.length || 0 }}
          </div>

          <div class="mt-2">
            <v-icon left small class="mr-1">mdi-account</v-icon>
            مسئول: {{ item.user?.name || 'نامشخص' }}
          </div>
        </div>
      </v-card-text>

      <v-divider color="rgba(255,255,255,0.3)"></v-divider>

      <v-card-actions class="justify-center py-4">
        <v-btn
          color="white"
          text
          class="rounded-pill px-6"
          @click="$emit('open-shipment-details', item)"
        >
          <v-icon left small>mdi-eye</v-icon>
          مشاهده جزئیات
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    lineItems: { type: Array, required: true },
    shipments: { type: Array, required: true },
  },
  methods: {
    openCreateDialog() {
      this.$emit('open-create-transfer-dialog');
    },
    formatDate(date) {
      if (!date) return 'نامشخص';
      const d = new Date(date);
      return d.toLocaleDateString('fa-IR');
    },
  },
};
</script>
<style scoped>
/* 🧩 Layout grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  grid-gap: 20px;
  justify-content: center;
  padding: 24px 16px 16px 16px; /* فاصله از بالا و اطراف */
}

/* 💳 کارت پایه */
.order-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 16px;
  min-height: 150px; /* جمع و جورتر */
  padding: 12px; /* padding داخلی کمتر */
}
.order-card:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 🟢 کارت ایجاد جدید */
.create-card {
  background: linear-gradient(135deg, #43a047, #66bb6a);
  cursor: pointer;
  text-align: center;
  padding: 16px;
}
.create-card:hover {
  background: linear-gradient(135deg, #2e7d32, #43a047);
}
.create-card .v-icon {
  font-size: 40px;
}
.create-card .text-h6 {
  margin-top: 6px;
  font-size: 1rem;
}

/* 🔵 کارت Shipment */
.shipment-card {
  background: linear-gradient(135deg, #3949ab, #5c6bc0);
}
.shipment-card .v-card-text {
  padding: 12px;
}
.shipment-card .v-card-actions {
  padding: 6px 12px;
}

/* 🧠 واکنش‌گرا */
@media (max-width: 600px) {
  .order-card {
    min-height: 140px;
  }
  .card-grid {
    grid-gap: 12px;
    padding-top: 16px;
  }
}
</style>

