import { spreePAgent } from "@/services/agent";


export default {
    state(){
        return {
            mVOrders:[],
            mVOrdersItemCount: null,
            filteredVendors:[]
        
        }
    },
    mutations:{
        setMVOrders(state, payload){
            state.mVOrders = payload;
        },
        setMVOrdersItemCount(state, payload){
            state.mVOrdersItemCount = payload;
        },
        updateAMVorder(state, order){
          const index = state.mVOrders.findIndex(o => o.number === order.number);
  if (index !== -1) {
    // با نسخه جدید جایگزین کن
    state.mVOrders.splice(index, 1, order);
  } else {
    // اگر وجود نداشت، می‌تونی اضافه‌اش کنی (اختیاری)
    state.mVOrders.push(updatedOrder);
  }
        },
        setFilteredVendors(state,payload){
          state.filteredVendors = payload
      },
    },
    actions:{
        async assignVendorLineItem(context,payload){
          try{
            const apiUrl = "/platform/orders/assign_vendor"
            const { data: responseData } = await spreePAgent.post(apiUrl,payload);
            if (responseData.result === true){
              context.commit("updateAMVorder", responseData.order)
              return [true, null]
            } 
            else{
              return [false, responseData.error]
            }
          }
          catch(e){
            return [false, e]
          }
        },
        async assignDeliveryMean(context,payload){
          try{
            const apiUrl = "/platform/orders/assign_delivery_type"
            const { data: responseData } = await spreePAgent.post(apiUrl,payload);
            if (responseData.result === true){
              context.commit("updateAMVorder", responseData.order)
              return [true, null]
            } 
            else{
              return [false, responseData.error]
            }           
          }
          catch(e){
            return [false, e]
          }
        },
        async loadMVOrders(context, payload) {
            try {
              const filters = {
                "q[state_eq]": "complete",
              };
          
              const params = {
                ...filters,
                page: payload.page,
                per_page: payload.itemsPerPage,
              };
          
              const apiUrl =
                "/platform/orders?" +
                Object.entries(params)
                  .map(([key, value]) => `${key}=${value}`)
                  .join("&");
          
              const { data: responseData } = await spreePAgent.get(apiUrl);
          
              const orders = responseData.data;
         
              const itemCount = responseData.options?.count || 0;
          

          

          
              // 🔹 ذخیره در state
              context.commit("setMVOrders", orders);
              context.commit("setMVOrdersItemCount", itemCount);
            } catch (err) {
              console.error(err);
              throw new Error(err || "Failed to fetch");
            }
          },
       async fetchFiltereVendors(context,payload){
        try{
          console.log(payload)
          const filters = {
            "q[name_cont]": payload,
          };
      
          const params = {
            ...filters
          };
          let apiUrl = "/platform/vendors?" +
          Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
         const { data: responseData } = await spreePAgent.get(apiUrl);
          let vendors = responseData.data
          context.commit('setFilteredVendors',vendors);
      }catch(err){
          console.error(err);
              throw new Error(err || "Failed to fetch");
      }
       }   ,
       async createVendorLineItemTransfer(context,payload){
        try{
          console.log(payload)
          const apiUrl = "/platform/orders/create_shipment"
          const { data: responseData } = await spreePAgent.post(apiUrl,payload);
          if (responseData.result === true){
            context.commit("updateAMVorder", responseData.order)
            return [true, null]
          } 
          else{
            return [false, responseData.error]
          }           
        }
        catch(e){
          return [false, e]
        }     
       }
          

    },
    getters:{
      getFilteredVendors(state){
        return state.filteredVendors;
      },
        getMVOrders(state){
            return state.mVOrders;
        },
        getMVOrdersItemCount(state){
            return state.mVOrdersItemCount;
        },

    }
}