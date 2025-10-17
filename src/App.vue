<template>
  <v-app id="app-root">
    <!-- Sidebar -->
    <the-drawer v-if="!isVendorPanel"></the-drawer>

    <!-- Main content -->
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import TheDrawer from "./components/TheDrawer.vue";

export default {
  name: 'App',
  components: { TheDrawer },
  data: () => ({}),
  computed: {
    isVendorPanel() {
      return (this.$route.path.includes('vendorPanel')||this.$route.path.includes('vendorpanel')||this.$route.path.includes('VendorPanel'));
    },
    isPublic() {
      return this.$route.path.includes('club');
    }
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.onUnload);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.onUnload);
  },
  methods: {
    onUnload() {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('userId');
      window.localStorage.removeItem('userEmail');
      window.localStorage.removeItem('userRole');
    }
  },
  created() {
    this.$store.dispatch('initUser');
  }
};
</script>

<style>
/* 1️⃣ تعریف فونت Iranyekan */
@font-face {
  font-family: 'iranyekan';
  font-style: normal;
  font-weight: normal;
  font-display: swap;
  src: url('./assets/fonts/iranyekan/eot/iranyekanwebregular(fanum).eot');
  src: url('./assets/fonts/iranyekan/eot/iranyekanwebregular(fanum).eot?#iefix') format('embedded-opentype'),
       url('./assets/fonts/iranyekan/woff2/iranyekanwebregular(fanum).woff2') format('woff2'),
       url('./assets/fonts/iranyekan/ttf/iranyekanwebregular(fanum).ttf') format('truetype');
}

/* 2️⃣ اعمال فونت روی کل اپ */
html, body, #app-root, .v-application, .v-application * {
  font-family: 'iranyekan', sans-serif !important;
}

/* 3️⃣ تنظیمات پایه برای اپ */
body {
  margin: 0;
  background-color: #f5f5f5;
}

/* 4️⃣ مطمئن شدن از وراثت فونت برای کامپوننت‌های Vuetify */
.v-btn, .v-tab, .v-list-item, .v-card, .v-input, .v-select, .v-text-field {
  font-family: 'iranyekan', sans-serif !important;
}
</style>
