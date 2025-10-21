<template>
  <v-app>
    <!-- 🟣 هدر اصلی -->
    <v-app-bar
      app
      color="deep-purple accent-4"
      dark
      elevation="4"
    >
      <v-toolbar-title class="font-bold ml-4">تامین می‌ارزه!</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- تب‌های بالای صفحه -->
      <v-tabs v-model="tab" align-with-title>
        <v-tab><v-icon left>mdi-cart-outline</v-icon> سفارش‌ها</v-tab>
        <v-tab><v-icon left>mdi-truck-delivery-outline</v-icon> حمل و نقل</v-tab>
        <v-tab><v-icon left>mdi-clipboard-list-outline</v-icon> خطوط فاکتور</v-tab>
      </v-tabs>

      <v-spacer></v-spacer>

      <!-- دکمه خروج -->
      <v-btn dark color="green" @click="exitUser" class="mx-2" rounded>
        خروج از سامانه
      </v-btn>
    </v-app-bar>

    <!-- 🧾 محتوای تب‌ها -->
    <v-main class="grey lighten-4">
      <v-container fluid class="pa-4" style="min-height: 100vh; overflow-y: auto;">
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card flat class="pa-4 rounded-xl elevation-2">
              <MainPage />
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat class="pa-4 rounded-xl elevation-2">
              <MainShipments />
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat class="pa-4 rounded-xl elevation-2">
              <LineItemList />
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MainPage from './OrderList.vue';
import MainShipments from './MainShipments.vue';
import LineItemList from './lineItem/LineItemList.vue';

export default {
  components: { MainPage, MainShipments, LineItemList },
  data() {
    return {
      tab: 0, // اندیس تب فعال
    };
  },
  methods: {
    exitUser() {
      this.$store.dispatch('cleanUser');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.v-application {
  font-family: "iranyekan", sans-serif !important;
}

.v-toolbar-title {
  font-weight: 700;
  font-size: 18px;
}

.v-tab {
  font-weight: 500;
  color: white !important;
}

.v-main {
  background-color: #f5f5f5;
}

.v-card {
  background-color: white;
}

.v-btn {
  font-family: inherit;
  text-transform: none;
}
</style>
