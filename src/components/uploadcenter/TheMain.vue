<template>
    <v-container fluid>
      <v-row>
        <!-- Render each item as a card with v-for -->
        <v-col v-for="(bank, index) in banks" :key="index" cols="12" md="6" lg="6">
          <v-card outlined class="d-flex flex-column align-center">
            <!-- Display the bank logo at the top of the card -->
            <v-img :src="bank.image" height="150px" contain class="d-flex justify-center mt-3"></v-img>
  
            <!-- Card title and subtitle -->
            <v-card-title class="text-center">{{ bank.name }}</v-card-title>
            
            <!-- Card description -->
            <!-- <v-card-text>{{ item.description }}</v-card-text> -->
  
            <!-- Card actions: Link to import data and a regular button -->
          <!-- Card actions with vertical account list -->
            <v-card-actions class="d-flex flex-column align-center">
                <v-btn
                v-for="(acc, ind) in bank.bank_accounts"
                :key="ind"
                text
                @click="openForImport(acc, bank)"
                class="mb-2"
                >
                {{ acc.account_number }} - {{ acc.owner_name }}
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-if="importDialoge" v-model="importDialoge" persistent >
        <v-card outlined class="d-flex flex-column align-center">
            <v-card-title class="text-center">
                ورود اطلاعات برای حساب {{ accountToImport.owner_name }} بانک {{ bankToImport.name }} شماره حساب {{ accountToImport.account_number }}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    accept="excel/*"
                    label="بارگذاری فایل"
                    v-model="file"
                  />
                </v-col>
                <v-col>
                  <p v-if="uploadError" class="text-center">{{ uploadErrorMessage }}</p>
                  <v-btn :disabled="file == null" @click="submitForm" dark color="green">ارسال</v-btn> 
                  <v-btn  @click="closeImport" dark color="red">بستن</v-btn> 
                </v-col>
              </v-row>
            </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-if="resultDialoge" v-model="resultDialoge" persistent scrollable max-width="1600">
        <v-card>
          <v-card-text style="height: 900px;">
            <v-data-table
              :headers="resultHeader"
              :items="resultsOfUpload"
              fixed-header
              item-key="peygiri_number"
              class="elevation-1"
              :items-per-page="-1"
            >
              <template v-slot:top>
                <v-toolbar
                  flat
                >
                <v-dialog
                    v-model="dialogEditItem"
                    max-width="500px"
                  >
                  <v-card>
                      <v-card-title>
                        <span class="text-h5">ویرایش</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col
                              cols="12"
                            >
                              <v-select
                              :items="transactionTypesSelect"
                              name="transaction_type"
                              solo
                              item-text="name"
                              item-value="id"
                              v-model="editedItem.transaction_type"
                              label="نوع تراکنش"
                              ></v-select>
                            </v-col>
                            <v-col
                              cols="12"
                            >
                              <v-text-field
                                v-model="editedItem.card_from"
                                label="کارت مبدا"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                            >
                              <v-text-field
                                v-model="editedItem.account_from"
                                label="حساب مبدا"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                            >
                              <v-text-field
                                v-model="editedItem.peygiri_number"
                                label="شماره پیگیری"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                            >
                              <v-textarea
                                v-model="editedItem.description"
                                label="شرح"
                                disabled
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="closeEdit"
                        >
                          لغو
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="saveEdit"
                        >
                          ذخیره
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template  v-slot:[`item.transaction_type`]="props">
                  <v-chip small dark :color="getColorTransactionType(props.item.transaction_type)">
                    {{ transformTransactionTypes(props.item.transaction_type) }}
                  </v-chip>
                </template>
              <template  v-slot:[`item.submit_result`]="props">
                  <v-chip small dark :color="getColorResult(props.item.submit_result)">
                    {{ props.item.submit_result }}
                  </v-chip>
                </template>
              <template v-slot:[`item.actions`]="props">
                <v-icon
                  small
                  class="mr-2"
                  @click="editItem(props.item)"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </v-data-table>
            <v-spacer></v-spacer>
                        <v-btn
            v-if="!finalized"
              color="blue darken-1"
              
              @click="saveFinal"
            >
              ذخیره
            </v-btn>
            <v-btn
              color="red darken-1"
              
              @click="closeFinal"
            >
              بستن
            </v-btn>

          </v-card-text>
        </v-card>

      </v-dialog>
      <v-overlay :value="isLoading" style="z-index: 2000;">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>در حال عملیات</p>
        </v-overlay>
    </v-container>
  </template>
  
  <script>
  import {TransactionTypes} from '../../mixins/TransactionTypes.js'
  import {finAgent} from '@/services/agent'
  export default {
    mixins:[TransactionTypes],
    data() {
      return {
        finalized: false,
        editedIndex: -1,
      editedItem: {
        transaction_type: '',
        card_from: "",
        account_from: "",
        peygiri_number: "",
      },
      defaultItem:  {
        transaction_type: '',
        card_from: "",
        account_from: "",
        peygiri_number: "",
      },
        dialogEditItem: false,
        importDialoge: false,
        accountToImport: null,
        bankToImport: null,
        isLoading: false,
        file: null,
        fileKey:null,
        uploadError: false,
        uploadErrorMessage:"",
        resultsOfUpload: null,
        resultDialoge: false,
      
      };
    },
    computed: {
      resultHeader() {
        if (this.finalized) {
          return [
            { text: 'تاریخ', value: 'date' },
            { text: 'مبلغ', value: 'amount' },
            { text: 'نوع تراکنش', value: 'transaction_type' },
            { text: 'کارت مبدا', value: 'card_from' },
            { text: 'حساب مبدا', value: 'account_from' },
            { text: 'شماره پیگیری', value: 'peygiri_number' },
            { text: 'وضعیت ثبت', value: 'submit_result' },
            { text: 'خطا', value: 'error' },
          ]      
        } else {
          return [
            { text: 'تاریخ', value: 'date' },
            { text: 'مبلغ', value: 'amount' },
            { text: 'نوع تراکنش', value: 'transaction_type' },
            { text: 'کارت مبدا', value: 'card_from' },
            { text: 'حساب مبدا', value: 'account_from' },
            { text: 'شماره پیگیری', value: 'peygiri_number' },
            { text: 'شرح تراکنش', value: 'description' },
            { text: '', value: 'actions' }
          ]
        }
      },
        banks(){
            return this.$store.getters.getBanks
        },
        transactionTypesSelect(){
          return[
          {
            id:"0",
            name: "نامشخص"
          },
          {
            id:"1",
            name: "کارت به کارت"
          },
          {
            id: "2",
            name: "حساب به حساب"
          },
          {
            id: "3",
            name: "وصول چک"
          }]
        }
    },
    methods: {
      getColorResult(res) {
        if (res) {
          return "green"
        } else {
          return "red"
        }
      },
      openForImport(acc, bank) {
        this.importDialoge = true
        this.accountToImport = acc
        this.bankToImport = bank
      },
      async submitForm(){
            this.uploadError= false
            this.uploadErrorMessage = null
            this.resultsOfUpload = null
            if (!this.file) return;
            let formData = new FormData()
            this.isLoading = true;
            formData.append('file', this.file,this.file.name)
            try {
                const {data: responseData} = await finAgent.post(`/front/bank_accounts/${this.accountToImport.id}/import_file_primary`,formData );
                if (!responseData.is_success) {
                  this.uploadError = true;
                  this.uploadErrorMessage = responseData.error;
                  this.file = null;
                  this.isLoading = false;
                } else if(responseData.is_success) {
                  this.importDialoge = false;
                  this.resultsOfUpload = responseData.result
                  this.resultDialoge = true
                  this.file = null;
                  this.isLoading = false;
                  this.fileKey = responseData.filename
                }


            } catch (err){
                const error = new Error(
                    
                    err.response.data.error || 'Failed to fetch'
                );
                this.uploadError = true;
                    this.file = null;
                    this.isLoading = false;
                throw error;
            }
        },
      editItem (item) {
        this.editedIndex = this.resultsOfUpload.indexOf(item)
        this.editedItem = Object.assign({}, item)
        console.log(this.editedItem)
        console.log(item)
        this.dialogEditItem = true
      },
      closeEdit () {
        this.dialogEditItem = false
        
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      saveEdit () {
        if (this.editedIndex > -1) {
          Object.assign(this.resultsOfUpload[this.editedIndex], this.editedItem)
        } 
        this.closeEdit()
      },
      refreshAll() {
        this.finalized = false,
          this.editedIndex = -1,
          this.editedItem = {
            transaction_type: '',
            card_from: "",
            account_from: "",
            peygiri_number: "",
          };
        this.defaultItem = {
          transaction_type: '',
          card_from: "",
          account_from: "",
          peygiri_number: "",
        };
        this.dialogEditItem = false;
        this.importDialoge= false;
        this.accountToImport= null;
        this.bankToImport= null;
        this.isLoading= false;
        this.file= null;
        this.fileKey=null;
        this.uploadError= false;
        this.uploadErrorMessage="";
        this.resultsOfUpload= null;
        this.resultDialoge= false;
      },
      closeFinal () {
        this.refreshAll()
        this.closeImport()
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      async saveFinal() {
        this.finalized = false
        this.isLoading = true;
        if (this.resultsOfUpload.length > 0) {
          try {
            let payload = {
              file_key: this.fileKey,
              data: this.resultsOfUpload
            }
            const { data: responseData } = await finAgent.post(`/front/bank_accounts/${this.accountToImport.id}/import_file_finalize`, payload);
            if(responseData.is_success) {
              this.isLoading = false;
              responseData.card_to_card.forEach(item => {
                const existingItem = this.resultsOfUpload.find(result => (result.peygiri_number === item.peygiri_number) && (result.transaction_type === item.transaction_type) );
                Object.assign(existingItem, {
                  submit_result: item.result,
                  error: item.error
                })
              })
              responseData.account_to_account.forEach(item => {
                const existingItem = this.resultsOfUpload.find(result => (result.peygiri_number === item.peygiri_number) && (result.transaction_type === item.transaction_type) );
                Object.assign(existingItem, {
                  submit_result: item.result,
                  error: item.error
                })
              })
              this.finalized = true
            }
          }
          catch (err) {
            console.log(err)
          }
        }
        this.isLoading = false
      },
      closeImport(){
        this.importDialoge = false
        this.accountToImport = null
        this.bankToImport = null
      },
      
    },
    created(){
        this.$store.dispatch('loadBanks')
    }
  };
  </script>
  