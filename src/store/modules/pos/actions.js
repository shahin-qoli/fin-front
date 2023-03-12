
import  {finAgent} from '@/services/agent'
export default {
    async usePos(contex, payload){
        try{
            var data ={"used_for": payload.cardcode, "captured_by":""} 
            const {data:responseData} = await finAgent.post(`/front/pos_raws/${payload.item.id}/use_payment`,data)
            console.log(responseData.result)
            if(responseData.result == true){
                console.log("going to")
                data = {
                    cardcode: payload.cardcode,
                    itemId: payload.item.id
                }
                contex.commit('setUsedPos', data)
            }

        }catch (err) {
            //console.log(err.response);
            const error = new Error(
				err || 'Failed to fetch'
			);
			throw error;
         } 
    },
    async loadPoses(context,payload) {
        console.log("step1")
        context.commit('setIsLoading', 'true')
        try {
            const config = {
                params: {
                    'q[transaction_date_matches]': payload.transactionDate,
                }
            }
            const { data: responseData} = await finAgent.get(`/front/pos_raws?page=${payload.page}&per_page=${payload.itemsPerPage}&q[transaction_date_matches]=${payload.transactionDate}&q[amount_matches]=${payload.amount}&q[peygiri_number_matches]=${payload.peygiriNumber}&q[erja_code_mathces]=${payload.erjaCode}&q[payane_code_matches]=${payload.payaneCode}`, config);
            const poses = [];
            var posesData = responseData.data;
            var itemCount = responseData.options.count;
            for (const item of posesData) {
				const pos = {
                    ...item
				};
				poses.push(pos);  
              }
              context.commit('setIsLoading', 'false')
              context.commit('setPoses', poses);
              context.commit('setItemCount', itemCount);
    
         } catch (err) {
            //console.log(err.response);
            const error = new Error(
				err.response.data.error || 'Failed to fetch'
			);
			throw error;
         } 
    }
}

