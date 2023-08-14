import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
            banks:[]
        }
    },
    mutations:{
        setBanks(state, payload){
            state.banks = payload;
        }
    },
    getters:{
        getBanks(state){
            return state.banks;
        }
    },
    actions:{
        async loadBanks(context){
            try{
                const {data: bankData} = await finAgent.get('/front/banks');
                const banks = []
                for (const item of bankData) {
                    const bank= {
                        ...item
                    }
                    banks.push(bank); 
                }
                context.commit('setBanks', banks)

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