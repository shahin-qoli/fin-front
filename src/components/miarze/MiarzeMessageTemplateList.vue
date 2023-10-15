<template>
    <v-container>
        <v-card-text>
            <v-data-table
            fixed-header
                dense
                :headers="headers"
                :items="MiarzeMessageTemplates"
                item-key="id"
                :options.sync="options"
                :server-items-length="itemCountMiarzeMessageTemplates"
                class="elevation-1"    
            ></v-data-table>
        </v-card-text>
    </v-container>
</template>
<script>
export default{
    data(){
        return {
            options:{           
            itemsPerPage: 10,
            page:1, }
        }
    },    methods:{
        loadTemplates() {
            this.$store.dispatch('loadMiarzeMessageTemplates',this.options)
    },},
    computed:{
        data(){
            return {
                options:{
                        itemsPerPage: 10,
                        page:1
                    }
            }
        },
        headers(){
                return [
                    {
                    text: "عنوان",
                    align: "center",
                    value: "name"
                    },
                    {
                    text: "متن",
                    value: "message_body"
                    }
                    ]
                },
        MiarzeMessageTemplates(){
                    return this.$store.getters.getMiarzeMessageTemplates
                },
        itemCountMiarzeMessageTemplates(){
                    return this.$store.getters.getMiarzeMessageTemplatesItemCount
                }
    },
        watch:{
        options:{
      handler(){
      this.loadTemplates();    
      },  deep: true
         }
    }
}
</script>
