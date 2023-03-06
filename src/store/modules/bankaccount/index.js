import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
            bankAccounts:[]
        }
    },
    mutations:{
        setBankAccounts(state, payload){
            state.bankAccounts = payload;
        },
        createBankAccount(state, payload){
            state.bankAccounts.push(payload)
        }
    },
    getters:{
        getBankAccounts(state){
            return state.bankAccounts;
        }
    },
    actions:{
        async createBankAccount(context,payload){
            try{
                var data = {bank_account: payload}
                console.log(data)
                const {data:responseData} = await finAgent.post('/front/bank_accounts', data)
                if (responseData){
                    context.commit('createBankAccount', payload)
                }

            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
             }
        },
        async loadBankAccounts(context){
            try{
                context.commit('setIsLoading', 'true')
                const {data: bankAccountData} = await finAgent.get('/front/bank_accounts');
                const bankAccounts = []
                for (const item of bankAccountData) {
                    const bankAccount= {
                        ...item
                    }
                    bankAccounts.push(bankAccount); 
                }
                context.commit('setIsLoading', 'false')
                context.commit('setBankAccounts', bankAccounts)

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