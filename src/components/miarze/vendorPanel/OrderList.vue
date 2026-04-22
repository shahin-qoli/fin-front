<template>
  <v-container class="py-10">
    <v-card class="pt-10 pb-8 px-6">

      <!-- 🔍 فیلترها -->
      <v-card v-if="!isLoading" class="mb-8 px-4 py-4 filter-box" elevation="2" rounded="xl">
        <v-row dense>
          <v-col cols="12" md="3" sm="6">
            <v-text-field
              v-model="filters.number"
              label="شماره سفارش"
              dense
              outlined
              clearable
            />
          </v-col>

          <v-col cols="12" md="3" sm="6">
            <v-text-field
              v-model="filters.customer"
              label="نام خریدار"
              dense
              outlined
              clearable
            />
          </v-col>

          <v-col cols="12" md="3" sm="6">
            <v-text-field
              v-model="filters.amount"
              label="مبلغ"
              type="number"
              dense
              outlined
              clearable
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-btn
                  color="cyan darken-1"
                  class="text-white rounded-pill px-6 font-weight-bold"
                  @click="loadOrders"
                >
                  جستجو
                </v-btn>
          </v-col>

        </v-row>
      </v-card>

      <!-- 🧾 لیست سفارش‌ها -->
      <transition v-if="!isLoading" name="flip" mode="out-in">
        <div v-if="!showDetails" key="list">
          <h2 class="text-center mb-10">لیست سفارش‌ها</h2>

          <div class="card-grid">
            <v-card
              v-for="(item, i) in orders"
              :key="i"
              class="order-card"
              elevation="5"
              rounded="xl"
            >
              <v-card-text class="order-content">
                <div class="order-header">
                  <span>سفارش #{{ item.number }}</span>
                </div>

                <v-divider class="my-3"></v-divider>

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

              <v-card-actions class="justify-center mt-4">
                <v-btn
                  color="cyan darken-1"
                  class="text-white rounded-pill px-6 font-weight-bold"
                  @click="goToOrder(item)"
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

        <!-- جزئیات سفارش -->
        <div v-else key="details" class="details-wrapper">
          <MainOrder :order="selectedOrder" @back="backToList" />
        </div>
      </transition>
    </v-card>

    <TheLoader :visible="isLoading" />
  </v-container>
</template>

<script>
import TheLoader from '@/components/TheLoader.vue';
import MainOrder from './_mainOrder.vue';
import jalaali from 'jalaali-js';
import DatePicker from '../../DatePicker.vue';
export default {
  components: { MainOrder, TheLoader,DatePicker },
  data() {
    return {
      menu: false,
      showDetails: false,
      selectedOrder: null,
      isLoading: false,
      debounceTimer: null,
      options: {
        page: 1,
        itemsPerPage: 9,
      },
      filters: {
        number: '',
        customer: '',
        amount: '',
        date: '',
      },
    };
  },
  computed: {
    orders() {
      return this.$store.getters.getMVOrders || [];
    },
    itemCount() {
      return this.$store.getters.getMVOrdersItemCount;
    },
    pageCount(){
      return Math.ceil(this.itemCount / this.options.itemsPerPage);

    }
    
  },
  watch: {
    // واکنش به فیلترها
    // filters: {
    //   handler() {
    //     this.options.page = 1; // هر بار فیلتر تغییر کرد برگرد صفحه اول
    //     this.debounce(this.loadOrders, 500);
    //   },
    //   deep: true,
    // },

    // واکنش به تغییر صفحه
    'options.page': {
      handler() {
        this.loadOrders();
      },
    },
  },
  methods: {
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
      this.isLoading = true;
      const payload = {
        ...this.options,
        ...this.filters,
      };
      try {
       await this.$store.dispatch('loadMVOrders', payload);
      } finally { 
        this.isLoading = false;
      }
    },
    goToOrder(order) {
      this.selectedOrder = order;
      this.showDetails = true;
    },
    backToList() {
      this.loadOrders()
      this.showDetails = false;
    },
  },
  created() {
    this.loadOrders();
  },
};
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
