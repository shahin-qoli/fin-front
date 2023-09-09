<template>
   <v-container>
    <v-card outlined>
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
                class="elevation-1"
                >
            </v-data-table>
        </v-card-text>
    </v-card>
    <v-card v-if="selectedInvoice" outlined>
            <v-card-title>
                <p>عملیات</p>
            </v-card-title>
            <v-card-text>
                <v-btn @click="retryOrders">تلاش مجدد</v-btn>
            </v-card-text>
        </v-card>
            <!-- Modal -->
        <v-dialog v-model="showModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12"><p>نتایج</p></v-col>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="reportResult"></p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="showModal = false">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
   </v-container> 
</template>

<script>
export default {
    data(){
        return {
            selectedItems: [],
            showModal: false,
            reportResult: [],
        }
    },
    methods: {
        loadOrders(){
            this.$store.dispatch('loadOrdersForVendors')
        },
        retryOrders(){
            this.$store.dispatch('retryOrdersVendor'. this.selectedItems).then((response) =>{
                this.loadOrders();
                this.showModal=true;
                this.selectedItems= [];
                this.reportResult = response;
            })
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
                    text: "تاریخ سفارش",
                    align: "center",
                    //sortable: false,
                    value: "completed_at",
                }
            ]
        },
        orders(){
            return this.$store.getters.getOrders;
        },
        selectedInvoice(){
            return this.selectedItems.length > 0;
        }
    },
    created() {
        this.loadOrders;
    }
}
</script>
