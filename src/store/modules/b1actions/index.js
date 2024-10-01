import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
            orders:[],
            itemCount: null,
        }
    },
    mutations:{
        setOrders(state, orders){
            state.orders = orders;
        },
        setItemCount(state, payload){
            state.itemCount = payload
        },
    },
    getters:{
        getOrders(state){
            return state.orders;
        },
        getItemCount(state){
            return state.itemCount;
        },
    },
    actions:{
        async getCustomerDataForPayment(context, payload){
            try {
                const {data: responseData} = await finAgent.post(`/front/b1_actions/get_customer_open_documents`, payload)
                return responseData
              } catch(err){
                const error = new Error(
                  err.response.data.error || 'Failed to create user'
                );
                return {is_success: false, error: error}
              }
        }

    }
}
