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
            <v-card-text>
                <v-data-table
                fixed-header
                dense
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
    },
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
          //sortable: false,
          value: "number",
        },                {
          text: "وضعیت سفارش",
          align: "center",
          //sortable: false,
          value: "order_state",
        },                {
          text: "آخرین به‌روزرسانی",
          align: "center",
          //sortable: false,
          value: "order_updated_at",
        },                {
          text: "ایجاد",
          align: "center",
          //sortable: false,
          value: "order_created_at",
        },                {
          text: "کاربر",
          align: "center",
          //sortable: false,
          value: "user_name",
        },{
          text: "مبلغ",
          align: "center",
          //sortable: false,
          value: "total_amount",
        },{
          text: "پیامک",
          align: "center",
          //sortable: false,
          value: "message_count",
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
    
    created(){
        this.loadTemplates();
    }
}
</script>