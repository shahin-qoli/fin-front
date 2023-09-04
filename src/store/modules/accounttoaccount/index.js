import  {finAgent} from '@/services/agent'

export default{
    state(){
        return{
            accounttoaccounts:[],
            itemCount: null
        }
    },
    mutations:{
        setItemCount(state, payload){
            state.itemCount = payload
        },
        setAccounttoaccounts(state, payload) {       
            state.accounttoaccounts = payload;
        },
        setUsedAccounttoaccount(state, payload) {
            const cid = payload.itemId
            const cardcode = payload.cardcode
            const toUpdateIndex=state.accounttoaccounts.findIndex(c2c => c2c.id === cid )
            state.accounttoaccounts[toUpdateIndex].used_payments = []
            state.accounttoaccounts[toUpdateIndex].used_payments[0]={"used_for" : cardcode}
            state.accounttoaccounts[toUpdateIndex].is_used = true
            
        }
    },
    getters:{
        getAccountItemCount(state){
            return state.itemCount;
        },
        accounttoaccounts (state) {
            return state.accounttoaccounts;
        },
        usedaccounttoaccounts (state){
            return state.accounttoaccounts.filter(accounttoaccounts => accounttoaccounts.is_used)
        }
    },
    actions:{
        async useAccounttoaccount(contex, payload){
            try{
                var data ={"used_for": payload.cardcode, "captured_by":""} 
                const {data:responseData} = await finAgent.post(`/front/account_to_account_raws/${payload.item.id}/use_payment`,data)
                console.log(responseData.result)
                if(responseData.result == true){
                    console.log("going to")
                    data = {
                        cardcode: payload.cardcode,
                        itemId: payload.item.id
                    }
                    contex.commit('setUsedAccounttoaccount', data)
                }
    
            }catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err || 'Failed to fetch'
                );
                throw error;
             } 
        },
       
        async loadAccounttoaccounts(context, payload) {
      
            context.commit('setIsLoading', 'true')
            try {
                console.log(payload)
                const {data:responseData} = await finAgent.get(`/front/account_to_account_raws?page=${payload.page}&per_page=${payload.itemsPerPage}&q[transaction_date_eq]=${payload.transactionDate}&q[amount_eq]=${payload.amount}&q[peygiri_number_matches]=${payload.peygiriNumber}&q[is_used_eq]=${payload.isUsed}&q[bank_account_id_eq]=${payload.bankAccountId}`)
                var accounttoaccountsData = responseData.data;
                var itemCount = responseData.options.count;
                const accounttoaccounts = [];
                for (const item of accounttoaccountsData) {
                    
                    const accounttoaccount = {
     
                         ...item

                        // number: 2
                    };
                    accounttoaccounts.push(accounttoaccount);  
                  }
              
                  context.commit('setIsLoading', 'false')
                  context.commit('setAccounttoaccounts', accounttoaccounts);
                  context.commit('setItemCount', itemCount);
                  
                //   console.log(cardtocards)
             } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err || 'Failed to fetch'
                );
                throw error;
             } 
        }

    }
}