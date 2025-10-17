<template>
    <transition name="fade">
      <div v-if="visible" class="loader-overlay">
        <div class="loader-content">
          <!-- انیمیشن چرخان -->
          <v-progress-circular
            indeterminate
            size="70"
            width="6"
            color="primary"
            class="mb-6"
          ></v-progress-circular>
  
          <!-- لوگو یا آیکون برند -->
          <div class="loader-logo">
            <v-icon size="48" color="primary">mdi-truck-delivery-outline</v-icon>
          </div>
  
          <!-- پیام -->
          <p class="loader-text">
            {{ text }}
          </p>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: "Loader",
    props: {
      visible: { type: Boolean, default: false },
      text: { type: String, default: "در حال بارگذاری..." },
    },
  };
  </script>
  
  <style scoped>
  /* 🔷 افکت fade برای ورود/خروج */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* 🌀 استایل کلی لودر */
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, #f9fafb 0%, #eef1f6 100%);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    direction: rtl;
    font-family: "iranyekan", sans-serif;
  }
  
  /* ✨ محتوای وسط */
  .loader-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeInUp 0.6s ease;
  }
  
  .loader-logo {
    margin-bottom: 12px;
  }
  
  /* 🩵 متن */
  .loader-text {
    color: #37474f;
    font-size: 1.1rem;
    margin-top: 4px;
    font-weight: 500;
    letter-spacing: -0.3px;
  }
  
  /* 🔸 انیمیشن ملایم */
  @keyframes fadeInUp {
    from {
      transform: translateY(15px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  </style>
  