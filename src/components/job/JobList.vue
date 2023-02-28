<template>
    <nav>
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
                :items="jobs"
                item-key="id"
                class=""
                :search="search"
                :loading="isLoading"                      
                >
                <template v-slot:[`item.controls`]="props">
                    <v-btn class="mx-2" small  @click="retryJob(props.item)">
                        <v-icon>mdi-check-outline</v-icon>
                    </v-btn>
               </template>
                </v-data-table>
            </v-card>
        </template>
    </nav>
</template>

<script>
export default{
    data() {
        return {
            search: "",

        }
    },
    computed:{
        isLoading(){
            return this.$store.getters.isLoading;
        },
        headers(){
            return [
          {
            text: "پاسخ",
            align: "center",
            //sortable: false,
            value: "response",
          },
          {
            text: "تاریخ",
            value: "created_at",
            align: "center",
          },
          {
            text: "کد پاسخ",
            value: "response_status",
            align: "center",  
          },
          {
            text: "نوع",
            align: "center",
            value: "jobfull_type",
          },          {
            text: "شماره درخواست",
            align: "center",
            value: "jobfull_id",
          },
          {
            text: "",
            align: "center",
            value: "controls",
            sortable: false
          }
          
        ];
        }
    },
    methods:{
        retryJob(item){
            this.$store.dispatch('retryJob', item);
        },
            loadJobs(){
            this.$store.dispatch('loadJobs')
        }
    },
    created(){
        this.loadJobs()
    }
}
</script>
