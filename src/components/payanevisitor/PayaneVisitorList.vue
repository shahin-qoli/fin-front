<template>
  <div>
  <v-card outlined>
      <v-card-title>
        <v-row>
          <v-col cols="6">
          <v-text-field
          v-model="options.slpName"
          append-icon="mdi-magnify"
          label="نام"
          single-line
          hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
          v-model="options.payaneCode"
          append-icon="mdi-magnify"
          label="کد پایانه"
          single-line
          hide-details
          ></v-text-field>
        </v-col>
        </v-row>
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
            <!-- <v-dialog v-model="dialogEdit" max-width="500px">
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
                <span class="headline"><span class="text-h5">{{ formTitle }}</span></span>
                </v-card-title>
                <v-card-text>
                <v-container>
                    <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.name" label="نام ویزیتور"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.b1_slpcode" label="کد بی وان"></v-text-field>
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
            </v-dialog> -->
        </v-toolbar>
      </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              small
              class="mr-2"
              @click="deactiveItem(item)"
            >
              غیر فعال کردن
            </v-btn>
          </template>
      </v-data-table>
  </v-card>
  <v-dialog v-model="deactiveDialog">
    <v-card>
      <v-row>
        <v-col v-if="!alreadyValidatedDeactive" cols="12">
          <v-btn  @click="validateDeactive">بررسی</v-btn>
        </v-col>
        <v-col v-if="alreadyValidatedDeactive && validationError" cols="12">
          <v-row>
            <v-col cols="12">
          <p>
            تعداد تراکنش استفاده نشده: {{ validationError.pos_count }} 
          </p>
          <p>
            تعداد گزارش استفاده نشده: {{ validationError.report_count }}
          </p>
        </v-col>
        <v-col v-if="validationError.pos_count > 0" cols="12">
          <v-data-table
          :items="validationError.pos_detail"
          :headers="childHeader">
          <template v-slot:top>
            <p>تراکنش ها</p>
          </template>
          <template v-slot:[`item.amount`]="item">
            {{ item.item.amount | formatAmount}}
          </template>
          <template v-slot:[`item.transaction_date`]="item">
            {{ item.item.transaction_date | formatDate}}
          </template>
          </v-data-table>
        </v-col>
        <v-col v-if="validationError.report_count > 0" cols="12">
          <v-data-table
          :items="validationError.report_detail"
          :headers="childHeader">
          <template v-slot:top>
            <p>گزارش ها</p>
          </template>
          <template v-slot:[`item.amount`]="item">
            {{ item.item.amount | formatAmount}}
          </template>
          <template v-slot:[`item.transaction_date`]="item">
            {{ item.item.transaction_date | formatDate}}
          </template>
          </v-data-table>
        </v-col>
        </v-row>
        </v-col>
        <v-col v-if="alreadyValidatedDeactive && !validationError" cols="12">
          <p>برای غیر فعال سازی مشکلی وجود ندارد</p>
        </v-col>
        <v-col v-if="alreadyValidatedDeactive" cols="6">
          <date-picker v-model="endDate" label="تاریخ پایان"></date-picker>
        </v-col>
        <v-col v-if="alreadyValidatedDeactive" cols="6">
          <v-btn :disable="endDate"  @click="deactiveAnyway">غیر فعال سازی</v-btn>
        </v-col>        
      </v-row>
    </v-card>
  </v-dialog>
</div>
</template>

<script>

var jalaali = require('jalaali-js')
import DatePicker from '../DatePicker.vue'
  export default{        components:{
        DatePicker
    },
      data(){
      return{
        options: {
            itemsPerPage: 10,
            page:1,
            payaneCode:'',
            slpName:''
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
          toDeactiveItem:null,
          deactiveDialog: false,
          alreadyValidatedDeactive: false,
          validationError: null,
          endDate:null
      }
  }
      ,
      methods:{
          close () {
      this.dialogNew = false
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
    deactiveItem(item){
      this.toDeactiveItem = item
      this.deactiveDialog=true
    },
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
    },
    validateDeactive(){
      this.$store.dispatch('validatePayanePersonDeactive', this.toDeactiveItem).then((response) =>{
        if (response.success){
          if (response.result.success){
            this.alreadyValidatedDeactive = true
          }else{
            this.alreadyValidatedDeactive = true
            this.validationError= response.result.error ||  response.result.result 
          }
        }
      })
    },
    deactiveAnyway(){
      this.toDeactiveItem.endDate = this.endDate
      this.$store.dispatch('deactiveAnywayPayanePerson', this.toDeactiveItem).then((response) =>{
        if (response.success){
          this.loadPayaneVisitors()
          this.deactiveDialog= false
          if (response.result.success){
            this.$toasted.show('عملیات با موفقیت انجام شد', {
              position: 'bottom-center',
              type: 'success',
              duration: 3000
            })
          }else{
            this.$toasted.show(response.result.error, {
              position: 'bottom-center',
              type: 'error',
              duration: 5000
            })
          }
        }
      })
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
              text: "عملیات",
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
    },
    childHeader(){
      return [
             {
                  text: "تاریخ",
                  align: "center",
                  value: "transaction_date",
              }, 
              {
                  text: "مبلغ",
                  align: "center",
                  value: "amount",
              }, 
      ]
    }
  },
  watch:{
    options:{
      handler(){
      this.loadPayaneVisitors();    
      },  deep: true
    },
    deactiveDialog(newValue){
      if (!newValue){
        this.alreadyValidatedDeactive = false;
        this.validationError = null;
        this.endDate = null;
        this.toDeactiveItem=null
      }
    }
  },
  filters:{
        formatAmount(value){
          const stringVlue = String(value)
          const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return formattedIntegerPart
        },
        formatDate(geoDate){
            
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
         },
  }

</script>
