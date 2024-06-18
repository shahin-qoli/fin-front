<template>
    <v-container>
        <v-card>
            <v-card-text>
                <v-data-table
                        fixed-header
                        dense
                        :headers="headers"
                        :items="orders"
                        item-key="id"          
                        :search="searchLoaded"
                        :loading="isLoading"   
                        class="elevation-1"                   
                ></v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default{
    data(){        
        return{
        options: {
        itemsPerPage: 10,
        page:1,
        orderState: "",
        cardCode: "",
            },
        }
    },
    computed:{
        headers(){
            return[
                {
                    text: "شماره",
                    align: "center",
                    value: "docnum",
                },
                {
                    text: "تاریخ",
                    align: "center",
                    value: "docdate",
                },
                {
                    text: "شماره داخلی",
                    align: "center",
                    value: "docentry",
                },
                {
                    text: "کد مشتری",
                    align: "center",
                    value: "card_code",
                },
                {
                    text: "نام",
                    align: "center",
                    value: "card_name",
                },
                {
                    text: "وضعیت سند",
                    align: "center",
                    value: "state",
                },                
                {
                    text: "جمع",
                    align: "center",
                    value: "document_total",
                },
                {
                    text: "همگام سازی",
                    align: "center",
                    value: "is_synced",
                },           
                {
                    text: "نیاز به فاکتور",
                    align: "center",
                    value: "need_invoice",
                },
                {
                    text: "آماده فاکتور",
                    align: "center",
                    value: "ready_to_invoice",
                },   
                {
                    text: "دلیل رد شدن",
                    align: "center",
                    value: "not_ready_reason",
                },               
                {
                    text: "عملیات",
                    align: "center",
                    value: "more",
                }
            ]
        },
        orders(){
            return this.$store.getters.getAutomatedOrders
        },

    },
    methods:{
        loadOrders(){
            this.$store.dispatch('fetchtAutomateOrders',this.options)
        }
    },
    watch:{
    options:{
      handler(){
      this.loadOrders();    
      },  deep: true
    }
    },
}
</script>
