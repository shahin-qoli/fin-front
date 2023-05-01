import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
        posRawDetails: []
    }
    },
    mutations:{
        setPosRawDetails(state, payload){
            state.posRawDetails = payload;
        }
    },
    getters:{
        getPosRawsDetails(state){
            return state.posRawDetails;
        }
    },
    actions:{
        async loadPosRawsDetails(context, payload){
            try{
                
                const {data: responseData} = await finAgent.get(`/front/pos_raws?q[transaction_date_eq]=${payload.transactionDate}&q[payane_code_matches]=${payload.payaneCode}`);
                var posRawDetailsData = responseData.data;
                const posRawDetails = []
                for (const item of posRawDetailsData) {
                    const posRawDetail= {
                        ...item
                    }
                    posRawDetails.push(posRawDetail); 
                }
          
                context.commit('setPosRawDetails', posRawDetails)

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