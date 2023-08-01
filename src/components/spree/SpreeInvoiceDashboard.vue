<template>
    <v-container>
        <v-card outlined>
            <v-card-title>
                <v-row>
                    <v-col cols="12">
                        <v-col cols="3">
                            <date-picker v-model="options.completedAt"></date-picker>
                        </v-col>
                        <v-col cols="3">
                            <v-switch
                                v-model="options.hasB1Docs"
                                label="سفارشات ثبت شده"
                                class="pa-3"
                            ></v-switch>
                        </v-col>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-data-table
                fixed-header
                dense
                :headers="headers"
                :items="orders"
                item-key="number"
                show-select
                item-value="number"
                v-model="selectedItems"
                :options.sync="options"
                :server-items-length="itemCount"
                class="elevation-1"
                ></v-data-table>
            </v-card-text>
        </v-card>
        <v-card v-if="selectedInvoice" outlined>
            <v-card-title>
                <p>عملیات</p>
            </v-card-title>
            <v-card-text>
                <v-btn @click="createSo">صدور  SO</v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import DatePicker from '../DatePicker.vue'
export default {
    components:{DatePicker},
    data(){
        return {
            selectedItems: [],
            options: {
                itemsPerPage: 10,
                page:1,
                state: 'complete',
                hasB1Docs: false,
                completedAt:"",

            },
        }
    },
    computed:{
        headers(){
            return [
                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "number",
                },
                {
                    text: "SO DocEntry",
                    align: "center",
                    //sortable: false,
                    value: "b1_doc_entry",
                },
                {
                    text: "SO DocNumber",
                    align: "center",
                    //sortable: false,
                    value: "b1_doc_num",
                },
                {
                    text: "وضعیت همگام سازی",
                    align: "center",
                    //sortable: false,
                    value: "b1_documented",
                },
                {
                    text: "نیاز به همگام سازی",
                    align: "center",
                    //sortable: false,
                    value: "need_document",
                },
                {
                    text: "DL DocEntry",
                    align: "center",
                    //sortable: false,
                    value: "delivery_b1_doc_entry",
                },
                {
                    text: "DL DocNum",
                    align: "center",
                    //sortable: false,
                    value: "delivery_b1_doc_num",
                },
                {
                    text: "Inoice DocEntry",
                    align: "center",
                    //sortable: false,
                    value: "invoice_b1_doc_entry",
                },                {
                    text: "Invoice DocNum",
                    align: "center",
                    //sortable: false,
                    value: "invoice_b1_doc_num",
                },                {
                    text: "Payment DocEntry",
                    align: "center",
                    //sortable: false,
                    value: "payment_b1_doc_entry",
                },                {
                    text: "Payment DocNum",
                    align: "center",
                    //sortable: false,
                    value: "payment_b1_doc_num",
                },
            ]
        },
        orders(){
            return this.$store.getters.getOrders;
        },
        itemCount(){
            return this.$store.getters.getItemCount;
        },
        selectedInvoice(){
            return this.selectedItems.length > 0;
        }
    },
    methods:{
        loadOrders(){
            console.log('start')
            this.$store.dispatch('loadOrders', this.options)
        },
        createSo(){
            this.$store.dispatch('createSo', this.selectedItems)
        },
    },
    watch:{
    options:{
      handler(){
      this.loadOrders();    
      },  deep: true
    }
}
}
</script>
