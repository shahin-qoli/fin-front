import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
        bankPayanes: [],
        goldenPayanes: [],
        goldOrders:[]
    }
    },
    mutations:{
        setBankPayanes(state, payload){
            state.bankPayanes = payload;
        },
        setGoldenPayanes(state, payload){
            state.goldenPayanes = payload;
        },
        setGoldOrders(state, payload){
            state.goldOrders = payload;
        }
    },
    getters:{
        getBankPayanes(state){
            return state.bankPayanes;
        },
        getGoldenPayanes(state){
            return state.goldenPayanes
        },
        getGoldOrders(state){
            return state.goldOrders;
        }
    },
    actions:{
        async loadBankPayanes(context, payload){
            try{
                context.commit('setIsLoading', 'true')
                const {data: responseData} = await finAgent.get(`/front/bank_payanes?q[payane_code_cont]=${payload}`);
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
        },
        async loadGoldenPayanes(context){
            try{
                context.commit('setIsLoading', 'true')
                const {data: responseData} = await finAgent.get('/front/payane_persons/get_goldens?per_page=300&page=1');
                var goldenPayaneData = responseData.data;
                const goldenPayanes = []
                for (const item of goldenPayaneData) {
                    const goldenPayane= {
                        ...item
                    }
                    goldenPayanes.push(goldenPayane);
                }
                context.commit('setIsLoading', 'false')
                context.commit('setGoldenPayanes', goldenPayanes)

            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
             }
        },
        async loadGoldOrders(context,payload){
            try{

                const  responseData = await finAgent.get(`/front/payane_persons/get_golden_orders?card_code=${payload}`);
              console.log(responseData);
                var goldOrders = responseData.data.result;
                if (goldOrders&& goldOrders.length > 0){
                context.commit('setGoldOrders', goldOrders)
            }
            else{
                context.commit('setGoldOrders', [])
            }

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