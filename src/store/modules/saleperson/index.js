import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
        salePersons: [],
        FreeSalePersons: []
    }
    },
    mutations:{
        setSalePersons(state, payload){
            state.salePersons = payload;
        },
        setFreeSalePersons(state, payload){
            state.FreeSalePersons = payload;
        }
        ,
        createSalePerson(state, payload){
            state.salePersons.push(payload)
        }
    },
    getters:{
        getSalePersons(state){
            return state.salePersons;
        },
        getFreeSalePersons(state){
            return state.FreeSalePersons
        }
    },
    actions:{
        async editSalePerson(context, payload,actions){
            try{
                var data = {sale_person: payload}
                console.log(data)
                const {data:responseData} = await finAgent.put(`/front/sale_persons/${payload.id}`, data)
                if (responseData.result){
                    actions.loadSalePersons
                }
            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
             }

        },
        async createSalePerson(context,payload){
            try{
                var data = {sale_person: payload}
                console.log(data)
                const {data:responseData} = await finAgent.post('/front/sale_persons', data)
                if (responseData){
                    context.commit('createSalePerson', payload)
                }
            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
             }
        },
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
        },
        async loadFreeSalePersons(context){
            try{
                context.commit('setIsLoading', 'true')
                const {data: responseData} = await finAgent.get('/front/sale_persons?without_bank_payanes=true');
                var salePersonData = responseData.data;
                const salePersons = []
                for (const item of salePersonData) {
                    const salePerson= {
                        ...item
                    }
                    salePersons.push(salePerson); 
                }
                context.commit('setIsLoading', 'false')
                context.commit('setFreeSalePersons', salePersons)

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