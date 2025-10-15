<template>

    <v-container>
        <v-dialog :value="value" @input="$emit('input', $event)" max-width="500px" persistent>
      <v-card rounded>
        <v-card-title class="headline">تعیین روش ارسال</v-card-title>
  
        <v-card-text>

            <v-select
            v-model="selectedMean"
            :items="means"
            label="انتخاب روش"
            item-text="name"
            item-value="value"
            outlined
          />
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions class="d-flex justify-end pa-4">
          <v-btn text @click="closeDialog">انصراف</v-btn>
          <v-btn color="primary" @click="confirmAssign">
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
      value: { type: Boolean, default: false }, // Vuetify 2 style
      item: { type: Object, default: null },
    },
    data() {
      return {
        selectedMean: null,
        means: [
          { value: "unknown", name:"نامشخص" },
          { value: "vendor_to_base_to_customer", name: "تامین کننده به پایگاه، پایگاه به مشتری" },
          { value: "vendor_to_customer", name: "ارسال تامین کننده به مشتری" },
          { value: "warehouse_to_base_to_customer", name: "ارسال انبار به پایگاه، پایگاه به مشتری" },
          { value: "warehouse_to_customer", name:"ارسال انبار به مشتری" },
          { value: "base_to_customer", name:"ارسال پایگاه به مشتری" },
        ],
      };
    },
    methods: {

      closeDialog() {
        this.$emit("input", false); // بستن دیالوگ
        this.selectedMean = null;
      },
      confirmAssign() {
        console.log(this.item)
        let data = {
          vendor_line_item_id: this.item.vendor_line_item.id,
          delivery_type: this.selectedMean
        }
        this.$emit("assigned", data);
        this.closeDialog();
      },
    },
  };
  </script>
  
  <style scoped>
  .v-select {
    direction: rtl;
  }
  </style>
  