<template>
  <div>
    <!-- 🌐 App Bar -->
    <v-app-bar
      right
      :collapse="!collapseOnScroll"
      :collapse-on-scroll="collapseOnScroll"
      absolute
      color="deep-purple accent-4"
      dark
    >
      <!-- شروع راست‌چین: منوی اصلی -->
      <v-toolbar-title class="ml-4">مدیریت تامین می‌ارزه!</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-tabs right>
        <v-tab> <v-icon left>mdi-cart-outline</v-icon> سفارش‌ها</v-tab>
      <v-tab><v-icon left>mdi-truck-delivery-outline</v-icon> حمل و نقل</v-tab>
        <v-tab-item>
          <MainPage />
        </v-tab-item>
        <v-tab-item>
          <MainShipments />
        </v-tab-item>
      </v-tabs>




      <!-- دکمه خروج -->
      <v-btn dark color="green" @click="exitUser" class="mx-2">
        خروج از سامانه
      </v-btn>
    </v-app-bar>

    <!-- 📝 Main Page -->
  
  
  </div>
</template>

<script>
import MainPage from './OrderList.vue';
import MainShipments from './MainShipments.vue';

export default {
  components: { MainPage,MainShipments },
  data: () => ({
    collapseOnScroll: true,
  }),
  computed: {
    userLoged() {
      return this.$store.getters.isLogged;
    },
  },
  methods: {
    exitUser() {
      this.$store.dispatch('cleanUser');
      this.$router.push('/');
    },
    goTo(pageName) {
  if (this.$route.name !== pageName) {
    this.$router.push({ name: pageName });
  }
  },
}};
</script>

<style scoped>
.v-btn {
  font-weight: 500;
  text-transform: none; /* حروف بزرگ نشه */
}
</style>
