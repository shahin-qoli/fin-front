<template>
    <v-container>
        <v-card outlined>
            <v-card-text>
                <v-data-table
                fixed-header
                    dense
                    :headers="headers"
                    :items="templates"
                    item-key="id"
                :options.sync="options"
                :server-items-length="itemCountMiarze"
                    class="elevation-1"    
                >
                </v-data-table>
                </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default{
    data(){
        return{
            options:{           
            itemsPerPage: 10,
            page:1,
           },
            dialog: false,
            isLoading: false,
        }
    },methods:{
        loadPayments(){
            this.$store.dispatch('loadMiarzePayments',this.options)
        }
    },
    computed:{
        headers(){
            return [
                {
                    text: "شماره",
                    value:"id"
                },
                {
                    text: "نوع",
                    value: "message_type"
                },
                {
                    text: "متن",
                    value: "message_body"
                },
                {
                    text: "ویرایش",
                    value: "edit"
                }
            ]
        },},
        watch:{
        options:{
      handler(){
      this.loadPayments();    
      },  deep: true
         }
    },
}
</script>