import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
            bankCards:[]
        }
    },
    mutations:{
        setBanCards(state, payload){
            state.bankCards = payload;
        }
    },
    getters:{
        getBankCards(state){
            return state.bankCards;
        }
    },
    actions:{
        async setAccount(context,item){
            try{
                var payload = {account_number: item.account_number}
                const {data: bankAccountData} = await finAgent.post(`/front/bank_cards/${item.id}/create_account`,payload);
                console.log(bankAccountData)
            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );   throw error;
        }},
        async loadBankCards(context){
            try{
                context.commit('setIsLoading', 'true')
                const {data: bankCardsData} = await finAgent.get('/front/bank_cards');
                const bankCards = []
                for (const item of bankCardsData) {
                    const bankCard= {
                        ...item
                    }
                    bankCards.push(bankCard); 
                }
                context.commit('setIsLoading', 'false')
                context.commit('setBanCards', bankCards)

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