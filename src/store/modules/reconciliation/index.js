import { finAgent } from "@/services/agent";
import ReconciliationView from "@/views/ReconciliationView.vue";

export default {
    state(){
        return {
            isSuccessReconciliation: false,
        reconciliationResult: [],
        reconciliationError: null,
        reconciliationResultFiles: null,
    }
    },
    mutations:{
        setReconciliationResult(state, payload){
            console.log(payload)
            state.reconciliationResult = payload;
        },
        setReconciliationError(state, payload){
            console.log(payload)
            state.reconciliationError = payload
        },
        setIsSuccessReconciliation(state, payload){
            console.log(payload)
            state.isSuccessReconciliation = payload
        }
    },
    getters:{
        getIsSuccessReconciliation(state){
            return state.isSuccessReconciliation;
        },
        getReconciliationError(state){
            return state.reconciliationError;
        },
        getReconciliationResult(state){
            return state.reconciliationResult;
        }
    },
    actions:{
        async downloadReconciliationResultZip(context, payload){
            try{
                let data = {
                    "b1_file": payload.b1,
                    "bank_file": payload.bank,
                }
                const response = await finAgent.post('/front/reconciliation/download_result_files', data,
                    {
                        responseType: 'blob' // مهم: باینری دریافت کنیم
                    }
                )
                      // ساخت Blob و دانلود فایل
      const blob = new Blob([response.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'reconciliation_results.zip')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
            }catch(err){
                console.error('خطا در دانلود فایل:', err)
            }
        },
        async uploadReconiliationFiles(context, payload){
            try{
                let formData = new FormData();
                formData.append('b1_file', payload.fileB1, payload.fileB1.name);
                formData.append('bank_file', payload.fileBank, payload.fileBank.name);
                formData.append('bank_name', payload.bankName);
                const response = await finAgent.post('/front/reconciliation/upload_files', formData)
                context.commit("setIsSuccessReconciliation",response.data.is_success)

                if (response.data.is_success)
                    context.commit("setReconciliationResult", response.data.result)
                else
                context.commit("setReconciliationError", response.data.error)
            }
            catch(err){
                context.commit("setIsSuccessReconciliation",false)
                context.commit("setReconciliationError", err)
            }
        },

    }
}