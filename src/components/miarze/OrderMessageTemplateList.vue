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

                    class="elevation-1"    
                >
                <template v-slot:[`item.edit`]="item">
                    <v-icon
              small
              class="mr-2"
              @click="editItem(item.item)"
            >
              mdi-pencil
            </v-icon>
                </template></v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog">
            <v-card outlined>
                <v-card-text>
                    <v-form @submit.prevent="submitEdit">
                        <v-row>
                            <v-col cols="12">
                                <v-textarea v-model="editedItem.message_body"></v-textarea>
                            </v-col>
                            <v-col cols="3">
                                <v-btn color="red darken-1" text @click="dialog=false">بستن</v-btn>
                                <v-btn color="blue darken-1" :loading="isLoading" text type="submit">ذخیره</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>    
</template>

<script>
export default{
    data(){
        return{
            dialog: false,
            editedItem: {
            id:'',
              name: '',
              message_body: '',
          },
            isLoading: false,
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
        },
        templates(){
            return this.$store.getters.getMiarzeOrderMessageTemplates
        }
    },
    methods:{
        editItem(item){
            this.editedItem = item
      this.editedIndex = item.id
      this.dialog = true
        },
        submitEdit(){
            let data = this.editedItem
            this.isLoading= true
            console.log("BBBBBBBBBBBBBBBBBBBBBBBBB")
            this.$store.dispatch('updateMiarzeOrderMessageTemplate', data).then((response)=>{
                this.isLoading= false
                console.log(response)
                if (response.success){
                    this.loadTemplates()
                    this.dialog= false
                    this.$toasted.show("موفقیت آمیز بود",{
                        type: "success",
                        duration: 5000,
                        position: 'bottom-center'
                    })
                }else{
                    this.$toasted.show(`خطا: ${response.error}`,{
                        type: "error",
                        duration: 5000,
                        position: 'bottom-center'
                    })
                }
            })
        },
        loadTemplates(){
            this.$store.dispatch('loadOrderMessageTemplates')
        }
    },
    created(){
        this.loadTemplates();
    }
}
</script>
