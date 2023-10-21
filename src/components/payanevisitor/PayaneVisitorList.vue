<template>
  <v-container>
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
      :items="payaneVisitors"
      item-key="id"
      :search="search"
      :loading="isLoading"
      :options.sync="options"
        :server-items-length="itemCount"
        >
      <template  v-slot:[`item.payane_code`]="props">
      {{ props.item.bank_payane.payane_code }}
      </template>
      <template  v-slot:[`item.visitor_name`]="props">
      {{ props.item.sale_person.name }}
      </template>
      <template  v-slot:[`item.b1_slpcode`]="props">
      {{ props.item.sale_person.b1_slpcode }}
      </template>
        <template v-slot:top>
              <v-toolbar flat color="white">
                <v-switch 
                  v-model="options.isActive" label="فقط فعال ها"></v-switch>
                  <v-spacer></v-spacer>

                  <v-dialog v-model="dialogNew" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
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
                      <span class="headline"><span class="text-h5">جدید</span></span>
                      </v-card-title>
                      <v-card-text>
                      <v-container>
                          <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                                  :items="salePersons"
                                  name="salePerson"
                                  label="ویزیتور"
                                  solo
                                  item-text="name"
                                  item-value="b1_slpcode"
                                  v-model="newItem.b1_slpcode"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                                  :items="payaneCodes"
                                  name="payaneCode"
                                  label="پایانه"
                                  solo
                                  item-text="payane_code"
                                  item-value="payane_code"
                                  v-model="newItem.payane_code"
                            ></v-select>
                          </v-col>
                          </v-row>
                      </v-container>
                      </v-card-text>
                      <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">لغو</v-btn>
                      <v-btn color="blue darken-1" text @click="saveNew">ذخیره</v-btn>
                      </v-card-actions>
                  </v-card>
                  </v-dialog>
              </v-toolbar>
        </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="deactiveItem(item)"
              
            >
              mdi-cancel
            </v-icon>
          </template>
      </v-data-table>
  </v-card>
  <v-dialog v-model="dialogConfirmDeactivate" max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="error" dark small v-bind="attrs" v-on="on">غیرفعال کردن</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline"><span class="text-h5">تأیید عملیات</span></span>
      </v-card-title>
      <v-card-text>
        آیا از غیرفعال کردن این مورد اطمینان دارید؟
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeConfirmDeactivate">لغو</v-btn>
        <v-btn color="error" text @click="deactivateItemConfirmed">تأیید</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
  export default{
      data(){
      return{
        dialogConfirmDeactivate: false,
      itemToDeactivate: null, // Store the item to be deactivated
        options: {
            itemsPerPage: 10,
            page:1,
            isActive: true,
            },
        dialogNew: false,
        dialogEdit: false,
          isLoading:null,
          search: '',
          editedIndex: -1,
          editedItem: {
              payane_code: '',
              b1_slpcode: '',
          },
          newItem: {
            payane_code: '',
            b1_slpcode: '',
          },
          defaultItem: {
            payane_code: '',
            b1_slpcode: '',
          },
      }
  }
      ,
      methods:{
            closeConfirmDeactivate() {
      this.dialogConfirmDeactivate = false;
      this.itemToDeactivate = null; // Clear the stored item
    },
    openConfirmDeactivate() {
      this.dialogConfirmDeactivate = true;
    },
          close () {
      this.dialogNew = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    deactiveItem(item){
      if (this.itemToDeactivate) {
      this.$store.dispatch('deactivePayanePerson', item.id).then((response) => {
        if (response)
        console.log("TRUE")
      else
      console.log("False")
    })}
    this.closeConfirmDeactivate();},
    saveNew () {
      this.$store.dispatch('createPayaneVisitor', this.newItem)
      this.loadPayaneVisitors();
      this.close()
    },
          loadPayaneVisitors() {
              // console.log(this)
              this.$store.dispatch('loadPayaneVisitors',this.options)
              this.$store.dispatch('loadFreeSalePersons')
              this.$store.dispatch('loadFreePayaneCodes')
          }
      },
      computed:{
      headers(){
          return [
              {
                  text: "نام ویزیتور",
                  align: "center",
                  value: "visitor_name",
              },                {
                  text: "کد بی وان",
                  align: "center",
                  value: "b1_slpcode",
              },
              {
                  text: "کد پایانه",
                  align: "center",
                  value: "payane_code",
              },
              {
                  text: "فعال",
                  align: "center",
                  value: "is_active",
              },
              {
              text: "",
              align: "center",
              //sortable: false,
              value: "actions",
              }

          ]
      },
      payaneVisitors(){
          return this.$store.getters.getPayaneVisitors
      },
      formTitle () {
      return this.editedIndex === -1 ? 'ویزیتور جدید' : 'ویرایش ویزیتور'
    },
    salePersons(){
      return this.$store.getters.getFreeSalePersons
    },
    payaneCodes(){
      return this.$store.getters.getFreePayaneCodes
    }, itemCount(){
      return this.$store.getters.getPayaneVisitorItemCount;
    }
  },
  watch:{
    options:{
      handler(){
      this.loadPayaneVisitors();    
      },  deep: true
    }
  }
  }

</script>