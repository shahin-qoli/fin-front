import { spreeAgent } from "@/services/agent";

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
        async loadOrders(context, payload) {
            console.log("lets go")
            try {
                console.log(payload)
                const {data: responseData} = await spreeAgent.get(`/platform/orders?page=${payload.page}&per_page=${payload.itemsPerPage}&filter[b1_documented_eq]=${payload.hasB1Docs}&filter[completed_at_lteq]=${payload.completedAtLteq}&filter[completed_at_gteq]=${payload.completedAtGteq}&filter[state_eq]=complete&filter[number_eq]=${payload.number}`)
                const orders = []
                const ordersData= responseData.data
                console.log("after")
                console.log(responseData.data)
                for (const item of ordersData) {
                    const order= {
                        ...item.attributes
                    }
                    orders.push(order); 
                }
                let itemCount = responseData.meta.total_count
                context.commit('setItemCount', itemCount)
                context.commit('setOrders', orders)
            }
            catch(err){
                console.log('sssssssssssss222222222')
                console.log(err);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async createSo(contex, payload){
            try {
                let orderNumbers= []
                payload.forEach(item => {
                    orderNumbers.push(item.number)
                });
                const body ={order_numbers: orderNumbers} 
                const {data: responseData} = await spreeAgent.post(`/storefront/b1_requests/by_order_numbers`, body)

                const results= responseData.results
                return results
                // for (const item of ordersData) {
                //     const order= {
                //         ...item.attributes
                //     }
                //     orders.push(order); 
                // }
                // let itemCount = responseData.meta.total_count
            }
            catch(err){
                console.log('sssssssssssss222222222')
                console.log(err);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        }

    }
}