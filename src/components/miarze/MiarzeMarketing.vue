<template>
    <v-container>
        <v-card>
            <v-card-title>
                به روز رسانی سفارشات
            </v-card-title>
            <v-card-text>
                <v-btn :loading="isLoading" @click="updateMiarzeOrders" color="primary">به روز رسانی</v-btn>
            </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            <v-form>
                    <v-row>
                        <v-col cols="3">
                          <v-select
                          :items="orderStates"
                          v-model="options.orderState"
                          item-text="text"
                          item-value="value"
                          label="وضعیت سفارش"
                          ></v-select>
                        </v-col>
                        <v-col cols="4">
                            <date-picker label="تاریخ به‌روزرسانی از" v-model="options.orderUpdatedAtGt"></date-picker>
                        </v-col>
                        <v-col cols="4">
                            <date-picker label="تاریخ ایجاد از" v-model="options.orderCreatedAtGt"></date-picker>
                        </v-col>
                        <!-- <v-col cols="1">
                            <v-btn dark color="green" type="submit">جستجو</v-btn>
                        </v-col>
                        <v-col cols="1">
                            <v-btn dark color="red" @click="clearForm">پاک کردن</v-btn>
                        </v-col> -->
                    </v-row>
                </v-form>
          </v-card-title>
            <v-card-text>
                <v-data-table
                fixed-header
                dense
                :single-expand="singleExpand"
      :expanded.sync="expanded"
      show-expand
                :headers="headers"
                :items="MiarzeOrders"
                item-key="id"
                item-value="id"
                v-model="selectedOrders"
                :options.sync="options"
                :server-items-length="itemCountMiarze"
                class="elevation-1"
                show-select       
                @click:sort="sortChanged"           
                >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-card style="max-height: 200px; overflow: auto;">
                      <v-card-title class="text-h6">نام کالا ها</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12">
                            <th4 v-for="(productName, index) in item.product_names" :key="index">{{ productName }}</th4>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </td>
                </template>
                <template v-slot:[`item.total_amount`]="{ item }">
                  <p>{{ item.total_amount | formatAmount }}</p>
                </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-card v-if="isSelected">
          <v-card-title>
            ارسال پیامک
          </v-card-title>
          <v-card-text>    
                <v-form @submit.prevent="SendMessage">
                  <v-row>
                  <v-col cols="4">
                    <v-select :items="messageTemplates"
                              item-text="name"
                              item-value="id"
                              solo
                              v-model="selectedTemplate">
                    </v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-btn color="green" :loading="isLoading" type="submit">ارسال</v-btn>
                  </v-col>
                </v-row>
                </v-form>      
          </v-card-text>
        </v-card>
        <v-dialog v-model="showModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                    <v-row>
                      <h4>{{updateResult}}</h4>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="showModal = false">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>    
</template>
<script>
  import DatePicker from '../DatePicker.vue'
export default {

    data(){
        return {
          isLoading: false,
          showModal: false,
          updateResult: '',
            options:{           
            itemsPerPage: 10,
            page:1,
            sortBy:  ['order_created_at'],
            sortDesc:  ['false'],
            orderState: '',
            orderCreatedAtGt:'',
            orderUpdatedAtGt:''
           },
            showSendMessageModal: false,
            selectedOrders:[],
            selectedTemplate:null,
        }
    }, components:{ DatePicker},
    methods:{
      sortChanged(sort) {
        this.options.sortBy = sort[0].sortBy;
        this.options.sortDesc = sort[0].sortDesc;
    },
      loadTemplates() {
            this.$store.dispatch('loadMiarzeMessageTemplates')
        },
      SendMessage(){
        this.isLoading = true
        var payload = {selectedOrders: this.selectedOrders, selectedTemplate: this.selectedTemplate}
        this.$store.dispatch('sendMessageToOrder',payload).then((response)=> {
          this.isLoading = false
          this.showModal= true
        this.updateResult = response
           this.selectedOrders=[],
           this.selectedTemplate=null
           this.loadOrders()
        })
      },
        loadOrders() {
            console.log('Loading orders from Miarze...', this.options);
            this.$store.dispatch('loadMiarzeOrders',this.options)
    },
    openSendMessageModal(){
      this.showSendMessageModal = true;
    },
    closeSendMessageModal() {
      this.showSendMessageModal = false;
    },
    updateMiarzeOrders(){
      this.isLoading = true
      this.$store.dispatch('updateMiarzeOrders').then((response) => {
        this.showModal= true
        this.updateResult = response
        this.isLoading = false
        this.loadOrders()
      })
    }
  },
    
    computed:{
      orderStates(){
        return [
          {
            text:'payment',
            value:'payment'
          },
          {
            text:'complete',
            value:'complete'
          },
          {
            text:'address',
            value:'address'
          },
          {
            text:'cart',
            value:'cart'
          }
        ]
      },
      messageTemplates(){
            return this.$store.getters.getMiarzeMessageTemplates;
        },
      isSelected(){
        return this.selectedOrders.length > 0;
      },
        headers() {
            return [
                {
          text: "شماره سفارش",
          align: "center",
          sortable: false,
          value: "number",
        },                {
          text: "وضعیت سفارش",
          align: "center",
          sortable: false,
          value: "order_state",
        },                {
          text: "آخرین به‌روزرسانی",
          align: "center",
          value: "order_updated_at",
        },                {
          text: "ایجاد",
          align: "center",

          value: "order_created_at",
        },                {
          text: "کاربر",
          align: "center",
          sortable: false,
          value: "user_name",
        },{
          text: "مبلغ",
          align: "center",
          sortable: false,
          value: "total_amount",
        },{
          text: "پیامک",
          align: "center",
          sortable: false,
          value: "message_count",
        },{
          text: "تعداد کالا",
          align: "center",
          sortable: false,
          value: "item_count",
        },{
          text: "عملیات",
          align: "center",
          //sortable: false,
          value: "actions",
        }]
        },
        MiarzeOrders(){
            return this.$store.getters.getMiarzeOrders;
        }, itemCountMiarze(){
      return this.$store.getters.getMiarzeOrdersItemCount;
    }
    },
        watch:{
        options:{
      handler(){
      this.loadOrders();    
      },  deep: true
         }
    },
    filters:{
    formatAmount(value){
      const stringVlue = String(value)
      const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedIntegerPart
    }
    },
    
    created(){
        this.loadTemplates();
    }
}
</script>