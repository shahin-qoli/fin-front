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
                        :search="search"
                        :loading="isLoading"   
                        class="elevation-1"                   
                    >
                    <template v-slot:[`item.more`]="item">
                            <v-btn @click="openMoreDialog(item)">  <v-icon>mdi-eye</v-icon> </v-btn>
                    </template>
            </v-data-table>
        </v-card-text>
        </v-card>
        <v-dialog
        fullscreen
        transition="dialog-bottom-transition"
        v-model="moreDialog">
        <the-dashboard :order="order" :nextStatesData="nextStatesData"  @close="closeMoreDialog"></the-dashboard>
        </v-dialog>
        <!-- لودینگ -->
        <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>در حال بارگذاری</p>
        </v-overlay>
    </v-container>
</template>
<script>
import TheDashboard from './TheDashboard.vue'
export default{
    components:{TheDashboard},
    data(){
        return{
            options:{
                state:'',
                startDate:'',
                endDate:'',
                cardCode:''
            },
            isLoading: false,
            search:'',
            moreDialog:false,
            selectedDocNum:"",
            order:null,
            nextStatesData: null
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
        findOrder(){
          this.isLoading= true;
          this.$store.dispatch('prepareFinancialDashboardData', this.selectedDocNum).then((response) =>{
              this.isLoading = false;
              if (response.success)
                 console.log(response),
                  this.order = response.data,
                  this.nextStatesData = response.nextStates
              else
                //   this.docNum = ''
                  this.$toasted.show(response.error,{
                      duration: 3000,
                      position: 'bottom-center',
                      type: 'error'
              })
          })
      },
        openMoreDialog(item){
            console.log(item)
            this.selectedDocNum = item.item.DocNum
            this.findOrder()
            this.moreDialog = true
        },
        loadOrders(){
            this.$store.dispatch("fetchtFinancialOrders",this.options)
        },
        closeMoreDialog(){
            this.moreDialog=false
            this.selectedDocNum = ""
            this.order=null
            this.nextStatesData=null
        }
    },
    created(){
        this.loadOrders()
    }
}
</script>
