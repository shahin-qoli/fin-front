
// import cardtocardServ from '@/services/cardtocard/index.js'
import  {finAgent} from '@/services/agent'
export default {
    async useCardtocard(contex, payload){
        try{
            var data ={"used_for": payload.cardcode, "captured_by":""} 
            const {data:responseData} = await finAgent.post(`/card_to_card_raws/${payload.item.id}/use_payment`,data)
            console.log(responseData.result)
            if(responseData.result == true){
                console.log("going to")
                data = {
                    cardcode: payload.cardcode,
                    itemId: payload.item.id
                }
                contex.commit('setUsedCardtocard', data)
            }

        }catch (err) {
            //console.log(err.response);
            const error = new Error(
				err || 'Failed to fetch'
			);
			throw error;
         } 
    },
   
    async loadCardtocards(context) {
        if (!context.getters.shouldUpdate) return;
        context.commit('setIsLoading', 'true')
        try {
            const {data:cardtocardsData} = await finAgent.get('/card_to_card_raws')
            const cardtocards = [];
            for (const item of cardtocardsData) {
                
				const cardtocard = {
					// id: item.id,
                    // transaction_date: item.transaction_date,
                    // transaction_time: item.transaction_time,
                    // description: item.description,
                    // amount: item.amount,
                    // from_card: item.from_card,
                    // to_card: item.to_card,
                    // peygiri_number: item.peygiri_number,
                    // serial_number: item.serial_number,
                    // job_id: item.job_id,
                    // is_used: item.is_used 
                     ...item
                    // number: 2
				};
				cardtocards.push(cardtocard);  
              }
              context.commit('setIsLoading', 'false')
              context.commit('setCardtocards', cardtocards);
              context.commit('setFetchTimestamp');
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

