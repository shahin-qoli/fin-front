<template>
  <v-card outlined>
    <v-card-title>
        <v-row >
            <v-col cols="12">
                <v-form @submit.prevent="submitForm">
                    <v-row>
                      <v-col cols="6">
                            <v-text-field v-model="options.fromCard" hint="8787656" label="از شماره کارت"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="options.toCard" hint="8787656" label="به شماره کارت"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field v-model="options.amount" hint="120000000" label="مبلغ"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field v-model="options.peygiriNumber" hint="8787656" label="شماره پیگیری"></v-text-field>
                        </v-col>

                        <v-col cols="3">
                            <v-text-field v-model="options.serialNumber" hint="8787656" label="شماره سریال"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <date-picker v-model="options.transactionDate"></date-picker>
                        </v-col>
                        <v-col cols="1">
                            <v-btn dark color="green" type="submit">جستجو</v-btn>
                        </v-col>
                        <v-col cols="1">
                            <v-btn dark color="red" @click="clearForm">پاک کردن</v-btn>
                        </v-col>
                    </v-row>
                </v-form>

            </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
    <v-data-table
      fixed-header
      dense
      :headers="headers"
      :items="cardtocards"
      item-key="id"
      :loading="isLoading"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      show-expand
      :options.sync="options"
      :server-items-length="itemCount"
      class="elevation-1"
    >
    <template v-slot:top>
      <v-switch
        v-model="options.isUsed"
        label="تراکنش های استفاده شده"
        class="pa-3"
      ></v-switch>
    </template>
    <template v-slot:expanded-item="{ headers,item}">
      <td :colspan="headers.length">
        <the-row :item="item" @use-row="useRow" :key="item.id">
        </the-row>
      </td>
    </template>
    <template v-slot:[`item.is_used`]="{ item }">
        <v-simple-checkbox
          v-model="item.is_used"
          disabled
        ></v-simple-checkbox>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
import DatePicker from '../DatePicker.vue'
import TheRow from '../TheRow.vue'
  export default {
    components:{TheRow, DatePicker},
    data() {
    return {
      options: {
        itemsPerPage: 10,
        transactioDate: "",
        amount: "",
        fromCard: "",
        toCard: "",
        peygiriNumber: "",
        serialNumber:"",
        isUsed: false
      },
      cardcode: null,
      singleExpand: true,
      expanded: [],
      loading: null
    };
  },watch:{
    options:{
      handler(){
      
      this.loadCardtocards();    
 
      },  deep: true
    }
  },
  computed: {
    headers() {
      return [
        {
          text: "تاریخ تراکنش",
          align: "center",
          //sortable: false,
          value: "transaction_date",
        },
        {
          text: "ساعت تراکنش",
          value: "transaction_time",
          align: "center",
          filterable: false,
        },
        {
          text: "توضیحات",
          value: "description",
          align: "center",
          filterable: false

        },
        {
          text: "مبلغ",
          align: "center",
          value: "amount",
        },
        {
          text: "کارت مبدا",
          align: "center",
          value: "from_card",

        },
        {
          text: "کارت مقصد",
          align: "center",
          value: "to_card",

        },
        {
          text: "شماره پیگیری",
          align: "center",
          value: "peygiri_number",

        },
        {
          text: "شماره سریال",
          align: "center",
          value: "serial_number",
          
        },
        {
          text: "شماره فایل",
          align: "center",
          value: "job_id"
        },
        {
          text: "استفاده شده",
          align: "center",
          value: "is_used"
        },
        {
          text: "",
          align: "center",
          value: "controls",
          sortable: false
        }
      ];
    }, isLoading(){
      return this.$store.getters.isLoading;
    }, cardtocards(){
      return this.$store.getters.cardtocards;
    }, itemCount(){
      return this.$store.getters.getCardItemCount;
    }
  },
    methods: {
      async clearForm(){
          this.options =  {
        itemsPerPage: 10,
        transactioDate: "",
        amount: "",
        fromCard: "",
        toCard: "",
        peygiriNumber: "",
        serialNumber:"",
        isUsed:false
      };
          await this.$store.dispatch('loadPoses',this.options)
        },
      getCardcode(up){
        return up.used_payments[0].used_for
      },
      useRow(data){
        this.loading = true
        var payload = {
            ...data
            }
            this.$store.dispatch('useCardtocard',payload)
            .finally(() => {
                this.loading = false
              })
            
          },
      loadCardtocards() {
        this.$store.dispatch('loadCardtocards',this.options)
      },
    },
    // created() {
    //   this.loadCardtocards();
    // }
}
</script>

<style scoped>

</style>