<template>
  <!-- dir="rtl" برای راست‌چین کامل -->
  <v-app id="app" dir="rtl">
    <!-- نوار بالا: تب‌ها + عنوان + دکمه خروج (همه در هدر) -->
    <v-app-bar
      app
      color="deep-purple accent-4"
      dark
      elevation="4"
      dense
    >
      <!-- عنوان را اینجا قرار دادیم — در RTL با dir روی v-app این سمت راست قرار می‌گیرد -->
      <v-toolbar-title class="title-text">تامین می‌ارزه!</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- تب‌ها داخل هدر (مثل خواستهٔ شما) -->
      <v-tabs
        v-model="tab"
        background-color="transparent"
        grow
        slider-color="yellow"
        class="tabs-in-header"
      >
        <v-tab><v-icon left>mdi-cart-outline</v-icon>سفارش‌ها</v-tab>
        <v-tab><v-icon left>mdi-truck-delivery-outline</v-icon>حمل و نقل</v-tab>
        <v-tab><v-icon left>mdi-clipboard-list-outline</v-icon>خطوط فاکتور</v-tab>
      </v-tabs>

      <v-spacer></v-spacer>

      <!-- دکمه خروج -->
      <v-btn dark color="green" @click="exitUser" class="mx-2" rounded>
        خروج از سامانه
      </v-btn>
    </v-app-bar>

    <!-- محتوای تب‌ها بیرون از app-bar تا اسکرول کار کند -->
    <v-main class="page-bg">
      <v-container fluid class="pa-4 full-height">
        <v-tabs-items v-model="tab" class="mt-4">
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
  name: 'VendorPanelMain',
  components: { MainPage, MainShipments, LineItemList },
  data() {
    return {
      tab: 0, // اندیس تب فعال
    };
  },
  methods: {
    async exitUser() {
      await this.$store.dispatch('cleanUser');;
  const router = require('@/router').default;
  
  // جلوگیری از برخورد گاردها
  router.replace({ path: '/login' }).catch(() => {});
}

  },
};
</script>

<style scoped>
/* فونت سراسری برای این کامپوننت (اگر در جای دیگر هم قرار است باشد، بهتر در main.css/ index.css قرار بدی) */
.v-application {
  font-family: "iranyekan", sans-serif !important;
}

/* عنوان هدر */
.title-text {
  font-weight: 700;
  font-size: 18px;
  /* فاصلهٔ مناسب کناری برای زیبایی */
  margin-right: 8px;
}

/* محل تب‌ها داخل هدر — کوچک و جمع و جور */
.tabs-in-header {
  max-width: 680px; /* جلوگیری از فشرده شدن بیش از حد عنوان */
}

/* رنگ زمینهٔ کلی صفحه و ارتفاع که محتوا قابل اسکرول باشه */
.page-bg {
  background-color: #f5f5f5;
}

/* کانتینر محتوا را طوری تنظیم می‌کنیم که فضای لازم برای اسکرول داشته باشد */
.full-height {
  min-height: calc(100vh - 64px - 48px); /* کسر فضای header + tabs (تقریبی) */
  overflow-y: auto;
}

/* ظاهرسازی کارت‌ها */
.v-card {
  background-color: #ffffff;
}

/* دکمه‌ها خواناتر شوند */
.v-btn {
  font-family: inherit;
  text-transform: none;
}

/* اطمینان از نمایش مناسب در موبایل */
@media (max-width: 960px) {
  .tabs-in-header {
    max-width: 360px;
  }
  .title-text {
    font-size: 16px;
  }
}
</style>
