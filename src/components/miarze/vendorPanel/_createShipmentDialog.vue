<template>

    <v-container>
        <v-dialog :value="value" @input="$emit('input', $event)"  persistent>
            <v-card rounded>
                <v-card-title class="headline">ایجاد حمل و نقل جدید</v-card-title>
                <v-card-text>
                    <h3>انتخاب از سفارش</h3>
                    <v-list shaped>
                        <v-list-item-group
                            v-model="selectedItems"
                            multiple
                        >
                        <template v-for="(item, i) in lineItems">
          <v-divider
            v-if="!item"
            :key="`divider-${i}`"
          ></v-divider>

          <v-list-item
            v-else
            :key="`item-${i}`"
            :value="item"
            active-class="deep-purple--text text--accent-4"
          >
            <template v-slot:default="{ active }">
              <v-list-item-content>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-checkbox
                  :input-value="active"
                  color="deep-purple accent-4"
                ></v-checkbox>
              </v-list-item-action>
            </template>
          </v-list-item>
        </template>
                    </v-list-item-group>
                    </v-list>
                    <h3>انتخاب نوع عملیات</h3>
                    <v-select
                    v-model="selectedAction"
            :items="commonActions"
            label="انتخاب نوع"
            item-text="action"
            item-value="action"
            outlined
               
                ></v-select>
                <h3>انتخاب از سایر سفارشات</h3>
                <v-list shaped>
                        <v-list-item-group
                            v-model="selectedOtherItems"
                            multiple
                        >
                        <template v-for="(item, i) in otherOrderItems">
          <v-divider
            v-if="!item"
            :key="`divider-${i}`"
          ></v-divider>

          <v-list-item
            v-else
            :key="`item-${i}`"
            :value="item"
            active-class="deep-purple--text text--accent-4"
          >
            <template v-slot:default="{ active }">
              <v-list-item-content>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-checkbox
                  :input-value="active"
                  color="deep-purple accent-4"
                ></v-checkbox>
              </v-list-item-action>
            </template>
          </v-list-item>
        </template>
                    </v-list-item-group>
                    </v-list>
                </v-card-text>
          <!-- 🟧 نمایش آیتم‌های سایر سفارشات انتخاب‌شده -->
          <div v-if="allSelectedLineItems.length" class="mt-6">
            <h3>آیتم‌های انتخاب‌شده نهایی</h3>
            <v-list shaped dense>
              <v-list-item
                v-for="(item, i) in allSelectedLineItems"
                :key="`display-${i}`"
              >
                <v-list-item-content>
                  <v-list-item-title>
                   {{ item }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <!-- از سفارش #{{ item.order_id || "?" }} -->
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <v-row>
            <v-col cols="6">
                <v-text-field
                  v-model="shipment.total_cost"
                  label="قیمت حمل (ریال)"
                  type="number"
                  outlined
                  prepend-inner-icon="mdi-currency-usd"
                  required
                />
            </v-col>
                <v-col cols="12" md="6">
                <v-text-field
                  v-model="shipment.shipped_by"
                  label="نام حمل‌کننده"
                  outlined
                  prepend-inner-icon="mdi-truck"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="shipment.shipping_type"
                  label="نوع حمل"
                  outlined
                  prepend-inner-icon="mdi-truck"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="shipment.description"
                  label="توضیحات"
                  outlined
                  prepend-inner-icon="mdi-truck"
                  
                />
              </v-col>
              <v-col cols="3">
                                <date-picker  v-model="shipment.date" label=" تاریخ"></date-picker>
                </v-col>
          </v-row>
          <v-card-actions class="justify-end">
          <v-btn color="red" text @click="$emit('input', false)">انصراف</v-btn>
          <v-btn color="green darken-1" dark @click="submitShipment">ثبت</v-btn>
        </v-card-actions>
            </v-card>            
        </v-dialog>
    </v-container>


</template>
<script>
import vendor from '@/store/modules/miarze/vendor';
import DatePicker from '../../DatePicker.vue'

export default{
    props: {
      value: { type: Boolean, default: false },
      lineItems: { type: Array, required: true },
    },
    components:{ DatePicker},

    data(){return {
        selectedAction:'',
        selectedItems:[],
        selectedOtherItems:[],
        shipment:{
            date:"",
            shipped_by: "",
            shipping_type: "",
            total_cost:"",
            description: "",
            details:[],
            kar:""
        }
    }},
    computed:{
        actionItems() {
    const allActions = this.lineItems
      .flatMap(line => (line.vendor_line_item?.possible_action_bundles || [])) // آرایه دوبعدی رو فلت می‌کنیم
      .map(bundle => 
      bundle.action) // فقط action رو می‌گیریم

    // حذف مقادیر تکراری با Set و برگردوندن به آرایه
    return [...new Set(allActions)]
  },
  commonActions() {
      if (this.selectedItems.length === 0) return []

      // از selectedItems اکشن‌هاشون رو استخراج می‌کنیم
      const actionsForSelected = this.selectedItems.map(line =>
        (line.vendor_line_item?.possible_action_bundles || []).map(b => b.action)
      )

      // اشتراک همه آرایه‌ها با reduce
      return actionsForSelected.reduce((acc, arr) => acc.filter(a => arr.includes(a)))
    },
    otherOrderItems() {
    return [
      ...new Set(
        this.selectedItems
          .flatMap(item => item.vendor_line_item?.possible_action_bundles || [])
          .flatMap(bundle => bundle.bundles || [])
          .flatMap(b => b.other_order || [])
      ),
    ];
  },   
   allSelectedLineItems() {
      // از سفارش فعلی
      const fromCurrent = this.selectedItems.map(i => ({
        vendor_line_item_id: i.vendor_line_item.id,
        quantity: i.vendor_line_item.quantity,
      }))

      // از سایر سفارش‌ها
      const fromOther = this.selectedOtherItems.flatMap(line =>(
        {
          vendor_line_item_id: line.id,
          quantity: line.quantity,
        })
      )
        
      // ادغام و حذف تکراری‌ها بر اساس id
      const merged = [...fromCurrent, ...fromOther]
      return merged
    },
    vendorLineItems(){
        return this.lineItems.map(item=> item.vendor_line_item)
    }
    },
    methods:{
        submitShipment(){
           
            let payload = {...this.shipment}
            console.log(payload)
            this.$store.dispatch('createVendorLineItemTransfer',payload)
        }
    },
    watch: {
  allSelectedLineItems: {
    handler(newVal) {
      this.shipment.details = newVal
    },
    deep: true,
    immediate: true
  },
  selectedAction:{
    handler(newVal) {
      this.shipment.kar = newVal
    },
    deep: true,
  }
},
}
</script>