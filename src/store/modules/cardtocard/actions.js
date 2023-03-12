
// import cardtocardServ from '@/services/cardtocard/index.js'
import  {finAgent} from '@/services/agent'
export default {
    async useCardtocard(contex, payload){
        try{
            var data ={"used_for": payload.cardcode, "captured_by":""} 
            const {data:responseData} = await finAgent.post(`/front/card_to_card_raws/${payload.item.id}/use_payment`,data)
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
   
    async loadCardtocards(context, payload) {
  
        context.commit('setIsLoading', 'true')
        try {
            console.log(payload)
            const {data:responseData} = await finAgent.get(`/front/card_to_card_raws?page=${payload.page}&per_page=${payload.itemsPerPage}&q[transaction_date_matches]=${payload.transactionDate}&q[amount_matches]=${payload.amount}&q[peygiri_number_matches]=${payload.peygiriNumber}&q[from_card_start]=${payload.fromCard}&q[to_card_start]=${payload.toCard}&q[serial_number_matches]=${payload.serialNumber}`)
            var cardtocardsData = responseData.data;
            var itemCount = responseData.options.count;
            const cardtocards = [];
            for (const item of cardtocardsData) {
                
				const cardtocard = {
 
                     ...item
                    // number: 2
				};
				cardtocards.push(cardtocard);  
              }
          
              context.commit('setIsLoading', 'false')
              context.commit('setCardtocards', cardtocards);
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

