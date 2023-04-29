import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
        salePersons: []
    }
    },
    mutations:{
        setSalePersons(state, payload){
            state.salePersons = payload;
        }
    },
    getters:{
        getSalePersons(state){
            return state.salePersons;
        }
    },
    actions:{
        async loadSalePersons(context){
            try{
                context.commit('setIsLoading', 'true')
                const {data: responseData} = await finAgent.get('/front/sale_persons');
                var salePersonData = responseData.data;
                const salePersons = []
                for (const item of salePersonData) {
                    const salePerson= {
                        ...item
                    }
                    salePersons.push(salePerson); 
                }
                context.commit('setIsLoading', 'false')
                context.commit('setSalePersons', salePersons)

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