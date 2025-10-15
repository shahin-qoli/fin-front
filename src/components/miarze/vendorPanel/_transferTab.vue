<template>
        <v-row dense>
          <div class="card-grid">
            <!-- ✅ کارت ساخت Shipment جدید -->
      <v-card
        class="order-card create-card"
        elevation="10"
        rounded="xl"
        @click="openCreateDialog"
      >
        <v-card-text class="text-center">
          <v-icon size="48" class="mb-2">mdi-plus-circle-outline</v-icon>
          <div class="text-h6 font-weight-bold">ایجاد حمل و نقل جدید</div>
        </v-card-text>
      </v-card>
            <v-card
              v-for="(item, i) in shipments"
              :key="i"
              class="order-card"
              elevation="10"
              rounded="xl"
            >
              <v-card-text class="text-center text-h6 font-weight-bold">
                شماره سفارش: {{ item.id }}
              </v-card-text>
  
              <v-divider></v-divider>

            </v-card>
          </div>
        </v-row>
    </template>
    <script>
    export default {
        props: {
        lineItems: { type: Array, required: true },
        shipments:{ type: Array, required: true },
    },
    data(){
      return {
   
      }
    },
    computed: {

},
methods:{
  openCreateDialog(){
    this.$emit('open-create-transfer-dialog')
  }
}

    }
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

/* 🎨 استایل مخصوص کارت ساخت جدید */
.create-card {
  background: linear-gradient(135deg, #43a047, #66bb6a);
  cursor: pointer;
}
.create-card:hover {
  background: linear-gradient(135deg, #2e7d32, #43a047);
}
</style>
