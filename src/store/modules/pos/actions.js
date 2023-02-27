
import  {finAgent} from '@/services/agent'
export default {
    async usePos(contex, payload){
        try{
            var data ={"used_for": payload.cardcode, "captured_by":""} 
            const {data:responseData} = await finAgent.post(`/pos_raws/${payload.item.id}/use_payment`,data)
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
    async loadPoses(context) {
        console.log("step1")
        context.commit('setIsLoading', 'true')
        try {
            const { data: posesData} = await finAgent.get(`/pos_raws`);
            const poses = [];
            for (const item of posesData) {
				const pos = {
					// id: posesData[key].id,
                    // transaction_date: posesData[key].transaction_date,
                    // transaction_time: posesData[key].transaction_time,
                    // description: posesData[key].description,
                    // amount: posesData[key].amount,
                    // peygiri_number: posesData[key].peygiri_number,
                    // variz_date: posesData[key].variz_date,
                    // payane_code: posesData[key].payane_code,
                    // erja_code: posesData[key].erja_code,
                    // job_id: posesData[key].job_id,
                    // is_used: posesData[key].is_used,
                    // owner_account_number: posesData[key].owner_account_number
                    ...item
				};
				poses.push(pos);  
              }
              context.commit('setIsLoading', 'false')
        
              context.commit('setPoses', poses);
              context.commit('setFetchTimestamp');
    
         } catch (err) {
            //console.log(err.response);
            const error = new Error(
				err.response.data.error || 'Failed to fetch'
			);
			throw error;
         } 
    }
}

