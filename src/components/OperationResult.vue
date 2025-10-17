<template>
    <transition name="fade">
      <div v-if="visible" class="result-overlay">
        <div class="result-card" :class="type">
          <div class="icon-wrapper">
            <v-icon
              v-if="type === 'success'"
              size="80"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>
  
            <v-icon
              v-else-if="type === 'error'"
              size="80"
              color="red darken-2"
            >
              mdi-alert-circle-outline
            </v-icon>
  
            <v-icon
              v-else
              size="80"
              color="blue darken-2"
            >
              mdi-information-outline
            </v-icon>
          </div>
  
          <h2 class="result-title">
            {{ titleText }}
          </h2>
  
          <p class="result-message">
            {{ message }}
          </p>
  
          <v-btn
            color="primary"
            rounded
            class="mt-6 px-6"
            @click="$emit('close')"
          >
            <v-icon left small>mdi-close</v-icon>
            بستن
          </v-btn>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: "OperationResult",
    props: {
      visible: { type: Boolean, default: false },
      type: {
        type: String,
        default: "success", // success | error | info
      },
      message: {
        type: String,
        default: "عملیات با موفقیت انجام شد.",
      },
    },
    computed: {
      titleText() {
        switch (this.type) {
          case "success":
            return "عملیات موفق بود!";
          case "error":
            return "خطا در انجام عملیات!";
          default:
            return "اعلان";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* ✨ انیمیشن fade */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* 🌈 پس‌زمینه */
  .result-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(250, 250, 250, 0.85);
    backdrop-filter: blur(6px);
    z-index: 3000;
    direction: rtl;
    font-family: "iranyekan", sans-serif;
  }
  
  /* 🧩 کارت نتیجه */
  .result-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    animation: scaleIn 0.5s ease;
  }
  
  .icon-wrapper {
    margin-bottom: 20px;
  }
  
  .result-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #37474f;
  }
  
  .result-message {
    font-size: 1rem;
    color: #616161;
    line-height: 1.8;
  }
  
  /* 🔹 رنگ تم‌ها */
  .result-card.success {
    border-top: 6px solid #43a047;
  }
  .result-card.error {
    border-top: 6px solid #e53935;
  }
  .result-card.info {
    border-top: 6px solid #1e88e5;
  }
  
  /* 💫 انیمیشن */
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  </style>
  