<template>
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
            item-key="id"
            :options.sync="options"
            :server-items-length="itemCount"
            class="elevation-1"
            ></v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import DatePicker from '../DatePicker.vue'
export default {
    components:{DatePicker},
    data(){
        return {
            options: {
                itemsPerPage: 10,
                page:1,
                state: 'complete',
                hasB1Docs: false,
                completedAt:""
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
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "b1_doc_entry",
                },
                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "b1_doc_num",
                },
                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "b1_documented",
                },
                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "need_document",
                },
                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "delivery_b1_doc_entry",
                },
                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "delivery_b1_doc_num",
                },
                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "invoice_b1_doc_entry",
                },                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "invoice_b1_doc_num",
                },                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "payment_b1_doc_entry",
                },                {
                    text: "شماره سفارش",
                    align: "center",
                    //sortable: false,
                    value: "payment_b1_doc_num",
                },
            ]
        }
    },
    methods:{
        loadOrders(){
            this.$store.commit('loadOrders', this.options)
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
