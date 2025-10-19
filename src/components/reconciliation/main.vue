<template>
     <v-container>
        <v-row v-if="!isSuccessReconciliation" >
            <v-col cols="9">
                <v-card
                d
                class="mx-auto"      
                >
                <v-card-title>
                    <v-toolbar dark color="green">
                        <v-row>
                        <v-col cols="12">
                        <h3 class="text-center">ورود اطلاعات</h3>
                    </v-col>
                    </v-row>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <v-toolbar dark color="gold">
                        <v-row>
                        <v-col cols="12">
                        <h3 class="text-center">فایل بانک</h3>
                    </v-col>
                    </v-row>
                    </v-toolbar>
                            <v-file-input
                                accept="excel/*"
                                label="بارگذاری فایل بانک"
                                v-model="fileBank"
                            />
                        </v-col>
                        <v-col cols="6">
                            <v-toolbar dark color="gold">
                        <v-row>
                        <v-col cols="12">
                        <h3 class="text-center">فایل B1</h3>
                    </v-col>
                    </v-row>
                    </v-toolbar>
                            <v-file-input
                                accept="excel/*"
                                label="بارگذاری فایل B1"
                                v-model="fileB1"
                            />
                        </v-col>
                        <v-col cols="12" >
                                    <v-select
                                    :items="banks"
                                    name="bank"
                                    label="نام بانک"
                                    solo
                                    item-text="text"
                                    item-value="name"
                                    v-model="selected_bank"
                                    ></v-select>
                            </v-col>
                    </v-row>                   
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn :loading="isLoading" :disabled="!isRequiredFieldsFilled" @click="submitUpload" dark color="green">ارسال</v-btn>
                </v-card-actions> 
                <p color="red" v-if="reconciliationError && !reconciliationError.response?.data?.is_success">
                {{ reconciliationError.response?.data?.error || 'عملیات با خطا مواجه شد.' }}
                </p>
                </v-card>    
            </v-col>
        </v-row>
        <v-row justify="center" v-else>
            <v-col cols="12">
            <v-btn color="primary" @click="downloadZip">دانلود نتایج</v-btn>
            </v-col>
            <v-expansion-panels accordion>
                <v-expansion-panel v-for="(date,i) in dateRangeList" class="bordered-panel">
                    <v-expansion-panel-header>         
                                        تاریخ {{ formatDate(date) }} —
                        اختلاف واریز: {{
                        ((reconciliationResult.daily_summary[date]?.bank?.debit || 0) -
                        (reconciliationResult.daily_summary[date]?.b1?.debit || 0))
                        }} ریال ،
                        اختلاف برداشت: {{
                        ((reconciliationResult.daily_summary[date]?.bank?.credit || 0) -
                        (reconciliationResult.daily_summary[date]?.b1?.credit || 0))
                        }} ریال                   
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="panel-content">
                        <div>
                            <h4 class="matched-title">تطبیق شده</h4>
                                <v-simple-table class="bordered-table">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th>تاریخ</th>
                                                <th>واریز</th>
                                                <th>برداشت</th>
                                                <th>ردیف در بانک</th>
                                                <th>ردیف در B1</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="item in transactionsForDateMatched('matched', date)"
                                                :key="item.index"
                                                >
                                                <td>{{ formatDate(item.date) }}</td>
                                                <td>{{ item.debit }}</td>
                                                <td>{{ item.credit }}</td>
                                                <td>{{ item.data_index }}</td>
                                                <td>{{ item.matched_with }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                                <h4  class="unmatched-title">تکراری ها نا مطابق</h4>
                                <v-simple-table  class="bordered-table">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th>تاریخ</th>
                                                <th>واریز</th>
                                                <th>برداشت</th>
                                                <th>ردیف در مرجع</th>
                                                <th>ردیف تکراری</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="item in transactionsForDateDuplicate('duplicate', date)"
                                                :key="item.index"
                                                >
                                                <td>{{ formatDate(item.date) }}</td>
                                                <td>{{ item.debit }}</td>
                                                <td>{{ item.credit }}</td>
                                                <td>{{ item.data_index }}</td>
                                                <td>{{ item.matched_with }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>   
                                <h4 class="absent-title">عدم تطبیق</h4>     
                                <v-simple-table class="bordered-table">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th>تاریخ</th>
                                                <th>واریز</th>
                                                <th>برداشت</th>
                                                <th>ردیف در مرجع</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="item in transactionsForDateAbsent('duplicate', date)"
                                                :key="item.index"
                                                >
                                                <td>{{ formatDate(item.date) }}</td>
                                                <td>{{ item.debit }}</td>
                                                <td>{{ item.credit }}</td>
                                                <td>{{ item.data_index }}</td>
                                                
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>                                                          
                            <!-- <ul>
                            <li v-for="tx in transactionsForDate('matched', date)" :key="tx.index">
                                Index: {{ tx }}
                            </li>
                            </ul>

                            <h4>تکراری ها نا مطابق</h4>
                            <ul>
                            <li v-for="tx in transactionsForDate('duplicate', date)" :key="tx.index">
                                Index: {{ tx }}
                            </li>
                            </ul>

                            <h4>عدم تطبیق</h4>
                            <ul>
                            <li v-for="tx in transactionsForDate('absent', date)" :key="tx.index">
                                Index: {{ tx }}
                            </li>
                            </ul> -->
                        </div>
                    </v-expansion-panel-content>

                </v-expansion-panel>
            </v-expansion-panels>
        </v-row>
         <!-- لودینگ -->
         <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>در حال بارگذاری</p>
        </v-overlay>       
    </v-container>   
</template>
<script>
import reconciliation from '@/store/modules/reconciliation';

var jalaali = require('jalaali-js');
export default{
    data(){
        return{
            selected_bank:null,
            isFormReady: false,
            uploadError: false,
            fileB1: null,
            fileBank: null,
            isLoading: false,
        }
    },
        computed:{
            banks(){
                return[
                    {
                        text: "صادرات",
                        name: "saderat",
                        id: 1
                    },
                    {
                        text: "سپه",
                        name: "sepah",
                        id: 2
                    }
                ]
            },
            isRequiredFieldsFilled() {
                return this.fileB1 && this.fileBank && this.selected_bank !== null ;
            },
            isSuccessReconciliation(){
                return this.$store.getters.getIsSuccessReconciliation
            },
            reconciliationResult(){
                return this.$store.getters.getReconciliationResult 
            },
            dateRangeList() {
                if (!this.reconciliationResult) return [];

                const bankRange = this.reconciliationResult.bank_date_range;
                const recordedRange = this.reconciliationResult.recorded_date_range;

                if (!bankRange || !recordedRange) return [];

                const start = new Date(
                bankRange.start_date < recordedRange.start_date
                    ? bankRange.start_date
                    : recordedRange.start_date
                );
                const end = new Date(
                bankRange.end_date > recordedRange.end_date
                    ? bankRange.end_date
                    : recordedRange.end_date
                );

                let arr = [];
                let current = new Date(start);

                while (current <= end) {
                arr.push(current.toISOString().split("T")[0]); // yyyy-mm-dd
                current.setDate(current.getDate() + 1);
                }

                return arr;
            },
            reconciliationError(){
                return this.$store.getters.getReconciliationError;
            }
        },
        methods:{
            downloadZip(){
                this.$store.dispatch("downloadReconciliationResultZip",this.reconciliationResult.files)
            },
            submitUpload(){
                this.isLoading = true;
                let payload = {fileB1:this.fileB1, fileBank:this.fileBank,bankName: this.selected_bank}
                this.$store.dispatch('uploadReconiliationFiles',payload).then(()=>this.isLoading = false)
            },
            transactionsForDateMatched(category, date) {
    if (!this.reconciliationResult) return [];
    // category: 'matched', 'absent_bank', 'absent_recorded', 'duplicate_bank', 'duplicate_recorded'
    return (this.reconciliationResult.results || []).filter(tx => {
      // فرض می‌کنیم هر تراکنش شامل فیلد date هست
      return (tx.date === date && tx.match_type == 'matched' && String(tx.data_index).startsWith("BANK") );
    });
  },
  transactionsForDateDuplicate(category, date) {
    if (!this.reconciliationResult) return [];
    // category: 'matched', 'absent_bank', 'absent_recorded', 'duplicate_bank', 'duplicate_recorded'
    return (this.reconciliationResult.results || []).filter(tx => {
      // فرض می‌کنیم هر تراکنش شامل فیلد date هست
      return (tx.date === date && tx.match_type == 'duplicate' );
    });
  },
  transactionsForDateAbsent(category, date) {
    if (!this.reconciliationResult) return [];
    // category: 'matched', 'absent_bank', 'absent_recorded', 'duplicate_bank', 'duplicate_recorded'
    return (this.reconciliationResult.results || []).filter(tx => {
      // فرض می‌کنیم هر تراکنش شامل فیلد date هست
      return (tx.date === date && tx.match_type == 'absent' );
    });
  },
  formatDate(geoDate){
            
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
        },
        filters:{
    formatAmount(value){
      const stringVlue = String(value)
      const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedIntegerPart
    },

    }
}
</script>
<style scoped>
/* 🔹 Panel border and style */
.bordered-panel {
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: border-color 0.2s ease;
}
.bordered-panel.v-expansion-panel--active {
  border-color: #1976d2;
}

/* 🔹 Panel content background */
.panel-content {
  background-color: #f9fafc;
  padding: 12px 16px;
  border-top: 1px solid #ddd;
}

/* 🔹 Colored section headers */
.matched-title {
  background-color: #c8e6c9;
  padding: 6px 10px;
  border-radius: 6px;
  width: fit-content;
  margin-bottom: 8px;
}

.unmatched-title {
  background-color: #ffe0b2;
  padding: 6px 10px;
  border-radius: 6px;
  width: fit-content;
  margin-top: 12px;
  margin-bottom: 8px;
}

.absent-title {
  background-color: #ffcdd2;
  padding: 6px 10px;
  border-radius: 6px;
  width: fit-content;
  margin-top: 12px;
  margin-bottom: 8px;
}

/* 🔹 Simple table border + subtle elevation */
.bordered-table {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  width: 100%;
  border-collapse: collapse;
}


/* Optional: table header styling */
/* 🔹 تیتر جدول */
.bordered-table thead {
  background-color: #f2f5f8;
  font-weight: 600;
}
/* Optional: striped rows */
/* ✅ ردیف‌های یکی‌درمیون (zebra effect) */
.bordered-table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* رنگ خیلی ملایم برای زوج‌ها */
}
.bordered-table tbody tr:nth-child(odd) {
  background-color: #ffffff; /* سفید برای ردیف‌های فرد */
}

/* 🔹 افکت هاور برای تعامل بهتر */
.bordered-table tbody tr:hover {
  background-color: #e8f0fe; /* آبی خیلی ملایم در هنگام هاور */
  transition: background-color 0.2s ease;
}
</style>