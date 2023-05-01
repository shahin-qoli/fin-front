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
        },
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
                const {data: responseData} = await finAgent.get(`/front/bank_payanes/report?page=${payload.page}&per_page=${payload.itemsPerPage}&`);
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
        }
    }
}