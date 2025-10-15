<template>
    <v-container class="py-10">
      <!-- انیمیشن فلیپ -->
      <transition name="flip" mode="out-in">
        <div v-if="!showDetails" key="list">
          <h2 class="text-h4 text-center mb-10 font-weight-bold">لیست سفارش‌ها</h2>
  
          <div class="card-grid">
            <v-card
              v-for="(item, i) in orders"
              :key="i"
              class="order-card"
              elevation="10"
              rounded="xl"
            >
              <v-card-text class="text-center text-h6 font-weight-bold">
                شماره سفارش: {{ item.number }}
              </v-card-text>
  
              <v-divider></v-divider>
  
              <v-card-actions class="justify-center mt-4">
                <v-btn
                  color="primary"
                  size="large"
                  class="rounded-pill px-6"
                  @click="goToOrder(item)"
                >
                  دیدن جزئیات
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
  
        <!-- صفحه جزئیات -->
        <div v-else key="details" class="details-wrapper">
          <MainOrder
            :order="selectedOrder"
            @back="backToList"
          />
        </div>
      </transition>
    </v-container>
  </template>
  
  <script>
  import MainOrder from './_mainOrder.vue';
  
  export default {
    components: { MainOrder },
    data() {
      return {
        options: {
          page: 1,
          itemsPerPage: 10,
          orderState: 'complete',
        },
        showDetails: false,
        selectedOrder: null,
      };
    },
    computed: {
      orders() {
        return this.$store.getters.getMVOrders;
      },
    },
    methods: {
      loadOrders() {
        this.$store.dispatch('loadMVOrders', this.options);
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
  /* Layout */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    grid-gap: 24px;
    justify-content: center;
    padding: 0 16px;
  }
  
  /* کارت سفارش */
  .order-card {
    height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(135deg, #1e88e5, #42a5f5);
    color: white;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .order-card:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
  }
  
  /* Flip Animation */
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
  
  /* جزئیات سفارش */
  .details-wrapper {
    animation: fadeIn 0.6s ease-in-out;
  }
  
  /* Fade animation برای جزئیات */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  </style>
  