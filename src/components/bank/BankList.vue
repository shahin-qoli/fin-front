<template>
    <v-card outlined>
        <v-data-table
        fixed-header
        dense
        :headers="headers"
        :items="banks"
        item-key="id"
          >
          </v-data-table>      
    </v-card>
  </template>
  <script>
  
  export default{
    data(){
        return{
        }
    },
    computed:{
        headers(){
            return [
                {
                text: "شماره",
                align: "center",
                //sortable: false,
                value: "id",
                },
                {
                text: "نام بانک",
                align: "center",
                //sortable: false,
                value: "name",
                }
            ]
        },
        banks(){
            return this.$store.getters.getBanks;
        }
    },
    methods:{
        loadBanks() {
        // console.log(this)
        this.$store.dispatch('loadBanks')
      }
    },
    created(){
        this.loadBanks();
    }
  }
  </script>