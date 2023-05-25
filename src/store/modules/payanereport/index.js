import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
        payaneReports: [],
        itemCount: null
    }
    },
    mutations:{
        setPayaneReports(state, payload){
            state.payaneReports = payload;
        },    setItemCount(state, payload){
            state.itemCount = payload
        },    setUsedPayaneReport(state, payload) {
            const cid = payload.itemId
            const cardcode = payload.cardcode
            const toUpdateIndex=state.payaneReports.findIndex(c2c => c2c.id === cid )
            state.payaneReports[toUpdateIndex].used_payments = []
            state.payaneReports[toUpdateIndex].used_payments[0]={"used_for" : cardcode}
            state.payaneReports[toUpdateIndex].is_used = true
            
        }
    },
    getters:{
        getPayaneReports(state){
            return state.payaneReports;
        },	getPosReportItemCount(state){
            return state.itemCount;
        }
    },
    actions:{
        async loadPayaneReports(context,payload){
            try{
                context.commit('setIsLoading', 'true')
                const {data: responseData} = await finAgent.get(`/front/pos_payane_reports?page=${payload.page}&per_page=${payload.itemsPerPage}&payane_codes=${payload.selectedPayaneCodes}&report_date=${payload.selectedDate}`);
                var payaneReportData = responseData.data;
                const payaneReports = []
                var itemCount = responseData.options.count;
                for (const item of payaneReportData) {
                    const payaneReport= {
                        ...item
                    }
                    payaneReports.push(payaneReport); 
                }
                context.commit('setIsLoading', 'false')
                context.commit('setPayaneReports', payaneReports)
                context.commit('setItemCount', itemCount);

            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
             } 
        },
        async usePayaneReport(contex, payload){
            try{
                console.log("HERE ITEM")
                console.log(payload)
                var data ={"used_for": payload.active_payane_person.sale_person_code, "captured_by":""} 
                const {data:responseData} = await finAgent.post(`/front/pos_payane_reports/${payload.id}/use_payments`,data)
                console.log(responseData.result)
                if(responseData.result == true){
                    console.log("going to")
                    data = {
                        cardcode: payload.active_payane_person.sale_person_code,
                        itemId: payload.id
                    }
                    contex.commit('setUsedPayaneReport', data)
                }
    
            }catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err || 'Failed to fetch'
                );
                throw error;
             } 
        }
    }
}