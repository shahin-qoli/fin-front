
import  {finAgent} from '@/services/agent'
export default {
    async loadPoses(context) {
        console.log("step1")
       // const apiUrl = context.rootGetters.apiUrl;
        try {
            
            const { data: posesData} = await finAgent.get(`http://192.168.1.80:3400/api/pos_raws`);

            const poses = [];
            for (const key in posesData) {
				const pos = {
					id: posesData[key].id,
                    transaction_date: posesData[key].transaction_date,
                    transaction_time: posesData[key].transaction_time,
                    description: posesData[key].description,
                    amount: posesData[key].amount,
                    peygiri_number: posesData[key].peygiri_number,
                    variz_date: posesData[key].variz_date,
                    payane_code: posesData[key].payane_code,
                    erja_code: posesData[key].erja_code,
                    job_id: posesData[key].job_id,
                    is_used: posesData[key].is_used,
                    owner_account_number: posesData[key].owner_account_number
				};
				poses.push(pos);  
              }
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

