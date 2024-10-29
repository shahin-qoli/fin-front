<template>
    <nav>
        <template>
            <v-card outlined>
                <v-card-title>
                  <v-switch
                  v-model="options.isSuccess">نیاز به تلاش مجدد</v-switch>
                </v-card-title>
                <v-data-table
                    fixed-header
                    dense
                    :headers="headers"
                    :items="jobs"
                    item-key="id"
            
                    :search="search"
                    :loading="isLoading"   
                    :options.sync="options"
                    :server-items-length="itemCount"
                    class="elevation-1"                   
                >

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
            options: {
        itemsPerPage: 10,
        page: 1,
        isSuccess: true
      },

        }
    },watch:{
    options:{
      handler(){   
      this.loadJobs();    
      },  deep: true
    }},
    computed:{
        itemCount(){
      return this.$store.getters.getRequestItemCount;
    },
        jobs(){
            return this.$store.getters.jobs;
        },
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

            loadJobs(){
            this.$store.dispatch('loadJobs',this.options)
        }
    }
}
</script>
