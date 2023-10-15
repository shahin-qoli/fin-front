<template>
    <v-container>
        <v-card outlined>
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
                >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">                   
                        <template v-slot:activator="{on, attrs}">
                            <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        >جدید</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <h3>{{ formTitle }}</h3>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="editedItem.name" label="نام قالب"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea  v-model="editedItem.message_body" label="متن پیامک"></v-textarea>
                                    </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">لغو</v-btn>
                                <v-btn color="blue darken-1" text @click="save">ذخیره</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
export default{
    data(){
        return {
            editedIndex: -1,
          editedItem: {
            id:'',
              name: '',
              message_body: '',
          },
          defaultItem: { id:'',
            name: '',
            message_body: '',
          },
            dialog: false,
            options:{           
            itemsPerPage: 10,
            page:1, }
        }
    },    methods:{
        close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    editItem(item){
      this.editedItem = item
      this.editedIndex = item.id
      this.dialog = true
    },
    save () {
      if (this.editedIndex > -1) {
        this.$store.dispatch('editMiarzeMessageTemplate', this.editedItem).then( (response) => {
            if (response > 0)
                 this.loadTemplates();
        })
      } else {
        this.$store.dispatch('createMiarzeMessageTemplate',this.editedItem).then( (response) => {
            if (response > 0)
                 this.loadTemplates();
        })
      }
      this.close()
    },
        loadTemplates() {
            this.$store.dispatch('loadMiarzeMessageTemplates',this.options)
    },},
    computed:{
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
                    },             {
              text: "",
              align: "center",
              //sortable: false,
              value: "actions",
              }
                    ]
                },
        MiarzeMessageTemplates(){
                    return this.$store.getters.getMiarzeMessageTemplates
                },
        itemCountMiarzeMessageTemplates(){
                    return this.$store.getters.getMiarzeMessageTemplatesItemCount
                },
        formTitle () {
      return this.editedIndex === -1 ? 'قالب جدید' : ' قالب ویرایش'
    }
    },
        watch:{    dialog (val) {
      val || this.close()
    },
        options:{
      handler(){
      this.loadTemplates();    
      },  deep: true
         }
    }
}
</script>
