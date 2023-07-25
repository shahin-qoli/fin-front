import { spreeAgent } from "@/services/agent";

export default {
    state(){
        return {
            orders:[]
        }
    },
    mutations:{
        setOrders(state, orders){
            state.orders = orders;
        }
    },
    getters:{
        getOrders(state){
            return state.orders;
        }
    },
    actions:{
        async loadOrders(context, payload) {
            try {
                const {data: ordersData} = await spreeAgent.get(`/platform/orders?page=${payload.page}&per_page=${payload.itemsPerPage}&filter[b1_documented_eq]=${payload.hasB1Docs}&filter[completed_at_eq]=${payload.completedAt}&filter[state_eq]=complete`)
                const orders = []
                for (const item of ordersData) {
                    const order= {
                        ...item
                    }
                    orders.push(order); 
                }
                context.commit('setOrders', orders)
            }
            catch(err){
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        }
    }
}