<template>
    <v-container>
        <v-data-table
                    fixed-header
                    dense
                    :headers="headers"
                    :items="orders"
                    item-key="id"          
                    :search="search"
                    :loading="isLoading"   
                    class="elevation-1"                   
                ></v-data-table>
    </v-container>
</template>
<script>
export default{
    data(){
        return{
            options:{
                state:'',
                startDate:'',
                endDate:'',
                cardCode:''
            },
            isLoading: false,
            search:''
        }
    },
    computed:{
        headers(){
            return[
                {
                    text: "تاریخ",
                    align: "center",
                    value: "DocDate",
                },
                {
                    text: "شماره",
                    align: "center",
                    value: "DocNum",
                },
                {
                    text: "شماره",
                    align: "center",
                    value: "CardCode",
                },
                {
                    text: "شماره",
                    align: "center",
                    value: "CardName",
                },
                {
                    text: "وضعیت",
                    align: "center",
                    value: "U_State",
                },
                {
                    text: "عملیات",
                    align: "center",
                    value: "more",
                }
            ]
        },
        orders(){
            return this.$store.getters.getFinancialOrders
        }
    },
    methods:{
        loadOrders(){
            this.$store.dispatch("fetchtFinancialOrders",this.options)
        }
    },
    created(){
        this.loadOrders()
    }
}
</script>
