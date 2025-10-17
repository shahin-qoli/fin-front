<template>
  <v-container class="py-10">
    <v-card class="pt-16 pb-8 px-4">

      <!-- انیمیشن فلیپ -->
      <transition name="flip" mode="out-in">
        <div v-if="!showDetails" key="list">
          <h2 class="text-center mb-10 ">لیست سفارش‌ها</h2>

          <div class="card-grid">
            <v-card
              v-for="(item, i) in orders"
              :key="i"
              class="order-card"
              elevation="5"
              rounded="xl"
            >
              <v-card-text class="order-content">
                <!-- هدر سفارش -->
                <div class="order-header">
                  <span>سفارش #{{ item.number }}</span>
                </div>

                <v-divider class="my-3"></v-divider>

                <!-- اطلاعات سفارش -->
                <div class="order-info">
                  <div class="info-row">
                    <span class="label">نام مشتری:</span>
                    <span class="value">{{ item.user.fi_name }} {{ item.user.la_name }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">مبلغ کل:</span>
                    <span class="value">{{ formatAmount(item.total) }} ریال</span>
                  </div>
                  <div class="info-row">
                    <span class="label">تاریخ تکمیل:</span>
                    <span class="value">{{ formatDate(item.completed_at) }}</span>
                  </div>
                </div>
              </v-card-text>

              <!-- دکمه جزئیات -->
              <v-card-actions class="justify-center mt-4">
                <v-btn
                  color="cyan darken-1"
                  variant="elevated"
                  class="text-white rounded-pill px-6 font-weight-bold"
                  @click="goToOrder(item)"
                >
                  دیدن جزئیات
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>

        <!-- جزئیات سفارش -->
        <div v-else key="details" class="details-wrapper">
          <MainOrder
            :order="selectedOrder"
            @back="backToList"
          />
        </div>
      </transition>
    </v-card>
    <TheLoader
    :visible="isLoading"
    ></TheLoader>
  </v-container>
</template>

<script>
import TheLoader from '@/components/TheLoader.vue';
import MainOrder from './_mainOrder.vue';
import jalaali from 'jalaali-js';

export default {
  components: { MainOrder,TheLoader },
  data() {
    return {
      options: { page: 1, itemsPerPage: 10, orderState: 'complete' },
      showDetails: false,
      selectedOrder: null,
      isLoading: false,
    };
  },
  computed: {
    orders() {
      return this.$store.getters.getMVOrders || [];
    },
  },
  methods: {
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
    loadOrders() {
      this.isLoading= true
      this.$store.dispatch('loadMVOrders', this.options).then(()=> this.isLoading = false);
    },
    goToOrder(order) {
      this.selectedOrder = order;
      this.showDetails = true;
    },
    backToList() {
      this.showDetails = false;
    },
  },
  created() {
    this.loadOrders();
  },
};
</script>

<style scoped>
/* Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  justify-content: center;
  padding: 0 16px;
}

/* کارت سفارش روشن و مدرن */
.order-card {
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
  color: #004d40;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  border-radius: 16px;
}
.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* محتوای کارت */
.order-content {
  padding: 20px;
}

/* هدر سفارش */
.order-header {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
}

/* اطلاعات سفارش */
.order-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}
.label {
  opacity: 0.7;
}
.value {
  font-weight: 600;
}

/* دکمه جزئیات */
.v-btn {
  transition: all 0.25s ease;
}
.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 77, 64, 0.3);
}

/* انیمیشن فلیپ */
.flip-enter-active,
.flip-leave-active {
  transition: transform 0.8s;
  transform-style: preserve-3d;
}
.flip-enter-from {
  transform: rotateY(-180deg);
  opacity: 0;
}
.flip-leave-to {
  transform: rotateY(180deg);
  opacity: 0;
}

/* جزئیات */
.details-wrapper {
  animation: fadeIn 0.6s ease-in-out;
}

/* fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
