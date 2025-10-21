<template>
    <v-container class="py-10">
      <!-- فیلترها -->
      <v-card class="pa-6 mb-6" outlined rounded="xl">
        <v-row dense>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.search"
              label="جستجو کلی"
              prepend-inner-icon="mdi-magnify"
              outlined dense clearable
            />
          </v-col>
  
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.vendor"
              :items="vendors"
              item-text="name"
              item-value="id"
              label="تامین‌کننده"
              prepend-inner-icon="mdi-truck-fast"
              outlined dense clearable
            />
          </v-col>
  
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.delivery_state"
              :items="deliveryStates"
              item-text="text"
              item-value="value"
              label="وضعیت"
              prepend-inner-icon="mdi-package-variant"
              outlined dense clearable
            />
          </v-col>
  
          <v-col cols="12" md="3" class="d-flex align-center">
            <v-btn color="deep-purple accent-4" dark @click="loadItems">
              <v-icon left>mdi-refresh</v-icon> بروزرسانی
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
  
      <!-- جدول -->
      <v-card outlined rounded="xl">
        <v-data-table
          :headers="headers"
          :items="vendorLineItems"
          :loading="loading"
          :search="filters.search"
          :group-by.sync="groupBy"
          show-group-by
          item-key="id"
          dense
          class="elevation-1"
          :server-items-length="itemCount"
          :options.sync="options"
        >
          <!-- ستون اکشن‌ها -->
          <template v-slot:item.actions="{ item }">
            <v-btn icon small color="blue" @click="showDetails(item)">
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon small color="green" @click="changeState(item)">
              <v-icon small>mdi-sync</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="removeItem(item)">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </template>
  
          <!-- وقتی دیتا نیست -->
          <template v-slot:no-data>
            <v-alert type="info" text>هیچ آیتمی یافت نشد</v-alert>
          </template>
        </v-data-table>
      </v-card>
  
      <!-- دیالوگ جزئیات -->
      <v-dialog v-model="detailDialog" max-width="700px" scrollable>
        <v-card>
          <v-card-title class="headline">
            جزئیات آیتم #{{ selectedItem?.id }}
            <v-spacer></v-spacer>
            <v-btn icon @click="detailDialog = false"><v-icon>mdi-close</v-icon></v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text v-if="selectedItem">
            <v-list dense>
              <v-list-item>
                <v-list-item-title>تامین‌کننده:</v-list-item-title>
                <v-list-item-subtitle>{{ selectedItem.vendor.name }}</v-list-item-subtitle>
              </v-list-item>
  
              <v-list-item>
                <v-list-item-title>سفارش:</v-list-item-title>
                <v-list-item-subtitle>#{{ selectedItem.order.id }}</v-list-item-subtitle>
              </v-list-item>
  
              <v-list-item>
                <v-list-item-title>محصول:</v-list-item-title>
                <v-list-item-subtitle>{{ selectedItem.variant.name }}</v-list-item-subtitle>
              </v-list-item>
  
              <v-list-item>
                <v-list-item-title>وضعیت:</v-list-item-title>
                <v-list-item-subtitle>{{ selectedItem.delivery_state }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
import vendor from '@/store/modules/miarze/vendor';

  export default {
    data() {
      return {
        vendorLineItems:[],
        itemCount:'',
        options:
                 {
                    page: 1,
                    itemsPerPage: 25,
                },
        filters: {
            search: '',
          vendor: null,
          delivery_state: null,
                },
        loading: false,
        groupBy: [],
        vendors: [],
        deliveryStates: [
          { text: 'در انبار تامین‌کننده', value: 'in_vendor_stock' },
          { text: 'در پایگاه', value: 'in_base_stock' },
          { text: 'تحویل مشتری', value: 'delivered' },
          { text: 'بدون حمل', value: 'no_delivery' },
          { text: 'در انبار', value: 'in_warehouse_stock' },
        ],
        headers: [
          { text: 'شناسه', value: 'id' },
          { text: 'تامین‌کننده', value: 'vendor.name' },
          { text: 'سفارش', value: 'order.id' },
          { text: 'محصول', value: 'variant.name' },
          { text: 'تعداد', value: 'quantity' },
          { text: 'وضعیت', value: 'delivery_state' },
          { text: 'عملیات', value: 'actions', sortable: false },
        ],
        items: [],
        detailDialog: false,
        selectedItem: null,
      };
    },
    computed: {

    },
    methods: {
      async loadItems() {
        this.loading = true;
        try {
            let payload = {
              page: this.options.page,
              per_page: this.options.itemsPerPage,
              delivery_state: this.filters.delivery_state
            }
            const response = await this.$store.dispatch('fetchFilteredVendorLineItems',payload);
            this.vendorLineItems = response.data
            this.itemCount = response.options.count;
        } catch (e) {
          console.error(e);
        } finally {
          this.loading = false;
        }
      },
      extractUniqueVendors(items) {
        const seen = new Set();
        return items
          .map((i) => i.vendor)
          .filter((v) => v && !seen.has(v.id) && seen.add(v.id));
      },
      showDetails(item) {
        this.selectedItem = item;
        this.detailDialog = true;
      },
      changeState(item) {
        // TODO: implement logic (maybe open dialog)
        console.log('Change state of', item.id);
      },
      removeItem(item) {
        // TODO: implement delete
        console.log('Remove item', item.id);
      },
    },
    created() {
      this.loadItems();
    },
  };
  </script>
  
  <style scoped>
  .v-data-table {
    direction: rtl;
    text-align: right;
  }
  .v-data-table th,
  .v-data-table td {
    font-family: "iranyekan", sans-serif;
  }
  </style>
  