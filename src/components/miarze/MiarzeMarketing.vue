<template>
    <v-container>
        <v-card>
            <v-card-title>
                به روز رسانی سفارشات
            </v-card-title>
            <v-card-text>
                <v-btn color="primary">به روز رسانی</v-btn>
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
                    <v-btn color="green" type="submit">ارسال</v-btn>
                  </v-col>
                </v-row>
                </v-form>      
          </v-card-text>
        </v-card>
    </v-container>    
</template>
<script>

export default {
    data(){
        return {
            options:{           
            itemsPerPage: 10,
            page:1, },
            showSendMessageModal: false,
            selectedOrders:[],
            selectedTemplate:null,
        }
    },
    methods:{
      loadTemplates() {
            this.$store.dispatch('loadMiarzeMessageTemplates')
        },
      SendMessage(){
        var payload = {selectedOrders: this.selectedOrders, selectedTemplate: this.selectedTemplate}
        this.$store.dispatch('sendMessageToOrder',payload).then((response)=> {
          console.log(response)
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