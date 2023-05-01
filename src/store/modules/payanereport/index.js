import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
        payaneReports: []
    }
    },
    mutations:{
        setPayaneReports(state, payload){
            state.payaneReports = payload;
        }
    },
    getters:{
        getPayaneReports(state){
            return state.payaneReports;
        }
    },
    actions:{
        async loadPayaneReports(context){
            try{
                context.commit('setIsLoading', 'true')
                const {data: responseData} = await finAgent.get('/front/bank_payanes/report');
                var payaneReportData = responseData.data;
                const payaneReports = []
                for (const item of payaneReportData) {
                    const payaneReport= {
                        ...item
                    }
                    payaneReports.push(payaneReport); 
                }
                context.commit('setIsLoading', 'false')
                context.commit('setPayaneReports', payaneReports)

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