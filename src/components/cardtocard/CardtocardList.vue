<template>
  <v-card outlined>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="جستجو"
        single-line
        hide-details

      ></v-text-field>
    </v-card-title>
    <v-data-table
      fixed-header
      dense
      :headers="headers"
      :items="cardtocards"
      item-key="id"
      class=""
      :search="search"
      :loading="isLoading"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      show-expand
    >

    <template v-slot:expanded-item="{ headers,item}">
      <td :colspan="headers.length">
      <v-container v-if="item.is_used==true" fluid style="margin: 0px; padding: 0px; width: 100%">
          <v-row dense >
            <v-col cols="1" >
              <p> کد مشتری : </p>
              <!-- <v-text-field > {{item.transaction_date}}</v-text-field> -->
            </v-col>
            <v-col cols="1" >
            {{ getCardcode(item) }}
          </v-col>
          </v-row>
        </v-container>
        <v-container v-if="item.is_used==false">
          <v-form  @submit.prevent="useRow(item,cardcode)">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="cardcode" hint="c50000" label="کد مشتری"> </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn dark color="green" type="submit">استفاده تراکنش</v-btn>
              </v-col>
            </v-row>
        </v-form>
        </v-container>
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
  export default {
    data() {
    return {
      search: "",
      cardcode: null,
      singleExpand: true,
      expanded: [],
      transaction_date: "",
      transaction_time: "",
      description: "",
      amount: "",
      from_card: "",
      to_card: "",
      peygiri_number: "",
      serial_number: "",
      job_id: "",
      loading: true
    };
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
    },
    cardtocards(){
      //console.log(this.$store.getters.cardtocards)
    
      return this.$store.getters.cardtocards
      
    }, isLoading(){
      return this.$store.getters.isLoading;
    }
  },
    methods: {
      getCardcode(up){
        
        // const ups = JSON.parse(up);
        // console.log(ups)
        return up.used_payments[0].used_for
      },
      useRow(item, cardcode){
        console.log(cardcode)
            var payload = {
              "item": item,
              cardcode: cardcode
            }
            this.$store.dispatch('useCardtocard',payload)
            
          },
      loadCardtocards() {
        // console.log(this)
        this.$store.dispatch('loadCardtocards')
      }
    },
    created() {
      this.loadCardtocards ();
    }
}
</script>

<style scoped>

</style>