import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
            miarzeOrders:[],
            itemCount: null
        }
    },
    mutations:{
        setMiarzeOrders(state, payload){
            state.miarzeOrders = payload;
        },
        setItemCount(state, payload){
            state.itemCount = payload;
        }
    },
    methods:{
        async loadMiarzeOrders(context, payload){
            try{
                const {data: responseData} = await finAgent.get(`/front/miarze_orders?page=${payload.page}&per_page=${payload.itemsPerPage}`);
                var miarzeOrderData = responseData.data;
                const miarzeOrders = []
                var itemCount = responseData.options.count;
                for (const item of miarzeOrderData) {
                    const miarzeOrder= {
                        ...item
                    }
                    miarzeOrders.push(miarzeOrder); 
                }
                context.commit('setMiarzeOrders', payaneReports)
                context.commit('setItemCount``', itemCount);
            }catch(err){}
        }
    },
    getters:{
        getMiarzeOrders(state){
            return state.miarzeOrders;
        },
        getMiarzeOrdersItemCount(state){
            return state.itemCount;
        }
    }
}