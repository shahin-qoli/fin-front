<template>
  <v-container>
    <!-- 🔹 دیالوگ اصلی -->
    <v-dialog
      :value="value"
      @input="$emit('input', $event)"
      max-width="520px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card class="assign-dialog rounded-xl pa-5" elevation="12">
        <!-- 🔸 عنوان -->
        <v-card-title class="d-flex align-center pb-2">
          <v-icon color="primary" class="ml-2">mdi-account-plus-outline</v-icon>
          <span class="font-weight-bold text-h6">تخصیص تأمین‌کننده</span>
        </v-card-title>

        <v-divider class="mb-4"></v-divider>

        <!-- 🔸 بخش جستجوی تأمین‌کننده -->
        <v-card-text>
          <v-autocomplete
            v-model="selectedVendor.b1_code"
            :items="items"
            :search-input.sync="searchVendor"
            label="نام تأمین‌کننده را جستجو کنید"
            item-text="name"
            item-value="b1_code"
            outlined
            dense
            hide-details
            clearable
            class="mb-4"
            @input="updateSelectedVendor"
          >
            <template v-slot:prepend-inner>
              <v-icon color="primary">mdi-magnify</v-icon>
            </template>
          </v-autocomplete>

          <!-- 🔹 اطلاعات تأمین‌کننده -->
          <v-expand-transition>
            <div v-if="isCardCodeChecked" class="vendor-info-card pa-4 rounded-lg">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="selectedVendor.b1_code"
                    label="کد تأمین‌کننده"
                    dense
                    outlined
                    readonly
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="selectedVendor.name"
                    label="نام تأمین‌کننده"
                    dense
                    outlined
                    readonly
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="selectedVendor.vendor_price"
                    label="قیمت تأمین (ریال)"
                    dense
                    outlined
                    type="number"
                  />
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-card-text>

        <!-- 🔸 دکمه‌ها -->
        <v-divider></v-divider>
        <v-card-actions class="justify-end pt-5">
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
            :disabled="!isCardCodeChecked"
            @click="confirmAssign"
          >
            <v-icon left small>mdi-check-circle-outline</v-icon>
            تایید تخصیص
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 🔹 حالت بارگذاری -->
    <v-overlay :value="isLoading" opacity="0.8">
      <div class="d-flex flex-column align-center justify-center text-center white--text">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
        <p class="mt-3 text-body-1">در حال انجام عملیات...</p>
      </div>
    </v-overlay>
  </v-container>
</template>

<script>
export default {
  name: "AssignSupplierDialog",
  props: {
    value: { type: Boolean, default: false },
    item: { type: Object, default: null },
  },
  data() {
    return {
      searchVendor: "",
      isLoading: false,
      isCardCodeChecked: false,
      selectedVendor: { b1_code: "", name: "", vendor_price: "" },
    };
  },
  computed: {
    items() {
      return this.$store.getters.getFilteredVendors;
    },
  },
  methods: {
    debounce(func, delay) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(func, delay);
    },
    updateSelectedVendor() {
      if (!this.selectedVendor.b1_code) return;
      this.isCardCodeChecked = true;
      const found = this.items.find((item) => item.b1_code === this.selectedVendor.b1_code);
      if (found) this.selectedVendor.name = found.name;
    },
    loadFilteredVendors() {
      if (this.searchVendor && this.searchVendor.trim() !== "")
        this.$store.dispatch("fetchFiltereVendors", this.searchVendor);
    },
    closeDialog() {
      this.$emit("input", false);
      this.selectedVendor = { b1_code: "", name: "", vendor_price: "" };
      this.isCardCodeChecked = false;
    },
    confirmAssign() {
      const payload = {
        vendor_b1code: this.selectedVendor.b1_code,
        vendor_name: this.selectedVendor.name,
        vendor_line_item_id: this.item.vendor_line_item.id,
        vendor_price: this.selectedVendor.vendor_price,
      };
      this.$emit("assigned", payload);
      this.closeDialog();
    },
  },
  watch: {
    searchVendor(newValue) {
      if (newValue) this.debounce(this.loadFilteredVendors, 300);
    },
  },
};
</script>

<style scoped>
.assign-dialog {
  background: #fff;
  border: 1px solid #e3e7ed;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.vendor-info-card {
  background-color: #f5f8fa;
  border: 1px solid #dfe4ea;
}

.v-btn:hover {
  transform: translateY(-2px);
  transition: 0.25s;
}

.v-dialog {
  font-family: 'iranyekan', sans-serif;
}
</style>
