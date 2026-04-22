<template>
  <v-container>
    <v-dialog
      :value="value"
      @input="$emit('input', $event)"
      max-width="480px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card class="delivery-dialog rounded-xl pa-4" elevation="12">
        <!-- 🔹 عنوان -->
        <v-card-title class="headline d-flex align-center pb-3">
          <v-icon color="primary" class="ml-2">mdi-truck-delivery-outline</v-icon>
          <span >تعیین روش ارسال</span>
        </v-card-title>

        <v-divider class="mb-4"></v-divider>

        <!-- 🔹 فرم انتخاب -->
        <v-card-text>
          <v-select
            v-model="selectedMean"
            :items="means"
            label="انتخاب روش ارسال"
            item-text="name"
            item-value="value"
            outlined
            dense
            class="delivery-select"
          >
            <template v-slot:prepend-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-caption grey--text text--darken-1">
                    لطفاً روش ارسال را انتخاب کنید
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-select>
        </v-card-text>

        <!-- 🔹 دکمه‌ها -->
        <v-card-actions class="justify-end pt-6">
          <v-btn
            variant="text"
            color="grey darken-1"
            class="rounded-pill px-4"
            @click="closeDialog"
          >
            انصراف
          </v-btn>
          <v-btn
            color="primary"
            class="rounded-pill px-6"
            elevation="2"
            :disabled="!selectedMean"
            @click="confirmAssign"
          >
            <v-icon left small>mdi-check-circle-outline</v-icon>
            تایید تخصیص
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, default: false },
    item: { type: Object, default: null },
  },
  data() {
    return {
      selectedMean: null,
      means: [
        { value: "unknown", name: "نامشخص" },
        { value: "vendor_to_base_to_customer", name: "مشتری → پایگاه → تأمین‌کننده" },
        { value: "vendor_to_customer", name: "مشتری → تأمین‌کننده" },
        { value: "warehouse_to_base_to_customer", name: "مشتری → پایگاه → انبار" },
        { value: "warehouse_to_customer", name: "مشتری → انبار" },
        { value: "base_to_customer", name: "مشتری → پایگاه" },
      ],
    };
  },
  methods: {
    closeDialog() {
      this.$emit("input", false);
      this.selectedMean = null;
    },
    confirmAssign() {
      const data = {
        vendor_line_item_id: this.item.vendor_line_item.id,
        delivery_type: this.selectedMean,
      };
      this.$emit("assigned", data);
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
.delivery-dialog {
  background: #fff;
  border: 1px solid #e3e7ed;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  color: #333;
}

.delivery-select {
  direction: rtl;
}

.v-btn {
  transition: all 0.25s ease;
}
.v-btn:hover {
  transform: translateY(-2px);
}

.v-dialog {
  font-family: 'iranyekan', sans-serif;
}
</style>
