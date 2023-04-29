import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
        bankPayanes: []
    }
    },
    mutations:{
        setBankPayanes(state, payload){
            state.bankPayanes = payload;
        }
    },
    getters:{
        getBankPayanes(state){
            return state.bankPayanes;
        }
    },
    actions:{
        async loadBankPayanes(context){
            try{
                context.commit('setIsLoading', 'true')
                const {data: responseData} = await finAgent.get('/front/bank_payanes');
                var bankPayaneData = responseData.data;
                const bankPayanes = []
                for (const item of bankPayaneData) {
                    const bankPayane= {
                        ...item
                    }
                    bankPayanes.push(bankPayane); 
                }
                context.commit('setIsLoading', 'false')
                context.commit('setBankPayanes', bankPayanes)

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